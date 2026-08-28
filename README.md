# 🎴 Pokédex TCG - Ionic & Angular

Aplicação **mobile/web** inspirada nas cartas de Pokémon TCG, desenvolvida com **Ionic + Angular** e integrada à **PokéAPI**.

## 🚀 Sobre o Projeto

A aplicação permite:

* 📋 Listar Pokémon em formato de cartas TCG;
* 🔎 Pesquisar Pokémon por nome ou ID;
* ⭐ Adicionar e remover favoritos;
* 💾 Salvar favoritos no `LocalStorage`;
* ♾️ Carregar Pokémon utilizando Infinite Scroll;
* 📊 Visualizar detalhes e estatísticas;
* 📱 Utilizar a aplicação em dispositivos móveis ou navegador.

## 🏗️ Arquitetura

O projeto utiliza **Angular Standalone Components** e separa as responsabilidades entre componentes, modelos e serviços.

### Principais serviços

* `PokemonService` — responsável pelas requisições à PokéAPI.
* `FavoritesService` — responsável pelo gerenciamento dos favoritos e `LocalStorage`.

### Estrutura

```text
src/
└── app/
    ├── core/
    │   ├── models/
    │   └── services/
    │
    ├── home/
    │   └── Listagem, busca e Infinite Scroll
    │
    ├── favorites/
    │   └── Pokémon favoritos
    │
    └── pokemon-detail/
        └── Detalhes e estatísticas
```

## 🔎 Busca

A pesquisa funciona em duas etapas:

1. Primeiro verifica os Pokémon já carregados.
2. Caso não encontre, consulta a PokéAPI.

A busca pode ser feita por:

* Nome;
* ID.

## ⭐ Favoritos

Os favoritos são gerenciados pelo `FavoritesService` e armazenados no navegador utilizando:

```text
LocalStorage
```

Assim, os favoritos permanecem salvos mesmo após fechar a aplicação.

## ♾️ Infinite Scroll

A listagem utiliza o **Infinite Scroll do Ionic** para carregar novos Pokémon conforme o usuário rola a página.

Também existem controles para evitar requisições duplicadas durante pesquisas e carregamentos.

## ⚡ Performance

Foram utilizadas algumas boas práticas do Angular:

* `trackBy` para otimizar listas;
* `ChangeDetectorRef` para controle de atualização;
* `inject()` para injeção de dependências;
* Controle de estados de carregamento;
* Separação entre componentes e serviços.

## 🛠️ Tecnologias

* **Angular**
* **Ionic Framework**
* **TypeScript**
* **PokéAPI**
* **REST API**
* **LocalStorage**

## 🚀 Como Executar

### Pré-requisitos

* Node.js 18+
* npm
* Ionic CLI *(opcional)*

### Instalar dependências

```bash
npm install
```

### Executar

Com Ionic:

```bash
npx ionic serve
```

Ou utilizando npm:

```bash
npm start
```

A aplicação estará disponível em:

```text
http://localhost:8100
```

ou

```text
http://localhost:4200
```

## 🎯 Objetivo

O projeto foi desenvolvido para demonstrar conhecimentos em **Angular, Ionic, TypeScript, APIs REST, arquitetura de componentes, persistência local e desenvolvimento responsivo para Web/Mobile**.
