"use client";

import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BrainCircuit, Pencil, Sparkles, ArrowRight, CheckCircle2, MousePointer2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Set isClient to true once component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    
    async function getUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }
    
    getUser();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    }
  }, []);
  
  useEffect(() => {
    // Skip this effect during server-side rendering
    if (!isClient) return;
    
    // Initialize window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient, cursorX, cursorY]);
  
  // Parallax elements - create motion values that will be updated manually
  const floatingY1 = useMotionValue(0);
  const floatingX1 = useMotionValue(0);
  const floatingY2 = useMotionValue(0);
  const floatingX2 = useMotionValue(0);
  
  // Manually update the parallax effect
  useEffect(() => {
    if (!isClient) return;
    
    // Function to calculate and set the parallax values
    const updateParallaxValues = () => {
      // Get the current values
      const cursorXValue = cursorX.get();
      const cursorYValue = cursorY.get();
      
      // Calculate the transform values (simple linear interpolation)
      const width = windowSize.width || 1;
      const height = windowSize.height || 1;
      
      // Map cursor position to parallax values
      const y1Value = 10 - (cursorYValue / height) * 20;
      const x1Value = 10 - (cursorXValue / width) * 20;
      const y2Value = -10 + (cursorYValue / height) * 20;
      const x2Value = -10 + (cursorXValue / width) * 20;
      
      // Set the motion values
      floatingY1.set(y1Value);
      floatingX1.set(x1Value);
      floatingY2.set(y2Value);
      floatingX2.set(x2Value);
    };
    
    // Subscribe to cursor motion values
    const unsubscribeX = cursorX.onChange(updateParallaxValues);
    const unsubscribeY = cursorY.onChange(updateParallaxValues);
    
    // Initial update
    updateParallaxValues();
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [isClient, cursorX, cursorY, windowSize.width, windowSize.height, floatingY1, floatingX1, floatingY2, floatingX2]);

  return (
    <div className="flex flex-col min-h-screen relative cursor-auto">
      {/* Interactive cursor follower */}
      {isClient && (
        <motion.div
          className="fixed w-24 h-24 rounded-full pointer-events-none z-50 mix-blend-difference hidden md:block"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: "-50%",
            translateY: "-50%",
            backgroundColor: cursorHovered ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
            scale: cursorHovered ? 1.5 : 1,
          }}
          animate={{
            scale: cursorHovered ? 1.5 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Floating decorative elements */}
      {isClient && (
        <>
          <motion.div 
            className="absolute top-32 left-10 w-64 h-64 bg-blue-600/5 dark:bg-blue-400/5 rounded-full filter blur-3xl hidden md:block" 
            style={{ x: floatingX1, y: floatingY1 }}
          />
          <motion.div 
            className="absolute bottom-32 right-20 w-72 h-72 bg-indigo-600/5 dark:bg-indigo-400/5 rounded-full filter blur-3xl hidden md:block" 
            style={{ x: floatingX2, y: floatingY2 }}
          />
        </>
      )}
      
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center relative overflow-hidden min-h-[80vh]">
        <div className="absolute inset-0  -z-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-6"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <div className="relative">
              <div className="flex items-center justify-center">
                <Image src="/logo.png" alt="MemoMind Logo" width={150} height={150} className="rounded-full items-center justify-center"/>
              </div>
              {isClient && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 0.7, 0], 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                  />
                  <motion.div
                    className="absolute -inset-14 rounded-full border border-primary/20 hidden md:block"
                    animate={{ 
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 20, 
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                  />
                  <motion.div
                    className="absolute -inset-20 rounded-full border border-primary/10 hidden md:block"
                    animate={{ 
                      rotate: -360
                    }}
                    transition={{ 
                      duration: 30, 
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "linear"
                    }}
                  />
                </>
              )}
            </div>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            MemoMind
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Capture, organize, and enhance your thoughts with AI-powered summaries
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href={user ? "/dashboard" : "/sign-up"}>
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <Button className="text-base px-8 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 shadow-lg shadow-blue-600/20 rounded-xl cursor-pointer">
                  {user ? "Go to Dashboard" : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/ai-summarizer">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setCursorHovered(true)}
                onMouseLeave={() => setCursorHovered(false)}
              >
                <Button variant="outline" className="text-base px-8 py-7 border-2 transition-all duration-300 hover:bg-primary/5 rounded-xl cursor-pointer">
                  Try AI Summarizer <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Sign-up required</span>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Scroll for more</span>
          {isClient && (
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <MousePointer2 className="h-5 w-5" />
            </motion.div>
          )}
        </motion.div>
      </section>
      
      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 relative overflow-hidden"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            variants={fadeIn}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            Powerful Features
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-all duration-500 relative group"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Pencil className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">Note Creation</h3>
              <p className="text-muted-foreground text-lg">Create, edit and organize your notes with a clean, intuitive interface. Keep all your important information in one place.</p>
              
              {isClient && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-32 h-32 bg-primary/5 rounded-br-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ 
                    rotate: 360
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
            
            <motion.div 
              className="bg-card rounded-2xl p-8 border shadow-sm hover:shadow-xl transition-all duration-500 relative group"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              onMouseEnter={() => setCursorHovered(true)}
              onMouseLeave={() => setCursorHovered(false)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">AI Summarization</h3>
              <p className="text-muted-foreground text-lg">Automatically generate concise summaries of your notes with advanced AI. Save time and extract key insights effortlessly.</p>
              
              {isClient && (
                <motion.div
                  className="absolute -bottom-1 -right-1 w-32 h-32 bg-primary/5 rounded-br-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ 
                    rotate: -360
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "linear"
                  }}
                />
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Call to Action */}
      <motion.section 
        className="py-20 px-4 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        <motion.div 
          className="max-w-3xl mx-auto text-center relative z-10"
          variants={fadeIn}
        >
          <motion.h2 
            className="text-4xl font-bold mb-6"
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            Ready to get started?
          </motion.h2>
          <motion.p className="text-xl text-muted-foreground mb-10">
            Join thousands of users who are already enhancing their note-taking experience with MemoMind
          </motion.p>
          
          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.98 }}
            onMouseEnter={() => setCursorHovered(true)}
            onMouseLeave={() => setCursorHovered(false)}
          >
            <Link href={user ? "/dashboard" : "/note-creator"}>
              <Button className="text-lg px-10 py-7 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors duration-300 shadow-lg shadow-blue-600/10 rounded-xl cursor-pointer">
                {user ? "Go to Dashboard" : "Start For Free"} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            No credit card required
          </motion.p>
        </motion.div>
      </motion.section>
    </div>
  );
}
