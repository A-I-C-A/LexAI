import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {signUp} = useUserAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Animation for floating elements
  useEffect(() => {
    const animateElements = document.querySelectorAll('.animate-float');
    animateElements.forEach(el => {
      el.style.animationDelay = `${Math.random() * 0.5}s`;
    });
  }, []);
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 bg-card border border-border rounded-full hover:bg-accent transition-all duration-300"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              opacity: Math.random() * 0.1 + 0.05,
              background: theme === 'dark' 
                ? `radial-gradient(circle, #ffffff ${Math.random() * 20}%, transparent 70%)`
                : `radial-gradient(circle, #10b981 ${Math.random() * 20}%, transparent 70%)`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-md w-full space-y-8 z-10">
        {/* Header with animation */}
        <div className="text-center transform transition-all duration-700 hover:scale-105">
          <div className="flex justify-center mb-6 animate-float" style={{animationDuration: '6s'}}>
            <div className="w-20 h-20 flex items-center justify-center bg-muted rounded-2xl p-2 shadow-lg backdrop-blur-sm border border-border">
              <img 
                src="/logolegal.png" 
                alt="LegalAxis Logo" 
                className="h-16 w-auto object-contain select-none transform transition-transform duration-300 hover:scale-110" 
                draggable="false" 
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground animate-fade-in-down">Join LegalAxis</h2>
          <p className="mt-2 text-muted-foreground animate-fade-in-down" style={{animationDelay: '0.2s'}}>Create your account to get started</p>
        </div>

        {/* Signup Form */}
  <div className="bg-card rounded-2xl shadow-2xl p-8 ring-1 ring-border transform transition-all duration-500 hover:shadow-xl animate-fade-in-up">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-shake">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-muted ring-1 ring-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:border-landing-accent focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted ring-1 ring-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:border-landing-accent focus:border-transparent transition-all duration-200"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-muted ring-1 ring-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:border-landing-accent focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            {/* Password requirements */}
            <div className="text-xs text-muted-foreground space-y-1 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <p className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${password.length >= 6 ? 'bg-landing-accent' : 'bg-muted'}`}></span>
                At least 6 characters
              </p>
              <p className="flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${password === confirmPassword && password.length > 0 ? 'bg-landing-accent' : 'bg-muted'}`}></span>
                Passwords match
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-landing-accent hover:bg-landing-accent-hover text-landing-accent-text font-semibold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:border-landing-accent disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-lg animate-fade-in-up"
              style={{animationDelay: '0.7s'}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-landing-accent-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Terms and conditions */}
          <div className="mt-6 text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-landing-accent hover:text-landing-accent-hover transition-all duration-200">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-landing-accent hover:text-landing-accent-hover transition-all duration-200">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center animate-fade-in-up" style={{animationDelay: '0.9s'}}>
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link 
              to="/" 
              className="text-landing-accent hover:text-landing-accent-hover font-medium transition-all duration-300 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s forwards;
          opacity: 0;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s forwards;
          opacity: 0;
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
};

export default Signup;

