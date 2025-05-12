
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CheckboxOption = {
  id: string;
  label: string;
};

type CheckboxGroupProps = {
  label: string;
  options: CheckboxOption[];
  selectedOptions: string[];
  onChange: (value: string[]) => void;
  otherOption?: boolean;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  required?: boolean;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedOptions,
  onChange,
  otherOption = false,
  otherValue = '',
  onOtherChange,
  required = false
}) => {
  const handleCheckboxChange = (checked: boolean, id: string) => {
    if (checked) {
      onChange([...selectedOptions, id]);
    } else {
      onChange(selectedOptions.filter(option => option !== id));
    }
  };

  return (
    <div className="space-y-4">
      <Label className="input-label">{label}</Label>
      <div className="space-y-2">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={selectedOptions.includes(option.id)}
              onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, option.id)}
              required={required && selectedOptions.length === 0}
            />
            <Label htmlFor={option.id} className="font-normal cursor-pointer text-foreground">
              {option.label}
            </Label>
          </div>
        ))}
        
        {otherOption && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="other"
              checked={selectedOptions.includes('other')}
              onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'other')}
            />
            <Label htmlFor="other" className="font-normal cursor-pointer text-foreground">
              Other
            </Label>
            {selectedOptions.includes('other') && (
              <Input
                value={otherValue}
                onChange={(e) => onOtherChange && onOtherChange(e.target.value)}
                placeholder="Please specify"
                className="ml-2 text-white"
                required={selectedOptions.includes('other')}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckboxGroup;
