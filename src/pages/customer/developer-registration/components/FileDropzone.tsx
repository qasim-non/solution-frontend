import React, { useState } from 'react';
import { AlertCircle, FileText, UploadCloud, X } from 'lucide-react';

interface FileDropzoneProps {
  id: string;
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  error?: string;
  onChange: (file: File | null) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} بايت`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} كيلوبايت`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} ميجابايت`;
};

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  id,
  label,
  hint,
  accept,
  file,
  error,
  onChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      onChange(droppedFile);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-1">
        <label htmlFor={id} className="text-sm font-bold text-[#191c1e]">
          {label}
        </label>
        <span className="text-xs font-medium text-[#737686]">{hint}</span>
      </div>

      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          onChange(event.target.files?.[0] ?? null);
          // Allow selecting the same file again after removing it.
          event.target.value = '';
        }}
      />

      {file ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#006242]/20 bg-[#f0fbf5] p-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#006242] shadow-sm">
              <FileText className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p
                dir="ltr"
                className="truncate text-start text-sm font-bold text-[#191c1e]"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-xs text-[#434655]">
                {formatFileSize(file.size)} • جاهز للإرسال
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange(null)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#434655] transition-colors hover:bg-[#ffdad6] hover:text-[#ba1a1a]"
            aria-label={`إزالة ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? 'border-[#004ac6] bg-[#dbe1ff]/40'
              : 'border-[#c3c6d7] bg-[#f7f9fb] hover:border-[#004ac6] hover:bg-[#f2f4f6]'
          }`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dbe1ff] text-[#004ac6]">
            <UploadCloud className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-[#191c1e]">
            اسحب الملف هنا أو اضغط للاختيار
          </span>
          <span className="text-xs text-[#737686]">
            {hint} • بحد أقصى 10 ميجابايت
          </span>
        </label>
      )}

      <div aria-live="polite">
        {error && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-[#ba1a1a]">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    </div>
  );
};
