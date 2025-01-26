"use client";

import { useEffect, useRef } from 'react';

interface ParticleTextProps {
  children: React.ReactNode;
  className?: string;
}

export function ParticleText({ children, className = '' }: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const createParticle = (x: number, y: number) => {
    if (!containerRef.current) return;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    // Random x offset for particle movement
    particle.style.setProperty('--x-offset', `${(Math.random() - 0.5) * 40}px`);
    
    containerRef.current.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
      particle.remove();
    }, 1000);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create initial burst of particles
    const rect = containerRef.current.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      createParticle(x, y);
    }
  }, []);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
    </div>
  );
}