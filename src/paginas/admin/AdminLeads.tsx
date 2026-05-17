import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Trash2, Mail, Users, Download } from "lucide-react";
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
import { useState } from "react";

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
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
    const rows = [
      ["Nome", "E-mail", "Data de cadastro"],
      ...(subscribers as any[]).map((s) => [s.name || "—", s.email, formatDate(s.created_at)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
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
          <h2 className="text-xl font-bold text-navy-900 tracking-tight">Leads / Newsletter</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {(subscribers as any[]).length} cadastros recebidos
          </p>
        </div>
        {(subscribers as any[]).length > 0 && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-sm border border-border bg-white hover:bg-secondary transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        )}
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-sm" />
            ))}
          </div>
        ) : (subscribers as any[]).length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 rounded-sm bg-secondary flex items-center justify-center mx-auto mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nenhum lead cadastrado ainda.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Os cadastros da newsletter aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="hidden sm:grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Nome</span>
              <span>E-mail</span>
              <span>Data</span>
              <span />
            </div>

            <div className="divide-y divide-border">
              {(subscribers as any[]).map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1.5fr_auto_auto] gap-1 sm:gap-4 items-center px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-sm font-medium text-navy-900 truncate">
                    {s.name || <span className="text-muted-foreground italic text-xs">Não informado</span>}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <a href={`mailto:${s.email}`} className="hover:text-foreground transition-colors truncate">
                      {s.email}
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(s.created_at)}</p>
                  <button
                    onClick={() => setDeleteId(s.id)}
                    className="p-1.5 rounded-sm hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors justify-self-end"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover lead?</AlertDialogTitle>
            <AlertDialogDescription>O e-mail será removido da lista permanentemente.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-sm bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMut.mutate(deleteId!)}
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
