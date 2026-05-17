import { supabase } from "@/lib/supabase";

// Maps the "-field" ordering convention (from base44) to Supabase options
function parseOrder(order?: string): { column: string; ascending: boolean } {
  if (!order) return { column: "created_at", ascending: false };
  const descending = order.startsWith("-");
  const raw = descending ? order.slice(1) : order;
  // created_date → created_at
  const column = raw === "created_date" ? "created_at" : raw;
  return { column, ascending: !descending };
}

function makeEntity(table: string) {
  return {
    async list(order?: string, limit?: number) {
      const { column, ascending } = parseOrder(order);
      let query = supabase.from(table).select("*").order(column, { ascending });
      if (limit) query = query.limit(limit);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },

    async get(id: string) {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },

    async filter(filters: Record<string, unknown>) {
      const { data, error } = await supabase.from(table).select("*").match(filters);
      if (error) throw error;
      return data ?? [];
    },

    async create(payload: Record<string, unknown>) {
      const { data, error } = await supabase.from(table).insert(payload).select().single();
      if (error) throw error;
      return data;
    },

    async update(id: string, payload: Record<string, unknown>) {
      const { data, error } = await supabase.from(table).update(payload).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },

    async delete(id: string) {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
  };
}

export const base44 = {
  entities: {
    Property: makeEntity("properties"),
    Partner: makeEntity("partners"),
    Subscriber: makeEntity("subscribers"),
    Settings: {
      async get() {
        const { data } = await supabase.from("settings").select("*").limit(1).single();
        return data ?? {};
      },
      async update(id: string, payload: Record<string, unknown>) {
        const { data, error } = await supabase.from("settings").update(payload).eq("id", id).select().single();
        if (error) throw error;
        return data;
      },
    },
  },

  auth: {
    async getUser() {
      const { data } = await supabase.auth.getUser();
      return data.user ?? null;
    },

    async loginViaEmailPassword(email: string, password: string) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },

    loginWithProvider(provider: "google", redirectPath = "/") {
      supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      });
    },

    async register({ email, password }: { email: string; password: string }) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    },

    async verifyOtp({ email, otpCode }: { email: string; otpCode: string }) {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "signup",
      });
      if (error) throw error;
      return data.session ?? null;
    },

    // Supabase sets the session automatically after verifyOtp; no-op kept for compatibility
    setToken(_token: string) {},

    async resendOtp(email: string) {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
    },

    async resetPasswordRequest(email: string) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
    },

    async resetPassword({ newPassword }: { resetToken?: string; newPassword: string }) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },

    async logout(redirectPath = "/") {
      await supabase.auth.signOut();
      window.location.href = redirectPath;
    },
  },
};
