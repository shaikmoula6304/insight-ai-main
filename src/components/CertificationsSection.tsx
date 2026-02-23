import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

const certifications = [
  {
    id: "1",
    title: "Google Android Developer Virtual Internship",
    period: "Jan – Mar 2025",
    issuer: "Google Developers & AICTE",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
  },
  {
    id: "2",
    title: "Microchip Embedded System Developer Virtual Internship",
    period: "Jul – Sep 2024",
    issuer: "Microchip & AICTE",
    logo: "src/assets/Microchip_Technology_logo.svg",
  },
  {
    id: "3",
    title: "Java Full Stack Developer Virtual Internship",
    period: "Mar – Jul 2025",
    issuer: "AICTE",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const CertificationsSection = () => {
  return (
    <section id="certifications" className="py-24 relative">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full gradient-bg opacity-[0.03] blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="gradient-text">Certifications</span> & Training
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Industry-recognized virtual internships and professional training programs.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={cardVariants}
              className="glass-card p-6 flex flex-col items-center text-center group hover:shadow-elevated hover:scale-[1.02] transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border/40 flex items-center justify-center mb-5 group-hover:border-primary/30 transition-colors">
                <img
                  src={cert.logo}
                  alt={cert.issuer}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>

              <h3 className="font-semibold text-foreground text-sm leading-snug mb-2">
                {cert.title}
              </h3>

              <p className="text-xs text-primary font-medium mb-1">{cert.period}</p>

              <p className="text-xs text-muted-foreground">{cert.issuer}</p>

              <div className="mt-4 pt-4 border-t border-border/30 w-full flex items-center justify-center gap-1.5 text-muted-foreground">
                <Award className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium uppercase tracking-wider">Certified</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CertificationsSection;
