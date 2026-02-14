import React from 'react';

const Logo = ({ variant = 'default', className = '' }) => {
  
  if (variant === 'hero') {
    // Landing page - floating logo
    return (
      <div className={`animate-float ${className}`} style={{ animationDuration: '6s' }}>
        <div className="w-24 h-24 rounded-2xl bg-card backdrop-blur-xl border border-border flex items-center justify-center shadow-lg">
          <img 
            src="/logolegal.png" 
            alt="Lex AI Logo" 
            className="h-18 w-18 object-contain select-none" 
            draggable="false"
          />
        </div>
      </div>
    );
  }
  
  if (variant === 'sidebar') {
    // Sidebar - icon + text horizontal layout
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img 
          src="/logolegal.png" 
          alt="Lex AI Logo" 
          className="w-6 h-6 object-contain select-none" 
          draggable="false"
        />
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
    // Navbar - icon + text horizontal layout
    return (
      <span className={`text-xl sm:text-2xl font-light tracking-tighter text-foreground truncate flex items-center ${className}`}>
        <img 
          src="/logolegal.png" 
          alt="Lex AI Logo" 
          className="h-7 w-7 sm:h-8 sm:w-8 mr-2 object-contain select-none" 
          draggable="false"
        />
        Lex AI
      </span>
    );
  }
  
  // Default - for auth pages
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logolegal.png" 
        alt="Lex AI Logo" 
        className="h-18 w-18 object-contain select-none" 
        draggable="false"
      />
    </div>
  );
};

export default Logo;
