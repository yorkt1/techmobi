import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Textarea } from "@/componentes/ui/textarea";
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
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

const EMPTY = {
  name: "",
  logo_url: "",
  website: "",
  category: "",
  description: "",
  active: true,
};

const CATEGORY_LABELS = {
  financiamento: "Financiamento",
  construtora: "Construtora",
  cartório: "Cartório",
  advocacia: "Advocacia",
  outros: "Outros",
};

export default function AdminPartners() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);

  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: () => base44.entities.Partner.list(),
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: (data) => base44.entities.Partner.create(data),
    onSuccess: () => { qc.invalidateQueries(["partners"]); closeDialog(); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Partner.update(id, data),
    onSuccess: () => { qc.invalidateQueries(["partners"]); closeDialog(); },
  });
  const deleteMut = useMutation({
    mutationFn: (id) => base44.entities.Partner.delete(id),
    onSuccess: () => { qc.invalidateQueries(["partners"]); setDeleteId(null); },
  });

  const openCreate = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setOpen(true); };
  const closeDialog = () => { setOpen(false); setEditing(null); setForm(EMPTY); };

  const handleSave = () => {
    if (editing) updateMut.mutate({ id: editing.id, data: form });
    else createMut.mutate(form);
  };

  const field = (key) => ({
    value: form[key] ?? "",
    onChange: (e) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Parceiros</h2>
          <p className="text-sm text-muted-foreground mt-1">{partners.length} parceiros cadastrados</p>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-sm bg-navy-900 text-white hover:bg-navy-800" size="sm">
          <Plus className="w-4 h-4" /> Novo parceiro
        </Button>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm overflow-hidden">
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Carregando...</p>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-muted-foreground">Nenhum parceiro cadastrado ainda.</p>
            <Button onClick={openCreate} variant="outline" size="sm" className="mt-4 gap-2 rounded-sm border-slate-500 text-slate-600 hover:bg-slate-500 hover:text-white">
              <Plus className="w-4 h-4" /> Cadastrar parceiro
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {partners.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  {p.logo_url ? (
                    <img src={p.logo_url} alt={p.name} className="w-10 h-10 object-contain rounded-sm border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {p.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {p.category && (
                    <Badge variant="secondary" className="rounded-sm text-xs hidden sm:flex bg-slate-100 text-slate-600">
                      {CATEGORY_LABELS[p.category] || p.category}
                    </Badge>
                  )}
                  {p.website && (
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-slate-500 transition-colors hidden sm:block">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-sm hover:bg-slate-200 transition-colors text-muted-foreground hover:text-navy-900">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded-sm hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editing ? "Editar parceiro" : "Novo parceiro"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">
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
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">Logo URL</label>
              <Input {...field("logo_url")} placeholder="https://..." className="rounded-sm" />
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
              <input type="checkbox" id="active" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              <label htmlFor="active" className="text-sm text-muted-foreground">Parceiro ativo (aparece no site)</label>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={closeDialog} className="rounded-sm">Cancelar</Button>
            <Button onClick={handleSave} disabled={createMut.isPending || updateMut.isPending} className="rounded-sm">
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
            <AlertDialogAction className="rounded-sm bg-destructive hover:bg-destructive/90" onClick={() => deleteMut.mutate(deleteId)}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}