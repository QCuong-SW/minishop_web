import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantityPickerProps {
  quantity: number;
  maxStock: number;
  onChange: (newQuantity: number) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function QuantityPicker({
  quantity,
  maxStock,
  onChange,
  size = "md",
  disabled = false,
}: QuantityPickerProps) {
  const handleDecrement = () => {
    if (quantity > 1 && !disabled) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxStock && !disabled) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      onChange(1);
    } else if (val > maxStock) {
      onChange(maxStock);
    } else {
      onChange(val);
    }
  };

  const sizeClasses = {
    sm: "h-7 text-xs",
    md: "h-9 text-sm",
    lg: "h-11 text-base",
  };

  const btnWidth = {
    sm: "w-7",
    md: "w-9",
    lg: "w-11",
  };

  const inputWidth = {
    sm: "w-10",
    md: "w-14",
    lg: "w-16",
  };

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden ${sizeClasses[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className={`flex items-center justify-center ${btnWidth[size]} h-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition active:bg-slate-200`}
        aria-label="Giảm số lượng"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <input
        type="number"
        min={1}
        max={maxStock}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className={`${inputWidth[size]} h-full text-center font-bold text-slate-800 focus:outline-none border-x border-slate-200 bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= maxStock}
        className={`flex items-center justify-center ${btnWidth[size]} h-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent transition active:bg-slate-200`}
        aria-label="Tăng số lượng"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
