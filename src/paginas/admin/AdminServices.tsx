import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "./Dashboard";
import ImageUpload from "@/componentes/ui/ImageUpload";
import { Button } from "@/componentes/ui/button";
import { Save, Check } from "lucide-react";

export default function AdminServices() {
  const qc = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("settings").select("*").single();
      if (error) throw error;
      return data ?? {};
    },
  });

  useEffect(() => {
    if (settings) setImageUrl(settings.services_image_url ?? "");
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!settings?.id) throw new Error("Configurações não encontradas.");
      const { data, error } = await supabase
        .from("settings")
        .update({ services_image_url: imageUrl })
        .eq("id", settings.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-900 tracking-tight font-sans normal-case">
            Nossos Serviços
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Imagem exibida na seção "Nossos Serviços Imobiliários" da página inicial
          </p>
        </div>
      </div>

      <div className="bg-white border border-border shadow-sm rounded-sm max-w-3xl">
        <div className="px-6 py-5 border-b border-border">
          <p className="text-sm font-semibold text-navy-900 font-sans normal-case">
            Foto da Seção
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Use uma foto horizontal. Ela aparece entre os Diferenciais e os Parceiros.
          </p>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="skeleton h-52 rounded-sm" />
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <ImageUpload value={imageUrl} onChange={setImageUrl} />

            <Button
              className="gap-2 rounded-sm"
              onClick={() => saveMut.mutate()}
              disabled={saveMut.isPending || !settings?.id}
            >
              {saved ? (
                <><Check className="w-4 h-4" /> Salvo!</>
              ) : (
                <><Save className="w-4 h-4" />{saveMut.isPending ? "Salvando…" : "Salvar imagem"}</>
              )}
            </Button>

            {saveMut.isError && (
              <p className="text-xs text-red-500">Erro ao salvar. Verifique sua conexão.</p>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
