import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Trash2, Mail, Users, Download, Phone, ChevronDown, ChevronUp } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/componentes/ui/alert-dialog";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-medium bg-slate-100 text-slate-600">
      {children}
    </span>
  );
}

function LeadRow({ s, onDelete }: { s: any; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      {/* Linha principal */}
      <div className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-navy-900">{s.name || "—"}</p>
            {s.urgencia && <Tag>{s.urgencia}</Tag>}
            {s.faixa && <Tag>{s.faixa}</Tag>}
          </div>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {s.phone && (
              <a href={`https://wa.me/55${s.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="w-3 h-3" /> {s.phone}
              </a>
            )}
            {s.email && (
              <a href={`mailto:${s.email}`}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="w-3 h-3" /> {s.email}
              </a>
            )}
            <span className="text-xs text-muted-foreground/60">{formatDate(s.created_at)}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setOpen(v => !v)}
            className="p-1.5 rounded-sm hover:bg-slate-200 text-muted-foreground hover:text-navy-900 transition-colors"
            title="Ver detalhes">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={onDelete}
            className="p-1.5 rounded-sm hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
            title="Remover">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detalhes expandidos */}
      {open && (
        <div className="px-5 pb-4 bg-slate-50 border-t border-border">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 pt-4">
            {[
              { label: "CPF",           value: s.cpf },
              { label: "Tipo de imóvel", value: s.tipo_imovel },
              { label: "Objetivo",      value: s.objetivo },
              { label: "Localização",   value: s.localizacao },
              { label: "Quartos",       value: s.quartos },
              { label: "Vagas",         value: s.vagas },
              { label: "Área",          value: s.area ? `${s.area} m²` : null },
              { label: "Faixa",         value: s.faixa },
              { label: "Pagamento",     value: s.pagamento },
              { label: "Urgência",      value: s.urgencia },
            ].map(({ label, value }) =>
              value ? (
                <div key={label}>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60">{label}</p>
                  <p className="text-sm text-navy-900 mt-0.5">{value}</p>
                </div>
              ) : null
            )}
          </div>
          {s.observacoes && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60 mb-1">Observações</p>
              <p className="text-sm text-navy-900 whitespace-pre-line">{s.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLeads() {
  const qc = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => base44.entities.Subscriber.list("-created_at"),
    initialData: [],
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => base44.entities.Subscriber.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["subscribers"] }); setDeleteId(null); },
  });

  const exportCSV = () => {
    const headers = ["Nome", "E-mail", "Telefone", "CPF", "Tipo Imóvel", "Objetivo", "Localização", "Quartos", "Vagas", "Área", "Faixa", "Pagamento", "Urgência", "Observações", "Data"];
    const rows = (subscribers as any[]).map((s) => [
      s.name || "", s.email || "", s.phone || "", s.cpf || "",
      s.tipo_imovel || "", s.objetivo || "", s.localizacao || "",
      s.quartos || "", s.vagas || "", s.area || "",
      s.faixa || "", s.pagamento || "", s.urgencia || "",
      s.observacoes || "", formatDate(s.created_at),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">Leads</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {(subscribers as any[]).length} {(subscribers as any[]).length === 1 ? "lead recebido" : "leads recebidos"}
          </p>
        </div>
        {(subscribers as any[]).length > 0 && (
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-border bg-white hover:bg-secondary transition-colors">
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
        )}
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="skeleton h-14 rounded-sm" />)}
          </div>
        ) : (subscribers as any[]).length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Nenhum lead ainda</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Os formulários de pretensão de compra aparecerão aqui.
            </p>
          </div>
        ) : (
          <div>
            {(subscribers as any[]).map((s) => (
              <LeadRow key={s.id} s={s} onDelete={() => setDeleteId(s.id)} />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lead?</AlertDialogTitle>
            <AlertDialogDescription>O lead será removido permanentemente da lista.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="rounded-sm bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMut.mutate(deleteId!)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
