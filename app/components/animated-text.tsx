"use client";

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const [chars, setChars] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChars([]);
    const chars = text.split('');
    let index = 0;

    const interval = setInterval(() => {
      if (index < chars.length) {
        setChars(prev => [...prev, chars[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative w-full">
      <div 
        ref={containerRef} 
        className={`${className} whitespace-nowrap overflow-x-scroll custom-scrollbar pl-1`}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="char inline-block"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}