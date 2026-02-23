import { Github, Linkedin, Globe } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Shaik Moulali — Built with intention.
        </p>
        <div className="flex items-center gap-4">
          {[
            { icon: Github, href: "https://github.com/shaikmoula6304", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/shaikmoula/", label: "LinkedIn" },
            { icon: Globe, href: "https://shaikmoula6304.github.io/portfolio/", label: "Portfolio" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
