import { motion } from "framer-motion"
import { Calendar, Clock, User, ArrowLeft, Shield, Terminal, Brain, ExternalLink } from "lucide-react"
import { CyberCard } from "@/components/cyber-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function HackSkyICS() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/blog">
              <Button variant="outline" className="font-mono">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Full Blog Post */}
          <CyberCard title="HackSkyICS — Full Article" glowColor="cyan" className="max-w-6xl mx-auto">
            <div className="space-y-8">
              {/* Post Header */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge variant="outline" className="font-mono">
                    Cybersecurity
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Ahaan Parmar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>July 2025</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>5 minute read</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold font-mono text-primary leading-tight">
                  HackSkyICS – AI-Powered ICS Cybersecurity Attack Simulation & Anomaly Detection
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  How we built a comprehensive industrial cybersecurity platform that combines real-time attack simulation with AI-powered threat detection, achieving 92.42% accuracy in anomaly detection.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["ICS", "AI/ML", "Industrial Security", "Penetration Testing", "Machine Learning"].map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="font-mono text-xs bg-secondary/30 text-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="overflow-hidden rounded-lg border border-border bg-muted">
                  <img
                    src="/blog/hackskyics/architecture.png"
                    alt="HackSkyICS overall architecture overview"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Full Blog Content */}
              <div className="prose prose-invert max-w-none space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    1. The Idea & Vision
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Industrial Control Systems (ICS) run the world quietly in the background — they control our power grids, water treatment plants, manufacturing lines, and more. But these systems weren't built with cybersecurity in mind. In today's world, that's a dangerous gap.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    When we joined the Kaspersky Industrial Cybersecurity Hackathon, we wanted to show that AI can spot industrial cyberattacks as they happen — even subtle ones that humans might miss — using realistic, hands-on simulations.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    That's how HackSkyICS came to life. Our main goal:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Simulate a real ICS network using virtualization</li>
                    <li>Launch actual ICS-specific cyberattacks on it</li>
                    <li>Detect anomalies in real-time using machine learning and an LLM</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed">
                    The focus was purely on detection, not on stopping or reversing the attack. And despite that scope, we ended up as one of the Top 15 teams in the hackathon.
                  </p>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    2. Quick Primer – ICS, IT, and OT
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you come from an IT-only background, here's a quick context:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-secondary/20 border border-border rounded-lg p-4">
                      <h4 className="font-semibold font-mono text-primary mb-2">IT (Information Technology)</h4>
                      <p className="text-sm text-muted-foreground">Your usual servers, databases, web apps, and emails. Downtime is bad, but mostly an inconvenience.</p>
                    </div>
                    <div className="bg-secondary/20 border border-border rounded-lg p-4">
                      <h4 className="font-semibold font-mono text-primary mb-2">OT (Operational Technology)</h4>
                      <p className="text-sm text-muted-foreground">The tech that makes the physical world work — turbines, pumps, PLCs, conveyor belts. Downtime here can cause massive damage or even risk lives.</p>
                    </div>
                    <div className="bg-secondary/20 border border-border rounded-lg p-4">
                      <h4 className="font-semibold font-mono text-primary mb-2">ICS (Industrial Control Systems)</h4>
                      <p className="text-sm text-muted-foreground">Sits inside OT. It's a combination of hardware, software, and networks that control industrial processes — typically via PLCs and SCADA systems.</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    The tricky part: many ICS protocols like Modbus and DNP3 have zero built-in security. They trust anything that talks to them, which is why attacks like Stuxnet were possible.
                  </p>
                  <div className="overflow-hidden rounded-lg border border-border bg-muted">
                    <img
                      src="/blog/hackskyics/security-events-management.png"
                      alt="Security events monitoring dashboard"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    3. Building HackSkyICS – The Core Architecture
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We went heavy on virtualization to create a controlled yet realistic environment. The setup:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Terminal className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold font-mono text-primary">Attack VM</span>
                        <p className="text-sm text-muted-foreground">Kali Linux with Metasploit, Modbus exploitation scripts, and network scanning tools.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold font-mono text-primary">ICS VM</span>
                        <p className="text-sm text-muted-foreground">Ubuntu Server running OpenPLC + ModbusPal, simulating a water treatment plant.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold font-mono text-primary">Monitoring VM</span>
                        <p className="text-sm text-muted-foreground">Python + Node.js environment running our ML models and anomaly detection logic.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-cyan-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold font-mono text-primary">Display VM (HMI)</span>
                        <p className="text-sm text-muted-foreground">React-based SCADA dashboard showing live sensor readings and system status.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    All of them were connected to a virtual network (192.168.100.0/24) to mimic a real plant setup. We used OpenPLC for its open-source flexibility and native Modbus support, and ModbusPal for generating realistic sensor values.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src="/blog/hackskyics/network-protocol-distribution.png"
                        alt="Network protocol distribution analytics"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src="/blog/hackskyics/attack.png"
                        alt="Attack interface demonstrating ICS attack simulation"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    4. Our AI/ML Detection Model
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We built HackSkyICS to use two key ML approaches:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-secondary/20 border border-border rounded-lg p-4">
                      <h4 className="font-semibold font-mono text-primary mb-2">Isolation Forest (scikit-learn)</h4>
                      <p className="text-sm text-muted-foreground">An unsupervised method that detects data points that don't fit normal patterns. Perfect for catching unknown or zero-day attacks.</p>
                    </div>
                    <div className="bg-secondary/20 border border-border rounded-lg p-4">
                      <h4 className="font-semibold font-mono text-primary mb-2">Autoencoder (PyTorch)</h4>
                      <p className="text-sm text-muted-foreground">A deep learning model trained on normal sensor patterns. If it struggles to "rebuild" the incoming data, that's a strong anomaly signal.</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Why both? ICS attacks can be subtle drifts in data (great for Isolation Forest) or they can be completely new patterns (Autoencoder catches these).
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We trained using both clean operational data and simulated attack data. The result:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-green-400">92.42%</div>
                      <div className="text-sm text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-blue-400">&lt;500ms</div>
                      <div className="text-sm text-muted-foreground">Detection Time</div>
                    </div>
                    <div className="text-center p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                      <div className="text-2xl font-bold font-mono text-cyan-400">Real-time</div>
                      <div className="text-sm text-muted-foreground">Alerts</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src="/blog/hackskyics/AI-Anomaly-Detection.png"
                        alt="AI anomaly detection visualization"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border bg-muted">
                      <img
                        src="/blog/hackskyics/detection.png"
                        alt="Detection alerts and monitoring"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    5. Key Achievements & Results
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    What made us stand out was that HackSkyICS wasn't just a model — it was a complete working environment where people could see an attack happen and then watch the system detect it in real-time.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-secondary/20 border border-border rounded-lg p-6">
                      <h4 className="font-semibold font-mono text-primary mb-4">Technical Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Detection Time:</span>
                          <span className="font-mono text-primary">&lt;500ms average</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Response Time:</span>
                          <span className="font-mono text-primary">&lt;1 second average</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">System Overhead:</span>
                          <span className="font-mono text-primary">&lt;5% CPU/memory</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-secondary/20 border border-border rounded-lg p-6">
                      <h4 className="font-semibold font-mono text-primary mb-4">ML Model Performance</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Accuracy:</span>
                          <span className="font-mono text-green-400">92.42%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Precision:</span>
                          <span className="font-mono text-blue-400">24.23%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Detection Rate:</span>
                          <span className="font-mono text-cyan-400">100.0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold font-mono text-primary border-b border-border pb-2">
                    6. The Bigger Picture & Future Applications
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    ICS attacks are getting more common, and they're dangerous because they target the physical world. HackSkyICS is a proof-of-concept that shows how AI can catch anomalies that humans or simple rules might miss.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold font-mono text-primary">Future Applications</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Training & Education for universities and training centers</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Research & Development for security researchers</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Vendor Testing for ICS security products</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Compliance Testing for security controls</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold font-mono text-primary">Potential Enhancements</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Automated Response capabilities</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Advanced Analytics and insights</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Multi-Protocol Support</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span>Cloud Integration and remote monitoring</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    The project demonstrates that with the right approach, even complex industrial security challenges can be addressed through innovative technology and careful design.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="border-t border-border pt-8">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Interested in learning more about industrial cybersecurity or collaborating on similar projects?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="https://github.com/avim3hta/HackSkyICS" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono hover:bg-primary/90 transition-colors"
                    >
                      <Terminal className="mr-2 h-5 w-5" />
                      <span>View Project on GitHub</span>
                      <ExternalLink className="mr-2 h-5 w-5" />
                    </a>
                    <Link 
                      to="/contact"
                      className="inline-flex items-center space-x-2 px-6 py-3 border border-accent text-accent rounded-lg font-mono hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      <span>Get in Touch</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </CyberCard>
        </motion.div>
      </div>
    </div>
  )
}


