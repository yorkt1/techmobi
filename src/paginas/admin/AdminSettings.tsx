import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import { Input } from "@/componentes/ui/input";
import { Button } from "@/componentes/ui/button";
import { Save, Check } from "lucide-react";

export default function AdminSettings() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => base44.entities.Settings.get(),
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name ?? "",
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
      });
    }
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () => base44.entities.Settings.update(settings.id, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">
            Configurações
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Dados de contato exibidos no site para os visitantes
          </p>
        </div>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm max-w-xl">
        <div className="px-6 py-5 border-b border-border">
          <p className="text-sm font-semibold text-navy-900 font-sans normal-case">
            Informações de Contato
          </p>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Nome da empresa
              </label>
              <Input
                value={form.company_name}
                onChange={set("company_name")}
                placeholder="Wagner Kaizer Consultoria Imobiliária"
                className="rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                WhatsApp / Telefone
              </label>
              <Input
                value={form.phone}
                onChange={set("phone")}
                placeholder="554891932966"
                className="rounded-sm"
              />
              <p className="text-xs text-muted-foreground/70 mt-1">
                Formato internacional sem espaços ou caracteres: 554891932966
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                E-mail
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="contato@wagnerkaizer.com.br"
                className="rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                Endereço
              </label>
              <Input
                value={form.address}
                onChange={set("address")}
                placeholder="Florianópolis, SC"
                className="rounded-sm"
              />
            </div>

            <div className="pt-2">
              <Button
                className="gap-2 rounded-sm"
                onClick={() => saveMut.mutate()}
                disabled={saveMut.isPending || !settings?.id}
              >
                {saved ? (
                  <>
                    <Check className="w-4 h-4" /> Salvo!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {saveMut.isPending ? "Salvando…" : "Salvar configurações"}
                  </>
                )}
              </Button>
              {saveMut.isError && (
                <p className="text-xs text-red-500 mt-2">
                  Erro ao salvar. Verifique sua conexão.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
