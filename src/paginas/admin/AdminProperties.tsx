import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Textarea } from "@/componentes/ui/textarea";
import MultiImageUpload from "@/componentes/ui/MultiImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componentes/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/componentes/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/componentes/ui/alert-dialog";
import { Badge } from "@/componentes/ui/badge";
import { Plus, Pencil, Trash2, Bed, Bath, Maximize2, Car } from "lucide-react";

const EMPTY = {
  code: "",
  title: "",
  type: "",
  transaction: "",
  price: "",
  neighborhood: "",
  city: "",
  bedrooms: "",
  bathrooms: "",
  garages: "",
  area: "",
  description: "",
  images: [] as string[],
  featured: false,
};

function formatPrice(value) {
  if (!value) return "—";
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function parsePriceInput(raw: string): string {
  return raw.replace(/\D/g, "");
}

export default function AdminProperties() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => base44.entities.Property.list("-created_date", 100),
    initialData: [],
  });

  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Property.delete(id),
    onSuccess: () => { qc.invalidateQueries(["properties"]); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); setSaveError(""); };
  const openEdit = (p) => {
    setEditing(p);
    setSaveError("");
    setForm({
      ...p,
      code: p.code || "",
      price: p.price ? String(p.price) : "",
      bedrooms: p.bedrooms != null ? String(p.bedrooms) : "",
      bathrooms: p.bathrooms != null ? String(p.bathrooms) : "",
      garages: p.garages != null ? String(p.garages) : "",
      area: p.area != null ? String(p.area) : "",
      images: Array.isArray(p.images) ? p.images : [],
    });
    setOpen(true);
  };
  const closeDialog = () => { setOpen(false); setEditing(null); setForm(EMPTY); setSaveError(""); };

  const handleSave = async () => {
    setSaveError("");
    setSaving(true);
    const rawPrice = parsePriceInput(String(form.price));
    const images = (form.images as string[]) ?? [];

    const basePayload = {
      title: form.title,
      type: form.type,
      transaction: form.transaction,
      price: rawPrice ? parseInt(rawPrice, 10) : undefined,
      neighborhood: form.neighborhood || null,
      city: form.city,
      bedrooms: form.bedrooms !== "" ? Number(form.bedrooms) : undefined,
      bathrooms: form.bathrooms !== "" ? Number(form.bathrooms) : undefined,
      area: form.area !== "" ? Number(form.area) : undefined,
      description: form.description || null,
      image_url: images[0] || (form as any).image_url || null,
      featured: form.featured,
    };

    const fullPayload = {
      ...basePayload,
      code: form.code || null,
      garages: form.garages !== "" ? Number(form.garages) : undefined,
      images,
    };

    try {
      if (editing) {
        await base44.entities.Property.update(editing.id, fullPayload);
      } else {
        await base44.entities.Property.create(fullPayload);
      }
      qc.invalidateQueries(["properties"]);
      closeDialog();
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.includes("images") || msg.includes("code") || msg.includes("garages")) {
        try {
          if (editing) {
            await base44.entities.Property.update(editing.id, basePayload);
          } else {
            await base44.entities.Property.create(basePayload);
          }
          qc.invalidateQueries(["properties"]);
          closeDialog();
          setSaveError("Salvo, mas execute a migration SQL no Supabase para habilitar fotos múltiplas, código e garagens.");
        } catch (err2: any) {
          setSaveError(err2?.message ?? "Erro ao salvar. Tente novamente.");
        }
      } else {
        setSaveError(msg || "Erro ao salvar. Tente novamente.");
      }
    } finally {
      setSaving(false);
    }
  };

  const field = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  const priceDisplayValue = form.price
    ? Number(parsePriceInput(String(form.price))).toLocaleString("pt-BR")
    : "";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">Imóveis</h2>
          <p className="text-sm text-muted-foreground mt-1">{properties.length} imóveis cadastrados</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="gap-2 rounded-sm bg-navy-900 text-white hover:bg-navy-800" size="sm">
            <Plus className="w-4 h-4" /> Novo imóvel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-border shadow-sm rounded-sm overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum imóvel cadastrado ainda.</p>
            <Button onClick={openCreate} variant="outline" size="sm" className="mt-4 gap-2 rounded-sm border-slate-500 text-slate-600 hover:bg-slate-500 hover:text-white">
              <Plus className="w-4 h-4" /> Cadastrar primeiro imóvel
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-5 py-3">Imóvel</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden md:table-cell">Localização</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Detalhes</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">Preço</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3 hidden sm:table-cell">Status</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {properties.map((p) => {
                  const thumb = (Array.isArray(p.images) && p.images.length > 0) ? p.images[0] : p.image_url;
                  return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-2">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-sm overflow-hidden border border-border shrink-0 bg-slate-100">
                          {thumb ? (
                            <img src={thumb} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Maximize2 className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-navy-900 line-clamp-1">{p.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {p.code ? `#${p.code}` : ""}{p.code && p.type ? " · " : ""}{p.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-muted-foreground text-xs">{p.neighborhood && `${p.neighborhood}, `}{p.city}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        {p.bedrooms > 0 && <span className="flex items-center gap-1 text-xs"><Bed className="w-3 h-3 text-slate-500" />{p.bedrooms}</span>}
                        {p.bathrooms > 0 && <span className="flex items-center gap-1 text-xs"><Bath className="w-3 h-3 text-slate-500" />{p.bathrooms}</span>}
                        {p.garages > 0 && <span className="flex items-center gap-1 text-xs"><Car className="w-3 h-3 text-slate-500" />{p.garages}</span>}
                        {p.area > 0 && <span className="flex items-center gap-1 text-xs"><Maximize2 className="w-3 h-3 text-slate-500" />{p.area}m²</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-navy-900 text-xs">{formatPrice(p.price)}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="rounded-sm text-xs bg-slate-100 text-slate-600">
                        {p.transaction === "venda" ? "Venda" : "Aluguel"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-sm hover:bg-slate-200 transition-colors text-slate-500 hover:text-navy-900">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-sm hover:bg-red-50 transition-colors text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editing ? "Editar imóvel" : "Novo imóvel"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">

            {/* Título */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Título</label>
              <Input {...field("title")} placeholder="Ex: Apartamento 2 quartos no Centro" className="rounded-sm" />
            </div>

            {/* Código do imóvel */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Código do imóvel</label>
              <Input {...field("code")} placeholder="Ex: APT-001" className="rounded-sm" />
            </div>

            {/* Tipo */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Tipo</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="rounded-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {["apartamento","casa","terreno","comercial","cobertura","kitnet"].map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Finalidade */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Finalidade</label>
              <Select value={form.transaction} onValueChange={(v) => setForm({ ...form, transaction: v })}>
                <SelectTrigger className="rounded-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Preço */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Preço (R$)</label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="Ex: 650000"
                value={priceDisplayValue}
                onChange={(e) => setForm({ ...form, price: parsePriceInput(e.target.value) })}
                className="rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Digite apenas números, sem pontos ou vírgulas</p>
            </div>

            {/* Cidade */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Cidade</label>
              <Input {...field("city")} placeholder="Ex: São Paulo" className="rounded-sm" />
            </div>

            {/* Bairro */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Bairro</label>
              <Input {...field("neighborhood")} placeholder="Ex: Centro" className="rounded-sm" />
            </div>

            {/* Quartos */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Quartos</label>
              <Input {...field("bedrooms")} type="number" min="0" placeholder="0" className="rounded-sm" />
            </div>

            {/* Banheiros */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Banheiros</label>
              <Input {...field("bathrooms")} type="number" min="0" placeholder="0" className="rounded-sm" />
            </div>

            {/* Garagens */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Garagens</label>
              <Input {...field("garages")} type="number" min="0" placeholder="0" className="rounded-sm" />
            </div>

            {/* Área */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Área (m²)</label>
              <Input {...field("area")} type="number" min="0" placeholder="0" className="rounded-sm" />
            </div>

            {/* Fotos */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Fotos do imóvel</label>
              <MultiImageUpload
                value={(form.images as string[]) ?? []}
                onChange={(urls) => setForm({ ...form, images: urls })}
              />
            </div>

            {/* Descrição */}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Descrição</label>
              <Textarea {...field("description")} placeholder="Descreva o imóvel..." className="rounded-sm resize-none" rows={4} />
            </div>

            {/* Destaque */}
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" checked={!!form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="rounded-sm" />
              <label htmlFor="featured" className="text-sm text-muted-foreground">Imóvel em destaque</label>
            </div>
          </div>
          {saveError && (
            <p className="text-xs text-red-500 px-1 -mt-2">{saveError}</p>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} className="rounded-sm">Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-sm">
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar imóvel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir imóvel?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita. O imóvel será removido permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-sm bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMut.mutate(deleteId)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
