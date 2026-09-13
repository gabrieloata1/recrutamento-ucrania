# 🛡️ Recrutamento Internacional — Ucrânia & África do Sul

Landing Page institucional e tática para recrutamento e triagem de voluntários (Ucrânia e África do Sul).

---

## 🚀 Funcionalidades

- **Design Tático e Responsivo:** Visual militar moderno, alta performance, otimizado para dispositivos móveis (*mobile-first*).
- **Formulário Unificado e Direto:** Fluxo contínuo com validações em tempo real (idade de 18 a 50 anos, e-mail, telefone com DDI/DDD, cidadania e línguas).
- **Integração WhatsApp & Telegram:**
  - Redirecionamento automático com compilação formatada da ficha de inscrição para o WhatsApp do Recrutador (+380 96 950 1051).
  - Suporte ao Telegram (+48 796 977 298) com cópia rápida e links universais.
  - Orientação explícita para envio do passaporte diretamente no mensageiro.
- **Sistema Multilíngue (i18n):** Suporte em tempo real a 4 idiomas com persistência:
  - 🇧🇷 Português (PT)
  - 🇺🇸 English (EN)
  - 🇪🇸 Español (ES)
  - 🇺🇦 Українська (UK)
- **Galeria de Demonstração:** 4 módulos de treinamento militar operacional em vídeo MP4 de alta performance.

---

## 📁 Estrutura do Projeto

```text
├── index.html            # Estrutura semântica da Landing Page
├── style.css             # Estilização tática militar responsiva
├── script.js             # Lógica de validação, integração WhatsApp/Telegram e i18n
├── translations.js       # Dicionário de tradução para os 4 idiomas
├── logo.svg              # Logotipo oficial em vetor de alta resolução
├── logo_insignia.jpg     # Emblema em alta definição
├── VID-20260912-WA0020.mp4  # Vídeo Treinamento Módulo 01
├── VID-20260912-WA0021.mp4  # Vídeo Treinamento Módulo 02
├── VID-20260912-WA0022.mp4  # Vídeo Treinamento Módulo 03
├── VID-20260912-WA0023.mp4  # Vídeo Treinamento Módulo 04
└── README.md             # Documentação do projeto
```

---

## 🌐 Hospedagem no Netlify

Este é um site estático puro (*Vanilla HTML/CSS/JS*):
1. No painel do [Netlify](https://app.netlify.com/), selecione **Add new site** > **Import an existing project**.
2. Conecte com sua conta GitHub e selecione este repositório.
3. Configurações de Deploy:
   - **Build command:** *(deixe em branco)*
   - **Publish directory:** `./` ou `.` *(raiz do repositório)*
4. Clique em **Deploy site**.
