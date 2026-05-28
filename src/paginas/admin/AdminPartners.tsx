import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Textarea } from "@/componentes/ui/textarea";
import ImageUpload from "@/componentes/ui/ImageUpload";
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
import { Plus, Pencil, Trash2, ExternalLink, Image } from "lucide-react";

const EMPTY = {
  name: "",
  logo_url: "",
  website: "",
  category: "",
  description: "",
  active: true,
};

const CATEGORY_LABELS: Record<string, string> = {
  financiamento: "Financiamento",
  construtora: "Construtora",
  cartório: "Cartório",
  advocacia: "Advocacia",
  outros: "Outros",
};

export default function AdminPartners() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: partners = [], isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data, error } = await supabase.from("partners").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: async (data: any) => {
      const { data: res, error } = await supabase.from("partners").insert(data).select().single();
      if (error) throw error;
      return res;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partners"] }); qc.invalidateQueries({ queryKey: ["partners-active"] }); closeDialog(); },
  });
  const updateMut = useMutation({
    mutationFn: async ({ id, data }: any) => {
      const { data: res, error } = await supabase.from("partners").update(data).eq("id", id).select().single();
      if (error) throw error;
      return res;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partners"] }); qc.invalidateQueries({ queryKey: ["partners-active"] }); closeDialog(); },
  });
  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["partners"] }); qc.invalidateQueries({ queryKey: ["partners-active"] }); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p }); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); setForm(EMPTY); };
  const handleSave = () => {
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  const field = (key: string) => ({
    value: form[key] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">Parceiros</h2>
          <p className="text-sm text-muted-foreground mt-1">{partners.length} parceiros cadastrados</p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-sm bg-navy-900 text-white hover:bg-navy-800" size="sm">
          <Plus className="w-4 h-4" /> Novo parceiro
        </Button>
      </div>

      {/* Grid de cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-sm border border-border bg-white overflow-hidden">
              <div className="skeleton h-40 w-full" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : partners.length === 0 ? (
        <div className="bg-white border border-border rounded-sm p-10 text-center">
          <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center mx-auto mb-4">
            <Image className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Nenhum parceiro cadastrado ainda.</p>
          <Button onClick={openCreate} variant="outline" size="sm" className="mt-4 gap-2 rounded-sm">
            <Plus className="w-4 h-4" /> Cadastrar parceiro
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((p: any) => (
            <div key={p.id} className="bg-white border border-border rounded-sm overflow-hidden group">
              {/* Foto */}
              <div className="relative h-44 bg-secondary flex items-center justify-center">
                {p.logo_url ? (
                  <img
                    src={p.logo_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Image className="w-8 h-8 opacity-30" />
                    <span className="text-xs opacity-50">Sem foto</span>
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                      p.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {p.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-1.5 rounded-sm bg-white/90 shadow text-navy-800 hover:bg-white transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="p-1.5 rounded-sm bg-white/90 shadow text-red-500 hover:bg-white transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy-900 text-sm leading-tight">{p.name}</p>
                    {p.category && (
                      <Badge variant="secondary" className="rounded-sm text-[10px] mt-1 bg-slate-100 text-slate-600">
                        {CATEGORY_LABELS[p.category] || p.category}
                      </Badge>
                    )}
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-slate-600 transition-colors shrink-0 mt-0.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                {p.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editing ? "Editar parceiro" : "Novo parceiro"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">

            {/* Foto */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
                Foto / Logo do Parceiro
              </label>
              <ImageUpload
                value={form.logo_url}
                onChange={(url) => setForm({ ...form, logo_url: url })}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Nome</label>
              <Input {...field("name")} placeholder="Nome da empresa" className="rounded-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Categoria</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="rounded-sm"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Site</label>
              <Input {...field("website")} placeholder="https://..." className="rounded-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Descrição</label>
              <Textarea {...field("description")} placeholder="Breve descrição do parceiro..." className="rounded-sm resize-none" rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={!!form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label htmlFor="active" className="text-sm text-muted-foreground">
                Parceiro ativo (aparece no site)
              </label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} className="rounded-sm">Cancelar</Button>
            <Button
              onClick={handleSave}
              disabled={createMut.isPending || updateMut.isPending}
              className="rounded-sm"
            >
              {createMut.isPending || updateMut.isPending ? "Salvando..." : editing ? "Salvar" : "Cadastrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir parceiro?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-sm bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMut.mutate(deleteId!)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
