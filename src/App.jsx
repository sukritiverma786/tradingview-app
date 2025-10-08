import React, { useState, useEffect } from "react";
import Header from "./component/Header";
import StatsCards from "./component/StatsCards ";
import TradingViewChart from "./component/TradingViewChart";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.style.setProperty("--card-bg", "#000");
      document.documentElement.style.setProperty("--card-fg", "#f8fafc");
    } else {
      document.documentElement.style.setProperty("--card-bg", "#f8fafc");
      document.documentElement.style.setProperty("--card-fg", "#000");
    }
  }, [theme]);

  return (
    <div
      className="min-h-screen"
      style={{ background: theme === "dark" ? "#000" : "#ffffff" }}
    >
      <Header
        theme={theme}
        toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
      <main className="p-6">
        <StatsCards theme={theme} />
      </main>
      <TradingViewChart theme={theme} />

    </div>
  );
}
