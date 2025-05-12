
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type RadioOption = {
  id: string;
  label: string;
};

type RadioGroupCustomProps = {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  otherOption?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  required?: boolean;
};

const RadioGroupCustom: React.FC<RadioGroupCustomProps> = ({
  label,
  options,
  value,
  onChange,
  otherOption = false,
  otherValue = '',
  onOtherChange,
  required = false
}) => {
  return (
    <div className="space-y-4">
      <Label className="input-label">{label}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="space-y-2">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} required={required && !value} />
            <Label htmlFor={option.id} className="font-normal cursor-pointer text-foreground">
              {option.label}
            </Label>
          </div>
        ))}
        
        {otherOption && (
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other-radio" />
            <Label htmlFor="other-radio" className="font-normal cursor-pointer text-foreground">
              Other
            </Label>
            {value === 'other' && (
              <Input
                value={otherValue}
                onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
                placeholder="Please specify"
                className="ml-2 text-white"
                required={value === 'other'}
              />
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
};

export default RadioGroupCustom;
