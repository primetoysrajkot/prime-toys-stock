import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Search, Download, Upload, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface Stock {
  id: string;
  item_name: string;
  item_code: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  stock_value: number;
  created_at: string;
}

const StockList = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/signin");
    } else if (user) {
      fetchStocks();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStocks(stocks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = stocks.filter(
        (stock) =>
          stock.item_name.toLowerCase().includes(query) ||
          stock.item_code.toLowerCase().includes(query)
      );
      setFilteredStocks(filtered);
    }
  }, [searchQuery, stocks]);

  const fetchStocks = async () => {
    const { data, error } = await supabase
      .from("stocks")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load stocks");
      console.error(error);
    } else {
      setStocks(data || []);
      setFilteredStocks(data || []);
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("Prime Toys - Stock List", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Item Name", "Item Code", "Purchase", "Selling", "Qty", "Value"]],
      body: filteredStocks.map((stock) => [
        stock.item_name,
        stock.item_code,
        `$${stock.purchase_price.toFixed(2)}`,
        `$${stock.selling_price.toFixed(2)}`,
        stock.quantity.toString(),
        `$${stock.stock_value.toFixed(2)}`,
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [232, 121, 87] },
    });

    doc.save("prime-toys-stock.pdf");
    toast.success("PDF downloaded!");
  };

  const handleDownloadExcel = () => {
    const worksheetData = filteredStocks.map((stock) => ({
      "Item Name": stock.item_name,
      "Item Code": stock.item_code,
      "Purchase Price": stock.purchase_price,
      "Selling Price": stock.selling_price,
      "Quantity": stock.quantity,
      "Stock Value": stock.stock_value,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock List");
    XLSX.writeFile(workbook, "prime-toys-stock.xlsx");
    toast.success("Excel downloaded!");
  };

  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

      const stocksToInsert = jsonData.map((row) => ({
        user_id: user.id,
        item_name: String(row["Item Name"] || row["item_name"] || ""),
        item_code: String(row["Item Code"] || row["item_code"] || ""),
        purchase_price: parseFloat(String(row["Purchase Price"] || row["purchase_price"] || 0)),
        selling_price: parseFloat(String(row["Selling Price"] || row["selling_price"] || 0)),
        quantity: parseInt(String(row["Quantity"] || row["quantity"] || 0)),
      }));

      const validStocks = stocksToInsert.filter(
        (s) => s.item_name && s.item_code
      );

      if (validStocks.length === 0) {
        toast.error("No valid data found in Excel file");
        setUploading(false);
        return;
      }

      const { error } = await supabase.from("stocks").insert(validStocks);

      if (error) {
        toast.error("Failed to upload stocks");
        console.error(error);
      } else {
        toast.success(`${validStocks.length} items uploaded!`);
        fetchStocks();
      }
    } catch (err) {
      toast.error("Failed to parse Excel file");
      console.error(err);
    }

    setUploading(false);
    e.target.value = "";
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col px-4 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-display font-bold text-foreground">
              Stock List
            </h1>
          </div>
        </motion.header>

        {/* Search & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4 mb-6"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              className="gap-2"
            >
              <FileText className="w-4 h-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadExcel}
              className="gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </Button>
            <label className="cursor-pointer">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                disabled={uploading}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  Upload
                </span>
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUploadExcel}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>

        {/* Stock Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-auto"
        >
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Download className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No stocks found</p>
              <Button
                variant="default"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/add-stock")}
              >
                Add Your First Stock
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 text-xs font-semibold text-muted-foreground">Code</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Purchase</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Selling</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Qty</th>
                    <th className="text-right py-3 px-2 text-xs font-semibold text-muted-foreground">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map((stock, index) => (
                    <motion.tr
                      key={stock.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                    >
                      <td className="py-3 px-2 font-medium text-sm">{stock.item_name}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground">{stock.item_code}</td>
                      <td className="py-3 px-2 text-sm text-right">${stock.purchase_price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-sm text-right">${stock.selling_price.toFixed(2)}</td>
                      <td className="py-3 px-2 text-sm text-right">{stock.quantity}</td>
                      <td className="py-3 px-2 text-sm text-right font-semibold text-gold">
                        ${stock.stock_value.toFixed(2)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {filteredStocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 rounded-2xl bg-gold/10 border border-gold/30"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Total Items</p>
                <p className="text-xl font-display font-bold">{filteredStocks.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total Stock Value</p>
                <p className="text-xl font-display font-bold text-gold">
                  ${filteredStocks.reduce((sum, s) => sum + s.stock_value, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default StockList;
