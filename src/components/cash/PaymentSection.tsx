import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/types/cash-register";

interface PaymentSectionProps {
  total: number;
  payment: string;
  setPayment: (value: string) => void;
  calculateChange: () => number;
  isDebt: boolean;
  setIsDebt: (value: boolean) => void;
  selectedCustomer: string;
  setSelectedCustomer: (customer: string) => void;
  customers: Customer[];
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  total,
  payment,
  setPayment,
  calculateChange,
  isDebt,
  setIsDebt,
  selectedCustomer,
  setSelectedCustomer,
  customers,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <Input
          value={`$${total.toFixed(2)}`}
          className="w-32 text-right font-bold"
          readOnly
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="payment" className="block text-sm font-medium">
          Payment Amount
        </label>
        <Input
          id="payment"
          type="number"
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          placeholder="Enter amount"
          className="w-full"
        />
      </div>

      <div className="flex justify-between font-bold">
        <span>Change:</span>
        <span className={calculateChange() < 0 ? "text-red-500" : ""}>
          ${calculateChange().toFixed(2)}
        </span>
      </div>

      {calculateChange() < 0 && (
        <div className="flex flex-col space-y-3 border p-3 rounded-md bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="debt"
              checked={isDebt}
              onCheckedChange={(checked) => setIsDebt(checked === true)}
            />
            <Label htmlFor="debt">Record as customer debt</Label>
          </div>

          {isDebt && (
            <Select
              value={selectedCustomer}
              onValueChange={setSelectedCustomer}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.name}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
