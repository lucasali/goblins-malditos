import type { Goblin } from './goblinGenerator'

// Interface para a resposta da API
interface ImageGenerationResponse {
  url: string
  error?: string
}

// Função para gerar a prompt para a IA baseada nos atributos do goblin
export function generateGoblinPrompt(goblin: Goblin): string {
  const { name, occupation, describer, physicalAttributes, equipment, attributes } = goblin

  // Extrair características principais para a prompt
  const skinColor = physicalAttributes.skinColor
  const eyeColor = physicalAttributes.eyeColor
  const trait = physicalAttributes.trait

  // Usar os atributos reais do goblin
  const combate = attributes.combate
  const habilidade = attributes.habilidade
  const nocao = attributes.noção
  const vitalidade = attributes.vitalidade

  // Determinar uma classe baseada na ocupação e descritor
  // const classe = `${describer} ${occupation}`

  // Sanitizar descrições para evitar conteúdo problemático
  const sanitizeText = (text: string): string => {
    // Lista de palavras que podem violar as políticas de conteúdo
    const problematicTerms = [
      /armas?/gi,
      /matar/gi,
      /morte/gi,
      /sangue/gi,
      /violência/gi,
      /violento/gi,
      /maldição/gi,
      /afiado/gi,
      /cortar/gi,
      /ferir/gi,
      /machucar/gi,
      /perigoso/gi,
      /veneno/gi,
      /explosivo/gi,
      /lâmina/gi,
      /faca/gi,
      /espada/gi,
    ]

    let safeText = text
    problematicTerms.forEach((term) => {
      safeText = safeText.replace(term, 'item')
    })

    return safeText
  }

  const safeWeapon = sanitizeText(equipment.weapon)
  const safeArmor = sanitizeText(equipment.armor)
  const safeTrait = sanitizeText(trait)

  // Traduzir ocupação para inglês
  const occupationTranslation: Record<string, string> = {
    Mercenário: 'Mercenary',
    Caçador: 'Hunter',
    Gatuno: 'Thief',
    Líder: 'Leader',
    Incendiário: 'Arsonist',
    Bruxo: 'Warlock',
  }

  // Traduzir descritor para inglês
  const describerTranslation: Record<string, string> = {
    Covarde: 'Cowardly',
    Atrapalhado: 'Clumsy',
    Tapado: 'Dumb',
    Fracote: 'Weak',
    Medíocre: 'Mediocre',
    Supimpa: 'Awesome',
  }

  const englishOccupation = occupationTranslation[occupation] || 'Adventurer'
  const englishDescriber = describerTranslation[describer] || 'Chaotic'

  // Criar o prompt em inglês - versão específica para ficha de personagem
  const prompt = `Create a detailed RPG character sheet for a goblin named "${name}", a ${englishDescriber} ${englishOccupation}. 
The character sheet should have:
- A large cartoon illustration of the goblin with ${skinColor} skin and ${eyeColor} eyes
- The goblin's name "${name}" in a banner
- Stats displayed clearly: Combat ${combate}, Skill ${habilidade}, Wits ${nocao}, Vitality ${vitalidade}
- The goblin holding its equipment: ${safeWeapon} and wearing ${safeArmor}
- Distinctive trait: ${safeTrait}
- Fantasy RPG style layout with decorative borders
- Parchment background texture

Art style: Colorful cartoon illustration, D&D-inspired character sheet, fantasy tabletop RPG game.`

  // Verificar o comprimento do prompt
  if (prompt.length > 950) {
    console.warn(`Prompt muito longo (${prompt.length} caracteres). Reduzindo...`)
    // Versão ainda mais curta em inglês
    return `Create a RPG character sheet for goblin "${name}" with ${skinColor} skin. 
Include stats (C${combate}, S${habilidade}, W${nocao}, V${vitalidade}) and a cartoon illustration of the goblin.
Style: D&D character sheet with parchment background.`
  }

  return prompt
}

// Função para gerar a imagem do goblin usando a API do OpenAI
export async function generateGoblinImage(goblin: Goblin, apiKey: string): Promise<ImageGenerationResponse> {
  try {
    const prompt = generateGoblinPrompt(goblin)

    // Verificar o tamanho do prompt
    if (prompt.length > 1000) {
      console.warn(`Prompt excede 1000 caracteres (${prompt.length}). Isso pode causar erros.`)
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
        quality: 'standard',
        model: 'dall-e-3', // Especificar DALL-E 3, o mesmo usado pelo ChatGPT
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('Erro na API de imagem:', data.error)
      return { url: '', error: data.error.message || 'Erro ao gerar imagem' }
    }

    return { url: data.data[0].url }
  }
  catch (error) {
    console.error('Erro ao gerar imagem:', error)
    return { url: '', error: 'Erro ao conectar com o serviço de imagem' }
  }
}

// Função para gerar uma imagem de placeholder quando a API não está disponível
export function getPlaceholderImage(goblin: Goblin): string {
  // Gerar uma cor de fundo baseada no nome do goblin para ter alguma variação
  const hash = goblin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const hue = hash % 360

  // Retornar uma URL para um placeholder com a inicial do nome do goblin
  return `https://via.placeholder.com/512x512/${hue.toString(16)}0/ffffff?text=${goblin.name.charAt(0)}`
}
