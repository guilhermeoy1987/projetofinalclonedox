# 🚀 Social Profile & E-commerce Platform (Frontend & UI)

Este projeto foi desenvolvido como parte da minha transição de carreira para a área de tecnologia e conclusão do curso Full Stack Python na EBAC. O objetivo principal foi recriar uma interface moderna, componentizada e altamente responsiva inspirada na experiência de usuário de redes sociais (como o X/Twitter), integrando gestão de perfil, rotas dinâmicas e componentes customizados em React.

---

## 🛠️ O que foi feito (Funcionalidades & Arquitetura)

### 1. Sistema de Gestão de Perfil Interativo

- **Modal de Configuração Guiada (Step-by-Step):** Desenvolvido um fluxo em etapas (passos de 1 a 4) para customização completa do perfil do usuário.
- **Upload e Preview de Mídia:** Funcionalidade para seleção e pré-visualização instantânea de imagem de perfil (Avatar) e Banner de cabeçalho utilizando URLs locais (`URL.createObjectURL`).
- **Campos Dinâmicos com Validação:** Inputs controlados para edição de biografia (com contador de caracteres em tempo real e limite de 160 caracteres) e localização geográfica.

### 2. Componentização Avançada & Estilização (CSS Moderno)

- **Design System Fiel à Interface Real:** Ajustes refinados de UI/UX, incluindo botões interativos no padrão "pílula" (`border-radius: 9999px`), alinhamentos via **Flexbox** e estados de _hover_ fluidos.
- **Layout Responsivo e Limpo:** Estruturação de componentes utilizando boas práticas de organização em CSS puro, evitando redundâncias e garantindo alta performance de renderização.
- **Componente Dinâmico de Ação:** Lógica condicional inteligente no botão de perfil — alternando automaticamente entre _"Set up profile"_ (para novos usuários) e _"Edit profile"_ (para perfis já configurados).

---

## 💻 Tecnologias Utilizadas

- **React.js (JSX):** Construção baseada em componentes reutilizáveis e gerenciamento de estados locais (`useState`).
- **CSS3 (Flexbox & Layouts Modernos):** Estilização customizada focada em fidelidade visual, padronização de fontes, espaçamentos e responsividade.
- **JavaScript (ES6+):** Manipulação de eventos, tratamento de arquivos de imagem e lógica de navegação por etapas.

---

## 🎯 Proposta de Valor (Para Seletivas & Entrevistas)

- **Atenção aos Detalhes de UI/UX:** Capacidade de traduzir interfaces complexas do mundo real em código limpo, componentizado e funcional.
- **Foco na Experiência do Usuário (UX):** Implementação de fluxos intuitivos de onboarding (como o assistente de configuração de perfil) que elevam a retenção e usabilidade da aplicação.
- **Código Limpo e Escalável:** Organização modular do CSS e separação clara de responsabilidades entre os componentes.

  ## ⚙️ Instruções Claras de Uso (Como executar localmente)

Se você deseja clonar e executar este projeto em sua máquina localmente para testes, siga os passos abaixo:
Dicas importantes  para rodar o projeto: 
### 1. Clonar o repositório
Abra o seu terminal e execute:
```bash
git clone [https://github.com/guilhermeoy1987/projetofinalclonedox.git](https://github.com/guilhermeoy1987/projetofinalclonedox.git)
cd projetofinalclonedox

2. Instalar as dependências
Certifique-se de ter o Node.js instalado em sua máquina e execute: npm install

3. Executar o projeto em ambiente de desenvolvimento
npm start

A aplicação abrirá automaticamente no seu navegador padrão na porta http://localhost:3000.
