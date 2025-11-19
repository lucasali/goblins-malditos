# Gerador de Goblins - Goblins Malditos

Uma aplicação web interativa para gerar goblins aleatórios para o RPG Goblins Malditos. Esta ferramenta permite criar personagens goblins únicos com características físicas, personalidade, equipamentos, talentos especiais e sorte/maldição.

## Características

- **Geração Aleatória**: Crie goblins completamente aleatórios com um clique
- **Características Detalhadas**: Nome, aparência física, personalidade, equipamentos e mais
- **Interface Temática**: Design visual que reflete o espírito caótico dos goblins
- **Exportação Fácil**: Copie os detalhes do goblin para usar em suas sessões de jogo
- **Fichas de Personagem por IA**: Gere fichas de personagem sob demanda com ilustrações personalizadas e atributos de RPG
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
   pnpm install
   ```
3. Execute o servidor de desenvolvimento:
   ```
   pnpm dev
   ```
4. Acesse `http://localhost:5173` no seu navegador

## Configuração da API para Geração de Imagens

Para utilizar a funcionalidade de geração de fichas de personagem, você precisará de uma chave de API da OpenAI:

1. Crie uma conta na [OpenAI](https://platform.openai.com/)
2. Obtenha uma chave de API em [API Keys](https://platform.openai.com/api-keys)
3. Insira a chave na configuração do aplicativo (clique em "Configurar API Key")

**Nota**: A geração de imagens é um serviço pago. Verifique os preços atuais na [documentação da OpenAI](https://platform.openai.com/docs/guides/rate-limits).

**Modelo DALL-E 3**: Esta aplicação utiliza o modelo DALL-E 3 da OpenAI para gerar fichas de personagem de alta qualidade, semelhantes às que você obteria no ChatGPT. Este modelo oferece resultados superiores, mas tem um custo mais elevado (aproximadamente $0.04 USD por imagem na resolução 1024x1024). Certifique-se de que sua conta OpenAI tenha créditos suficientes.

### Geração de Fichas Sob Demanda

Para economizar seus créditos da API OpenAI, a aplicação agora permite que você escolha quando gerar a ficha de personagem:

1. Gere um goblin usando o botão "Gerar Goblin"
2. Visualize as características do goblin gerado
3. Se desejar uma ficha visual, clique no botão "Gerar Ficha de Personagem"
4. A ficha será gerada usando a API da OpenAI (DALL-E 3)

Isso permite que você gere múltiplos goblins sem consumir créditos da API, gerando fichas apenas para os goblins que você realmente deseja utilizar.

### Limitações da API

A API da OpenAI possui algumas limitações que podem afetar a geração de imagens:

- **Políticas de Conteúdo**: A API pode rejeitar prompts que contenham conteúdo considerado violento, explícito ou que viole suas políticas de uso.
- **Limite de Caracteres**: Os prompts têm um limite de 1000 caracteres.
- **Filtros de Segurança**: Alguns termos relacionados a armas, violência ou conteúdo adulto podem ser bloqueados.

**Nota sobre idioma**: Para melhorar os resultados e reduzir erros, o aplicativo envia prompts em inglês para a API da OpenAI, mesmo que a interface do usuário esteja em português. Isso ocorre porque o modelo foi treinado principalmente com dados em inglês e tende a produzir resultados mais consistentes nesse idioma.

**Prompts específicos para fichas**: Para garantir que as imagens geradas sejam realmente fichas de personagem de RPG, utilizamos prompts estruturados que descrevem especificamente o layout desejado, incluindo a ilustração do goblin, seus atributos, nome e equipamento, além de elementos visuais como bordas decorativas e fundo de pergaminho. Isso resulta em fichas visualmente semelhantes às que você obteria no ChatGPT.

Se você encontrar erros de violação de política de conteúdo, tente:
1. Gerar um novo goblin com características diferentes
2. Regenerar a imagem (às vezes o mesmo goblin pode funcionar em uma nova tentativa)
3. Evitar goblins com descrições muito violentas ou explícitas

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
pnpm build
```

Os arquivos serão gerados na pasta `dist`.

## Sobre o RPG Goblins Malditos

Goblins Malditos é um RPG onde os jogadores interpretam goblins - criaturas caóticas, fracas e propensas a morrer de formas estúpidas. O jogo celebra o caos, a comédia e a natureza imprevisível desses pequenos monstros verdes.

## Licença

Este projeto é livre para uso pessoal e não-comercial.

---

Criado com 💚 para todos os goblins que morreram de forma estúpida em nossas mesas de RPG.
