import React, { useState, useRef, useCallback } from "react";
import { ImageIcon, Plus, X, Crop, Star, GripVertical, AlertCircle, Loader2 } from "lucide-react";
import ImageCropper from "./ImageCropper";

const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_IMAGES   = 8;

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

async function uploadToCloudinary(blob: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", blob, "photo.jpg");
  form.append("upload_preset", UPLOAD_PRESET);
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (data.secure_url) return data.secure_url as string;
  throw new Error(data.error?.message ?? "Erro no upload.");
}

export default function MultiImageUpload({ value, onChange }: MultiImageUploadProps) {
  const [dropActive, setDropActive] = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState("");
  const [cropSrc,    setCropSrc]    = useState<string | null>(null);
  const [cropIdx,    setCropIdx]    = useState<number | null>(null); // null = nova foto
  const [dragIdx,    setDragIdx]    = useState<number | null>(null);
  const [overIdx,    setOverIdx]    = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Upload após crop ───────────────────────────────────── */
  const handleCropConfirm = useCallback(async (blob: Blob) => {
    setCropSrc(null);
    setUploading(true);
    setError("");
    try {
      const url = await uploadToCloudinary(blob);
      if (cropIdx === null) {
        onChange([...value, url]);
      } else {
        const next = [...value];
        next[cropIdx] = url;
        onChange(next);
      }
    } catch (e: any) {
      setError(e.message ?? "Falha no upload.");
    } finally {
      setUploading(false);
      setCropIdx(null);
    }
  }, [value, onChange, cropIdx]);

  /* ── Selecionar arquivo e abrir cropper ─────────────────── */
  const pickFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Apenas imagens são permitidas."); return; }
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (files: FileList | null) => {
    if (!files?.length) return;
    if (value.length >= MAX_IMAGES) { setError(`Máximo de ${MAX_IMAGES} fotos atingido.`); return; }
    setCropIdx(null);
    setError("");
    pickFile(files[0]);
  };

  const openRecrop = (url: string, idx: number) => {
    setCropIdx(idx);
    setCropSrc(url);
    setError("");
  };

  /* ── Drag-and-drop (zona de upload) ─────────────────────── */
  const onDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setDropActive(false);
    if (e.dataTransfer.files.length) handleFileInput(e.dataTransfer.files);
  };

  /* ── Reordenar fotos ────────────────────────────────────── */
  const onDragStart = (i: number) => (e: React.DragEvent) => {
    setDragIdx(i);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragEnter = (i: number) => () => setOverIdx(i);
  const onDragEnd   = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const next = [...value];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(overIdx, 0, moved);
      onChange(next);
    }
    setDragIdx(null);
    setOverIdx(null);
  };

  /* ── Ações ─────────────────────────────────────────────── */
  const remove       = (i: number) => onChange(value.filter((_, j) => j !== i));
  const makePrimary  = (i: number) => {
    const next = [...value];
    const [img] = next.splice(i, 1);
    onChange([img, ...next]);
  };

  const canAdd = value.length < MAX_IMAGES;

  return (
    <>
      {/* Cropper em tela cheia */}
      {cropSrc && (
        <ImageCropper
          imageSrc={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => { setCropSrc(null); setCropIdx(null); }}
        />
      )}

      <div className="space-y-2">

        {/* ── Grid de fotos ──────────────────────────────── */}
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {value.map((url, i) => {
              const isDragging = dragIdx === i;
              const isOver     = overIdx === i && dragIdx !== i;
              return (
                <div
                  key={i}
                  draggable
                  onDragStart={onDragStart(i)}
                  onDragEnter={onDragEnter(i)}
                  onDragEnd={onDragEnd}
                  onDragOver={e => e.preventDefault()}
                  className="group relative rounded-sm overflow-hidden border select-none"
                  style={{
                    aspectRatio: "4/3",
                    borderColor: isOver ? "#001529" : isDragging ? "transparent" : "hsl(var(--border))",
                    opacity: isDragging ? 0.4 : 1,
                    boxShadow: isOver ? "0 0 0 2px #001529" : undefined,
                    cursor: "grab",
                    transition: "opacity .15s, box-shadow .15s",
                  }}
                >
                  {/* Imagem */}
                  <img
                    src={url}
                    alt={`Foto ${i + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />

                  {/* Overlay escuro no hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 pointer-events-none" />

                  {/* Badge índice (sempre visível) */}
                  <span
                    className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-sm"
                    style={{ background: i === 0 ? "#001529" : "rgba(0,0,0,0.55)", color: "#fff" }}
                  >
                    {i === 0 ? "★ Principal" : `Foto ${i + 1}`}
                  </span>

                  {/* Handle de arrastar (sempre visível no canto) */}
                  <div className="absolute top-1.5 right-1.5 p-0.5 rounded-sm opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: "rgba(0,0,0,0.5)", color: "#fff", cursor: "grab" }}>
                    <GripVertical className="w-3 h-3" />
                  </div>

                  {/* Botões de ação — surgem no hover */}
                  <div className="absolute bottom-0 inset-x-0 p-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      type="button"
                      onClick={() => openRecrop(url, i)}
                      title="Reajustar recorte"
                      className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] font-semibold rounded-sm transition-colors"
                      style={{ background: "rgba(255,255,255,0.92)", color: "#001529" }}
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <Crop className="w-3 h-3" /> Ajustar
                    </button>

                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makePrimary(i)}
                        title="Definir como foto principal"
                        className="flex-1 flex items-center justify-center gap-1 py-1 text-[11px] font-semibold rounded-sm transition-colors"
                        style={{ background: "rgba(255,255,255,0.92)", color: "#001529" }}
                        onMouseDown={e => e.stopPropagation()}
                      >
                        <Star className="w-3 h-3" /> Principal
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => remove(i)}
                      title="Remover foto"
                      className="flex items-center justify-center p-1 rounded-sm transition-colors"
                      style={{ background: "rgba(220,38,38,0.9)", color: "#fff" }}
                      onMouseDown={e => e.stopPropagation()}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Célula "adicionar" */}
            {canAdd && (
              <button
                type="button"
                onClick={() => { setError(""); inputRef.current?.click(); }}
                disabled={uploading}
                className="flex flex-col items-center justify-center gap-1.5 rounded-sm border-2 border-dashed transition-colors disabled:opacity-40"
                style={{
                  aspectRatio: "4/3",
                  borderColor: "hsl(var(--border))",
                  color: "#64748b",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#001529"; (e.currentTarget as HTMLElement).style.color = "#001529"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))"; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span className="text-xs font-medium">Adicionar</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* ── Zona de drop (sem fotos ainda) ─────────────── */}
        {value.length === 0 && (
          <div
            onDragOver={e => { e.preventDefault(); setDropActive(true); }}
            onDragLeave={() => setDropActive(false)}
            onDrop={onDropZone}
            onClick={() => { setError(""); inputRef.current?.click(); }}
            className="flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed cursor-pointer transition-all select-none"
            style={{
              minHeight: 160,
              borderColor: dropActive ? "#001529" : "hsl(var(--border))",
              background:  dropActive ? "hsl(var(--secondary))" : "transparent",
              transform:   dropActive ? "scale(0.99)" : "scale(1)",
            }}
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                <p className="text-sm text-muted-foreground">Processando foto…</p>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full" style={{ background: dropActive ? "hsl(var(--border))" : "hsl(var(--secondary))" }}>
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {dropActive ? "Solte para adicionar" : "Arraste ou clique para adicionar fotos"}
                </p>
                <p className="text-xs text-muted-foreground">JPG · PNG · WEBP — até {MAX_IMAGES} fotos</p>
              </>
            )}
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => { handleFileInput(e.target.files); e.target.value = ""; }}
        />

        {/* Rodapé */}
        {value.length > 0 && (
          <div className="flex items-center justify-between pt-0.5">
            <p className="text-xs text-muted-foreground">
              {value.length}/{MAX_IMAGES} foto{value.length !== 1 ? "s" : ""} · Arraste para reordenar
            </p>
            {canAdd && !uploading && (
              <button
                type="button"
                onClick={() => { setError(""); inputRef.current?.click(); }}
                className="text-xs font-semibold text-navy-900 hover:underline underline-offset-2 transition-colors"
              >
                + adicionar foto
              </button>
            )}
            {uploading && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Enviando…
              </span>
            )}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-red-500">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </div>
        )}
      </div>
    </>
  );
}
