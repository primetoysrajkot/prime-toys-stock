import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ToyDecorations } from "@/components/ToyDecorations";
import { PageTransition } from "@/components/PageTransition";
import { Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
        <ToyDecorations />

        {/* Main Content */}
        <div className="z-10 flex flex-col items-center text-center max-w-md w-full">
          {/* Logo/Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            <motion.div
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-gold">Premium Stock Management</span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4 leading-tight"
          >
            Prime{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-glow">
              Toys
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-muted-foreground mb-12 font-body"
          >
            Manage your toy inventory with style
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col gap-4 w-full max-w-xs"
          >
            <Button
              variant="hero"
              size="xl"
              onClick={() => navigate("/signup")}
              className="w-full"
            >
              Sign Up
            </Button>

            <Button
              variant="hero-secondary"
              size="xl"
              onClick={() => navigate("/signin")}
              className="w-full"
            >
              Sign In
            </Button>
          </motion.div>

          {/* Decorative bottom element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-16 flex items-center gap-2 text-muted-foreground/60"
          >
            <div className="w-8 h-px bg-border" />
            <span className="text-xs font-medium">STOCK • TRACK • GROW</span>
            <div className="w-8 h-px bg-border" />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Home;
