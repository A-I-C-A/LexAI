import { motion } from 'framer-motion';

const GlassLoader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const Container = fullScreen ? 'div' : motion.div;
  const containerClass = fullScreen 
    ? 'fixed inset-0 bg-dark-background/90 backdrop-blur-xl flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <Container className={containerClass}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-2 border-white/10`}></div>
        
        {/* Spinning ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-2 border-dark-primary border-t-transparent`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        ></motion.div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full bg-dark-primary"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          ></motion.div>
        </div>
      </motion.div>

      {fullScreen && (
        <motion.p
          className="absolute mt-32 text-dark-foreground font-light text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.p>
      )}
    </Container>
  );
};

export const GlassSkeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`glass-skeleton ${className}`}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        ></motion.div>
      ))}
    </>
  );
};

export default GlassLoader;
