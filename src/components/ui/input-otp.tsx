
import React from "react";

export interface InputOTPProps {
  /** Current OTP value (as a single string) */
  value: string;
  /** Called whenever it changes; receives the full new string */
  onChange: (newValue: string) => void;
  /** Number of digits (optional) */
  length?: number;
}

export const InputOTP: React.FC<InputOTPProps> = ({
  value,
  onChange,
  length = 6,
}) => {
  // Split the incoming string into an array of characters, padded to `length`
  const chars = Array.from(value.padEnd(length, ' ').slice(0, length));

  const handleChange = (index: number) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const next = [...chars];
    next[index] = e.target.value.slice(-1) || ' ';
    onChange(next.join('').trim());
  };

  return (
    <div className="flex space-x-2">
      {chars.map((char, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={char.trim()}
          onChange={handleChange(i)}
          className="w-12 h-12 text-center border border-gray-300 rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      ))}
    </div>
  );
};

export default InputOTP;
