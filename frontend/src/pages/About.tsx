import { motion } from "framer-motion"
import { GraduationCap, Award, Code, Shield, Terminal, Search } from "lucide-react"
import { CyberCard } from "@/components/cyber-card"
import { Badge } from "@/components/ui/badge"

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const skills = [
    "Application Security", "Penetration Testing", "Vulnerability Assessment",
    "Red Team Operations", "OWASP Top 10", "Secure Code Review",
    "Network Security", "Web Application Security", "API Security",
    "Security Automation", "CTF Challenges", "Threat Modeling"
  ]

  const certifications = [
    { name: "eLearnSecurity Junior Penetration Tester (eJPT)", status: "In Progress", year: "October 2025" },
    { name: "Google Cybersecurity Professional Certificate V2", status: "Earned", year: "2024" }
  ]

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.section variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-mono mb-6">
              <span className="text-accent">./</span>
              <span className="text-primary">about</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate cybersecurity student dedicated to securing the digital world through 
              ethical hacking, vulnerability research, and continuous learning.
            </p>
          </motion.section>

          {/* Bio Section */}
          <motion.section variants={itemVariants} className="mb-16">
            <CyberCard title="Bio" glowColor="cyan">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground leading-relaxed mb-4">
                  I'm currently pursuing a B.Tech in Cybersecurity, where I've developed a deep 
                  passion for application security and red team operations. My journey began with 
                  curiosity about how systems work and evolved into a mission to help organizations 
                  strengthen their security posture.
                </p>
                <p className="text-foreground leading-relaxed mb-4">
                  As an Application Security Intern, I've gained hands-on experience in vulnerability 
                  assessment, secure code review, and penetration testing. I believe in the power of 
                  ethical hacking to make the digital world safer for everyone.
                </p>
                <p className="text-foreground leading-relaxed">
                  When I'm not breaking things (ethically), you'll find me participating in CTF 
                  competitions, contributing to open-source security tools, and sharing knowledge 
                  through technical writeups and blog posts.
                </p>
              </div>
            </CyberCard>
          </motion.section>

          {/* Education */}
          <motion.section variants={itemVariants} className="mb-16">
            <CyberCard title="Education" glowColor="green">
              <div className="flex items-start space-x-4">
                <GraduationCap className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h3 className="text-lg font-semibold font-mono text-primary">
                    Bachelor of Technology in Cybersecurity
                  </h3>
                  <p className="text-muted-foreground">Manipal Institute of Technology , Bangalore • 2022 - 2027</p>
                  <p className="text-sm text-foreground mt-2">
                    Relevant coursework: Network Security, Cryptography, Ethical Hacking, 
                    Digital Forensics, OOPS
                  </p>
                </div>
              </div>
            </CyberCard>
          </motion.section>

          {/* Skills */}
          <motion.section variants={itemVariants} className="mb-16">
            <CyberCard title="Technical Skills" glowColor="blue">
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="font-mono text-xs bg-secondary/50 text-primary border-primary/20 hover:bg-secondary hover:border-primary/40 transition-colors"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CyberCard>
          </motion.section>

          {/* Certifications */}
          <motion.section variants={itemVariants} className="mb-16">
            <CyberCard title="Certifications & Learning Path" glowColor="cyan">
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/50">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-primary" />
                      <div>
                        <h4 className="font-semibold font-mono text-primary">{cert.name}</h4>
                        <p className="text-sm text-muted-foreground">{cert.year}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={cert.status === "Earned" ? "default" : cert.status === "In Progress" ? "secondary" : "outline"}
                      className="font-mono text-xs"
                    >
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CyberCard>
          </motion.section>

          {/* Current Focus */}
          <motion.section variants={itemVariants}>
            <CyberCard title="Current Focus" glowColor="green">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="font-mono text-primary">Application Security</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">
                    Deepening expertise in secure development practices and vulnerability research
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Terminal className="h-5 w-5 text-accent" />
                    <span className="font-mono text-accent">Red Team Skills</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">
                    Advancing penetration testing techniques and offensive security methodologies
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Code className="h-5 w-5 text-cyber-blue" />
                    <span className="font-mono text-cyber-blue">Tool Development</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">
                    Building custom security tools and automation scripts
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-primary" />
                    <span className="font-mono text-primary">Research</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">
                    Contributing to the security community through research and writeups
                  </p>
                </div>
              </div>
            </CyberCard>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}