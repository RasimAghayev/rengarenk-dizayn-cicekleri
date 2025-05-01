
import React, { useRef } from 'react';
import { Printer, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Product } from '@/types/cash-register';
import { toast } from '@/hooks/use-toast';

interface ReceiptProps {
  cart: Product[];
  total: number;
  payment: string;
  change: number;
  customerName?: string;
}

const ReceiptComponent: React.FC<ReceiptProps> = ({
  cart,
  total,
  payment,
  change,
  customerName
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    if (!receiptRef.current) return;
    
    try {
      const printContent = receiptRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: "Error",
          description: "Could not open print window. Please check your browser settings.",
          variant: "destructive",
        });
        return;
      }
      
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                width: 300px;
                margin: 0 auto;
              }
              .receipt-header {
                text-align: center;
                margin-bottom: 10px;
              }
              .receipt-body {
                margin-bottom: 10px;
              }
              .receipt-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .receipt-total {
                border-top: 1px dashed #000;
                padding-top: 5px;
                margin-top: 10px;
                font-weight: bold;
              }
              .receipt-footer {
                text-align: center;
                margin-top: 20px;
                font-size: 10px;
              }
              @media print {
                body {
                  width: 100%;
                }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      
      toast({
        title: "Success",
        description: "Receipt printed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to print receipt",
        variant: "destructive",
      });
    }
  };

  // Format date as YYYY-MM-DD HH:MM
  const formattedDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Receipt className="h-4 w-4" />
          <span>View Receipt</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Receipt</DialogTitle>
        </DialogHeader>
        
        <div ref={receiptRef} className="font-mono text-sm">
          <div className="receipt-header text-center mb-4">
            <h3 className="font-bold">STORE RECEIPT</h3>
            <p className="text-xs">{formattedDate}</p>
            {customerName && <p className="text-xs">Customer: {customerName}</p>}
          </div>
          
          <div className="receipt-body">
            <div className="flex justify-between border-b pb-2 font-bold">
              <span>Item</span>
              <div className="flex gap-4">
                <span>Qty</span>
                <span>Price</span>
              </div>
            </div>
            
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between py-1 border-b border-dashed">
                <span className="truncate max-w-[150px]">{item.name}</span>
                <div className="flex gap-4">
                  <span className="w-6 text-center">{item.quantity}</span>
                  <span className="w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
            
            <div className="receipt-total mt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Payment:</span>
                <span>${parseFloat(payment || '0').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span>Change:</span>
                <span>${change >= 0 ? change.toFixed(2) : '0.00'}</span>
              </div>
              
              {change < 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Debt:</span>
                  <span>${Math.abs(change).toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="receipt-footer text-center text-xs mt-6">
            <p>Thank you for your purchase!</p>
            <p>Please come again</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={handlePrint}
            className="flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            <span>Print Receipt</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptComponent;
