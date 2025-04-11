
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';

type ReelExample = {
  id: string;
  link: string;
  comment: string;
};

type RepeatableFieldProps = {
  items: ReelExample[];
  onChange: (items: ReelExample[]) => void;
  maxItems?: number;
  label: string;
};

const RepeatableField: React.FC<RepeatableFieldProps> = ({
  items,
  onChange,
  maxItems = 3,
  label
}) => {
  const addItem = () => {
    if (items.length < maxItems) {
      onChange([...items, { id: `item-${Date.now()}`, link: '', comment: '' }]);
    }
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ReelExample, value: string) => {
    onChange(
      items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="input-label">{label}</Label>
        <p className="text-sm text-gray-500">{items.length} of {maxItems}</p>
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} className="p-4 border rounded-md bg-gray-50 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Example {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(item.id)}
              className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
          
          <div>
            <Label htmlFor={`link-${item.id}`} className="text-sm">Demo Reel Link</Label>
            <Input
              id={`link-${item.id}`}
              value={item.link}
              onChange={(e) => updateItem(item.id, 'link', e.target.value)}
              placeholder="Paste demo reel URL here"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`comment-${item.id}`} className="text-sm">What do you like about it?</Label>
            <Textarea
              id={`comment-${item.id}`}
              value={item.comment}
              onChange={(e) => updateItem(item.id, 'comment', e.target.value)}
              placeholder="Explain what elements you appreciate from this reel"
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      ))}
      
      {items.length < maxItems && (
        <Button 
          variant="outline" 
          onClick={addItem}
          className="w-full border-dashed border-gray-300 text-gray-500 hover:text-reel-accent"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Another Example
        </Button>
      )}
    </div>
  );
};

export default RepeatableField;
