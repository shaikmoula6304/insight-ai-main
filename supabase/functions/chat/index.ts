import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RESUME_CONTEXT = `You are an AI assistant for Shaik Moulali's interactive portfolio website. Answer questions about his resume accurately and professionally. Keep answers concise (2-4 sentences max).

RESUME DATA:
- Name: Shaik Moulali
- Role: Aspiring Junior Software Tester | Web Developer | Embedded Systems Enthusiast
- Email: shaikmoula6304@gmail.com | Phone: +91 6304485aborr
- Location: Kavali, Andhra Pradesh, India

EDUCATION:
- B.Tech, Electronics & Communication Engineering at PBR VITS, Kavali (JNTUA) — 2023–Present
- Diploma in ECE from Government Polytechnic College, Kalyandurgam — 2020–2023

SKILLS:
- Programming: C, Python, Java
- Web: HTML, CSS, Node.js, REST APIs
- Tools: Git, GitHub, Postman, SEO, Selenium, Manual Testing, Automation Testing
- Embedded: Microcontroller Architecture, PCB Testing, Circuit Design, Arduino, IoT Sensors, Embedded C
- Soft Skills: Problem Solving, Communication, Leadership, Adaptability

EXPERIENCE:
1. Embedded Systems Developer Intern (Feb 2021 – Dec 2022)
   - Optimized IoT device firmware, reducing power consumption by 20%
   - Performed PCB testing and functional validation with 95% accuracy
2. Pre-fabricated Hardware Circuit Designer (Jul 2022 – Jan 2023)
   - Conducted functional and circuit testing for reliability
   - Documented circuit workflows

PROJECTS:
1. AI-Based Competitive Exam Mock Test Platform — MVP with adaptive AI feedback and analytics
2. AI-Powered Resume Builder & ATS Optimization — Smart resume builder with AI scoring
3. Smart Helmet for Coal Mine Workers — IoT safety helmet, 3rd Prize at State-Level Project Expo 2025

CERTIFICATIONS:
1. Google Android Developer Virtual Internship (Jan–Mar 2025) — Google Developers & AICTE
2. Microchip Embedded System Developer Virtual Internship (Jul–Sep 2024) — Microchip & AICTE
3. Java Full Stack Developer Virtual Internship (Mar–Jul 2025) — AICTE

ACHIEVEMENTS:
- National Level Hackathon participant at VIT Chennai (2025)
- 3rd Prize at State-Level Project Expo 2025

If asked something not in the resume, politely say you can only answer questions about Shaik Moulali's professional background.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: RESUME_CONTEXT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
