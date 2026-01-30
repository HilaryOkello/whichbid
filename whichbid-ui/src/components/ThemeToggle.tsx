"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600 group-hover:text-blue-500 transition-colors" />
      )}
    </button>
  );
}