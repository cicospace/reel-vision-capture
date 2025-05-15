
import React from "react";

type InputOTPProps = {
  value: string;
  onChange: (val: string) => void;  // Making sure this matches what's being passed
};

const InputOTP: React.FC<InputOTPProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="otp-input"
    />
  );
};

export { InputOTP };
