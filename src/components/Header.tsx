import React from "react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header
      className={cn(
        "w-full py-4 px-6 flex items-center justify-between bg-white shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8" />
        <span className="font-bold text-lg text-gray-800">RenkDesign</span>
      </div>
      <nav className="hidden md:flex items-center gap-6">
        <a
          href="#"
          className="text-gray-600 hover:text-brandBlue transition-colors"
        >
          Home
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-brandRed transition-colors"
        >
          About
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-brandGreen transition-colors"
        >
          Services
        </a>
        <a
          href="#"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Contact
        </a>
      </nav>
      <div className="md:hidden">
        <button className="text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
