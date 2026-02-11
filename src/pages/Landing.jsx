import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Scale, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';

const Landing = () => {
  const [loaded, setLoaded] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-dark-background text-dark-foreground font-light overflow-hidden relative">
      {/* Animated SVG Background */}
      <AnimatedBackground />
      
      {/* Floating Background Icons */}
      <motion.div
        className="fixed top-1/4 left-1/4 w-20 h-20 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield className="w-full h-full text-dark-primary" />
      </motion.div>
      
      <motion.div
        className="fixed top-1/2 right-1/4 w-24 h-24 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Zap className="w-full h-full text-dark-primary" />
      </motion.div>
      
      <motion.div
        className="fixed bottom-1/4 left-1/3 w-20 h-20 opacity-10 z-0"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Scale className="w-full h-full text-dark-primary" />
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
              <div className="w-12 h-12 rounded-full bg-[#0E0E0E] backdrop-blur-xl border border-white/10 flex items-center justify-center mr-3">
                <Scale className="w-6 h-6 text-dark-primary" />
              </div>
              <span className="text-2xl font-light tracking-tighter text-dark-primary">LegalAxis</span>
            </motion.div>
            
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <a href="#features" className="text-dark-muted-foreground hover:text-dark-primary transition-colors duration-300 font-light">Features</a>
              <a href="#pricing" className="text-dark-muted-foreground hover:text-dark-primary transition-colors duration-300 font-light">Pricing</a>
              <a href="#contact" className="text-dark-muted-foreground hover:text-dark-primary transition-colors duration-300 font-light">Contact</a>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/login" className="text-dark-foreground hover:text-[#ffffff] transition-colors duration-300 font-light">Login</Link>
              <Link 
                to="/signup" 
                className="rounded-full px-6 py-3 bg-black text-black font-medium hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </nav>

        {/* Hero Section */}
        <motion.section 
          className="flex flex-col items-center justify-center min-h-screen text-center px-6"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          {/* Logo */}
          <motion.div
            className="w-24 h-24 rounded-full bg-[#0E0E0E] backdrop-blur-xl border border-[#ffffff]/50 flex items-center justify-center mb-12 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <Scale className="w-12 h-12 text-[#ffffff]" />
          </motion.div>
          
          {/* Title */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter mb-8 max-w-5xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Your AI-Powered Legal Intelligence Platform
          </motion.h1>
          
          {/* Subheading */}
          <motion.div
            className="px-8 py-4 rounded-2xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-xl md:text-2xl font-light tracking-wide text-dark-muted-foreground max-w-3xl">
              Transform legal workflows with <span className="text-dark-primary">glassmorphic precision</span> and <span className="text-dark-primary">agentic intelligence</span>
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
              className="rounded-full px-12 py-6 text-xl font-bold bg-black text-black hover:scale-105 active:scale-95 transition-transform duration-300 shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] inline-block"
            >
              Start Free Trial
            </Link>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-12 flex flex-col items-center text-dark-muted-foreground"
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
            className="text-4xl md:text-5xl font-light tracking-tighter text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Intelligent Legal Agents
          </motion.h2>
          
          <motion.p
            className="text-xl text-center text-dark-muted-foreground mb-16 max-w-3xl mx-auto font-light"
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
                className="p-8 rounded-3xl bg-[#0E0E0E] backdrop-blur-xl border border-white/10 border-white/20 hover:border-white/30 transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#0E0E0E] flex items-center justify-center mb-6 text-dark-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium tracking-tight mb-4">{feature.title}</h3>
                <p className="text-base text-dark-muted-foreground font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-white/10">
          <div className="text-center text-dark-muted-foreground font-light">
            <p>© 2026 LegalAxis. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;


