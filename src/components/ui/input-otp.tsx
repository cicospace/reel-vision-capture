
import React from "react";

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
}

const InputOTP: React.FC<InputOTPProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="otp-input px-4 py-2 border border-gray-300 rounded text-center w-24 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      placeholder="Access code"
      autoComplete="off"
    />
  );
};

export { InputOTP };
