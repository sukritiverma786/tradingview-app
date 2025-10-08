import React from "react";
import { Sun, Moon } from "lucide-react"; // icons

export default function Header({ theme, toggleTheme }) {
  return (
    <header
      className="flex items-center justify-between p-4 shadow-sm"
      style={{ background: "var(--card-bg)", color: "var(--card-fg)" }}
    >
      <h1 className="text-xl font-bold">BTC Dashboard</h1>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}
