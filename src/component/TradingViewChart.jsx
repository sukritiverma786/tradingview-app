import React, { useEffect, useRef, useState, memo } from "react";

function TradingViewChart({
  symbol = "BINANCE:BTCUSDT",
  interval = "D",
  theme = "light", // light | dark
  timezone = "Etc/UTC",
  autosize = true,
}) {
  const container = useRef();
  const [showGraph, setShowGraph] = useState(false);

  useEffect(() => {
    if (!container.current || !showGraph) return;

    // Clear previous widget
    container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize,
      symbol,
      interval,
      timezone,
      theme: theme === "dark" ? "dark" : "light",
      style: "1",
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
    });

    container.current.appendChild(script);
  }, [symbol, interval, theme, autosize, timezone, showGraph]);

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Toggle Button */}
      <button
        onClick={() => setShowGraph((prev) => !prev)}
        style={{
          padding: "8px 12px",
          marginBottom: "12px",
          backgroundColor: theme === "dark" ? "#ffffff" : "#071226",
          color: theme === "dark" ? "#071226" : "#ffffff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showGraph ? "Hide Graph" : "Show Graph"}
      </button>

      {/* Graph */}
      {showGraph && (
        <div
          ref={container}
          style={{
            height: "500px", // proper height
            width: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
}

export default memo(TradingViewChart);
