import { motion } from "framer-motion"
import { Github, Shield, Terminal, Code, Search, Lock, Zap } from "lucide-react"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Projects() {
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

  const projects = [
    {
      title: "HackSkyICS - Industrial Control System Cybersecurity Platform",
      description: "Comprehensive industrial cybersecurity platform combining real-time SCADA monitoring, AI-powered threat detection, and autonomous defense mechanisms. Built a full-stack application demonstrating advanced ICS protection with realistic attack simulation and intelligent response systems.",
      tech: ["React 18", "TypeScript", "Python", "PyTorch", "Node.js", "Docker", "Supabase"],
      category: "Cybersecurity Platform",
      icon: Shield,
      github: "https://github.com/avim3hta/HackSkyICS",
      status: "Complete",
      glowColor: "cyan" as const,
      achievements: [
        "AI/ML models achieving 92.42% accuracy in anomaly detection",
        "Real-time threat detection with <500ms average response time",
        "Multi-VM architecture simulating realistic industrial environments",
        "Autonomous defense system with zero-human-intervention response"
      ]
    },
    {
      title: "IPS - Real-Time Intrusion Prevention System",
      description: "Enterprise-grade Intrusion Prevention System combining advanced network traffic analysis, dynamic threat mitigation, and intelligent monitoring capabilities. Built a comprehensive security platform with automated threat detection and response mechanisms.",
      tech: ["Python", "Snort 3.6.0", "iptables", "Flask", "WebSocket", "Linux", "tcpdump"],
      category: "Network Security",
      icon: Lock,
      github: "https://github.com/avim3hta/IPS",
      status: "Complete",
      glowColor: "green" as const,
      achievements: [
        "Real-time intrusion detection with automated blocking capabilities",
        "Dynamic firewall rule management using iptables",
        "Multi-threaded architecture with queue-based alert processing",
        "Comprehensive scan detection (stealth, version, OS, aggressive scans)"
      ]
    },
    {
      title: "Python Network Firewall - Real-Time Traffic Monitoring & Security System",
      description: "Robust, enterprise-grade network firewall implementation from scratch using Python, featuring stateful packet inspection, real-time traffic analysis, and configurable rule-based filtering. Built a comprehensive security solution demonstrating deep understanding of network protocols.",
      tech: ["Python", "Scapy", "PyYAML", "Linux", "Multi-threading", "Stateful Inspection"],
      category: "Network Security",
      icon: Terminal,
      github: "https://github.com/ahaan-parmar/FireWall",
      status: "Complete",
      glowColor: "blue" as const,
      achievements: [
        "Stateful packet inspection with advanced connection tracking",
        "Real-time packet capture and analysis engine using Scapy",
        "YAML-based configuration system for flexible rule management",
        "Multi-threaded architecture supporting high-volume packet processing"
      ]
    }
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
          <motion.section variants={containerVariants} className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold font-mono mb-6">
              <span className="text-accent">./</span>
              <span className="text-primary">projects</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A showcase of my cybersecurity projects and technical achievements 
              in building secure, intelligent systems and network security solutions.
            </p>
          </motion.section>

          {/* Projects Grid */}
          <motion.section variants={containerVariants}>
            <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
              {projects.map((project, index) => {
                const IconComponent = project.icon
                return (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, delay: index * 0.1 }
                      }
                    }}
                  >
                    <CyberCard 
                      title={project.title} 
                      glowColor={project.glowColor}
                      className="h-full"
                    >
                      <div className="space-y-6">
                        {/* Project Icon and Category */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <Badge variant="outline" className="font-mono text-xs">
                              {project.category}
                            </Badge>
                          </div>
                          <Badge 
                            variant="default"
                            className="font-mono text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {project.description}
                        </p>

                        {/* Key Achievements */}
                        <div className="space-y-3">
                          <h4 className="font-semibold font-mono text-primary text-sm">Key Technical Achievements:</h4>
                          <div className="space-y-2">
                            {project.achievements.map((achievement, achievementIndex) => (
                              <div key={achievementIndex} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                <p className="text-xs text-muted-foreground">{achievement}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack */}
                        <div className="space-y-2">
                          <h4 className="font-semibold font-mono text-primary text-sm">Technologies Used:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.tech.map((tech, techIndex) => (
                              <Badge 
                                key={techIndex} 
                                variant="secondary" 
                                className="text-xs font-mono bg-secondary/30 text-foreground"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="pt-2">
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="w-full font-mono border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            asChild
                          >
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="mr-2 h-5 w-5" />
                              View on GitHub
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CyberCard>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section 
            variants={containerVariants}
            className="text-center mt-16"
          >
            <CyberCard title="Collaborate" glowColor="green" className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Interested in collaborating on cybersecurity projects or contributing to open source? 
                  Let's build something amazing together!
                </p>
                <Button size="lg" variant="outline" className="font-mono border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                  <a href="https://github.com/ahaan-parmar" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    View All Projects
                  </a>
                </Button>
              </div>
            </CyberCard>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}