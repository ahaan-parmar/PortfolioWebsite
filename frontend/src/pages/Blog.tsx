import { motion } from "framer-motion"
import { Calendar, Clock, User, ArrowRight, Shield, Terminal, Brain, AlertTriangle, Zap, Globe, BarChart3, ExternalLink } from "lucide-react"
import { CyberCard } from "@/components/cyber-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Blog() {
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

  const blogPosts = [
    {
      id: "hackskyics-ai-powered-ics-cybersecurity",
      title: "HackSkyICS – AI-Powered ICS Cybersecurity Attack Simulation & Anomaly Detection",
      excerpt: "How we built a comprehensive industrial cybersecurity platform that combines real-time attack simulation with AI-powered threat detection, achieving 92.42% accuracy in anomaly detection.",
      author: "Ahaan Parmar",
      date: "December 2024",
      readTime: "12 min read",
      category: "Cybersecurity",
      tags: ["ICS", "AI/ML", "Industrial Security", "Penetration Testing", "Machine Learning"],
      featured: true,
      image: "/blog/hackskyics/architecture.png"
    }
  ]

  const featuredPost = blogPosts.find(post => post.featured)

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
              <span className="text-primary">blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Technical insights, project deep-dives, and cybersecurity research 
              from my journey in ethical hacking and industrial security.
            </p>
          </motion.section>

          {/* Featured Blog Post Overview */}
          {featuredPost && (
            <motion.section variants={containerVariants} className="mb-16">
              <CyberCard title="Featured Article" glowColor="cyan" className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  <div className="md:col-span-1">
                    <div className="rounded-lg border border-border bg-muted">
                      <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-auto object-contain" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <Badge variant="outline" className="font-mono">
                        {featuredPost.category}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold font-mono text-primary leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featuredPost.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="font-mono text-xs bg-secondary/30 text-foreground">
                          {tag}
                        </Badge>
              ))}
                    </div>
                              <div>
                      <Link to="/blog/hackskyics">
                          <Button size="lg" className="font-mono bg-primary hover:bg-primary/90">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            Read Full Article
                        </Button>
                        </Link>
                    </div>
                  </div>
                      </div>
                    </CyberCard>
            </motion.section>
          )}

          {/* More Articles Coming Soon */}
          <motion.section variants={containerVariants} className="text-center">
            <CyberCard title="More Articles Coming Soon" glowColor="green" className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  I'm working on more technical deep-dives, security research findings, and project insights. 
                  Stay tuned for more cybersecurity content!
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  <span>Topics: ICS Security, AI/ML, Penetration Testing, Network Security</span>
                </div>
              </div>
            </CyberCard>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}