'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === 'dark';

  // Generate floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 8,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    duration: Math.random() * 25 + 20,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.4 + 0.1,
  }));

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
      
      {/* Animated Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            isDark ? 'bg-purple-400/30' : 'bg-purple-400/40'
          }`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
            opacity: particle.opacity,
            animation: `floatAround ${particle.duration}s infinite linear`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      
      {/* Neural Network Nodes */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`node-${i}`}
          className={`absolute rounded-full ${
            isDark ? 'bg-blue-400/20 border-blue-400/30' : 'bg-blue-400/30 border-blue-400/40'
          } border-2`}
          style={{
            width: `${Math.random() * 16 + 8}px`,
            height: `${Math.random() * 16 + 8}px`,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            animation: `neuralPulse ${Math.random() * 4 + 3}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
      
      {/* AI Chip Representations */}
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={`chip-${i}`}
          className={`absolute ${
            isDark ? 'border-green-400/20 bg-green-400/10' : 'border-green-400/30 bg-green-400/20'
          } border-2 rounded-sm`}
          style={{
            width: `${Math.random() * 40 + 20}px`,
            height: `${Math.random() * 40 + 20}px`,
            left: `${Math.random() * 85 + 7.5}%`,
            top: `${Math.random() * 85 + 7.5}%`,
            animation: `chipFloat ${Math.random() * 15 + 12}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 8}s`,
          }}
        >
          {/* Circuit lines inside chip */}
          <div className={`absolute inset-1 ${isDark ? 'border-green-400/30' : 'border-green-400/40'} border-l border-t`} />
          <div className={`absolute inset-1 ${isDark ? 'border-green-400/30' : 'border-green-400/40'} border-r border-b`} />
        </div>
      ))}
      
      {/* Data Flow Lines */}
      {Array.from({ length: 8 }, (_, i) => (
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

      {/* Matrix-like Binary Rain (sparse) */}
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={`binary-${i}`}
          className={`absolute text-xs font-mono ${
            isDark ? 'text-green-400/20' : 'text-green-600/30'
          }`}
          style={{
            left: `${Math.random() * 95}%`,
            top: `${Math.random() * 50}%`,
            animation: `binaryFall ${Math.random() * 10 + 8}s infinite linear`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          {Math.random() > 0.5 ? '1' : '0'}
        </div>
      ))}
    </div>
  );
}