import React from "react";
import { cn } from "@/lib/utils";

interface ColorBlockProps {
  color: string;
  name: string;
  description: string;
  className?: string;
  textColor?: string;
}

const ColorBlock: React.FC<ColorBlockProps> = ({
  color,
  name,
  description,
  className,
  textColor = "text-white",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 rounded-lg shadow-lg transition-transform hover:scale-105",
        color,
        className,
      )}
    >
      <h3 className={cn("text-2xl font-bold mb-2", textColor)}>{name}</h3>
      <p className={cn("text-center", textColor)}>{description}</p>
    </div>
  );
};

export default ColorBlock;
