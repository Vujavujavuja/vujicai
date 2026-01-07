'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// AI Pictogram Components
const BrainIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 7 19.5v-15A2.5 2.5 0 0 1 9.5 2Z"/>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 17 19.5v-15A2.5 2.5 0 0 0 14.5 2Z"/>
    <path d="M6 7c-1.5 0-3 1-3 2.5S4.5 12 6 12s3-1 3-2.5S7.5 7 6 7Z"/>
    <path d="M18 7c1.5 0 3 1 3 2.5S19.5 12 18 12s-3-1-3-2.5S16.5 7 18 7Z"/>
    <path d="M6 15c-1.5 0-3 1-3 2.5S4.5 20 6 20s3-1 3-2.5S7.5 15 6 15Z"/>
    <path d="M18 15c1.5 0 3 1 3 2.5S19.5 20 18 20s-3-1-3-2.5S16.5 15 18 15Z"/>
  </svg>
);

const RobotIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="8" width="16" height="12" rx="2"/>
    <path d="M12 8V4"/>
    <circle cx="12" cy="2" r="1"/>
    <circle cx="9" cy="12" r="1"/>
    <circle cx="15" cy="12" r="1"/>
    <path d="M9 16h6"/>
    <path d="M4 12h2"/>
    <path d="M18 12h2"/>
  </svg>
);

const NetworkIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="2"/>
    <circle cx="6" cy="6" r="2"/>
    <circle cx="18" cy="6" r="2"/>
    <circle cx="6" cy="18" r="2"/>
    <circle cx="18" cy="18" r="2"/>
    <path d="M8 8l6 6"/>
    <path d="M16 8l-6 6"/>
    <path d="M8 16l6-6"/>
    <path d="M16 16l-6-6"/>
  </svg>
);

const ProcessorIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
    <path d="M9 9h6v6H9z"/>
    <path d="M6 10h-2"/>
    <path d="M6 14h-2"/>
    <path d="M20 10h-2"/>
    <path d="M20 14h-2"/>
    <path d="M10 6V4"/>
    <path d="M14 6V4"/>
    <path d="M10 20v-2"/>
    <path d="M14 20v-2"/>
  </svg>
);

const CodeIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16,18 22,12 16,6"/>
    <polyline points="8,6 2,12 8,18"/>
    <line x1="14" y1="4" x2="10" y2="20"/>
  </svg>
);

export function AnimatedBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  // Generate floating AI pictograms
  const aiPictograms = Array.from({ length: 16 }, (_, i) => {
    const icons = [BrainIcon, RobotIcon, NetworkIcon, ProcessorIcon, CodeIcon];
    return {
      id: i,
      Icon: icons[i % 5],
      size: Math.random() * 25 + 20,
      initialX: Math.random() * 90 + 5,
      initialY: Math.random() * 90 + 5,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.2,
    };
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Darker Gradient Background */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-950 via-gray-950 to-slate-950' 
            : 'bg-gradient-to-br from-gray-50 via-slate-50 to-gray-50'
        }`}
      />
      
      {/* Animated AI Pictograms */}
      {aiPictograms.map((pictogram) => {
        const { Icon } = pictogram;
        return (
          <div
            key={pictogram.id}
            className={`absolute ${
              isDark ? 'text-purple-400/40' : 'text-purple-500/50'
            }`}
            style={{
              left: `${pictogram.initialX}%`,
              top: `${pictogram.initialY}%`,
              opacity: pictogram.opacity,
              animation: `floatAround ${pictogram.duration}s infinite linear`,
              animationDelay: `${pictogram.delay}s`,
            }}
          >
            <Icon size={pictogram.size} />
          </div>
        );
      })}
      
      {/* Secondary AI Elements */}
      {Array.from({ length: 11 }, (_, i) => {
        const icons = [BrainIcon, RobotIcon, NetworkIcon, ProcessorIcon, CodeIcon];
        const Icon = icons[i % 5];
        return (
          <div
            key={`secondary-${i}`}
            className={`absolute ${
              isDark ? 'text-blue-400/25' : 'text-blue-500/35'
            }`}
            style={{
              left: `${Math.random() * 85 + 7.5}%`,
              top: `${Math.random() * 85 + 7.5}%`,
              animation: `neuralPulse ${Math.random() * 4 + 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <Icon size={Math.random() * 20 + 15} />
          </div>
        );
      })}
      
      {/* Tertiary AI Elements */}
      {Array.from({ length: 8 }, (_, i) => {
        const icons = [ProcessorIcon, CodeIcon, BrainIcon, NetworkIcon, RobotIcon];
        const Icon = icons[i % 5];
        return (
          <div
            key={`tertiary-${i}`}
            className={`absolute ${
              isDark ? 'text-green-400/20' : 'text-green-500/30'
            }`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animation: `chipFloat ${Math.random() * 15 + 12}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          >
            <Icon size={Math.random() * 30 + 25} />
          </div>
        );
      })}
      
      {/* Data Flow Lines */}
      {Array.from({ length: 11 }, (_, i) => (
        <div
          key={`line-${i}`}
          className={`absolute ${
            isDark ? 'bg-cyan-400/15' : 'bg-cyan-400/25'
          }`}
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: '2px',
            left: `${Math.random() * 70 + 15}%`,
            top: `${Math.random() * 80 + 10}%`,
            transform: `rotate(${Math.random() * 360}deg)`,
            animation: `dataFlow ${Math.random() * 8 + 6}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Small Floating AI Icons */}
      {Array.from({ length: 7 }, (_, i) => {
        const icons = [BrainIcon, RobotIcon, NetworkIcon, ProcessorIcon, CodeIcon];
        const Icon = icons[i % 5];
        return (
          <div
            key={`floating-${i}`}
            className={`absolute ${
              isDark ? 'text-cyan-400/15' : 'text-cyan-600/25'
            }`}
            style={{
              left: `${Math.random() * 95}%`,
              top: `${Math.random() * 50}%`,
              animation: `binaryFall ${Math.random() * 10 + 8}s infinite linear`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <Icon size={12} />
          </div>
        );
      })}
    </div>
  );
}