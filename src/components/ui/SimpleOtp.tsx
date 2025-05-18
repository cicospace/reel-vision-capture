
// src/components/ui/SimpleOtp.tsx
import React, { useRef, useEffect } from "react";

interface SimpleOtpProps {
  /** The full OTP string */
  value: string;
  /** Called whenever value changes — receives the new full string */
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

  // Auto-focus to next input after typing a character
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement;
      const index = inputs.current.indexOf(target);
      
      // Skip if not our inputs or index not found
      if (index === -1) return;
      
      // On backspace, clear current and focus previous
      if (event.key === 'Backspace' && target.value === '') {
        if (index > 0) {
          inputs.current[index - 1].focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Move focus to next input after entering a digit
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const digit = e.target.value.slice(-1);
    
    // Update the value
    const chars = value.split("");
    chars[index] = digit;
    onChange(chars.join(""));
    
    // Move focus to next input if we have a value and not at the end
    if (digit && index < length - 1) {
      setTimeout(() => inputs.current[index + 1].focus(), 0);
    }
  };

  return (
    <div className="flex space-x-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          ref={(el) => {
            if (el) inputs.current[i] = el;
          }}
          className="w-10 h-10 text-center border rounded focus:border-primary focus:ring-1 focus:ring-primary"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
