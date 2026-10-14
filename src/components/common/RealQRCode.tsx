"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function RealQRCode({
  value,
  size = 140,
  className = "",
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: "#0f172a", // slate-900
          light: "#ffffff",
        },
      },
      (err, url) => {
        if (!err && url && isMounted) {
          setDataUrl(url);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`flex items-center justify-center bg-slate-100 rounded-lg animate-pulse ${className}`}
      >
        <span className="text-[10px] text-slate-400 font-mono">QR...</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      alt={`Código QR ${value}`}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
    />
  );
}
