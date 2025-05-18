
// src/components/ui/OtpInput.tsx
import React, { useRef } from 'react';

export interface OtpInputProps {
  value: string;
  onChange: (newValue: string) => void;
  length?: number;
}

export default function OtpInput({
  value,
  onChange,
  length = 6,
}: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  // build array of exactly `length` characters
  const chars = value.padEnd(length, ' ').split('').slice(0, length);

  const handleChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.slice(-1);
    const newChars = [...chars];
    newChars[idx] = v;
    onChange(newChars.join('').trimEnd());
    if (v && inputs.current[idx + 1]) {
      inputs.current[idx + 1]!.focus();
    }
  };

  return (
    <div className="flex space-x-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={el => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={c}
          onChange={handleChange(i)}
          className="w-12 h-12 text-center border rounded"
        />
      ))}
    </div>
  );
}
