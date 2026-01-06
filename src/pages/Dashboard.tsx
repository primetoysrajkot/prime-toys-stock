import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Package, ListOrdered, LogOut, Sparkles } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col px-6 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <h1 className="text-2xl font-display font-bold text-foreground">
            Prime{" "}
            <span className="text-primary">Toys</span>
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.header>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 border border-gold/30 mb-4">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-gold">Dashboard</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Welcome back!
          </h2>
          <p className="text-muted-foreground mt-2">
            Manage your toy inventory
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-sm mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Button
              variant="default"
              size="xl"
              className="w-full gap-3"
              onClick={() => navigate("/add-stock")}
            >
              <Package className="w-6 h-6" />
              Add Stock
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full"
          >
            <Button
              variant="accent"
              size="xl"
              className="w-full gap-3"
              onClick={() => navigate("/stock-list")}
            >
              <ListOrdered className="w-6 h-6" />
              Stock List
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-xs text-muted-foreground">
            {user?.email}
          </p>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
