import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Scale, ChevronDown, Sun, Moon } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const [loaded, setLoaded] = useState(false);
  const { scrollY } = useScroll();
  const { theme, toggleTheme } = useTheme();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-light overflow-hidden relative">
      {/* Animated SVG Background */}
      <AnimatedBackground />
      
      {/* Floating Background Icons */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-20 h-20 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield className="w-full h-full text-landing-accent" />
      </motion.div>
      
      <motion.div
        className="fixed top-1/2 right-1/4 w-24 h-24 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Zap className="w-full h-full text-landing-accent" />
      </motion.div>
      
      <motion.div
        className="fixed bottom-1/4 left-1/3 w-20 h-20 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Scale className="w-full h-full text-landing-accent" />
      </motion.div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-12 rounded-full bg-card backdrop-blur-xl border border-border flex items-center justify-center mr-3">
                <Scale className="w-6 h-6 text-landing-accent" />
              </div>
              <span className="text-2xl font-light tracking-tighter text-landing-accent" style={{ fontFamily: '"Inter", sans-serif' }}>LegalAxis</span>
            </motion.div>
            
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light no-underline">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light no-underline">Pricing</a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors duration-300 font-light no-underline">Contact</a>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-secondary transition-colors duration-300"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 text-foreground" />
                )}
              </button>
              <Link to="/login" className="text-foreground hover:text-landing-accent transition-colors duration-300 font-light no-underline" style={{ fontFamily: '"Inter", sans-serif' }}>Login</Link>
              <Link 
                to="/signup" 
                className="rounded-full px-9 py-3.5 bg-landing-accent text-landing-accent-text font-semibold border border-landing-accent shadow-lg hover:bg-landing-accent-hover hover:border-landing-accent-hover hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 ease-out text-lg no-underline"
                style={{ fontFamily: '"Inter", sans-serif' }}
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </nav>

        <motion.section 
  className="flex flex-col items-center justify-start min-h-screen text-center px-6 pt-28"
  style={{ y: heroY, opacity: heroOpacity }}
>

  {/* Logo */}
  <motion.div
    className="w-24 h-24 rounded-full bg-card backdrop-blur-xl border border-border flex items-center justify-center mb-8 shadow-lg"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.8, type: "spring" }}
  >
    <Scale className="w-12 h-12 text-landing-accent" />
  </motion.div>

  {/* Title */}
  <motion.h1 
    className="mb-6 max-w-4xl mx-auto text-foreground"
    style={{ 
      fontFamily: '"Inter", sans-serif',
      fontSize: '64px',
      fontWeight: '300',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
  >
    Your AI-Powered Legal Intelligence Platform
  </motion.h1>

  {/* Subtitle */}
  <motion.div
    className="mt-6 px-8 py-4 rounded-2xl bg-secondary/50 backdrop-blur-xl border border-border mb-12"

    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 0.5, y: 0 }}
    transition={{ duration: 0.8, delay: 0.5 }}
  >
    <p 
      className="text-[20px] text-foreground/75 max-w-3xl mx-auto"
      style={{ 
        fontFamily: '"Inter", sans-serif',
        fontWeight: '400',
        
      }}
    >
      Transparent. Accessible. Unbiased.
    </p>
  </motion.div>

  {/* CTA Button */}
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.7 }}
  >
    <Link 
      to="/signup"
      className="rounded-full bg-landing-accent text-landing-accent-text shadow-lg hover:bg-landing-accent-hover hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 ease-out inline-block no-underline"
      style={{ 
        fontFamily: '"Inter", sans-serif',
        fontWeight: '600',
        padding: '14px 36px'
      }}
    >
      Start Free Trial
    </Link>
  </motion.div>





          
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center text-muted-foreground"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-sm mb-2 font-light">Scroll to explore</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.section>

        {/* Feature Cards Section */}
        <section id="features" className="container mx-auto px-6 py-24">
          <motion.h2 
            className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-6 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Intelligent Legal Agents
          </motion.h2>
          
          <motion.p
            className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Powered by advanced AI that transforms legal workflows
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Compliance Guardian',
                description: 'Real-time validation against legal databases & regulations'
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Risk Analyzer',
                description: 'Visual heatmaps for clause-by-clause risk assessment'
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: 'Negotiation AI',
                description: 'Generate counter-proposals with balanced alternatives'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-3xl bg-card backdrop-blur-xl border border-border hover:border-landing-accent/50 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-landing-accent">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-4 text-foreground">{feature.title}</h3>
                <p className="text-base text-muted-foreground font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-border">
          <div className="text-center text-muted-foreground font-light">
            <p>© 2026 LegalAxis. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;


