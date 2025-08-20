import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-sm text-muted-foreground mb-4 md:mb-0">
            <Shield className="h-4 w-4 text-primary" />
            <span>© 2025 Ahaan Parmar. All rights reserved.</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="font-mono">Built with ❤️ and </span>
            <span className="text-primary font-mono">React + Vite</span>
          </div>
        </div>
      </div>
    </footer>
  )
}