import React, { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon, Plus } from "lucide-react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_IMAGES = 8;

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (fileArray.length === 0) {
      setError("Apenas imagens são permitidas.");
      return;
    }
    const remaining = MAX_IMAGES - value.length;
    const toUpload = fileArray.slice(0, remaining);
    if (toUpload.length === 0) {
      setError(`Limite de ${MAX_IMAGES} fotos atingido.`);
      return;
    }

    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of toUpload) {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", UPLOAD_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: "POST", body: form }
        );
        const data = await res.json();
        if (data.secure_url) {
          uploaded.push(data.secure_url);
        } else {
          setError(data.error?.message ?? "Erro ao enviar imagem.");
        }
      }
      if (uploaded.length > 0) {
        onChange([...value, ...uploaded]);
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }, [value, onChange]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 0) upload(e.dataTransfer.files);
    },
    [upload]
  );

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const canAddMore = value.length < MAX_IMAGES;

  return (
    <div className="space-y-3">
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, idx) => (
            <div key={url + idx} className="relative rounded-sm overflow-hidden border border-border aspect-square">
              <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 text-[10px] bg-black/60 text-white px-1.5 py-0.5 rounded-sm">
                  Principal
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="aspect-square border-2 border-dashed border-slate-300 rounded-sm flex flex-col items-center justify-center text-slate-400 hover:border-slate-400 hover:text-slate-500 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-xs">Adicionar</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {value.length === 0 && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm h-40 flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
            dragging
              ? "border-slate-700 bg-slate-50 scale-[0.99]"
              : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Enviando foto...</span>
            </div>
          ) : (
            <>
              <div className={`mb-3 p-3 rounded-full transition-colors ${dragging ? "bg-slate-200" : "bg-slate-100"}`}>
                <ImageIcon className="w-6 h-6 text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-600">
                {dragging ? "Solte para enviar" : "Arraste as fotos aqui"}
              </p>
              <p className="text-xs text-slate-400 mt-1">ou clique para selecionar</p>
              <p className="text-xs text-slate-300 mt-3">JPG · PNG · WEBP · até 10 MB · máx. {MAX_IMAGES} fotos</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) upload(e.target.files);
          e.target.value = "";
        }}
      />

      {value.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {value.length}/{MAX_IMAGES} fotos · A primeira foto será a principal
          {value.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="ml-2 text-slate-600 underline underline-offset-2 hover:text-navy-900 disabled:opacity-50"
            >
              {uploading ? "Enviando..." : `+ adicionar mais`}
            </button>
          )}
        </p>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
