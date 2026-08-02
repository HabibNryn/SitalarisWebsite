"use client";

import { UseFormReturn, FieldValues, Path } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CloudUpload, X, FileIcon } from "lucide-react";
import { useFileUpload } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/hooks/use-file-upload";
import { useMemo, useState } from "react";

interface UploadKTPFieldProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  maxSize?: number; // bytes
  accept?: string;
}

export function UploadKTPField<TFormValues extends FieldValues>({
  form,
  name,
  label = "Upload KTP",
  required = false,
  disabled = false,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*,application/pdf",
}: UploadKTPFieldProps<TFormValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <FileUploadZone
              form={form}
              name={name}
              disabled={disabled}
              maxSize={maxSize}
              accept={accept}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface FileUploadZoneProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>;
  name: Path<TFormValues>;
  disabled?: boolean;
  maxSize: number;
  accept: string;
}

function FileUploadZone<TFormValues extends FieldValues>({
  form,
  name,
  disabled,
  maxSize,
  accept,
}: FileUploadZoneProps<TFormValues>) {
  const fieldValue = form.watch(name) as unknown;

  const [uploading, setUploading] = useState(false);
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);

  const initialUploadDisplay = useMemo(() => {
    // Jika value string berarti sudah tersimpan sebagai uploadFileId (tanpa filename)
    if (typeof fieldValue === "string" && fieldValue) {
      return { id: fieldValue, name: lastUploadedName ?? "KTP tersimpan" };
    }
    return null;
  }, [fieldValue, lastUploadedName]);

  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: 1,
    maxSize,
    accept,
    multiple: false,
    onFilesAdded: async (added) => {
      const file = added[0]?.file;
      if (!file || !(file instanceof File)) return;
      if (disabled || uploading) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/uploadFile", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Upload gagal");
        }

        const uploadFileId = json?.uploadFile?.id as string | undefined;
        if (!uploadFileId) throw new Error("uploadFileId tidak ditemukan");

        // Simpan uploadFileId ke form (uploadFileId adalah string)
        form.setValue(name, uploadFileId as unknown as never);
        setLastUploadedName(file.name);
      } catch (e) {
        console.error(e);
      } finally {
        setUploading(false);
      }
    },
  });

  const displayFile = files.length > 0 ? files[0].file : null;

  const isImageFile = (file: File) => file.type.startsWith("image/");

  const handleRemove = () => {
    if (files.length > 0) {
      removeFile(files[0].id);
    }
    form.setValue(name, "" as unknown as never);
    setLastUploadedName(null);
  };

  const canInteract = !disabled && !uploading;

  return (
    <div className="w-full">
      {displayFile ? (
        <div className="flex items-center gap-3 w-full p-2 border rounded-lg">
          {displayFile instanceof File && isImageFile(displayFile) ? (
            <img
              src={URL.createObjectURL(displayFile)}
              alt={displayFile.name}
              className="h-16 w-16 rounded-lg border object-cover"
            />
          ) : (
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg border">
              <FileIcon className="text-muted-foreground h-6 w-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {displayFile instanceof File ? displayFile.name : "KTP"}
            </p>
            {displayFile instanceof File ? (
              <p className="text-xs text-muted-foreground">
                {formatBytes(displayFile.size)}
              </p>
            ) : null}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={handleRemove}
            disabled={!canInteract}
          >
            <X className="size-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      ) : initialUploadDisplay ? (
        <div className="flex items-center gap-3 w-full p-2 border rounded-lg">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg border">
            <FileIcon className="text-muted-foreground h-6 w-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {initialUploadDisplay.name}
            </p>
            <p className="text-xs text-muted-foreground">Sudah tersimpan</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => {
              form.setValue(name, "" as unknown as never);
              setLastUploadedName(null);
            }}
            disabled={!canInteract}
          >
            <X className="size-4" />
            <span className="sr-only">Hapus</span>
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "border-border rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            (!canInteract || uploading) && "opacity-50 cursor-not-allowed",
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            {...getInputProps({ disabled: !canInteract })}
            className="sr-only"
          />
          <CloudUpload className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drag and drop atau{" "}
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto"
              onClick={openFileDialog}
              disabled={!canInteract}
            >
              pilih file
            </Button>{" "}
            KTP (maks. {formatBytes(maxSize)})
          </p>
          <p className="text-xs text-muted-foreground">
            Format: {accept.replace(/,/g, ", ")}
          </p>
        </div>
      )}

      {uploading ? (
        <p className="mt-2 text-sm text-muted-foreground">Mengunggah...</p>
      ) : null}

      {errors.length > 0 && (
        <div className="mt-2 text-sm text-destructive">
          {errors.map((err, i) => (
            <p key={i}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
