-- ============================================================
-- TechMobi - Criação das tabelas no Supabase
-- Execute este SQL no SQL Editor do painel do Supabase
-- ============================================================

-- ============================================================
-- MIGRAÇÃO: execute no SQL Editor do Supabase se as tabelas
-- já existirem (apenas adiciona colunas novas)
-- ============================================================
-- ALTER TABLE properties ADD COLUMN IF NOT EXISTS code TEXT;
-- ALTER TABLE properties ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
-- ALTER TABLE news ADD COLUMN IF NOT EXISTS content TEXT;
-- ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
--
-- Se a tabela subscribers já existir, adicione as colunas:
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS phone TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS cpf TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS tipo_imovel TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS objetivo TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS localizacao TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS quartos TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS vagas TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS area TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS faixa TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS pagamento TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS urgencia TEXT;
-- ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS observacoes TEXT;
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
  code        TEXT,
  image_url   TEXT,
  images      TEXT[]      DEFAULT '{}',
  featured    BOOLEAN     DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Tabela de leads / pretensão de compra
CREATE TABLE IF NOT EXISTS subscribers (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT,
  phone       TEXT,
  cpf         TEXT,
  tipo_imovel TEXT,
  objetivo    TEXT,
  localizacao TEXT,
  quartos     TEXT,
  vagas       TEXT,
  area        TEXT,
  faixa       TEXT,
  pagamento   TEXT,
  urgencia    TEXT,
  observacoes TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Inserção pública - subscribers" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura admin - subscribers"    ON subscribers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Deleção admin - subscribers"    ON subscribers FOR DELETE USING (auth.role() = 'authenticated');

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

-- Tabela de notícias em destaque
CREATE TABLE IF NOT EXISTS news (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  slug         TEXT        UNIQUE,
  image_url    TEXT,
  display_date TEXT,
  featured     BOOLEAN     DEFAULT true,
  active       BOOLEAN     DEFAULT true,
  order_index  INTEGER     DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Tabela de configurações (linha única)
CREATE TABLE IF NOT EXISTS settings (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  phone        TEXT,
  email        TEXT,
  address      TEXT,
  logo_url     TEXT,
  hero_image_url TEXT,
  hero_image_mobile_url TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Caso a tabela settings já exista, garante as colunas da capa (imagem do topo da home)
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_image_mobile_url TEXT;

-- Inserir configuração padrão
INSERT INTO settings (company_name, phone) VALUES ('Wagner Kaizer Consultoria Imobiliária', '554891932966') ON CONFLICT DO NOTHING;

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
CREATE POLICY "Leitura pública - news"       ON news       FOR SELECT USING (true);

-- Escrita apenas para usuários autenticados (admin)
CREATE POLICY "Admin write - properties" ON properties FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write - partners"   ON partners   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write - settings"   ON settings   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin write - news"        ON news        FOR ALL USING (auth.role() = 'authenticated');

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

CREATE TRIGGER trg_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
