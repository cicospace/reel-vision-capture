
import React, { useRef } from 'react';

interface SimpleOtpProps { 
  value: string; 
  onChange: (v: string) => void; 
  length?: number; 
}

export default function SimpleOtp({ value, onChange, length = 6 }: SimpleOtpProps) {
  const inputs = useRef<HTMLInputElement[]>([]);
  
  return (
    <div className="flex space-x-2">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => {
            const chars = value.split('');
            chars[i] = e.target.value.slice(-1);
            const newVal = chars.join('');
            onChange(newVal);
            if (e.target.value && inputs.current[i + 1]) {
              inputs.current[i + 1].focus();
            }
          }}
          ref={el => { if (el) inputs.current[i] = el; }}
          className="w-10 h-10 text-center border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
