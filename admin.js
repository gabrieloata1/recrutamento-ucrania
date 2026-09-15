/**
 * ADMIN PANEL — admin.js
 * Recrutamento Oficial — Painel Administrativo
 * Idiomas: Português (PT) / Espanhol (ES)
 * Stack: Supabase Auth + Supabase DB + Supabase Storage
 *
 * ⚠️ CONFIGURAÇÃO OBRIGATÓRIA:
 *   1. Substitua SUPABASE_URL e SUPABASE_ANON_KEY pelas credenciais do seu projeto Supabase.
 *   2. Crie a tabela "candidaturas" e o bucket "documentos" conforme o README.
 */

// =========================================================================
// CONFIGURAÇÀO OO SUPABASE	// =========================================================================
const SUPABASE_URL = 'https://zmraktthccacdusrmdua.supabase.co';         // ← SUBSTITUIR
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcmFrdHRoY2NhY2R1c3JtZHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMDEwNjYsImV4cCI6MjA5MDY3NzA2Nn0.yyDSggN_tKdDARWxgoexQKPi4SBMj7uAQ3E4BZ-P7N8';                  // ← SUBSTITUIR
const DOCS_BUCKET = 'documentos';                                   // nome do bucket

const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =========================================================================
// TRADUÇÕES DO PAINEL (PT e ES)
// =========================================================================
const ADMIN_TRANSLATIONS = {
    pt: {
        loginTitle: 'PAINEL ADMINISTRATIVO',
        loginSubtitle: 'Recrutamento Oficial — Área Restrita',
        labelEmail: 'Usuário',
        placeholderUser: 'Ice ou seu e-mail',
        labelPassword: 'Senha',
        btnLoginText: 'Entrar no Painel',
        loginNote: 'Acesso exclusivo para administradores autorizados.',
        loginError: 'Usuário ou senha inválidos. Tente novamente.',
        loginErrorUnknown: 'Erro ao conectar. Verifique sua conexão com a internet.',
        adminBrand: 'PAINEL ADMIN',
        adminBrandSub: 'Recrutamento Oficial',
        logoutLabel: 'Sair',
        statLabelTotal: 'Total de Candidatos',
        statLabelNew: 'Novos (Últimas 24h)',
        statLabelDocs: 'Com Documentos',
        statLabelApproved: 'Aprovados',
        searchPlaceholder: 'Buscar por nome, email, telefone...',
        filterAll: 'Todos os Status',
        filterNovo: '🔡 Novo',
        filterAnalise: '🔆 Em Análise',
        filterAprovado: '<!-- raw emoji -->🔢 Aprovado',
        filterRejeitado: '🔔 Rejeitado',
        refreshLabel: 'Atualizar',
        exportLabel: 'Exportar CSV',
        loadingText: 'Carregando candidatos...',
        emptyText: 'Nenhum candidato encontrado.',
        thId: '#',
        thName: 'Nome',
        thCitizenship: 'Cidadania',
        thLang: 'Idioma',
        thAge: 'Idade',
        thContact: 'Contato',
        thDate: 'Data',
        thStatus: 'Status',
        thDocs: 'Docs',
        thActions: 'Ações',
        btnView: 'Ver Ficha',
        statusNovo: '🔡 Novo',
        statusEmAnalise: '🔆 Em Análise',
        statusAprovado: '<!-- raw emoji -->🔢 Aprovado',
        statusRejeitado: '🔔 Rejeitado',
        modalSecPersonal: '📋 Dados Pessoais',
        modalSecContact: '💡 Contato',
        modalSecMilitary: '🩦 Experiência Militar',
        modalSecStatus: '<!-- raw emoji -->⚙️ Status do Processo',
        modalSecNotes: '👝 Notas Internas',
        modalSecDocs: '🔁 Documentos Enviados',
        detLabelNome: 'Nome Completo',
        detLabelDOB: 'Data de Nascimento',
        detLabelCit: 'Cidadania',
        detLabelNativeLang: 'Língua Materna',
        detLabelOtherLang: 'Outro Idioma',
        detLabelArrival: 'Chegada Prevista',
        detLabelPhone: 'Telefone / Messenger',
        notesPlaceholder: 'Adicione observações sobre este candidato...',
        notesSaved: '✓ Notas salvas!',
        statusSaved: '✓ Salvo!',
        docsLoading: 'Carregando documentos...',
        noDocs: 'Nenhum documento enviado ainda.',
        btnDownload: '↯ Baixar',
        btnDelete: '👓D Deletar',
        uploadText: '🐮 Adicionar documento (PDF/Imagem)',
        uploadSuccess: 'Documento enviado com sucesso!',
        uploadError: 'Erro ao enviar documento.',
        btnClose: 'Fechar',
        confirmDelete: 'Deseja realmente excluir este documento?',
        ageYears: 'anos',
        noneInformed: 'Não informado',
        exportFilename: 'candidatos_recrutamento',
    },
    es: {
        loginTitle: 'PANEL ADMINISTRATIVO',
        loginSubtitle: 'Reclutamiento Oficial — Área Restringida',
        labelEmail: 'Usuario',
        placeholderUser: 'Ice o su correo',
        labelPassword: 'Contraseña',
        btnLoginText: 'Ingresar al Panel',
        loginNote: 'Acceso exclusivo para administradores autorizados.',
        loginError: 'Usuario o contraseña inválidos. Intente de nuevo.',
        loginErrorUnknown: 'Error de conexión. Verifique su conexión a internet.',
        adminBrand: 'PANEL ADMIN',
        adminBrandSub: 'Reclutamiento Oficial',
        logoutLabel: 'Salir',
        statLabelTotal: 'Total de Candidatos',
        statLabelNew: 'Nuevos (Últimas 24h)',
        statLabelDocs: 'Con Documentos',
        statLabelApproved: 'Aprobados',
        searchPlaceholder: 'Buscar por nombre, email, teléfono...',
        filterAll: 'Todos los Estados',
        filterNovo: '🔡 Nuevo',
        filterAnalise: '🔆 En Análisis',
        filterAprovado: '🔢 Aprobado',
        filterRejeitado: '🔔 Rechazado',
        refreshLabel: 'Actualizar',
        exportLabel: 'Exportar CSV',
        loadingText: 'Cargando candidatos...',
        emptyText: 'Ningun candidato encontrado.',
        thId: '#',
        thName: 'Nombre',
        thCitizenship: 'Ciudadanía',
        thLang: 'Idioma',
        thAge: 'Edad',
        thContact: 'Contacto',
        thDate: 'Fecha',
        thStatus: 'Estado',
        thDocs: 'Docs',
        thActions: 'Acciones',
        btnView: 'Ver Ficha',
        statusNovo: '🔡 Nuevo',
        statusEmAnalise: '🔆 En Análisis',
        statusAprovado: '🔢 Aprobado',
        statusRejeitado: '🔔 Rechazado',
        modalSecPersonal: '📋 Datos Personales',
        modalSecContact: '💡 Contacto',
        modalSecMilitary: '🩦 Experiencia Militar',
        modalSecStatus: '⚙️ Estado del Proceso',
        modalSecNotes: '👝 Notas Internas',
        modalSecDocs: '🔁 Documentos Enviados',
        detLabelNome: 'Nombre Completo',
        detLabelDOB: 'Fecha de Nacimiento',
        detLabelCit: 'Ciudadanía',
        detLabelNativeLang: 'Lengua Materna',
        detLabelOtherLang: 'Otro Idioma',
        detLabelArrival: 'Llegada Prevista',
        detLabelPhone: 'Teléfono / Mensajero',
        notesPlaceholder: 'Añadir observaciones sobre este candidato...',
        notesSaved: '✓ ¡Notas guardadas!',
        statusSaved: '⌓ ¡Guardado!',
        docsLoading: 'Cargando documentos...',
        noDocs: 'Ningún documento enviado aún.',
        btnDownload: '↷ Descargar',
        btnDelete: '👓D Eliminar',
        uploadText: '🐮 Agregar documento (PDF/Imagen)',
        uploadSuccess: '¡Documento enviado exitosamente!',
        uploadError: 'Error al enviar el documento.',
        btnClose: 'Cerrar',
        confirmDelete: '¿Desea eliminar este documento?',
        ageYears: 'años',
        noneInformed: 'No informado',
        exportFilename: 'candidatos_reclutamiento',
    }
};

// =========================================================================
// ESTADO GLOBAL
// =========================================================================
let currentLang = 'pt';
let allCandidates = [];
let filteredCandidates = [];
let currentCandidate = null;

// =========================================================================
// UTILITÁRIOS
// =========================================================================
function t(key) {
    return (ADMIN_TRANSLATIONS[currentLang] || ADMIN_TRANSLATIONS.pt)[key] || key;
}

function calculateAge(dob) {
    if (!dob) return '—';
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function formatDateShort(dateStr) {
    if (!dateStr) return '—';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dateStr;
}

function statusLabel(status) {
    const map = {
        novo: t('statusNovo'),
        em_analise: t('statusEmAnalise'),
        aprovado: t('statusAprovado'),
        rejeitado: t('statusRejeitado')
    };
    return map[status] || status;
}

function statusClass(status) {
    return `status-badge status-${status || 'novo'}`;
}

// =========================================================================
// IDIOMA DO PAINEL
// =========================================================================
function setAdminLang(lang) {
    currentLang = lang;
    localStorage.setItem('admin_lang', lang);
    applyTranslations();
    if (allCandidates.length > 0) renderTable(filteredCandidates);
}

function applyTranslations() {
    const lang = currentLang;

    // Botões de idioma
    document.querySelectorAll('.lang-btn-admin').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Login
    setText('loginTitle', t('loginTitle'));
    setText('loginSubtitle', t('loginSubtitle'));
    setText('labelEmail', t('labelEmail'));
    setAttr('loginEmail', 'placeholder', t('placeholderUser'));
    setText('labelPassword', t('labelPassword'));
    setText('btnLoginText', t('btnLoginText'));
    setText('loginNote', t('loginNote'));

    // Painel
    setText('adminBrand', t('adminBrand'));
    setText('adminBrandSub', t('adminBrandSub'));
    setText('logoutLabel', t('logoutLabel'));
    setText('statLabelTotal', t('statLabelTotal'));
    setText('statLabelNew', t('statLabelNew'));
    setText('statLabelDocs', t('statLabelDocs'));
    setText('statLabelApproved', t('statLabelApproved'));
    setAttr('searchInput', 'placeholder', t('searchPlaceholder'));
    setText('refreshLabel', t('refreshLabel'));
    setText('exportLabel', t('exportLabel'));
    setText('loadingText', t('loadingText'));
    setText('emptyText', t('emptyText'));

    // Cabeçalhos da tabela
    setText('thId', t('thId'));
    setText('thName', t('thName'));
    setText('thCitizenship', t('thCitizenship'));
    setText('thLang', t('thLang'));
    setText('thAge', t('thAge'));
    setText('thContact', t('thContact'));
    setText('thDate', t('thDate'));
    setText('thStatus', t('thStatus'));
    setText('thDocs', t('thDocs'));
    setText('thActions', t('thActions'));

    // Modal
    setText('modalSecPersonal', t('modalSecPersonal'));
    setText('modalSecContact', t('modalSecContact'));
    setText('modalSecMilitary', t('modalSecMilitary'));
    setText('modalSecStatus', t('modalSecStatus'));
    setText('modalSecNotes', t('modalSecNotes'));
    setText('modalSecDocs', t('modalSecDocs'));
    setText('detLabelNome', t('detLabelNome'));
    setText('detLabelDOB', t('detLabelDOB'));
    setText('detLabelCit', t('detLabelCit'));
    setText('detLabelNativeLang', t('detLabelNativeLang'));
    setText('detLabelOtherLang', t('detLabelOtherLang'));
    setText('detLabelArrival', t('detLabelArrival'));
    setText('detLabelPhone', t('detLabelPhone'));
    setAttr('adminNotes', 'placeholder', t('notesPlaceholder'));
    setText('btnClose', t('btnClose'));
    setText('uploadText', t('uploadText'));

    // Select de status no modal
    const statusSelect = document.getElementById('statusSelect');
    if (statusSelect) {
        const cur = statusSelect.value;
        statusSelect.innerHTML = `
            <option value="novo">${t('statusNovo')}</option>
            <option value="em_analise">${t('statusEmAnalise')}</option>
            <option value="aprovado">${t('statusAprovado')}</option>
            <option value="rejeitado">${t('statusRejeitado')}</option>
        `;
        statusSelect.value = cur;
    }

    // Select de filtro na toolbar
    const filterSelect = document.getElementById('statusFilter');
    if (filterSelect) {
        const cur = filterSelect.value;
        filterSelect.innerHTML = `
            <option value="">${t('filterAll')}</option>
            <option value="novo">${t('filterNovo')}</option>
            <option value="em_analise">${t('filterAnalise')}</option>
            <option value="aprovado">${t('filterAprovado')}</option>
            <option value="rejeitado">${t('filterRejeitado')}</option>
        `;
        filterSelect.value = cur;
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setAttr(id, attr, val) {
    const el = document.getElementById(id);
    if (el) el.setAttribute(attr, val);
}

// =========================================================================
// AUTH — LOGIN / LOGOUT
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Idioma salvo
    const savedLang = localStorage.getItem('admin_lang');
    if (savedLang && ADMIN_TRANSLATIONS[savedLang]) {
        currentLang = savedLang;
    }
    applyTranslations();

    // Verificar sessão existente
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showPanel(session.user);
    }

    // Login form
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const rawInput = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const btnText = document.getElementById('btnLoginText');
        const errEl = document.getElementById('loginError');

        errEl.classList.add('hidden');
        btnText.textContent = '...';

        // Suporte a login por usuário (ex: "Ice") ou e-mail
        let email = rawInput;
        if (!rawInput.includes('@')) {
            if (rawInput.toLowerCase() === 'ice') {
                email = 'ice@admin.com';
            } else {
                email = `${rawInput.toLowerCase()}@admin.com`;
            }
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            errEl.textContent = error.status === 400 ? t('loginError') : t('loginErrorUnknown');
            errEl.classList.remove('hidden');
            btnText.textContent = t('btnLoginText');
            return;
        }

        showPanel(data.user);
    });

    // Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            await supabase.auth.signOut();
            document.getElementById('adminPanel').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
        });
    }

    // Busca e Filtros
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', filterCandidates);

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', filterCandidates);

    const btnRefresh = document.getElementById('btnRefresh');
    if (btnRefresh) btnRefresh.addEventListener('click', loadCandidates);

    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', exportCSV);
});

function showPanel(user) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    const displayName = user.user_metadata?.username || (user.email === 'ice@admin.com' ? 'Ice' : user.email) || 'admin';
    document.getElementById('userEmailDisplay').textContent = displayName;
    loadCandidates();
}

// =========================================================================
// CARREGAR CANDIDATOS
// =========================================================================
async function loadCandidates() {
    showLoading(true);
    try {
        const { data, error } = await supabase
            .from('candidaturas')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allCandidates = data || [];
        filteredCandidates = [...allCandidates];
        updateStats(allCandidates);
        renderTable(filteredCandidates);
    } catch (err) {
        console.error('Erro ao carregar candidatos:', err);
        showLoading(false);
    }
}

// =========================================================================
// ESTATÍSTICAS
// =========================================================================
function updateStats(candidates) {
    const total = candidates.length;
    const now = new Date();
    const yesterday = new Date(now - 24 * 60 * 60 * 1000);
    const newToday = candidates.filter(c => new Date(c.created_at) > yesterday).length;
    const withDocs = candidates.filter(c => c.has_docs).length;
    const approved = candidates.filter(c => c.status === 'aprovado').length;

    setText('statTotal', total);
    setText('statNew', newToday);
    setText('statWithDocs', withDocs);
    setText('statApproved', approved);
}

// =========================================================================
// FILTRO E BUSCA
// =========================================================================
function filterCandidates() {
    const query = (document.getElementById('searchInput').value || '').toLowerCase().trim();
    const statusVal = document.getElementById('statusFilter').value;

    filteredCandidates = allCandidates.filter(c => {
        const matchSearch = !query ||
            `${c.nome} ${c.sobrenome} ${c.email} ${c.telefone}`.toLowerCase().includes(query);
        const matchStatus = !statusVal || (c.status || 'novo') === statusVal;
        return matchSearch && matchStatus;
    });

    renderTable(filteredCandidates);
}

// =========================================================================
// RENDERIZAR TABELA
// =========================================================================
function showLoading(show) {
    document.getElementById('tableLoading').classList.toggle('hidden', !show);
    document.getElementById('candidatesTable').classList.add('hidden');
    document.getElementById('tableEmpty').classList.add('hidden');
}

function renderTable(candidates) {
    document.getElementById('tableLoading').classList.add('hidden');

    if (!candidates || candidates.length === 0) {
        document.getElementById('tableEmpty').classList.remove('hidden');
        document.getElementById('candidatesTable').classList.add('hidden');
        return;
    }

    document.getElementById('tableEmpty').classList.add('hidden');
    document.getElementById('candidatesTable').classList.remove('hidden');

    const tbody = document.getElementById('candidatesBody');
    tbody.innerHTML = candidates.map((c, idx) => {
        const age = calculateAge(c.nascimento);
        const status = c.status || 'novo' ;
        const docsHtml = c.has_docs
            ? `<span class="docs-badge has-docs">📄 ${c.doc_count || '?'}</span>`
            : `<span class="docs-badge no-docs">—</span>`;

        return `<tr>
            <td style="color:var(--text-muted);font-size:0.78rem;">#${String(idx + 1).padStart(3, '0')}</td>
            <td>
                <div style="font-weight:600;">${escapeHtml(c.nome)} ${escapeHtml(c.sobrenome)}</div>
            </td>
            <td>${escapeHtml(c.cidadania || '—')}</td>
            <td>${escapeHtml(c.lingua_materna || '—')}</td>
            <td>${age !== '—' ? `${age} ${t('ageYears')}` : '—'}</td>
            <td>
                <div style="font-size:0.8rem;color:var(--text-secondary);">${escapeHtml(c.email || '—')}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);">${escapeHtml(c.telefone || '—')}</div>
            </td>
            <td style="font-size:0.8rem;color:var(--text-secondary);white-space:nowrap;">${formatDate(c.created_at)}</td>
            <td><span class="${statusClass(status)}">${statusLabel(status)}</span></td>
            <td>${docsHtml}</td>
            <td>
                <button class="btn-view" onclick="openCandidate('${c.id}')">${t('btnView')}</button>
            </td>
        </tr>`;
    }).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text || '');
    return div.innerHTML;
}

// =========================================================================
// ABRIR FICHA DO CANDIDATO
// =========================================================================
function openCandidate(id) {
    const candidate = allCandidates.find(c => c.id === id);
    if (!candidate) return;
    currentCandidate = candidate;

    // Cabeçalho do modal
    setText('modalCandidateName', `${candidate.nome} ${candidate.sobrenome}`);
    setText('modalCandidateId', `ID: ${candidate.id}`);

    // Dados pessoais
    setText('detNome', `${candidate.nome} ${candidate.sobrenome}`);
    setText('detDOB', candidate.nascimento ? `${formatDateShort(candidate.nascimento)} (${calculateAge(candidate.nascimento)} ${t('ageYears')})` : '—');
    setText('detCit', candidate.cidadania || t('noneInformed'));
    setText('detNativeLang', candidate.lingua_materna || t('noneInformed'));
    setText('detOtherLang', candidate.outra_lingua || t('noneInformed'));
    setText('detArrival', candidate.chegada_ucrania || t('noneInformed'));

    // Contato
    const emailEl = document.getElementById('detEmail');
    if (emailEl) emailEl.innerHTML = candidate.email
        ? `<a href="mailto:${escapeHtml(candidate.email)}" style="color:var(--accent);">${escapeHtml(candidate.email)}</a>`
        : '✔';
    setText('detPhone', candidate.telefone || t('noneInformed'));

    // Experiência militar
    setText('detMilitary', candidate.experiencia_militar || t('noneInformed'));

    // Status
    const statusSelect = document.getElementById('statusSelect');
    statusSelect.value = candidate.status || 'novo';
    document.getElementById('statusSavedMsg').classList.add('hidden');

    // Notas
    const notesEl = document.getElementById('adminNotes');
    notesEl.value = candidate.admin_notes || '';
    document.getElementById('notesSavedMsg').classList.add('hidden');

    // WhatsApp link
    const waBtn = document.getElementById('btnWhatsappCandidate');
    if (candidate.telefone) {
        const phone = candidate.telefone.replace(/\D/g, '');
        waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(`Olá ${candidate.nome}, seu processo de recrutamento...`)}`;
        waBtn.style.display = '';
    } else {
        waBtn.style.display = 'none';
    }

    // Documentos
    loadCandidateDocs(candidate.id);

    // Mostrar modal
    document.getElementById('candidateModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('candidateModal').classList.add('hidden');
    currentCandidate = null;
}

// Fechar ao clicar fora
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('candidateModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('candidateModal')) closeModal();
    });
});

// =========================================================================
// ATUALIZAR STATUS
// =========================================================================
async function updateCandidateStatus() {
    if (!currentCandidate) return;
    const newStatus = document.getElementById('statusSelect').value;
    const savedMsg = document.getElementById('statusSavedMsg');

    const { error } = await supabase
        .from('candidaturas')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', currentCandidate.id);

    if (!error) {
        currentCandidate.status = newStatus;
        // Atualizar no array local
        const idx = allCandidates.findIndex(c => c.id === currentCandidate.id);
        if (idx !== -1) allCandidates[idx].status = newStatus;
        renderTable(filteredCandidates);
        updateStats(allCandidates);

        savedMsg.textContent = t('statusSaved');
        savedMsg.classList.remove('hidden');
        setTimeout(() => savedMsg.classList.add('hidden'), 2000);
    }
}

// =========================================================================
// SALVAR NOTAS
// =========================================================================
async function saveNotes() {
    if (!currentCandidate) return;
    const notes = document.getElementById('adminNotes').value;
    const savedMsg = document.getElementById('notesSavedMsg');

    const { error } = await supabase
        .from('candidaturas')
        .update({ admin_notes: notes, updated_at: new Date().toISOString() })
        .eq('id', currentCandidate.id);

    if (!error) {
        currentCandidate.admin_notes = notes;
        savedMsg.textContent = t('notesSaved');
        savedMsg.classList.remove('hidden');
        setTimeout(() => savedMsg.classList.add('hidden'), 2500);
    }
}

// =========================================================================
// DOCUMENTOS — LISTAR, BAIXAR, DELETAR, UPLOAD
// =========================================================================
async function loadCandidateDocs(candidateId) {
    const container = document.getElementById('docsContainer');
    container.innerHTML = `<div class="docs-loading">${t('docsLoading')}</div>`;

    const { data: files, error } = await supabase.storage
        .from(DOCS_BUCKET)
        .list(`candidatos/${candidateId}`, { limit: 50, offset: 0 });

    if (error || !files || files.length === 0) {
        container.innerHTML = `<p class="no-docs-msg">${t('noDocs')}</p>`;
        return;
    }

    container.innerHTML = files.map(file => `
        <div class="doc-item" id="doc-${file.name}">
            <span class="doc-name">📄 ${escapeHtml(file.name)}</span>
            <div class="doc-actions">
                <a class="btn-doc-dl" href="#" onclick="downloadDoc('${candidateId}', '${file.name}'); return false;">${t('btnDownload')}</a>
                <button class="btn-doc-del" onclick="deleteDoc('${candidateId}', '${file.name}')">${t('btnDelete')}</button>
            </div>
        </div>
    `).join('');

    // Atualizar contagem no candidato
    const idx = allCandidates.findIndex(c => c.id === candidateId);
    if (idx !== -1) {
        allCandidates[idx].has_docs = files.length > 0;
        allCandidates[idx].doc_count = files.length;
    }
}

async function downloadDoc(candidateId, fileName) {
    const { data, error } = await supabase.storage
        .from(DOCS_BUCKET)
        .createSignedUrl(`candidatos/${candidateId}/${fileName}`, 60);

    if (error || !data) { alert('Erro ao gerar link de download.'); return; }
    window.open(data.signedUrl, '_blank');
}

async function deleteDoc(candidateId, fileName) {
    if (!confirm(t('confirmDelete'))) return;

    const { error } = await supabase.storage
        .from(DOCS_BUCKET)
        .remove([`candidatos/${candidateId}/${fileName}`]);

    if (error) { alert('Erro ao excluir documento.'); return; }
    document.getElementById(`doc-${fileName}`)?.remove();

    const container = document.getElementById('docsContainer');
    if (container.children.length === 0) {
        container.innerHTML = `<p class="no-docs-msg">${t('noDocs')}</p>`;
    }
}

async function uploadDocs(event) {
    if (!currentCandidate) return;
    const files = event.target.files;
    if (!files || files.length === 0) return;

    for (const file of files) {
        const path = `candidatos/${currentCandidate.id}/${Date.now()}_${file.name}`;
        const { error } = await supabase.storage
            .from(DOCS_BUCKET)
            .upload(path, file, { cacheControl: '3600', upsert: false });

        if (error) {
            alert(`${t('uploadError')}: ${file.name}`);
        }
    }

    // Atualizar flag no registro
    await supabase
        .from('candidaturas')
        .update({ has_docs: true })
        .eq('id', currentCandidate.id);

    // Recarregar lista de docs
    loadCandidateDocs(currentCandidate.id);
    event.target.value = '';
}

// =========================================================================
// EXPORTAR CSV
// =========================================================================
function exportCSV() {
    if (filteredCandidates.length === 0) return;

    const headers = ['Nome', 'Sobrenome', 'Nascimento', 'Cidadania', 'Lingua Materna',
        'Outro Idioma', 'Email', 'Telefone', 'Chegada', 'Experiencia Militar', 'Status', 'Data Cadastro'];

    const rows = filteredCandidates.map(c => [
        c.nome, c.sobrenome, c.nascimento, c.cidadania, c.lingua_materna,
        c.outra_lingua, c.email, c.telefone, c.chegada_ucrania,
        (c.experiencia_militar || '').replace(/\n/g, ' '),
        c.status || 'novo',
        c.created_at
    ].map(v => `"${(v || '').replace(/"/g, '""')}"`));

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${t('exportFilename')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}
