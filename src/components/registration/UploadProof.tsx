"use client";

import * as React from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, RefreshCw, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { IconSwap } from "@/components/ui/IconSwap";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/validation/registration";

export interface UploadProofProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Format ukuran byte menjadi representasi manusiawi (KB / MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1).replace(".", ",")} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

export function UploadProof({
  file,
  onFileSelect,
  error: externalError,
  className,
  disabled = false,
}: UploadProofProps) {
  const [internalError, setInternalError] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Buat preview URL saat file dipilih secara lokal
  const updateFileAndPreview = React.useCallback(
    (newFile: File | null) => {
      setPreviewUrl((prevUrl) => {
        if (prevUrl) {
          URL.revokeObjectURL(prevUrl);
        }
        return newFile ? URL.createObjectURL(newFile) : null;
      });
      onFileSelect(newFile);
    },
    [onFileSelect]
  );

  // Bersihkan object URL saat komponen di-unmount
  React.useEffect(() => {
    return () => {
      setPreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }
        return null;
      });
    };
  }, []);

  const activeError = internalError || externalError;

  const validateAndSetFile = (selectedFile: File) => {
    setInternalError(null);

    // Validasi tipe file
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      setInternalError(
        "Format foto tidak didukung. Harap unggah foto berformat JPG, PNG, atau WebP. (Jika memakai iPhone, coba screenshot foto transfer)."
      );
      return;
    }

    // Validasi ukuran file
    if (selectedFile.size > MAX_FILE_SIZE) {
      const sizeMb = (selectedFile.size / (1024 * 1024)).toFixed(1).replace(".", ",");
      setInternalError(
        `Ukuran foto ${sizeMb} MB melebihi batas maksimal 5 MB. Coba ambil screenshot bukti transfer Anda.`
      );
      return;
    }

    updateFileAndPreview(selectedFile);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setInternalError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    updateFileAndPreview(null);
  };

  const handleTriggerPicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full flex flex-col gap-2 text-left", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_FILE_TYPES.join(",")}
        onChange={handleInputChange}
        disabled={disabled}
        className="sr-only"
        aria-label="Pilih foto bukti pembayaran"
      />

      {!file && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleTriggerPicker}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleTriggerPicker();
            }
          }}
          className={cn(
            "relative flex flex-col items-center justify-center p-6 sm:p-8 rounded-card border-2 border-dashed transition-all duration-200 cursor-pointer select-none text-center",
            "border-muted/30 bg-surface/50 hover:bg-surface hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            activeError && "border-danger/60 bg-danger/5",
            disabled && "opacity-50 cursor-not-allowed hover:bg-surface/50 hover:border-muted/30"
          )}
        >
          <div className="h-12 w-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-3">
            <IconSwap
              swapKey={activeError ? "error" : "idle"}
              icon={
                activeError ? (
                  <AlertCircle className="h-6 w-6 text-danger" />
                ) : (
                  <UploadCloud className="h-6 w-6" />
                )
              }
            />
          </div>

          <p className="text-sm font-semibold text-foreground mb-1">
            Klik untuk memilih foto bukti pembayaran
          </p>
          <p className="text-xs text-muted max-w-xs text-pretty">
            Bisa berupa foto struk transfer atau tangkapan layar (screenshot) m-Banking.
          </p>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted/80 tabular-nums">
            <span className="rounded bg-muted/10 px-2 py-0.5">JPG, PNG, WebP</span>
            <span>•</span>
            <span>Maksimal 5 MB</span>
          </div>
        </div>
      )}

      {file && previewUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 sm:p-4 rounded-card bg-surface shadow-border transition-all duration-200">
          {/* Thumbnail preview dengan outline 1px 10% & Tautan Tab Baru */}
          <div className="relative group shrink-0">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Buka bukti pembayaran ukuran penuh di tab baru"
              className="relative block w-32 sm:w-36 aspect-[4/3] rounded-control overflow-hidden image-outline shadow-sm bg-neutral-100 dark:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Pratinjau bukti transfer"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150 flex items-center justify-center text-white gap-1 text-xs font-medium">
                <ExternalLink className="h-4 w-4" />
                <span>Buka</span>
              </div>
            </a>
          </div>

          {/* Info File & Aksi */}
          <div className="flex-1 flex flex-col justify-between w-full min-w-0">
            <div className="space-y-1 mb-3 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Foto Siap Diunggah
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-muted tabular-nums">
                {formatFileSize(file.size)}
              </p>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleTriggerPicker}
                disabled={disabled}
                className="text-xs h-9 min-h-[44px] sm:min-h-[36px]"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                Ganti Foto
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
                className="text-xs h-9 min-h-[44px] sm:min-h-[36px] text-danger hover:bg-danger/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeError && (
        <p
          role="alert"
          className="text-xs font-medium text-danger text-pretty flex items-center gap-1.5 mt-1"
        >
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{activeError}</span>
        </p>
      )}
    </div>
  );
}
