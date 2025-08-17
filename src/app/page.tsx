import { ArecaAnalyzer } from "@/components/areca-analyzer";
import { ArecaNutIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3">
          <ArecaNutIcon className="w-10 h-10 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Areca Grade AI
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Upload a photo of your areca nuts and get an instant, AI-powered
          analysis of their grade and quality.
        </p>
      </div>
      <ArecaAnalyzer />
    </main>
  );
}
