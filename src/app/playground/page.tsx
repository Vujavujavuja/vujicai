'use client';

import { Globe, FileText, Layers, Rocket, Map } from 'lucide-react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

const projectData = [
  {
    id: 1,
    title: "Vuja Mapapp",
    date: "2025",
    content: "AI-powered travel route generator that creates aesthetic maps based on your vibes. Describe your dream trip and let AI design a beautiful route.",
    category: "AI Tool",
    icon: Map,
    relatedIds: [2],
    status: "completed" as const,
    energy: 100,
    url: "https://map.vujic.ai",
  },
  {
    id: 2,
    title: "Vuja Paper",
    date: "2025",
    content: "AI-first research assistant that transforms static PDFs into interactive conversations. Chat with any Arxiv paper using the latest AI models.",
    category: "AI Tool",
    icon: FileText,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 90,
    url: "https://paper.vujic.ai",
  },
  {
    id: 3,
    title: "PromptStratum",
    date: "2025",
    content: "Free MCP server for prompt layering. Get more out of your AI usage with a simple prompt layer (stratum).",
    category: "MCP",
    icon: Layers,
    relatedIds: [2],
    status: "in-progress" as const,
    energy: 60,
    url: "https://promptstratum.com",
  },
];

export default function PlaygroundPage() {
  return (
    <div className="pb-32 md:pb-0">
      <div className="pt-20 text-center px-4">
        <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight mb-4">
          Playground
        </h1>
        <p className="text-muted-foreground mb-4">
          Click on a node to explore
        </p>
      </div>
      <RadialOrbitalTimeline timelineData={projectData} />
    </div>
  );
}
