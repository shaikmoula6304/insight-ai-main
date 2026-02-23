import { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Server, Brain, Cpu, Cloud, ChevronDown } from "lucide-react";
import { skillCategories } from "@/data/portfolio";

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Brain: <Brain className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Cloud: <Cloud className="w-5 h-5" />,
};

const SkillsSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="skills" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Skills <span className="gradient-text">Intelligence</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            A curated view of my technical capabilities across the full stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {skillCategories.map((cat, i) => {
            const isOpen = expanded === cat.id;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : cat.id)}
                  className="w-full text-left glass-card p-5 transition-all duration-200 hover:shadow-card group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-secondary text-primary">
                        {iconMap[cat.icon]}
                      </div>
                      <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-2">
                      {cat.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground border border-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
