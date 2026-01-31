"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check localStorage on mount
        const savedTheme = localStorage.getItem("whichbid-theme");
        if (savedTheme === "light") {
            setIsDark(false);
            document.documentElement.classList.add("light-mode");
        }
    }, []);

    const toggleTheme = () => {
        const newIsDark = !isDark;
        setIsDark(newIsDark);

        if (newIsDark) {
            document.documentElement.classList.remove("light-mode");
            localStorage.setItem("whichbid-theme", "dark");
        } else {
            document.documentElement.classList.add("light-mode");
            localStorage.setItem("whichbid-theme", "light");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-300 group shadow-lg hover:shadow-xl"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light Mode" : "Dark Mode"}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
            ) : (
                <Moon className="w-5 h-5 text-blue-500 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-300" />
            )}
        </button>
    );
}
