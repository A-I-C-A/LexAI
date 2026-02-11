import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    const generatedPaths = [];
    for (let i = 0; i < 15; i++) {
      const startY = (i / 15) * 100;
      const midY = startY + (Math.random() - 0.5) * 40;
      const endY = startY + (Math.random() - 0.5) * 30;
      
      generatedPaths.push({
        d: `M 0 ${startY} Q 25 ${midY}, 50 ${(startY + endY) / 2} T 100 ${endY}`,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 3,
      });
    }
    setPaths(generatedPaths);
  }, []);

  return (
    <svg
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(192,192,192,0)" />
          <stop offset="50%" stopColor="rgba(220,220,220,0.9)" />
          <stop offset="100%" stopColor="rgba(192,192,192,0)" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {paths.map((path, index) => (
        <motion.path
          key={index}
          d={path.d}
          stroke="url(#pathGradient)"
          strokeWidth="0.3"
          fill="none"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: path.duration,
            delay: path.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
};

export default AnimatedBackground;
