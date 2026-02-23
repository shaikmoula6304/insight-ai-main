import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import { projects } from "@/data/portfolio";
import { Project } from "@/types";

const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className="glass-card p-6 cursor-pointer transition-shadow duration-200 hover:shadow-card group"
  >
    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
      {project.title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
      {project.description}
    </p>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {project.techStack.map((t) => (
        <span
          key={t}
          className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-secondary text-muted-foreground border border-border"
        >
          {t}
        </span>
      ))}
    </div>
    <div className="flex items-center gap-3">
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View on GitHub"
        >
          <Github className="w-4 h-4" />
        </a>
      )}
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          onClick={(e) => e.stopPropagation()}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="View live demo"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  </motion.div>
);

const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="glass-card p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">{project.title}</h2>
          <p className="text-muted-foreground text-sm">{project.description}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        {[
          { label: "Problem", content: project.problem },
          { label: "Solution", content: project.solution },
          { label: "Technical Decisions", content: project.techDecisions },
          { label: "Challenges Solved", content: project.challenges },
        ].map((s) => (
          <div key={s.label}>
            <h3 className="text-sm font-semibold text-primary mb-2">{s.label}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border">
        {project.techStack.map((t) => (
          <span
            key={t}
            className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="flex gap-3 mt-6">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-secondary text-secondary-foreground text-sm font-medium hover:bg-muted transition-colors"
          >
            <Github className="w-4 h-4" /> Source Code
          </a>
        )}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        )}
      </div>
    </motion.div>
  </motion.div>
);

const ProjectsSection = () => {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Project <span className="gradient-text">Showcase</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Selected projects demonstrating end-to-end engineering across AI, systems, and full stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
          ))}
        </div>

        <AnimatePresence>
          {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProjectsSection;
