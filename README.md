# Gerador de Goblins - Goblins Malditos

Uma aplicação web interativa para gerar goblins aleatórios para o RPG Goblins Malditos. Esta ferramenta permite criar personagens goblins únicos com características físicas, personalidade, equipamentos, talentos especiais e sorte/maldição.

## Características

- **Geração Aleatória**: Crie goblins completamente aleatórios com um clique
- **Características Detalhadas**: Nome, aparência física, personalidade, equipamentos e mais
- **Interface Temática**: Design visual que reflete o espírito caótico dos goblins
- **Exportação Fácil**: Copie os detalhes do goblin para usar em suas sessões de jogo
- **Fichas de Personagem por IA**: Visualize seus goblins com fichas de personagem geradas por inteligência artificial, incluindo ilustrações personalizadas e atributos de RPG
- **Download de Fichas**: Baixe as fichas geradas como imagens para usar em suas sessões de jogo

## Tecnologias Utilizadas

- Vue 3 (Composition API)
- TypeScript
- TailwindCSS
- Vite
- OpenAI API (para geração de imagens)

## Como Executar

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse `http://localhost:5173` no seu navegador

## Configuração da API para Geração de Imagens

Para utilizar a funcionalidade de geração de fichas de personagem, você precisará de uma chave de API da OpenAI:

1. Crie uma conta na [OpenAI](https://platform.openai.com/)
2. Obtenha uma chave de API em [API Keys](https://platform.openai.com/api-keys)
3. Insira a chave na configuração do aplicativo (clique em "Configurar API Key")

**Nota**: A geração de imagens é um serviço pago. Verifique os preços atuais na [documentação da OpenAI](https://platform.openai.com/docs/guides/rate-limits).

### Limitações da API

A API da OpenAI possui algumas limitações que podem afetar a geração de imagens:

- **Políticas de Conteúdo**: A API pode rejeitar prompts que contenham conteúdo considerado violento, explícito ou que viole suas políticas de uso.
- **Limite de Caracteres**: Os prompts têm um limite de 1000 caracteres.
- **Filtros de Segurança**: Alguns termos relacionados a armas, violência ou conteúdo adulto podem ser bloqueados.

**Nota sobre idioma**: Para melhorar os resultados e reduzir erros, o aplicativo envia prompts em inglês para a API da OpenAI, mesmo que a interface do usuário esteja em português. Isso ocorre porque o modelo foi treinado principalmente com dados em inglês e tende a produzir resultados mais consistentes nesse idioma.

**Simplificação de prompts**: Para evitar problemas com as políticas de conteúdo da OpenAI, os prompts foram extremamente simplificados para incluir apenas características básicas do goblin: nome, cor da pele e olhos, e estatísticas. Qualquer menção a armas ou itens potencialmente problemáticos foi removida para garantir a compatibilidade com as políticas de conteúdo da OpenAI.

**Estilo visual**: As imagens são geradas em um estilo de ilustração infantil, adequado para todas as idades, semelhante a livros infantis. Isso garante que as imagens sejam sempre aprovadas pelo sistema de segurança da OpenAI.

Se você encontrar erros de violação de política de conteúdo, tente:
1. Gerar um novo goblin com características diferentes
2. Regenerar a imagem (às vezes o mesmo goblin pode funcionar em uma nova tentativa)
3. Evitar goblins com descrições que contenham referências a armas, violência ou conteúdo adulto

### Sobre as Fichas de Personagem

As fichas de personagem geradas incluem:
- Ilustração personalizada do goblin com suas características físicas únicas
- Nome e classe do personagem
- Atributos de RPG (Combate, Habilidade, Noção, Vitalidade)
- Características físicas e de personalidade
- Talento especial e sorte/maldição
- Equipamentos

Você pode:
- Regenerar a ficha quantas vezes quiser para obter diferentes estilos visuais
- Ampliar a ficha para ver todos os detalhes
- Baixar a ficha como imagem PNG para usar em suas sessões de jogo
- Copiar os dados do goblin em formato texto

## Construção para Produção

Para construir a versão de produção:

```
npm run build
```

Os arquivos serão gerados na pasta `dist`.

## Sobre o RPG Goblins Malditos

Goblins Malditos é um RPG onde os jogadores interpretam goblins - criaturas caóticas, fracas e propensas a morrer de formas estúpidas. O jogo celebra o caos, a comédia e a natureza imprevisível desses pequenos monstros verdes.

## Licença

Este projeto é livre para uso pessoal e não-comercial.

---

Criado com 💚 para todos os goblins que morreram de forma estúpida em nossas mesas de RPG.
