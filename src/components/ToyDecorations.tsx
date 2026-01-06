import { motion } from "framer-motion";
import { Sparkles, Gift, Star } from "lucide-react";

export const ToyDecorations = () => {
  return (
    <>
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-8 text-primary opacity-40"
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-8 h-8" />
      </motion.div>

      <motion.div
        className="absolute top-32 right-12 text-accent opacity-40"
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gift className="w-10 h-10" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-16 text-gold opacity-40"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-6 h-6" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 right-8 text-primary opacity-30"
        animate={{ y: [-5, 15, -5], x: [-5, 5, -5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gift className="w-12 h-12" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-4 text-accent opacity-20"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Star className="w-5 h-5" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-6 text-gold opacity-30"
        animate={{ y: [0, -20, 0], rotate: [-10, 10, -10] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="w-7 h-7" />
      </motion.div>
    </>
  );
};
