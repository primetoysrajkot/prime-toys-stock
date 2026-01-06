import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface SuccessAnimationProps {
  message: string;
}

export const SuccessAnimation = ({ message }: SuccessAnimationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-3 p-4 rounded-2xl bg-accent/10 border border-accent/30"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="w-6 h-6 text-accent" />
      </motion.div>
      <span className="text-accent font-semibold">{message}</span>
    </motion.div>
  );
};
