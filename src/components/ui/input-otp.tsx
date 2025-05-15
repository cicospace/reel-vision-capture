
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  className?: string;
  containerClassName?: string;
  inputMode?: "text" | "numeric" | "tel" | "search" | "email" | "url";
  pattern?: string;
  disabled?: boolean;
}

const InputOTP = React.forwardRef<
  HTMLDivElement,
  InputOTPProps
>(({ 
  value, 
  onChange, 
  maxLength = 6, 
  className, 
  containerClassName,
  inputMode = "text",
  pattern,
  disabled = false
}, ref) => {
  const digits = value.split('');
  
  // Handle input changes
  const handleChange = (index: number, digit: string) => {
    if (disabled) return;
    
    const newValue = [...digits];
    newValue[index] = digit.slice(-1); // Only take the last character
    
    // Remove any undefined values
    const filteredValue = newValue.filter(d => d !== undefined).join('');
    onChange(filteredValue.slice(0, maxLength));
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, maxLength);
    onChange(pastedData);
  };

  // Handle backspace and auto focus
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    // If backspace is pressed with empty input, focus previous input
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      // Focus previous input
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
    
    // If right arrow pressed, focus next input
    if (e.key === 'ArrowRight' && index < maxLength - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
    
    // If left arrow pressed, focus previous input
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Automatically focus the next input when a digit is entered
  const handleDigitChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value;
    handleChange(index, digit);
    
    // If digit is entered and we're not at the last input, focus next input
    if (digit && index < maxLength - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div 
      ref={ref}
      className={cn("flex items-center gap-2", containerClassName)}
      onPaste={handlePaste}
    >
      {Array.from({ length: maxLength }, (_, i) => (
        <input
          key={i}
          id={`otp-input-${i}`}
          type="text"
          inputMode={inputMode}
          pattern={pattern}
          maxLength={1}
          value={digits[i] || ''}
          disabled={disabled}
          className={cn(
            "h-10 w-10 rounded border border-input bg-background text-center text-sm shadow-sm transition-all",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          onChange={(e) => handleDigitChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  )
})

InputOTP.displayName = "InputOTP"

export { InputOTP }
