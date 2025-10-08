import { useEffect, useRef, useState } from "react";

export default function useBybitTicker(symbol = "BTCUSDT") {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState({
    lastPrice: null,
    markPrice: null,
    high24h: null,
    low24h: null,
    turnover24h: null,
    percent24h: null,
    prevPrice: null,
  });
  const [prices, setPrices] = useState([]); // for sparkline (last N)
  const wsRef = useRef(null);
  const backoffRef = useRef(1000);

  useEffect(() => {
    let mounted = true;

    function connect() {
      if (!mounted) return;
      const url = "wss://stream.bybit.com/v5/public/linear";
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WS open");
        setConnected(true);
        backoffRef.current = 1000;
        // subscribe message (ByBit v5 tickers)
        // NOTE: If remote API expects slightly different payload, adjust accordingly.
        ws.send(JSON.stringify({ op: "subscribe", args: [`tickers.${symbol}`] }));
      };

      ws.onmessage = (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          // Robust parsing: ByBit sometimes nest data. We try common keys.
          const maybeData = Array.isArray(payload.data) ? payload.data[0] : payload.data ?? payload;

          if (!maybeData) return;

          // Try many possible key names, because different versions use different keys
          const get = (o, ...keys) => {
            for (const k of keys) {
              if (o?.[k] !== undefined) return o[k];
            }
            return undefined;
          };

          const rawLast = get(maybeData, "lastPrice", "last_price", "last", "price");
          const rawMark = get(maybeData, "markPrice", "mark_price", "mark");
          const rawHigh = get(maybeData, "highPrice24h", "high24h", "high", "highPrice");
          const rawLow = get(maybeData, "lowPrice24h", "low24h", "low", "lowPrice");
          const rawTurn = get(maybeData, "turnover24h", "turnover", "volume24h", "volume");
          let rawPct = get(maybeData, "price24hPcnt", "price_pct", "priceChangePercent", "percent");

          const toNum = (v) => {
            if (v === undefined || v === null) return null;
            const n = Number(v);
            return Number.isFinite(n) ? n : null;
          };

          let lastPrice = toNum(rawLast);
          const markPrice = toNum(rawMark);
          const high24h = toNum(rawHigh);
          const low24h = toNum(rawLow);
          const turnover24h = toNum(rawTurn);

          // percent may be in decimal (0.02) or percent (2). Normalize:
          let percent24h = toNum(rawPct);
          if (percent24h !== null && Math.abs(percent24h) < 1) percent24h = percent24h * 100;

          setData((prev) => {
            const prevPrice = prev.lastPrice;
            // maintain lastPrice as number
            const newLast = lastPrice ?? prevPrice;
            // update prices array (keep max 60)
            setPrices((p) => {
              const arr = [...p, newLast].filter(Boolean);
              if (arr.length > 60) arr.splice(0, arr.length - 60);
              return arr;
            });

            return {
              lastPrice: newLast,
              markPrice,
              high24h,
              low24h,
              turnover24h,
              percent24h,
              prevPrice,
            };
          });
        } catch (e) {
          // non-json messages possible
          // console.log("WS msg parse err", e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log("WS closed, will retry");
        // reconnect with backoff
        const t = backoffRef.current;
        backoffRef.current = Math.min(backoffRef.current * 1.5, 30000);
        setTimeout(() => connect(), t);
      };

      ws.onerror = (err) => {
        console.log("WS error", err);
        ws.close();
      };
    }

    connect();

    return () => {
      mounted = false;
      try {
        wsRef.current?.close();
      } catch {}
    };
  }, [symbol]);

  return { data, prices, connected };
}
