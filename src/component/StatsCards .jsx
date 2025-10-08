import React, { useEffect, useRef, useState } from "react";

// --- Single Stat Card Component ---
const StatsCard = ({ title, value, prevValue, theme }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    if (value == null) return;

    const numeric = Number(value);
    const prevNum = Number(prevValue);

    if (!isNaN(numeric) && !isNaN(prevNum)) {
      if (numeric > prevNum) setFlashClass("flash-up");
      else if (numeric < prevNum) setFlashClass("flash-down");
    }

    const timer = setTimeout(() => {
      setDisplayValue(value);
      setFlashClass("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [value, prevValue]);

  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <div className="flex-1 min-w-0 ms-4">
          <p>{title}</p>
        </div>

        {/* Value */}
        <div
          className={`inline-flex items-center text-base font-semibold transition-colors duration-500 ${flashClass}`}
        >
          {displayValue != null
            ? Number(displayValue).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : "—"}

          {flashClass === "flash-up" && (
            <span style={{ color: "green", marginLeft: "4px" }}>↑</span>
          )}
          {flashClass === "flash-down" && (
            <span style={{ color: "red", marginLeft: "4px" }}>↓</span>
          )}
        </div>
      </div>
    </li>
  );
};

// --- Main BTC Stats Card List ---
const StatsCards = ({
  symbol = "BTCUSDT",
  wsUrl = "wss://stream.bybit.com/v5/public/linear",
  theme,
}) => {
  const wsRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({
    lastPrice: null,
    markPrice: null,
    high24h: null,
    low24h: null,
    turnover24h: null,
    price24hPcnt: null,
    ts: null,
  });
  const prevStatsRef = useRef({ ...stats });

  // --- Helper to parse ticker messages ---
  const parseTickerMessage = (msg) => {
    const d = Array.isArray(msg.data) ? msg.data[0] : msg.data || {};
    return {
      lastPrice: d.lastPrice
        ? Number(d.lastPrice)
        : d.last_price
        ? Number(d.last_price)
        : null,
      markPrice: d.markPrice
        ? Number(d.markPrice)
        : d.mark_price
        ? Number(d.mark_price)
        : null,
      high24h: d.highPrice24h ? Number(d.highPrice24h) : null,
      low24h: d.lowPrice24h ? Number(d.lowPrice24h) : null,
      turnover24h: d.turnover24h ? Number(d.turnover24h) : null,
      price24hPcnt: d.price24hPcnt ? Number(d.price24hPcnt) : null,
      ts: msg.ts || d.ts || Date.now(),
    };
  };

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    let lastUpdateTime = 0;

    ws.addEventListener("open", () => {
      setConnected(true);
      ws.send(JSON.stringify({ op: "subscribe", args: [`tickers.${symbol}`] }));

      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN)
          ws.send(JSON.stringify({ op: "ping" }));
      }, 40000);
    });

    ws.addEventListener("message", (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.op === "ping" || msg.op === "pong" || msg.op === "subscribe")
          return;

        if (msg.topic && msg.topic.startsWith("tickers.")) {
          const parsed = parseTickerMessage(msg);
          const now = Date.now();

          // Throttle updates to once every 500ms
          if (now - lastUpdateTime > 500) {
            setStats((prev) => {
              prevStatsRef.current = { ...prev }; // store previous stats
              return {
                lastPrice: parsed.lastPrice ?? prev.lastPrice,
                markPrice: parsed.markPrice ?? prev.markPrice,
                high24h: parsed.high24h ?? prev.high24h,
                low24h: parsed.low24h ?? prev.low24h,
                turnover24h: parsed.turnover24h ?? prev.turnover24h,
                price24hPcnt: parsed.price24hPcnt ?? prev.price24hPcnt,
                ts: parsed.ts,
              };
            });
            lastUpdateTime = now;
          }
        }
      } catch (err) {
        console.error(err);
      }
    });

    ws.addEventListener("close", () => {
      setConnected(false);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    });

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      try {
        ws.close();
      } catch (e) {}
    };
  }, [symbol, wsUrl]);

  return (
    <div
      className="w-[96%] max-w-md p-[22px] border border-gray-300 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700"
      style={{
        color: theme === "dark" ? "white" : "black",
        fontSize: "14px",
        fontWeight: 500,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none">BTC / USDT</h5>
        <span className="text-sm font-medium">
          {connected ? "Live" : "Disconnected"}
        </span>
      </div>

      <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
        {/* <StatsCard
          title="Last Price"
          value={stats.lastPrice}
          prevValue={prevStatsRef.current.lastPrice}
        /> */}
        <StatsCard
          title="Last Price"
          value={stats.lastPrice}
          prevValue={prevStatsRef.current.lastPrice}
          theme={theme}
        />

        <StatsCard
          title="Mark Price"
          value={stats.markPrice}
          prevValue={prevStatsRef.current.markPrice}
          theme={theme}
        />
        <StatsCard
          title="24h High"
          value={stats.high24h}
          prevValue={prevStatsRef.current.high24h}
          theme={theme}
        />
        <StatsCard
          title="24h Low"
          value={stats.low24h}
          prevValue={prevStatsRef.current.low24h}
          theme={theme}
        />
        <StatsCard
          title="24h Turnover"
          value={stats.turnover24h}
          prevValue={prevStatsRef.current.turnover24h}
          theme={theme}
        />
        <StatsCard
          title="24h % Change"
          value={stats.price24hPcnt ? stats.price24hPcnt * 100 : null}
          prevValue={
            prevStatsRef.current.price24hPcnt
              ? prevStatsRef.current.price24hPcnt * 100
              : null
          }
          theme={theme}
        />
      </ul>

      <div className="mt-3 text-xs text-gray-400">
        Last update: {stats.ts ? new Date(stats.ts).toLocaleTimeString() : "—"}
      </div>
    </div>
  );
};

export default StatsCards;
