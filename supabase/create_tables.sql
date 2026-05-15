-- ============================================================
-- TechMobi - Criação das tabelas no Supabase
-- Execute este SQL no SQL Editor do painel do Supabase
-- ============================================================

-- Tabela de imóveis
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  type        TEXT        NOT NULL CHECK (type IN ('apartamento', 'casa', 'terreno', 'comercial', 'cobertura', 'kitnet')),
  transaction TEXT        NOT NULL CHECK (transaction IN ('venda', 'aluguel')),
  price       NUMERIC     NOT NULL,
  neighborhood TEXT,
  city        TEXT        NOT NULL,
  bedrooms    INTEGER,
  bathrooms   INTEGER,
  garages     INTEGER,
  area        NUMERIC,
  description TEXT,
  image_url   TEXT,
  featured    BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabela de parceiros
CREATE TABLE IF NOT EXISTS partners (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  category    TEXT        CHECK (category IN ('financiamento', 'construtora', 'cartorio', 'advocacia', 'outros')),
  description TEXT,
  active      BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabela de configurações (linha única)
CREATE TABLE IF NOT EXISTS settings (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  phone        TEXT,
  email        TEXT,
  address      TEXT,
  logo_url     TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO settings (company_name) VALUES ('TechMobi') ON CONFLICT DO NOTHING;

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners   ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

-- Leitura pública (visitantes podem ver imóveis e parceiros)
CREATE POLICY "Leitura pública - properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Leitura pública - partners"   ON partners   FOR SELECT USING (true);
CREATE POLICY "Leitura pública - settings"   ON settings   FOR SELECT USING (true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "Admin write - properties" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write - partners"   ON partners   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write - settings"   ON settings   FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Trigger para atualizar updated_at automaticamente
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
