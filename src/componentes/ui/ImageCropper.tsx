import React, { useState, useCallback } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import Cropper from "react-easy-crop";
import { X, Check, ZoomIn, ZoomOut, RotateCw, Maximize } from "lucide-react";

/* ─── Types ────────────────────────────────────────────────── */
interface Area { x: number; y: number; width: number; height: number }
interface ImageCropperProps {
  imageSrc: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

/* ─── Crop math (official react-easy-crop recipe) ─────────── */
function getRadianAngle(deg: number) { return (deg * Math.PI) / 180; }

function rotateSize(w: number, h: number, rotation: number) {
  const r = getRadianAngle(rotation);
  return {
    width:  Math.abs(Math.cos(r) * w) + Math.abs(Math.sin(r) * h),
    height: Math.abs(Math.sin(r) * w) + Math.abs(Math.cos(r) * h),
  };
}

async function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src.startsWith("data:") ? src : `${src}?t=${Date.now()}`;
  });
}

async function getCroppedBlob(src: string, pixelCrop: Area, rotation = 0): Promise<Blob> {
  const image = await createImage(src);

  const { width: bw, height: bh } = rotateSize(image.width, image.height, rotation);
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width  = bw;
  rotCanvas.height = bh;
  const rotCtx = rotCanvas.getContext("2d")!;
  rotCtx.translate(bw / 2, bh / 2);
  rotCtx.rotate(getRadianAngle(rotation));
  rotCtx.translate(-image.width / 2, -image.height / 2);
  rotCtx.drawImage(image, 0, 0);

  const out = document.createElement("canvas");
  out.width  = pixelCrop.width;
  out.height = pixelCrop.height;
  const outCtx = out.getContext("2d")!;
  outCtx.drawImage(rotCanvas, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

  return new Promise((resolve, reject) =>
    out.toBlob((b) => b ? resolve(b) : reject(new Error("canvas vazio")), "image/jpeg", 0.93)
  );
}

/* ─── Aspect options ───────────────────────────────────────── */
const ASPECTS = [
  { label: "4:3",  value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "1:1",  value: 1 },
  { label: "Livre", value: 0 },
];

/* ─── Component ────────────────────────────────────────────── */
export default function ImageCropper({ imageSrc, onConfirm, onCancel }: ImageCropperProps) {
  const [crop, setCrop]       = useState({ x: 0, y: 0 });
  const [zoom, setZoom]       = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectKey, setAspectKey] = useState(0);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [err, setErr] = useState("");

  const currentAspect = ASPECTS[aspectKey].value || undefined;

  const changeAspect = (i: number) => {
    setAspectKey(i);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedPixels(pixels);
  }, []);

  const confirm = async () => {
    if (!croppedPixels) return;
    setProcessing(true);
    setErr("");
    try {
      const blob = await getCroppedBlob(imageSrc, croppedPixels, rotation);
      onConfirm(blob);
    } catch (e: any) {
      setErr("Erro ao recortar. Tente novamente.");
      console.error(e);
    } finally {
      setProcessing(false);
    }
  };

  return (
    /* Radix Dialog aninhado — o pai (AdminProperties DialogContent) não fecha
       porque o Radix rastreia dialogs filhos e suprime o DismissableLayer do pai */
    <DialogPrimitive.Root open={true} onOpenChange={(open) => { if (!open) onCancel(); }}>
      <DialogPrimitive.Portal>
        {/* Overlay sólido para cobrir tudo */}
        <DialogPrimitive.Overlay
          style={{ position: "fixed", inset: 0, zIndex: 9998, background: "#0a0a0a" }}
        />
        <DialogPrimitive.Content
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={onCancel}
          aria-describedby={undefined}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", flexDirection: "column",
            background: "#0a0a0a", outline: "none",
          }}
        >
          <DialogPrimitive.Title style={{ display: "none" }}>Ajustar foto</DialogPrimitive.Title>

          {/* ── Top bar ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
            <button
              onClick={onCancel}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.5)", background: "transparent", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 2 }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              <X style={{ width: 16, height: 16 }} /> Cancelar
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Maximize style={{ width: 14, height: 14, color: "rgba(255,255,255,0.25)" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>Ajustar foto</span>
            </div>

            <button
              onClick={confirm}
              disabled={processing}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600, padding: "6px 16px", borderRadius: 2, background: "#fff", color: "#0a0a0a", border: "none", cursor: processing ? "not-allowed" : "pointer", opacity: processing ? 0.6 : 1 }}
            >
              <Check style={{ width: 16, height: 16 }} />
              {processing ? "Processando…" : "Confirmar"}
            </button>
          </div>

          {/* ── Crop area ── */}
          <div style={{ position: "relative", flex: 1 }}>
            <Cropper
              key={`crop-${aspectKey}`}
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={currentAspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid
              style={{
                containerStyle: { background: "#0a0a0a" },
                cropAreaStyle: { border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)" },
              }}
            />
          </div>

          {/* ── Controls ── */}
          <div style={{ flexShrink: 0, padding: "16px", display: "flex", flexDirection: "column", gap: 14, background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Aspect ratio */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", width: 60, flexShrink: 0 }}>Proporção</span>
              <div style={{ display: "flex", gap: 6 }}>
                {ASPECTS.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => changeAspect(i)}
                    style={{
                      padding: "4px 12px", fontSize: 12, fontWeight: 500, borderRadius: 2, border: "1px solid", cursor: "pointer", transition: "all .15s",
                      background: aspectKey === i ? "#fff" : "transparent",
                      color:      aspectKey === i ? "#0a0a0a" : "rgba(255,255,255,0.5)",
                      borderColor: aspectKey === i ? "#fff" : "rgba(255,255,255,0.15)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zoom */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", width: 60, flexShrink: 0 }}>Zoom</span>
              <button onClick={() => setZoom(z => Math.max(1, +(z - 0.1).toFixed(2)))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
                <ZoomOut style={{ width: 16, height: 16 }} />
              </button>
              <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={e => setZoom(+e.target.value)}
                style={{ flex: 1, accentColor: "#fff", cursor: "pointer" }} />
              <button onClick={() => setZoom(z => Math.min(3, +(z + 0.1).toFixed(2)))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
                <ZoomIn style={{ width: 16, height: 16 }} />
              </button>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", width: 32, textAlign: "right" }}>{Math.round(zoom * 100)}%</span>
            </div>

            {/* Rotation */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em", width: 60, flexShrink: 0 }}>Girar</span>
              <button onClick={() => setRotation(r => Math.max(-180, r - 90))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
                <RotateCw style={{ width: 16, height: 16, transform: "scaleX(-1)" }} />
              </button>
              <input type="range" min={-180} max={180} step={1} value={rotation} onChange={e => setRotation(+e.target.value)}
                style={{ flex: 1, accentColor: "#fff", cursor: "pointer" }} />
              <button onClick={() => setRotation(r => Math.min(180, r + 90))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 2 }}
                onMouseEnter={e => (e.currentTarget.style.color="#fff")} onMouseLeave={e => (e.currentTarget.style.color="rgba(255,255,255,0.4)")}>
                <RotateCw style={{ width: 16, height: 16 }} />
              </button>
              <button onClick={() => setRotation(0)}
                style={{ fontSize: 11, width: 32, textAlign: "right", background: "none", border: "none", cursor: "pointer", color: rotation !== 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)" }}>
                {rotation}°
              </button>
            </div>

            {err && <p style={{ fontSize: 12, color: "#f87171", textAlign: "center" }}>{err}</p>}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
