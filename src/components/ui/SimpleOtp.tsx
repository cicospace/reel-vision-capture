
import { useRef, useEffect } from "react";

interface SimpleOtpProps {
  value: string;
  onChange: (newValue: string) => void;
  length?: number;
}

export default function SimpleOtp({
  value,
  onChange,
  length = 6,
}: SimpleOtpProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Ensure the internal value always matches the desired length
  const padded = value.padEnd(length, " ").slice(0, length);

  useEffect(() => {
    // Focus next empty input on mount/update
    const idx = padded.indexOf(" ");
    if (idx >= 0 && inputsRef.current[idx]) {
      inputsRef.current[idx]!.focus();
    }
  }, [padded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = padded.split("");
    arr[idx] = char || " ";
    onChange(arr.join("").trimEnd());
    if (char && idx < length - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !padded[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("Text").replace(/\D/g, "");
    onChange(pasted.slice(0, length));
  };

  return (
    <div className="flex space-x-2">
      {padded.split("").map((char, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char === " " ? "" : char}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center border rounded-md focus:ring focus:outline-none"
        />
      ))}
    </div>
  );
}
