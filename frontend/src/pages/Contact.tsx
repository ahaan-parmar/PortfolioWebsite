import { motion } from "framer-motion"
import { Mail, Github, Linkedin, MessageSquare, Key, MapPin } from "lucide-react"
import { CyberCard } from "@/components/cyber-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import * as openpgp from "openpgp"

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
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

  const socialLinks = [
    {
              name: "GitHub",
        icon: Github,
        url: "https://github.com/ahaan-parmar",
      description: "Check out my open-source projects and contributions"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/ahaanparmar",
      description: "Connect with me professionally"
    },
    {
      name: "Email",
      icon: Mail,
      url: "mailto:ahaan.parmar@example.com",
      description: "Direct communication for opportunities and collaboration"
    }
  ]

  const pgpPublicKey = `
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQENBGMrN2kBCAC7vQHq4rN2xZqJHo5kWqm9k7sYRpXg8Q2Nv3zR7x1zQwYfGhJk
L3pMx9yWqR5QzLxNvF8hGzKx2vRz4jNxKqZgX7yHvP1pQzLm4jvY6kW5hFgJ8q3z
[... Truncated for display purposes ...]
vQHq4rN2xZqJHo5kWqm9k7sYRpXg8Q2Nv3zR7x1zQwYfGhJkL3pMx9yWqR5QzLxN
=AbCd
-----END PGP PUBLIC KEY BLOCK-----
  `.trim()

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
              <span className="text-primary">contact</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let's connect! Whether you have questions, collaboration ideas, or just want to 
              discuss cybersecurity, I'd love to hear from you.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.section variants={containerVariants}>
              <CyberCard title="Send a Message" glowColor="cyan">
                <form
                  className="space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setSubmitting(true)
                    try {
                      let payload: any = {}
                      let usedEncryption = false
                      try {
                        const publicKey = await openpgp.readKey({ armoredKey: pgpPublicKey })
                        const encrypted = await openpgp.encrypt({
                          message: await openpgp.createMessage({ text: form.message }),
                          encryptionKeys: publicKey
                        })
                        payload = { isEncrypted: true, encryptedPayload: encrypted }
                        usedEncryption = true
                      } catch (encErr) {
                        payload = { isEncrypted: false, message: form.message }
                      }

                      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/contact`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: form.name,
                          email: form.email,
                          subject: form.subject,
                          ...payload
                        })
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data?.error || 'Failed to submit')
                      if (usedEncryption) {
                        toast.success('Message sent securely. I will get back to you soon.')
                      } else {
                        toast.success('Message sent (PGP unavailable). I will get back to you soon.')
                      }
                      setForm({ name: "", email: "", subject: "", message: "" })
                    } catch (err: any) {
                      toast.error(err?.message || 'Something went wrong. Please try again.')
                    } finally {
                      setSubmitting(false)
                    }
                  }}
                >
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-primary">Name</label>
                    <Input 
                      placeholder="Your name"
                      className="font-mono bg-background/50 border-border focus:border-primary"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-primary">Email</label>
                    <Input 
                      type="email"
                      placeholder="your.email@example.com"
                      className="font-mono bg-background/50 border-border focus:border-primary"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-primary">Subject</label>
                    <Input 
                      placeholder="What's this about?"
                      className="font-mono bg-background/50 border-border focus:border-primary"
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-primary">Message</label>
                    <Textarea 
                      placeholder="Your message here..."
                      rows={6}
                      className="font-mono bg-background/50 border-border focus:border-primary resize-none"
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full font-mono" disabled={submitting}>
                    <MessageSquare className="mr-2 h-5 w-5" />
                    {submitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CyberCard>
            </motion.section>

            {/* Contact Information */}
            <motion.section variants={containerVariants} className="space-y-8">
              {/* Social Links */}
              <CyberCard title="Connect With Me" glowColor="green">
                <div className="space-y-4">
                  {socialLinks.map((link, index) => {
                    const IconComponent = link.icon
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-4 p-3 bg-secondary/20 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 group"
                      >
                        <IconComponent className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
                        <div>
                          <h4 className="font-semibold font-mono text-primary group-hover:text-accent transition-colors">
                            {link.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </CyberCard>

              {/* Location & Availability */}
              <CyberCard title="Availability" glowColor="blue">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-mono text-primary">Location</p>
                      <p className="text-sm text-muted-foreground">India (GMT+5:30)</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono text-primary">Status:</span> Available for consulting, 
                      freelance projects, and collaboration opportunities.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-secondary/20 rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-mono text-primary">Response Time:</span> Usually within 24-48 hours.
                    </p>
                  </div>
                </div>
              </CyberCard>

              {/* PGP Key */}
              <CyberCard title="Secure Communication" glowColor="cyan">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Key className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-mono text-primary mb-2">PGP Public Key</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        For sensitive communications, you can encrypt your messages using my PGP key.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 border border-border rounded-lg p-3 overflow-hidden">
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all">
                      {pgpPublicKey.split('\n').slice(0, 3).join('\n')}
                      <span className="text-primary">{'\n[... Key content ...]\n'}</span>
                      {pgpPublicKey.split('\n').slice(-2).join('\n')}
                    </pre>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="font-mono border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Download Full Key
                    </Button>
                    <Button size="sm" variant="ghost" className="font-mono text-xs">
                      Fingerprint: 1234 5678 9ABC DEF0
                    </Button>
                  </div>
                </div>
              </CyberCard>
            </motion.section>
          </div>

          {/* Quick Contact Options */}
          <motion.section variants={containerVariants} className="mt-16">
            <CyberCard title="Quick Contact" glowColor="green" className="max-w-2xl mx-auto text-center">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Need to reach out quickly? Choose your preferred method:
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button size="lg" className="font-mono" asChild>
                    <a href="mailto:ahaan.parmar@example.com">
                      <Mail className="mr-2 h-5 w-5" />
                      Email Me
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="font-mono border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                    <a href="https://linkedin.com/in/ahaanparmar" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-5 w-5" />
                      LinkedIn DM
                    </a>
                  </Button>
                </div>
              </div>
            </CyberCard>
          </motion.section>
        </motion.div>
      </div>
    </div>
  )
}