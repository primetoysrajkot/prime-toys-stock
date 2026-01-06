import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/PageTransition";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Package, DollarSign, Hash, Layers } from "lucide-react";

interface LastEntry {
  item_name: string;
  item_code: string;
  quantity: number;
  stock_value: number;
}

const AddStock = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const itemNameRef = useRef<HTMLInputElement>(null);
  
  const [itemName, setItemName] = useState("");
  const [itemCode, setItemCode] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastEntry, setLastEntry] = useState<LastEntry | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const stockValue = purchasePrice && quantity 
    ? (parseFloat(purchasePrice) * parseInt(quantity)).toFixed(2)
    : "0.00";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("stocks")
      .insert({
        user_id: user.id,
        item_name: itemName.trim(),
        item_code: itemCode.trim(),
        purchase_price: parseFloat(purchasePrice),
        selling_price: parseFloat(sellingPrice),
        quantity: parseInt(quantity),
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      toast.error("Failed to add stock item");
      console.error(error);
    } else {
      setLastEntry({
        item_name: data.item_name,
        item_code: data.item_code,
        quantity: data.quantity,
        stock_value: parseFloat(String(data.stock_value ?? "0")),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Clear form and focus
      setItemName("");
      setItemCode("");
      setPurchasePrice("");
      setSellingPrice("");
      setQuantity("");
      itemNameRef.current?.focus();
    }
  };

  if (authLoading) {
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
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-foreground">
            Add Stock
          </h1>
        </motion.header>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col max-w-md mx-auto w-full"
        >
          <div className="space-y-4 flex-1">
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                ref={itemNameRef}
                type="text"
                placeholder="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Item Code"
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Purchase Price"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Selling Price"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="number"
                min="0"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="pl-12"
                required
              />
            </div>

            {/* Stock Value Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-gold/10 border border-gold/30"
            >
              <p className="text-sm text-muted-foreground mb-1">Stock Value</p>
              <p className="text-2xl font-display font-bold text-gold">
                ${stockValue}
              </p>
            </motion.div>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>

            {/* Success Animation */}
            <AnimatePresence>
              {showSuccess && (
                <SuccessAnimation message="Stock added successfully!" />
              )}
            </AnimatePresence>

            {/* Last Entry Display */}
            <AnimatePresence>
              {lastEntry && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 rounded-2xl bg-secondary border border-border"
                >
                  <p className="text-xs text-muted-foreground mb-2">Last Saved Entry</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <span className="ml-2 font-semibold">{lastEntry.item_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Code:</span>
                      <span className="ml-2 font-semibold">{lastEntry.item_code}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Qty:</span>
                      <span className="ml-2 font-semibold">{lastEntry.quantity}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value:</span>
                      <span className="ml-2 font-semibold text-gold">${lastEntry.stock_value.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.form>
      </div>
    </PageTransition>
  );
};

export default AddStock;
