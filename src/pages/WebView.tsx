import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { supabase } from "../integrations/supabase/client";
import { SuccessAnimation } from "../components/SuccessAnimation";

interface LastEntry {
  item_name: string;
  item_code: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  stock_value: number;
}

const WebView = () => {
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

  useEffect(() => {
    if (itemNameRef.current) {
      itemNameRef.current.focus();
    }
  }, []);

  const handleAddStock = async () => {
    if (!itemName || !itemCode || !purchasePrice || !sellingPrice || !quantity) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("stock")
      .insert([
        {
          item_name: itemName,
          item_code: itemCode,
          purchase_price: parseFloat(purchasePrice),
          selling_price: parseFloat(sellingPrice),
          quantity: parseInt(quantity),
          stock_value: parseFloat(stockValue),
        },
      ])
      .select();

    if (error) {
      console.error("Error adding stock:", error);
      alert("Failed to add stock");
    } else if (data) {
      setLastEntry(data[0] as LastEntry);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        resetForm();
      }, 3000);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setItemName("");
    setItemCode("");
    setPurchasePrice("");
    setSellingPrice("");
    setQuantity("");
    if (itemNameRef.current) {
      itemNameRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Add Stock</h2>
        {showSuccess && <SuccessAnimation />}
        <div className="space-y-4">
          <Input
            ref={itemNameRef}
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Input
            placeholder="Item Code"
            value={itemCode}
            onChange={(e) => setItemCode(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Purchase Price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Selling Price"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div>
            <p>Stock Value: {stockValue}</p>
          </div>
          <Button onClick={handleAddStock} disabled={loading} className="w-full">
            {loading ? "Adding..." : "Add Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebView;
