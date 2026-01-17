import { useState, useRef } from 'react';
import { X, Loader2, ImageIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { uploadFile } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder: string;
  accept?: string;
  label?: string;
  rounded?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-20 w-20',
  md: 'h-24 w-24',
  lg: 'h-40 w-full max-w-xs',
};

export function FileUpload({
  value,
  onChange,
  bucket = 'uploads',
  folder,
  accept = 'image/*',
  label = 'Upload File',
  rounded = false,
  size = 'md'
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Max 5MB allowed.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file, bucket, folder);
      onChange(url);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  const isImage = accept.includes('image');

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {value ? (
        <div className="relative inline-block">
          {isImage ? (
            <img
              src={value}
              alt="Preview"
              className={cn(
                'object-cover border bg-muted',
                sizeClasses[size],
                rounded ? 'rounded-full' : 'rounded-lg'
              )}
            />
          ) : (
            <div className={cn(
              'flex items-center justify-center bg-muted rounded-lg border text-xs text-center p-2',
              sizeClasses[size]
            )}>
              {value.split('/').pop()}
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors',
            sizeClasses[size],
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground text-center px-2">{label}</span>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-destructive text-xs">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
