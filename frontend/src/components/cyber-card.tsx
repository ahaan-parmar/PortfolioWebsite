import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CyberCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  glowColor?: "cyan" | "green" | "blue"
  animate?: boolean
}

export function CyberCard({ 
  title, 
  description, 
  children, 
  className,
  glowColor = "cyan",
  animate = true 
}: CyberCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const hoverVariants = {
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const CardComponent = animate ? motion.div : "div"
  const cardProps = animate ? {
    variants: cardVariants,
    initial: "hidden",
    animate: "visible",
    whileHover: "hover",
    ...hoverVariants
  } : {}

  return (
    <CardComponent {...cardProps}>
      <Card className={cn(
        "bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300",
        glowColor === "cyan" && "hover:shadow-glow-cyan",
        glowColor === "green" && "hover:shadow-glow-green",
        "group",
        className
      )}>
        <CardHeader>
          <CardTitle className="font-mono text-primary group-hover:text-accent transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </CardComponent>
  )
}