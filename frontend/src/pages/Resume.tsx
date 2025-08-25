import { Button } from "@/components/ui/button"

export default function Resume() {
  const resumeUrl = "/resume_ahaanparmar.pdf"

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold font-mono">
            <span className="text-accent">./</span>
            <span className="text-primary">resume</span>
          </h1>
          <a href={resumeUrl} download>
            <Button variant="outline" className="font-mono border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Download PDF
            </Button>
          </a>
        </div>

        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <iframe
            src={resumeUrl}
            title="Ahaan Parmar Resume"
            className="w-full"
            style={{ height: "80vh" }}
          />
        </div>

        <div className="mt-4 text-sm text-muted-foreground font-mono">
          If the PDF doesn't load, <a className="text-primary underline" href={resumeUrl} target="_blank" rel="noopener noreferrer">open it in a new tab</a>.
        </div>
      </div>
    </div>
  )
}


