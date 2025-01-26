"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  config?: {
    charDelay?: number;
    animDuration?: number;
  };
}

export function AnimatedText({ 
  text, 
  className = '',
  config = {
    charDelay: 40,
    animDuration: 300
  }
}: AnimatedTextProps) {
  const [chars, setChars] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChars([]);
    // Add a blank space at the start and split the text
    const chars = [' ', ...text.split('')];
    let index = 0;

    const interval = setInterval(() => {
      if (index < chars.length) {
        setChars(prev => [...prev, chars[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, config.charDelay);

    return () => clearInterval(interval);
  }, [text, config.charDelay]);

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className={`${className} whitespace-nowrap overflow-x-scroll custom-scrollbar tracking-wide`}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="char inline-block"
            style={{ 
              animationDelay: `${i * 0.05}s`,
              animationDuration: `${config.animDuration}ms`,
              // Make the initial space character smaller
              ...(i === 0 && { width: '8px', opacity: 0 })
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}