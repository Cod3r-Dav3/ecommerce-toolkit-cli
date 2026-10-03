# 🛒 E-commerce Toolkit CLI

> Kit moderno de utilitários em linha de comando (CLI) para desenvolvedores, lojistas e operadores de E-commerce.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Type: Module](https://img.shields.io/badge/type-module%20(ESM)-yellow.svg)](https://nodejs.org/api/esm.html)

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades em Destaque](#-funcionalidades-em-destaque)
  - [1. Gerador de QR Code (Terminal e PNG)](#1-gerador-de-qr-code-terminal-e-png)
  - [2. Gerador de Senhas com Análise de Entropia](#2-gerador-de-senhas-com-análise-de-entropia)
  - [3. Menu Interativo Contínuo](#3-menu-interativo-contínuo)
- [Arquitetura do Projeto](#-arquitetura-do-projeto)
- [Configuração de Ambiente (.env)](#-configuração-de-ambiente-env)
- [Instalação e Execução](#-instalação-e-execução)
- [Boas Práticas e Segurança](#-boas-práticas-e-segurança)

---

## 🚀 Visão Geral

O **E-commerce Toolkit CLI** foi desenvolvido para centralizar rotinas do dia a dia do comércio eletrônico e testes de sistemas, oferecendo:
- Geração instantânea de QR Codes para produtos, links de pagamento, campanhas e cupons promocionais.
- Geração de credenciais e senhas criptograficamente seguras para clientes, contas de teste e acessos administrativos.
- Avaliação instantânea de segurança para conformidade com padrões de proteção de dados.

---

## ✨ Funcionalidades em Destaque

### 1. Gerador de QR Code (Terminal e PNG)
Permite gerar QR Codes rapidamente para qualquer URL ou texto com 3 formatos de saída:
- **Terminal - Padrão**: Renderização ASCII de alta legibilidade diretamente no console.
- **Terminal - Compacto**: Versão compacta para terminais menores ou janelas divididas.
- **Exportação de Imagem PNG (Novo)**: Cria uma imagem `.png` em alta definição (512x512, correção de erro nível `H`) e salva automaticamente na pasta `./output/qrcode-[timestamp].png`. Ideal para envio a gráficas, inclusão em etiquetas de envio e embalagens de produtos.

### 2. Gerador de Senhas com Análise de Entropia
Geração de senhas alfanuméricas baseadas em padrões criptográficos rígidos:
- **Aleatoriedade Criptográfica**: Implementado utilizando `node:crypto` (`crypto.randomInt`), garantindo imprevisibilidade e proteção contra ataques de predição de números pseudoaleatórios.
- **Alfabeto Completo**: Conjuntos padronizados com todas as 26 letras maiúsculas e minúsculas (incluindo `Y` e `y`), dígitos numéricos e símbolos especiais.
- **Métricas de Segurança em Tempo Real (Novo)**:
  - **Entropia da Senha**: Calculada em bits pela fórmula da Teoria da Informação:
    $$E = L \times \log_2(N)$$
    *(onde $L$ é o comprimento da senha e $N$ é o tamanho do espaço amostral de caracteres).*
  - **Classificação Visual de Força**:
    - `Fraca` ($< 40\text{ bits}$)
    - `Média / Razoável` ($40 \le E < 60\text{ bits}$)
    - `Forte` ($60 \le E < 80\text{ bits}$)
    - `Extremamente Segura - Padrão Enterprise` ($\ge 80\text{ bits}$)
  - **Estimativa de Tempo para Quebra**: Cálculo do tempo médio estimado para quebra por força bruta em clusters modernos de GPU ($10^{10}$ tentativas/segundo).

### 3. Menu Interativo Contínuo
- **Fluxo sem Interrupções**: Ao concluir a geração de um QR Code ou Senha, o sistema reapresenta o menu principal permitindo realizar novas operações consecutivas.
- **Saída Graciosa**: Opção `0 - Sair do Sistema` ou atalho `Ctrl+C` com encerramento limpo, sem disparo de erros não tratados no terminal.

---

## 🏗 Arquitetura do Projeto

O projeto adota uma arquitetura em camadas limpa e modular (Clean Architecture / SoC - Separation of Concerns), com padrão ESM nativo (`"type": "module"`):

```
ecommerce-toolkit-cli/
├── output/                      # Diretório automático para imagens PNG geradas
├── src/
│   ├── config/
│   │   └── env.js               # Centralização e validação das variáveis de ambiente
│   ├── schemas/
│   │   ├── main.schema.js       # Regras de validação do menu principal
│   │   └── qrcode.schema.js     # Regras de validação do prompt de QR Code
│   ├── services/
│   │   ├── password/
│   │   │   ├── constants.js     # Alfabetos canônicos e conjuntos de caracteres
│   │   │   └── password.service.js # Lógica de negócio, aleatoriedade segura e entropia
│   │   └── qrcode/
│   │       └── qrcode.service.js   # Geração no terminal e conversão para arquivo PNG
│   ├── controllers/
│   │   ├── main.controller.js   # Orquestrador do menu em loop e encerramento
│   │   ├── password.controller.js # Apresentação formatada das senhas e métricas
│   │   └── qrcode.controller.js   # Entrada de dados e exibição do QR Code
│   ├── utils/
│   │   └── logger.js            # Design de terminal padronizado com Chalk
│   └── index.js                 # Ponto de entrada (Bootstrap) e captura de exceções
├── .env                         # Configurações ativas do usuário
├── .env.example                 # Modelo documentado de variáveis de ambiente
├── .gitignore                   # Exclusão correta de dependências, saídas e logs
└── package.json                 # Metadados e scripts modernos de execução
```

---

## ⚙ Configuração de Ambiente (.env)

Copie o modelo de variáveis de ambiente e ajuste conforme necessário:

```bash
cp .env.example .env
```

| Variável | Tipo | Padrão | Descrição |
| :--- | :---: | :---: | :--- |
| `UPPERCASE_LETTERS` | `boolean` | `true` | Inclui caracteres maiúsculos (`A-Z`) no pool de senhas |
| `LOWERCASE_LETTERS` | `boolean` | `true` | Inclui caracteres minúsculos (`a-z`) no pool de senhas |
| `NUMBERS` | `boolean` | `true` | Inclui dígitos numéricos (`0-9`) no pool de senhas |
| `SPECIAL_CHARACTERS` | `boolean` | `true` | Inclui caracteres especiais (`!@#$%&*()-_+=...`) |
| `PASSWORD_LENGTH` | `number` | `16` | Quantidade de caracteres da senha (min: `4`, max: `128`) |

---

## 💻 Instalação e Execução

### Pré-requisitos
- **Node.js** v20.0.0 ou superior

### Instalação de dependências
```bash
npm install
```

### Executar a aplicação
```bash
# Modo padrão (com carregamento automático do .env)
npm start

# Modo de desenvolvimento (com auto-reload em alterações)
npm run dev
```

---

## 🔒 Boas Práticas e Segurança

- **Resolução Estrita de Módulos ESM**: Todos os arquivos utilizam caminhos relativos explícitos com extensões `.js`, prevenindo erros de carregamento em ambientes de produção.
- **Prevenção de Vulnerabilidades de Aleatoriedade**: Substituição de `Math.random()` por `node:crypto`, em conformidade com as recomendações da OWASP para geradores de credenciais.
- **Isolamento de Responsabilidades**: A lógica de apresentação (controllers/prompts) é completamente separada da lógica de geração (services).
