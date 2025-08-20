import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Terminal, Shield, Code, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CyberCard } from "@/components/cyber-card"

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold font-mono mb-6">
              <span className="text-primary">Ahaan</span>{" "}
              <span className="text-accent">Parmar</span>
            </h1>
            <div className="text-xl md:text-2xl text-muted-foreground font-mono mb-2">
              <span className="text-primary">$</span> whoami
            </div>
            <p className="text-2xl md:text-3xl font-mono text-foreground">
              Cybersecurity Student | AppSec Intern | Aspiring Red Teamer
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            <Link to="/projects">
              <Button size="lg" className="font-mono shadow-glow-cyan">
                <Terminal className="mr-2 h-5 w-5" />
                View Projects
              </Button>
            </Link>
            <Link to="/blog">
              <Button variant="secondary" size="lg" className="font-mono">
                <Code className="mr-2 h-5 w-5" />
                Read Blog
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="font-mono border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Shield className="mr-2 h-5 w-5" />
                Get In Touch
              </Button>
            </Link>
          </motion.div>

          {/* Terminal-style status */}
          <motion.div 
            variants={itemVariants}
            className="inline-block bg-card border border-border rounded-lg p-4 font-mono text-sm"
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-muted-foreground ml-2">~/status</span>
            </div>
            <div className="text-left space-y-1">
              <div><span className="text-accent">Status:</span> <span className="text-primary">Active</span></div>
              <div><span className="text-accent">Location:</span> <span className="text-primary">India</span></div>
              <div><span className="text-accent">Focus:</span> <span className="text-primary">Application Security</span></div>
            </div>
          </motion.div>
        </motion.section>

        {/* Quick Skills Overview */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-20"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold font-mono text-center mb-12 text-primary"
          >
            <span className="text-accent">./</span>expertise
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CyberCard title="Application Security" glowColor="cyan">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>OWASP Top 10</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-primary" />
                  <span>Vulnerability Assessment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span>Secure Code Review</span>
                </div>
              </div>
            </CyberCard>

            <CyberCard title="Penetration Testing" glowColor="green">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-accent" />
                  <span>Network Pentesting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span>Web App Testing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-accent" />
                  <span>Red Team Operations</span>
                </div>
              </div>
            </CyberCard>

            <CyberCard title="Research & Development" glowColor="blue">
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-cyber-blue" />
                  <span>Tool Development</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-cyber-blue" />
                  <span>Vulnerability Research</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-cyber-blue" />
                  <span>CTF Challenges</span>
                </div>
              </div>
            </CyberCard>
          </div>
        </motion.section>
      </div>
    </div>
  )
}