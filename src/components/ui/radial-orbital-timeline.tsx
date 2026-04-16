"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Link, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: "completed" | "in-progress" | "pending";
  energy: number;
  url?: string;
}

interface RadialOrbitalTimelineProps {
  timelineData: TimelineItem[];
}

export default function RadialOrbitalTimeline({
  timelineData,
}: RadialOrbitalTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [pulseEffect, setPulseEffect] = useState<Record<number, boolean>>({});
  const [centerOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeNodeId, setActiveNodeId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || e.target === orbitRef.current) {
      setExpandedItems({});
      setActiveNodeId(null);
      setPulseEffect({});
      setAutoRotate(true);
    }
  };

  const toggleItem = (id: number) => {
    setExpandedItems((prev) => {
      const newState: Record<number, boolean> = {};
      Object.keys(prev).forEach((key) => { newState[parseInt(key)] = false; });
      newState[id] = !prev[id];

      if (!prev[id]) {
        setActiveNodeId(id);
        setAutoRotate(false);
        const relatedItems = getRelatedItems(id);
        const newPulse: Record<number, boolean> = {};
        relatedItems.forEach((relId) => { newPulse[relId] = true; });
        setPulseEffect(newPulse);
        centerViewOnNode(id);
      } else {
        setActiveNodeId(null);
        setAutoRotate(true);
        setPulseEffect({});
      }
      return newState;
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRotate) {
      timer = setInterval(() => {
        setRotationAngle((prev) => Number(((prev + 0.08) % 360).toFixed(3)));
      }, 50);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [autoRotate]);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = timelineData.findIndex((item) => item.id === nodeId);
    const targetAngle = (nodeIndex / timelineData.length) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = 200;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian) + centerOffset.x;
    const y = radius * Math.sin(radian) + centerOffset.y;
    const zIndex = Math.round(100 + 50 * Math.cos(radian));
    const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));
    return { x, y, zIndex, opacity };
  };

  const getRelatedItems = (itemId: number): number[] => {
    const item = timelineData.find((i) => i.id === itemId);
    return item ? item.relatedIds : [];
  };

  const isRelatedToActive = (itemId: number): boolean => {
    if (!activeNodeId) return false;
    return getRelatedItems(activeNodeId).includes(itemId);
  };

  const getStatusStyles = (status: TimelineItem["status"]): string => {
    switch (status) {
      case "completed": return "text-primary-foreground bg-primary border-primary";
      case "in-progress": return "text-foreground bg-background border-primary";
      case "pending": return "text-muted-foreground bg-muted border-border";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div
      className="w-full h-[600px] md:h-[700px] flex flex-col items-center justify-center bg-background overflow-hidden relative"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        <div
          className="absolute w-full h-full flex items-center justify-center"
          ref={orbitRef}
          style={{ perspective: "1000px", transform: `translate(${centerOffset.x}px, ${centerOffset.y}px)` }}
        >
          {/* Center NV */}
          <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse flex items-center justify-center z-10">
            <div className="absolute w-20 h-20 rounded-full border border-primary/20 animate-ping opacity-70" />
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
              <span className="font-serif text-lg font-semibold text-foreground">NV</span>
            </div>
          </div>

          {/* Orbit ring */}
          <div className="absolute w-96 h-96 rounded-full border border-border/30" />

          {timelineData.map((item, index) => {
            const position = calculateNodePosition(index, timelineData.length);
            const isExpanded = expandedItems[item.id];
            const isRelated = isRelatedToActive(item.id);
            const isPulsing = pulseEffect[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                ref={(el) => { nodeRefs.current[item.id] = el; }}
                className="absolute transition-all duration-700 cursor-pointer"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  zIndex: isExpanded ? 200 : position.zIndex,
                  opacity: isExpanded ? 1 : position.opacity,
                }}
                onClick={(e) => { e.stopPropagation(); toggleItem(item.id); }}
              >
                {isPulsing && (
                  <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                      background: `radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)`,
                      width: `${item.energy * 0.5 + 40}px`,
                      height: `${item.energy * 0.5 + 40}px`,
                      left: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                      top: `-${(item.energy * 0.5 + 40 - 40) / 2}px`,
                    }}
                  />
                )}

                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isExpanded ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30 scale-150"
                    : isRelated ? "bg-primary/50 text-primary-foreground border-primary animate-pulse"
                    : "bg-card text-foreground border-border"
                }`}>
                  <Icon size={16} />
                </div>

                <div className={`absolute top-12 whitespace-nowrap text-xs font-semibold tracking-wider transition-all duration-300 ${
                  isExpanded ? "text-foreground scale-125" : "text-muted-foreground"
                }`}>
                  {item.title}
                </div>

                {isExpanded && (
                  <Card className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-card/95 backdrop-blur-lg border-border shadow-xl overflow-visible">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-px h-3 bg-border" />
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <Badge className={`px-2 text-xs ${getStatusStyles(item.status)}`}>
                          {item.status === "completed" ? "LIVE" : item.status === "in-progress" ? "IN PROGRESS" : "COMING SOON"}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm font-serif mt-2">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <p>{item.content}</p>
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="flex items-center"><Zap size={10} className="mr-1" />Progress</span>
                          <span className="font-mono">{item.energy}%</span>
                        </div>
                        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${item.energy}%` }} />
                        </div>
                      </div>
                      {item.relatedIds.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border">
                          <div className="flex items-center mb-2">
                            <Link size={10} className="text-muted-foreground mr-1" />
                            <h4 className="text-xs uppercase tracking-wider font-medium text-muted-foreground">Connected</h4>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {item.relatedIds.map((relatedId) => {
                              const relatedItem = timelineData.find((i) => i.id === relatedId);
                              return (
                                <Button key={relatedId} variant="outline" size="sm"
                                  className="flex items-center h-6 px-2 py-0 text-xs rounded-none border-border bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                                  onClick={(e) => { e.stopPropagation(); toggleItem(relatedId); }}
                                >
                                  {relatedItem?.title}
                                  <ArrowRight size={8} className="ml-1 text-muted-foreground" />
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center text-xs text-primary hover:text-primary/80 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit <ArrowRight size={10} className="ml-1" />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
