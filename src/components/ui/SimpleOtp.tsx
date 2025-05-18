
import React, { useRef } from "react";

interface SimpleOtpProps {
  /** The full OTP string */
  value: string;
  /** Called whenever value changes — will receive the new full string */
  onChange: (newValue: string) => void;
  /** Number of boxes (optional, defaults to 6) */
  length?: number;
}

export default function SimpleOtp({
  value,
  onChange,
  length = 6,
}: SimpleOtpProps) {
  const inputs = useRef<HTMLInputElement[]>([]);
  return (
    <div className="flex space-x-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => {
            const chars = value.split("");
            chars[i] = e.target.value;
            onChange(chars.join(""));
          }}
          ref={(el) => {
            if (el) inputs.current[i] = el;
          }}
          className="w-10 h-10 text-center border rounded"
        />
      ))}
    </div>
  );
}
