// ============================================================
//  Portfolio Backend — Node.js / Express
//  - AI Chat via OpenRouter (SSE streaming)
//  - Contact Form via Nodemailer (Gmail)
// ============================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));
app.use(express.json());

// ── System Prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an AI assistant embedded in Shaik Moulali's personal portfolio website.
Your job is to answer questions about Shaik in a friendly, professional, and concise way.
Never make up information. If you don't know something, say so politely.

====== ABOUT SHAIK MOULALI ======

SUMMARY:
Shaik Moulali is an aspiring Junior Software Tester with strong knowledge of web development, APIs,
and databases. Strong analytical mindset with hands-on experience in application validation and debugging.

CONTACT:
- Email: shaikmoula6304@gmail.com
- Phone: 6304996931

SKILLS:
- Programming: C, Python, Java
- Web Development: HTML, CSS, Node.js, REST APIs
- Databases & Tools: Git, GitHub, Postman, SEO, Selenium, Manual & Automation Testing
- Embedded Systems: Microcontroller Architecture, PCB Testing, Circuit Design
- Soft Skills: Problem Solving, Communication, Leadership, Adaptability
- Languages: English, Hindi, Telugu

EDUCATION:
- B.Tech in Electronics and Communication Engineering — PBR VITS, Kavali (JNTUA, 2023 Expected)
- Diploma in Electronics and Communication Engineering — Govt. Polytechnic College, Kalyandurgam (2020–2023)

PROFESSIONAL EXPERIENCE:
1. Embedded Systems Developer Intern (Feb 2021 – Dec 2022)
   - Optimized IoT device firmware, reducing power consumption by 20%
   - PCB testing and functional validation with 95% accuracy

2. Pre-fabricated Hardware Circuit Designer (Jul 2022 – Jan 2023)
   - Functional and circuit testing for reliability and compliance
   - Documented circuit workflows and collaborated with project teams

PROJECTS:
1. AI-Based Competitive Exam Mock Test Platform (MVP)
   - Designed UI/UX flow for mock tests, results, and analysis dashboards
   - AI-based feedback system to recommend re-tests and focus areas

2. AI-Powered Resume Builder & ATS Optimization Platform
   - Built resume builder workflow: templates, preview, edit, and export
   - Backend APIs for authentication, resume storage, ATS analysis, and AI tools
   - AI-driven resume scoring and content suggestions

3. Smart Helmet for Coal Mine Workers — 3rd Prize, State-Level Project Expo 2025
   - IoT helmet monitoring toxic gases, temperature, and humidity in real time
   - GPS/RF tracking for emergency response | Tools: Arduino, Embedded C, IoT Sensors

AWARDS:
- 3rd Prize — State Level Project Expo 2025, QISE College, Ongole
- National Level Hackathon — VIT Chennai 2025 (Assistive Device for Deaf and Dumb using AI + Raspberry Pi)

====== END ======`;

// ── Auth Middleware ───────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const expectedKey = process.env.API_SECRET_KEY;
  if (!expectedKey) return next();
  const token = (req.headers["authorization"] || "").replace("Bearer ", "").trim();
  if (token !== expectedKey) return res.status(401).json({ error: "Unauthorized" });
  next();
};

// ── POST /functions/v1/chat ───────────────────────────────────
app.post("/functions/v1/chat", authMiddleware, async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const apiMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  try {
    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
        "X-Title": process.env.SITE_NAME || "Shaik Moulali Portfolio",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
        messages: apiMessages,
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!openRouterRes.ok) {
      const errBody = await openRouterRes.json().catch(() => ({}));
      console.error("OpenRouter error:", errBody);
      res.write(`data: ${JSON.stringify({ error: errBody.error || "OpenRouter error" })}\n\n`);
      return res.end();
    }

    const reader = openRouterRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIndex;
      while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        res.write(`data: ${data}\n\n`);
        if (data === "[DONE]") { res.end(); return; }
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Chat server error:", err);
    res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
    res.end();
  }
});

// ── POST /api/contact ─────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Portfolio Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
        <h2 style="color: #111827; margin-bottom: 4px;">New Contact Form Submission</h2>
        <p style="color: #6b7280; font-size: 13px; margin-bottom: 24px;">Someone filled your portfolio contact form</p>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px 8px 0 0;">
              <span style="font-size: 12px; color: #6b7280; display: block; margin-bottom: 2px;">NAME</span>
              <span style="font-size: 15px; color: #111827; font-weight: 600;">${name}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-top: none;">
              <span style="font-size: 12px; color: #6b7280; display: block; margin-bottom: 2px;">EMAIL</span>
              <span style="font-size: 15px; color: #2563eb;">${email}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; background: #fff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <span style="font-size: 12px; color: #6b7280; display: block; margin-bottom: 2px;">MESSAGE</span>
              <span style="font-size: 15px; color: #111827; white-space: pre-line;">${message}</span>
            </td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 12px 16px; background: #eff6ff; border-radius: 8px; font-size: 13px; color: #1d4ed8;">
          Hit <strong>Reply</strong> to respond directly to ${name} at ${email}
        </div>

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center;">
          Sent from your portfolio contact form • ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Contact] Email sent from ${name} <${email}>`);
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("[Contact] Email error:", err);
    res.status(500).json({ error: "Failed to send email. Please try again." });
  }
});

// ── Health Check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "portfolio-chat-backend" });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Portfolio chat backend running on http://localhost:${PORT}`);
  console.log(`Model: ${process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"}`);
});