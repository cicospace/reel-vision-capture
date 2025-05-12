
import React, { ChangeEvent, useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, Image } from 'lucide-react';

type FileUploadFieldProps = {
  label: string;
  description?: string;
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  files: File[];
  required?: boolean;
};

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  description,
  onChange,
  accept = '',
  multiple = false,
  files,
  required = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      onChange(multiple ? [...files, ...fileList] : fileList);
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image size={16} />;
    }
    return <FileText size={16} />;
  };

  return (
    <div className="space-y-3">
      {label && <Label className="input-label">{label}</Label>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-reel-accent bg-reel-accent/5' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const fileList = Array.from(e.dataTransfer.files);
            onChange(multiple ? [...files, ...fileList] : fileList);
          }
        }}
      >
        <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-foreground mb-2">
          Drag and drop your files here, or
        </p>
        <Button
          type="button"
          variant="outline"
          className="bg-background"
          onClick={() => fileInputRef.current?.click()}
        >
          Browse Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          required={required && files.length === 0}
        />
        {required && files.length === 0 && (
          <p className="text-xs text-red-500 mt-2">This field is required</p>
        )}
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          <Label className="text-sm">Uploaded Files</Label>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file)}
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 text-muted-foreground"
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
