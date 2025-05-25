import React, { useState, useRef } from "react";
import { Barcode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan }) => {
  const [barcode, setBarcode] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = () => {
    if (barcode.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a barcode",
        variant: "destructive",
      });
      return;
    }

    onScan(barcode);
    setBarcode("");
    setIsDialogOpen(false);
    toast({
      title: "Success",
      description: `Barcode ${barcode} scanned successfully`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleScan();
    }
  };

  // Focus input when dialog opens
  React.useEffect(() => {
    if (isDialogOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Barcode className="h-4 w-4" />
          <span>Scan Barcode</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Barcode Scanner</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Enter barcode or scan..."
              className="pl-8"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <Button onClick={handleScan} className="w-full">
            Process Barcode
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
