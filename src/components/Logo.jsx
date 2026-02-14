import React from 'react';

const Logo = ({ variant = 'default', className = '' }) => {
  // Ornate gold logo with decorative framing
  const OrnateLogoSVG = () => (
    <svg viewBox="0 0 200 240" className="w-full h-full">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f6c453" />
          <stop offset="100%" stopColor="#e0a106" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="1.5" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Decorative top brackets */}
      <path 
        d="M 60 30 L 50 30 L 50 40 M 140 30 L 150 30 L 150 40" 
        stroke="url(#goldGradient)" 
        strokeWidth="2" 
        fill="none"
        filter="url(#softGlow)"
      />

      {/* Scales of Justice Icon */}
      <g transform="translate(100, 50)" filter="url(#softGlow)">
        {/* Center pole */}
        <line x1="0" y1="-15" x2="0" y2="15" stroke="url(#goldGradient)" strokeWidth="2.5" />
        {/* Crossbar */}
        <line x1="-20" y1="-10" x2="20" y2="-10" stroke="url(#goldGradient)" strokeWidth="2.5" />
        {/* Left scale pan */}
        <circle cx="-20" cy="-6" r="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <line x1="-25" y1="-6" x2="-15" y2="-6" stroke="url(#goldGradient)" strokeWidth="1" />
        {/* Right scale pan */}
        <circle cx="20" cy="-6" r="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <line x1="15" y1="-6" x2="25" y2="-6" stroke="url(#goldGradient)" strokeWidth="1" />
        {/* Base */}
        <line x1="-10" y1="15" x2="10" y2="15" stroke="url(#goldGradient)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Decorative side frames */}
      <g stroke="url(#goldGradient)" strokeWidth="1.5" fill="none" filter="url(#softGlow)">
        <path d="M 40 100 L 35 105 L 35 115" />
        <path d="M 160 100 L 165 105 L 165 115" />
      </g>

      {/* "Lex AI" Text */}
      <text 
        x="100" 
        y="130" 
        textAnchor="middle" 
        fill="url(#goldGradient)"
        style={{ 
          fontSize: '32px', 
          fontWeight: '700',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '1px'
        }}
        filter="url(#softGlow)"
      >
        Lex AI
      </text>

      {/* Decorative wings at bottom */}
      <g transform="translate(100, 165)" stroke="url(#goldGradient)" fill="none" strokeWidth="1.5" filter="url(#softGlow)">
        {/* Left wing */}
        <path d="M -5 0 Q -15 -5, -25 -3 Q -20 2, -15 3 Q -10 2, -5 3" />
        <path d="M -15 3 Q -20 6, -22 10" />
        {/* Center ornament */}
        <circle cx="0" cy="2" r="3" fill="url(#goldGradient)" />
        {/* Right wing */}
        <path d="M 5 0 Q 15 -5, 25 -3 Q 20 2, 15 3 Q 10 2, 5 3" />
        <path d="M 15 3 Q 20 6, 22 10" />
      </g>

      {/* Bottom decorative brackets */}
      <path 
        d="M 60 200 L 50 200 L 50 190 M 140 200 L 150 200 L 150 190" 
        stroke="url(#goldGradient)" 
        strokeWidth="2" 
        fill="none"
        filter="url(#softGlow)"
      />
    </svg>
  );

  // Different variants for different locations
  if (variant === 'hero') {
    // Landing page - medium ornate version with floating animation
    return (
      <div className={`relative ${className} animate-float`} style={{ animationDuration: '6s' }}>
        <div 
          className="bg-gray-100 dark:bg-gray-800 rounded-3xl flex items-center justify-center"
          style={{
            width: '140px',
            height: '168px',
            padding: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <OrnateLogoSVG />
        </div>
      </div>
    );
  }
  
  if (variant === 'sidebar') {
    // Sidebar - compact version with just text and simple icon
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <defs>
            <linearGradient id="sidebarGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f6c453" />
              <stop offset="100%" stopColor="#e0a106" />
            </linearGradient>
          </defs>
          <line x1="12" y1="6" x2="12" y2="18" stroke="url(#sidebarGold)" strokeWidth="2" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="url(#sidebarGold)" strokeWidth="2" />
          <circle cx="6" cy="11" r="2.5" fill="none" stroke="url(#sidebarGold)" strokeWidth="1.5" />
          <circle cx="18" cy="11" r="2.5" fill="none" stroke="url(#sidebarGold)" strokeWidth="1.5" />
        </svg>
        <div
          className="text-foreground"
          style={{
            fontSize: '20px',
            fontWeight: '600',
            letterSpacing: '0.3px'
          }}
        >
          Lex AI
        </div>
      </div>
    );
  }
  
  if (variant === 'navbar') {
    // Navbar - horizontal with small gold icon
    return (
      <span className={`text-xl sm:text-2xl font-light tracking-tighter text-foreground truncate flex items-center ${className}`}>
        <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7 mr-2" fill="none">
          <defs>
            <linearGradient id="navGold" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f6c453" />
              <stop offset="100%" stopColor="#e0a106" />
            </linearGradient>
          </defs>
          <line x1="12" y1="6" x2="12" y2="18" stroke="url(#navGold)" strokeWidth="2" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="url(#navGold)" strokeWidth="2" />
          <circle cx="6" cy="11" r="2.5" fill="none" stroke="url(#navGold)" strokeWidth="1.5" />
          <circle cx="18" cy="11" r="2.5" fill="none" stroke="url(#navGold)" strokeWidth="1.5" />
        </svg>
        Lex AI
      </span>
    );
  }
  
  // Default - medium ornate version for auth pages
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center"
        style={{
          width: '120px',
          height: '144px',
          padding: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        }}
      >
        <OrnateLogoSVG />
      </div>
    </div>
  );
};

export default Logo;
