
import React from 'react';

interface SimpleOtpProps {
  value: string;
  onChange: (newVal: string) => void;
}

export default function SimpleOtp({ value, onChange }: SimpleOtpProps) {
  return (
    <input
      type="text"
      maxLength={6}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="p-2 border rounded w-full text-center"
      placeholder="Enter 6-digit code"
    />
  );
}
