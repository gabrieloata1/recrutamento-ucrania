-- ============================================================
-- SUPABASE SETUP — Recrutamento Oficial
-- Execute este script no SQL Editor do seu projeto Supabase
-- ============================================================

-- 1. TABELA DE CANDIDATURAS
CREATE TABLE IF NOT EXISTS public.candidaturas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Dados pessoais
    nome TEXT NOT NULL,
    sobrenome TEXT NOT NULL,
    nascimento DATE NOT NULL,
    cidadania TEXT,
    lingua_materna TEXT,
    outra_lingua TEXT,

    -- Contato
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,

    -- Informações adicionais
    chegada_ucrania TEXT,
    experiencia_militar TEXT,

    -- Administração (preenchido pelo admin no painel)
    status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'em_analise', 'aprovado', 'rejeitado')),
    admin_notes TEXT,
    has_docs BOOLEAN DEFAULT FALSE,
    doc_count INTEGER DEFAULT 0,

    -- Protocolo único gerado
    protocolo TEXT
);

-- 2. ÍNDICES PARA BUSCA RÁPIDA
CREATE INDEX IF NOT EXISTS idx_candidaturas_email ON public.candidaturas(email);
CREATE INDEX IF NOT EXISTS idx_candidaturas_status ON public.candidaturas(status);
CREATE INDEX IF NOT EXISTS idx_candidaturas_created_at ON public.candidaturas(created_at DESC);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;

-- Política: qualquer pessoa pode INSERIR (formulário público do site)
DROP POLICY IF EXISTS "Inserção pública de candidaturas" ON public.candidaturas;
CREATE POLICY "Inserção pública de candidaturas"
    ON public.candidaturas
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Política: somente usuários autenticados (admin) podem LER
DROP POLICY IF EXISTS "Leitura somente para admin autenticado" ON public.candidaturas;
CREATE POLICY "Leitura somente para admin autenticado"
    ON public.candidaturas
    FOR SELECT
    TO authenticated
    USING (true);

-- Política: somente usuários autenticados podem ATUALIZAR (status, notas)
DROP POLICY IF EXISTS "Atualização somente para admin autenticado" ON public.candidaturas;
CREATE POLICY "Atualização somente para admin autenticado"
    ON public.candidaturas
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 4. BUCKET DE DOCUMENTOS (Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', false)
ON CONFLICT (id) DO NOTHING;

-- Política Storage: qualquer pessoa pode fazer upload (candidatos enviando docs)
DROP POLICY IF EXISTS "Upload público de documentos" ON storage.objects;
CREATE POLICY "Upload público de documentos"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'documentos');

-- Política Storage: somente admin autenticado pode ler/baixar documentos
DROP POLICY IF EXISTS "Leitura de documentos somente para admin" ON storage.objects;
CREATE POLICY "Leitura de documentos somente para admin"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (bucket_id = 'documentos');

-- Política Storage: somente admin autenticado pode deletar documentos
DROP POLICY IF EXISTS "Exclusão de documentos somente para admin" ON storage.objects;
CREATE POLICY "Exclusão de documentos somente para admin"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'documentos');

-- 5. TRIGGER: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_candidaturas_updated_at ON public.candidaturas;
CREATE TRIGGER update_candidaturas_updated_at
    BEFORE UPDATE ON public.candidaturas
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- 6. TRIGGER: gerar protocolo caso não enviado pelo cliente
CREATE OR REPLACE FUNCTION set_candidatura_protocolo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.protocolo IS NULL OR NEW.protocolo = '' THEN
        NEW.protocolo := 'REC-' || TO_CHAR(COALESCE(NEW.created_at, NOW()), 'YYYY') || '-' || LPAD(((EXTRACT(EPOCH FROM COALESCE(NEW.created_at, NOW()))::BIGINT % 100000))::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_candidaturas_protocolo ON public.candidaturas;
CREATE TRIGGER set_candidaturas_protocolo
    BEFORE INSERT ON public.candidaturas
    FOR EACH ROW
    EXECUTE PROCEDURE set_candidatura_protocolo();
