"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function FileUpload({ files, onFilesChange, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      if (droppedFiles.length > 0) {
        onFilesChange([...files, ...droppedFiles]);
      }
    },
    [files, onFilesChange, disabled]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      if (selectedFiles.length > 0) {
        onFilesChange([...files, ...selectedFiles]);
      }
      e.target.value = "";
    },
    [files, onFilesChange]
  );

  const removeFile = useCallback(
    (index: number) => {
      onFilesChange(files.filter((_, i) => i !== index));
    },
    [files, onFilesChange]
  );

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-none p-8 text-center transition-all duration-300
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-blue-500 hover:bg-white/5"}
          ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-white/20 bg-white/5"}
        `}
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-3">
          {/* Upload Icon */}
          <div className={`mx-auto w-16 h-16 rounded-none flex items-center justify-center transition-all duration-300 ${isDragging ? "bg-blue-500 scale-110" : "bg-blue-500"}`}>
            <Upload className="w-8 h-8 text-white" />
          </div>

          <div>
            <p className="text-lg font-semibold text-white">
              {isDragging ? "Drop your PDFs here" : "Drag & drop quote PDFs"}
            </p>
            <p className="text-sm text-white/50 mt-1">
              or click to browse • PDF files only
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-white">
            {files.length} file{files.length !== 1 ? "s" : ""} selected
          </p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-none transition-all duration-200 hover:bg-white/10 group"
              >
                <div className="flex items-center space-x-3">
                  {/* PDF Icon */}
                  <div className="w-10 h-10 bg-blue-500 rounded-none flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                {!disabled && (
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/20 rounded-none transition-all duration-200"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
