import { Download, Sparkles } from "lucide-react";
import { suggestedPrompts } from "@/data/portfolio";

interface ResumePanelProps {
  onPromptClick: (prompt: string) => void;
}

const ResumePanel = ({ onPromptClick }: ResumePanelProps) => {
  return (
    <div className="glass-card p-6 h-fit space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Resume Intelligence
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Aspiring Junior Software Tester with knowledge of web development, APIs, and databases.
          Strong analytical mindset with hands-on experience in embedded systems, IoT, and application validation.
        </p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Core Technologies
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {["Python", "Java", "C", "Node.js", "Arduino", "Selenium", "Postman", "Git"].map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <a
        href="/resume.pdf"
        download="Shaik_Moulali_Resume.pdf"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors"
      >
        <Download className="w-4 h-4" />
        Download Resume
      </a>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Suggested Questions
        </h4>
        <div className="space-y-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onPromptClick(prompt)}
              className="w-full text-left px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent hover:border-border transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResumePanel;
