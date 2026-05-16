import React, { useState, useRef, useCallback } from "react";
import { Upload, X, ImageIcon } from "lucide-react";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Apenas imagens são permitidas.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (data.secure_url) {
        onChange(data.secure_url);
      } else {
        setError(data.error?.message ?? "Erro ao enviar imagem.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload]
  );

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative rounded-sm overflow-hidden border border-border group">
          <img src={value} alt="Foto do imóvel" className="w-full h-52 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 px-3 py-1.5 bg-black/60 rounded-sm text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" /> Trocar foto
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-sm h-52 flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
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
                {dragging ? "Solte para enviar" : "Arraste a foto aqui"}
              </p>
              <p className="text-xs text-slate-400 mt-1">ou clique para selecionar</p>
              <p className="text-xs text-slate-300 mt-3">JPG · PNG · WEBP · até 10 MB</p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
