import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import AdminLayout from "./Dashboard";
import { Button } from "@/componentes/ui/button";
import { Input } from "@/componentes/ui/input";
import { Textarea } from "@/componentes/ui/textarea";
import ImageUpload from "@/componentes/ui/ImageUpload";
import TiptapEditor from "@/componentes/ui/TiptapEditor";
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
import { Plus, Pencil, Trash2, Save, Check } from "lucide-react";

const EMPTY_ITEM = {
  id: undefined,
  title: "",
  excerpt: "",
  content: "",
  slug: "",
  image_url: "",
  display_date: "",
  featured: true,
  active: true,
};

type NewsItem = {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  image_url?: string | null;
  display_date?: string | null;
  featured: boolean;
  active: boolean;
};

const slugify = (value: string) =>
  value
    .normalize("NFD")                 // separa letra e acento (ç -> c + diacrítico)
    .replace(/[\u0300-\u036f]/g, "")  // remove os acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")      // emoji, espaços, "!" etc viram hífen
    .replace(/^-+|-+$/g, "");         // tira hífens das pontas

// Código curto e estável no fim da URL: garante que o link nunca colida
// nem quebre se o título mudar. Ex.: "geracao-z-setor-de-imoveis-a1b2c3"
const randomCode = () => Math.random().toString(36).slice(2, 8);

const buildSlug = (title: string, code: string) => {
  const base = slugify(title);
  return base ? `${base}-${code}` : code;
};

// Recupera o código de uma notícia já no formato novo ("titulo-limpo-codigo").
// Para slugs legados (emoji/acento) devolve "" para um código novo ser gerado.
const codeFromSlug = (item: NewsItem) => {
  const base = slugify(item.title);
  if (base && item.slug.startsWith(`${base}-`)) {
    return item.slug.slice(base.length + 1);
  }
  return "";
};

export default function AdminNews() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<NewsItem | null>(null);
  const [form, setForm] = useState<NewsItem>(EMPTY_ITEM);
  const [code, setCode] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NewsItem[];
    },
    initialData: [],
  });

  const createMut = useMutation({
    mutationFn: async (payload: Omit<NewsItem, "id">) => {
      const { data, error } = await supabase.from("news").insert(payload).select().single();
      if (error) throw error;
      return data as NewsItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_ITEM);
    },
  });

  const updateMut = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Omit<NewsItem, "id"> }) => {
      const { data, error } = await supabase
        .from("news")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as NewsItem;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      setOpen(false);
      setEditing(null);
      setForm(EMPTY_ITEM);
    },
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["news"] });
      setDeleteId(null);
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_ITEM);
    setCode(randomCode());
    setOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    // Reaproveita o código atual; se for um slug legado, gera um novo.
    const itemCode = codeFromSlug(item) || randomCode();
    setCode(itemCode);
    setEditing(item);
    setForm({ ...item, slug: buildSlug(item.title, itemCode) });
    setOpen(true);
  };

  const handleSave = () => {
    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      slug: buildSlug(form.title, code),
      image_url: form.image_url || null,
      display_date: form.display_date || null,
      featured: form.featured,
      active: form.active,
    };

    if (editing?.id) {
      updateMut.mutate({ id: editing.id, payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const setField = (field: keyof NewsItem) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((current) => ({
        ...current,
        [field]: value,
        ...(field === "title" ? { slug: buildSlug(value, code) } : {}),
      }));
    };

  const setCheckbox = (field: keyof Pick<NewsItem, "active" | "featured">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: e.target.checked }));

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">
            Notícias
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Crie e edite notícias que aparecem na home.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreate} className="gap-2 rounded-sm bg-navy-900 text-white hover:bg-navy-800" size="sm">
            <Plus className="w-4 h-4" /> Nova notícia
          </Button>
          <Link to="/admin" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
            Voltar ao painel
          </Link>
        </div>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Carregando notícias...</div>
        ) : news.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Nenhuma notícia cadastrada ainda.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {news.map((item) => (
              <div key={item.id ?? item.title} className="p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-navy-900">{item.title || "Sem título"}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.display_date || "Sem data"}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.excerpt}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-sm ${item.featured ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.featured ? "Destaque" : "Normal"}
                  </span>
                  <span className={`px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] rounded-sm ${item.active ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                    {item.active ? "Ativo" : "Inativo"}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Button onClick={() => openEdit(item)} size="sm" className="gap-2 rounded-sm bg-slate-900 text-white hover:bg-slate-800">
                      <Pencil className="w-4 h-4" /> Editar
                    </Button>
                    {item.id && (
                      <Button onClick={() => setDeleteId(item.id)} size="sm" className="gap-2 rounded-sm bg-red-600 text-white hover:bg-red-500">
                        <Trash2 className="w-4 h-4" /> Excluir
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar notícia" : "Nova notícia"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Título
              </label>
              <Input value={form.title} onChange={setField("title")} placeholder="Título da notícia" className="rounded-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Slug da notícia
              </label>
              <Input value={form.slug} readOnly placeholder="slug-da-noticia" className="rounded-sm bg-slate-100" />
              <p className="text-xs text-muted-foreground mt-1">
                URL automática baseada no título. Use apenas letras, números e hífen.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Resumo
              </label>
              <Textarea value={form.excerpt} onChange={setField("excerpt")} placeholder="Resumo curto da notícia" className="rounded-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Conteúdo completo
              </label>
              <TiptapEditor value={form.content} onChange={(content) => setForm((current) => ({ ...current, content }))} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Imagem
                </label>
                <ImageUpload
                  value={form.image_url}
                  onChange={(url) => setForm((current) => ({ ...current, image_url: url }))}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                  Data de exibição
                </label>
                <Input value={form.display_date} onChange={setField("display_date")} placeholder="24 de maio de 2026" className="rounded-sm" />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.active} onChange={setCheckbox("active")} className="h-4 w-4 rounded border border-border text-primary focus:ring-2 focus:ring-primary" />
                Ativo
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" checked={form.featured} onChange={setCheckbox("featured")} className="h-4 w-4 rounded border border-border text-primary focus:ring-2 focus:ring-primary" />
                Destaque
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSave} className="gap-2 rounded-sm" disabled={createMut.isPending || updateMut.isPending}>
              {createMut.isPending || updateMut.isPending ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="w-4 h-4" /> Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notícia</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta notícia? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMut.mutate(deleteId)}
              className="bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
