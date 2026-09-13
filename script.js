/**
 * Recrutamento Oficial - Ucrânia & África do Sul
 * Script de Internacionalização (i18n), Validação e Formatação para WhatsApp / Telegram
 */

document.addEventListener('DOMContentLoaded', () => {
    const translations = (typeof TRANSLATIONS !== 'undefined') ? TRANSLATIONS : {};

    // Elementos do Formulário
    const form = document.getElementById('recrutamentoForm');
    const nomeInput = document.getElementById('nome');
    const sobrenomeInput = document.getElementById('sobrenome');
    const nascimentoInput = document.getElementById('nascimento');
    const cidadaniaInput = document.getElementById('cidadania');
    const linguaMaternaInput = document.getElementById('linguaMaterna');
    const outraLinguaInput = document.getElementById('outraLingua');
    const emailInput = document.getElementById('email');
    const telefoneInput = document.getElementById('telefone');
    const experienciaInput = document.getElementById('experienciaMilitar');
    const chegadaInput = document.getElementById('chegadaUcrania');

    // Elementos do Modal
    const modal = document.getElementById('confirmModal');
    const modalFilesSummary = document.getElementById('modalFilesSummary');
    const btnRedirectWa = document.getElementById('btnRedirectWa');
    const btnRedirectTg = document.getElementById('btnRedirectTg');
    const btnCopyTgPhone = document.getElementById('btnCopyTgPhone');
    const btnCopyText = document.getElementById('btnCopyText');
    const btnCloseModal = document.getElementById('btnCloseModal');

    // Configuração Centralizada de Contatos do Recrutador
    const RECRUITER_CONFIG = {
        whatsappNumber: '380969501051',
        telegramPhone: '+48796977298',
        telegramUsername: '', // Se o recrutador definir um @username (ex: 'recrutador_oficial'), defina aqui
        getTelegramUrl(draftText = '') {
            const query = draftText ? `?text=${encodeURIComponent(draftText)}` : '';
            if (this.telegramUsername) {
                const user = this.telegramUsername.replace('@', '').trim();
                return `https://t.me/${user}${query}`;
            }
            return `https://t.me/${this.telegramPhone}${query}`;
        }
    };

    // Atualizar links dinâmicos do cabeçalho e rodapé
    const headerTgBtn = document.getElementById('headerTelegramBtn');
    const footerTgLink = document.getElementById('footerTelegramLink');
    if (headerTgBtn) headerTgBtn.href = RECRUITER_CONFIG.getTelegramUrl();
    if (footerTgLink) footerTgLink.href = RECRUITER_CONFIG.getTelegramUrl();

    // Variáveis para armazenar o link e texto final
    let generatedWaUrl = '';
    let generatedTgUrl = '';
    let generatedMessageText = '';

    // Idioma atual (persistido via localStorage ou padrão 'pt')
    let currentLang = 'pt';
    try {
        const savedLang = localStorage.getItem('recrutador_lang');
        if (savedLang && translations[savedLang]) {
            currentLang = savedLang;
        }
    } catch (e) {
        currentLang = 'pt';
    }

    // =========================================================================
    // FUNÇÕES AUXILIARES
    // =========================================================================

    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }

    function formatDateBR(dateString) {
        if (!dateString) return '';
        const parts = dateString.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateString;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // =========================================================================
    // SISTEMA DE INTERNACIONALIZAÇÃO (i18n)
    // =========================================================================

    function updateSelectOptions(selectId, optionsArray, placeholderKey) {
        const select = document.getElementById(selectId);
        if (!select || !optionsArray) return;
        const currentValue = select.value;
        const t = translations[currentLang] || translations.pt;
        const placeholderText = t[placeholderKey] || 'Selecione...';

        let html = `<option value="">${escapeHtml(placeholderText)}</option>`;
        optionsArray.forEach(opt => {
            const isSelected = opt.value === currentValue ? 'selected' : '';
            html += `<option value="${escapeHtml(opt.value)}" ${isSelected}>${escapeHtml(opt.text)}</option>`;
        });
        select.innerHTML = html;
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;

        try {
            localStorage.setItem('recrutador_lang', lang);
        } catch (e) {
            // Suprime erro caso cookies/localStorage estejam bloqueados
        }

        const t = translations[lang];

        // Atualizar atributo de idioma do documento
        document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;

        // Atualizar título da página e meta tag de descrição
        if (t.meta_title) document.title = t.meta_title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.meta_desc) metaDesc.setAttribute('content', t.meta_desc);

        // Atualizar todos os elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.innerHTML = t[key];
            }
        });

        // Atualizar placeholders com data-i18n-ph
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (t[key]) {
                el.setAttribute('placeholder', t[key]);
            }
        });

        // Atualizar titles com data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (t[key]) {
                el.setAttribute('title', t[key]);
            }
        });

        // Atualizar opções dos selects
        updateSelectOptions('cidadania', t.citizenship_options, 'ph_citizenship');
        updateSelectOptions('linguaMaterna', t.native_lang_options, 'ph_native_lang');

        // Atualizar botões do seletor de idiomas
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Atualizar mensagem predefinida do botão do WhatsApp na Hero
        const heroWaBtn = document.getElementById('heroWaBtn');
        if (heroWaBtn && t.hero_wa_msg) {
            heroWaBtn.href = `https://wa.me/380969501051?text=${encodeURIComponent(t.hero_wa_msg)}`;
        }
    }

    // Configurar ouvintes de evento nos botões de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetLang = btn.getAttribute('data-lang');
            if (targetLang && targetLang !== currentLang) {
                setLanguage(targetLang);
            }
        });
    });

    // Inicializar idioma na montagem
    setLanguage(currentLang);

    // =========================================================================
    // VALIDAÇÃO E ENVIO DO FORMULÁRIO
    // =========================================================================

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const t = translations[currentLang] || translations.pt;
        let isValid = true;

        // Limpar estados de erro prévios
        document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));
        document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => el.classList.remove('invalid'));

        // 1. Nome próprio
        if (!nomeInput.value.trim()) {
            const err = document.getElementById('err-nome');
            err.textContent = t.err_first_name;
            err.classList.add('visible');
            nomeInput.classList.add('invalid');
            isValid = false;
        }

        // 2. Sobrenome
        if (!sobrenomeInput.value.trim()) {
            const err = document.getElementById('err-sobrenome');
            err.textContent = t.err_last_name;
            err.classList.add('visible');
            sobrenomeInput.classList.add('invalid');
            isValid = false;
        }

        // 3. Data de Nascimento e Idade (18 a 50 anos)
        if (!nascimentoInput.value) {
            const errNasc = document.getElementById('err-nascimento');
            errNasc.textContent = t.err_dob_req;
            errNasc.classList.add('visible');
            nascimentoInput.classList.add('invalid');
            isValid = false;
        } else {
            const age = calculateAge(nascimentoInput.value);
            if (age < 18 || age > 50) {
                const errNasc = document.getElementById('err-nascimento');
                errNasc.textContent = t.err_dob_range.replace('{age}', age);
                errNasc.classList.add('visible');
                nascimentoInput.classList.add('invalid');
                isValid = false;
            }
        }

        // 4. Cidadania
        if (!cidadaniaInput.value) {
            const err = document.getElementById('err-cidadania');
            err.textContent = t.err_citizenship;
            err.classList.add('visible');
            cidadaniaInput.classList.add('invalid');
            isValid = false;
        }

        // 5. Língua materna
        if (!linguaMaternaInput.value) {
            const err = document.getElementById('err-linguaMaterna');
            err.textContent = t.err_native_lang;
            err.classList.add('visible');
            linguaMaternaInput.classList.add('invalid');
            isValid = false;
        }

        // 6. E-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
            const err = document.getElementById('err-email');
            err.textContent = t.err_email;
            err.classList.add('visible');
            emailInput.classList.add('invalid');
            isValid = false;
        }

        // 7. Mensageiro ativo (Telegram ou WhatsApp)
        const cleanPhone = telefoneInput.value.replace(/\D/g, '');
        if (!cleanPhone || cleanPhone.length < 10) {
            const err = document.getElementById('err-telefone');
            err.textContent = t.err_phone;
            err.classList.add('visible');
            telefoneInput.classList.add('invalid');
            isValid = false;
        }

        if (!isValid) {
            const firstError = document.querySelector('.error-msg.visible');
            if (firstError) {
                firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // =====================================================================
        // COMPILAÇÃO DA MENSAGEM OFICIAL DO WHATSAPP
        // =====================================================================
        const age = calculateAge(nascimentoInput.value);
        const selectedCidadaniaText = cidadaniaInput.options[cidadaniaInput.selectedIndex] ? cidadaniaInput.options[cidadaniaInput.selectedIndex].text : cidadaniaInput.value;
        const selectedLinguaText = linguaMaternaInput.options[linguaMaternaInput.selectedIndex] ? linguaMaternaInput.options[linguaMaternaInput.selectedIndex].text : linguaMaternaInput.value;

        const msgLines = [
            t.wa_header,
            '----------------------------------------',
            t.wa_sec_personal,
            `• *${t.wa_first_name}:* ${nomeInput.value.trim()}`,
            `• *${t.wa_last_name}:* ${sobrenomeInput.value.trim()}`,
            `• *${t.wa_dob}:* ${formatDateBR(nascimentoInput.value)} (${age} ${t.wa_years})`,
            `• *${t.wa_citizenship}:* ${selectedCidadaniaText}`,
            `• *${t.wa_native_lang}:* ${selectedLinguaText}`,
            `• *${t.wa_other_lang}:* ${outraLinguaInput.value.trim() || t.wa_none_informed}`,
            '',
            t.wa_sec_docs,
            t.wa_doc_item,
            '',
            t.wa_sec_contact,
            `• *${t.wa_email}:* ${emailInput.value.trim()}`,
            `• *${t.wa_messenger}:* +${cleanPhone}`,
            `• *${t.wa_military}:* ${experienciaInput.value.trim() || t.wa_military_none}`,
            `• *${t.wa_arrival}:* ${chegadaInput.value.trim() || t.wa_arrival_default}`,
            '----------------------------------------',
            t.wa_source
        ];

        generatedMessageText = msgLines.join('\n');
        const encodedMsg = encodeURIComponent(generatedMessageText);
        // URLs parametrizadas via RECRUITER_CONFIG
        generatedWaUrl = `https://api.whatsapp.com/send?phone=${RECRUITER_CONFIG.whatsappNumber}&text=${encodedMsg}`;
        generatedTgUrl = RECRUITER_CONFIG.getTelegramUrl(generatedMessageText);

        // Atualizar resumo do modal
        modalFilesSummary.innerHTML = `
            <div><strong>${t.modal_summary_candidate}:</strong> ${escapeHtml(nomeInput.value.trim())} ${escapeHtml(sobrenomeInput.value.trim())} (${age} ${t.wa_years})</div>
            <div><strong>${t.modal_summary_cit_lang}:</strong> ${escapeHtml(selectedCidadaniaText)} / ${escapeHtml(selectedLinguaText)}</div>
            <div><strong>${t.modal_summary_passport}:</strong> ${t.modal_summary_passport_text}</div>
            <div><strong>${t.modal_summary_phone}:</strong> +${cleanPhone}</div>
        `;

        // Exibir modal
        modal.classList.add('active');
    });

    // Ação do botão do WhatsApp no Modal
    btnRedirectWa.addEventListener('click', () => {
        window.open(generatedWaUrl, '_blank', 'noopener,noreferrer');
    });

    // Ação do botão do Telegram no Modal
    if (btnRedirectTg) {
        btnRedirectTg.addEventListener('click', () => {
            window.open(generatedTgUrl, '_blank', 'noopener,noreferrer');
        });
    }

    // Copiar Número do Telegram
    if (btnCopyTgPhone) {
        btnCopyTgPhone.addEventListener('click', () => {
            const t = translations[currentLang] || translations.pt;
            navigator.clipboard.writeText(RECRUITER_CONFIG.telegramPhone).then(() => {
                btnCopyTgPhone.textContent = t.modal_btn_copy_tg_success || '✓ Número do Telegram Copiado!';
                setTimeout(() => {
                    btnCopyTgPhone.textContent = t.modal_btn_copy_tg || '📋 Copiar Número do Telegram (+48 796 977 298)';
                }, 2500);
            }).catch(() => {
                prompt('Número oficial do Telegram:', RECRUITER_CONFIG.telegramPhone);
            });
        });
    }

    // Copiar Texto para a Área de Transferência
    btnCopyText.addEventListener('click', () => {
        const t = translations[currentLang] || translations.pt;
        navigator.clipboard.writeText(generatedMessageText).then(() => {
            btnCopyText.textContent = t.modal_btn_copy_success;
            setTimeout(() => {
                btnCopyText.textContent = t.modal_btn_copy;
            }, 2500);
        }).catch(() => {
            alert('Não foi possível copiar automaticamente. Você pode abrir o WhatsApp diretamente.');
        });
    });

    // Fechar Modal
    btnCloseModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // Fechar ao clicar fora da caixa do modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});
