import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";
import { experiences, education } from "@/data/portfolio";

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Professional journey in embedded systems, hardware design, and software development.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            {/* Experience items */}
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative pl-16 pb-12 last:pb-0"
              >
                {/* Dot */}
                <div className="absolute left-4 top-1 w-5 h-5 rounded-full gradient-bg flex items-center justify-center">
                  <Briefcase className="w-2.5 h-2.5 text-primary-foreground" />
                </div>

                <div className="glass-card p-6 transition-shadow duration-200 hover:shadow-card">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <h3 className="font-semibold text-foreground">{exp.role}</h3>
                    <span className="text-xs text-muted-foreground font-medium px-2.5 py-1 rounded-full bg-secondary border border-border w-fit">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {exp.highlights.map((h, j) => (
                      <li key={j} className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary mt-1.5 shrink-0">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}

            {/* Education header */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative pl-16 pt-4 pb-6"
            >
              <div className="absolute left-4 top-5 w-5 h-5 rounded-full bg-secondary border-2 border-primary flex items-center justify-center">
                <GraduationCap className="w-2.5 h-2.5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Education</h3>
            </motion.div>

            {/* Education items */}
            {education.map((edu, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative pl-16 pb-8 last:pb-0"
              >
                <div className="absolute left-[23px] top-2 w-2.5 h-2.5 rounded-full bg-border" />

                <div className="glass-card p-5">
                  <h4 className="font-medium text-foreground text-sm mb-1">{edu.degree}</h4>
                  <p className="text-xs text-muted-foreground mb-1">{edu.institution}</p>
                  {"university" in edu && (
                    <p className="text-xs text-muted-foreground mb-1">Affiliated to {edu.university}</p>
                  )}
                  <span className="text-xs text-primary font-medium">{edu.period}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
