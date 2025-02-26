import type { Goblin } from './goblinGenerator';

// Interface para a resposta da API
interface ImageGenerationResponse {
  url: string;
  error?: string;
}

// Função para gerar a prompt para a IA baseada nos atributos do goblin
export const generateGoblinPrompt = (goblin: Goblin): string => {
  const { name, physicalAttributes, personality, equipment, specialTalent, luckOrCurse } = goblin;
  
  // Extrair características principais para a prompt
  const height = physicalAttributes.height.split('(')[0].trim();
  const weight = physicalAttributes.weight.split('(')[0].trim();
  const skinColor = physicalAttributes.skinColor;
  const eyeColor = physicalAttributes.eyeColor;
  
  // Selecionar apenas 1 característica física e 1 de personalidade para reduzir o tamanho
  const physicalTrait = physicalAttributes.physicalTraits[0] || '';
  const personalityTrait = personality[0] || '';
  
  // Selecionar apenas 1 item para reduzir o tamanho
  const item = equipment.items[0] || '';
  
  // Gerar valores aleatórios para atributos de RPG (1-4)
  const combate = Math.floor(Math.random() * 4) + 1;
  const habilidade = Math.floor(Math.random() * 4) + 1;
  const nocao = Math.floor(Math.random() * 4) + 1;
  const vitalidade = Math.floor(Math.random() * 4) + 1;
  
  // Determinar uma classe baseada nos atributos e personalidade
  let classe = '';
  if (combate > habilidade && combate > nocao) {
    classe = 'Guerreiro Caótico';
  } else if (habilidade > combate && habilidade > nocao) {
    classe = 'Gatuno Trapaceiro';
  } else if (nocao > combate && nocao > habilidade) {
    classe = 'Xamã Duvidoso';
  } else {
    classe = 'Aventureiro Desastrado';
  }
  
  // Sanitizar descrições para evitar conteúdo problemático
  const sanitizeText = (text: string): string => {
    // Lista de palavras que podem violar as políticas de conteúdo
    const problematicTerms = [
      /armas?/gi, /matar/gi, /morte/gi, /sangue/gi, /violência/gi, /violento/gi, 
      /maldição/gi, /afiado/gi, /cortar/gi, /ferir/gi, /machucar/gi, /perigoso/gi,
      /veneno/gi, /explosivo/gi, /lâmina/gi, /faca/gi, /espada/gi, /garras?/gi,
      /machado/gi, /martelo/gi, /porrete/gi, /adaga/gi, /punhal/gi, /lança/gi,
      /metal/gi, /metálico/gi, /aço/gi, /ferro/gi, /pontiagudo/gi, /cortante/gi
    ];
    
    let safeText = text;
    problematicTerms.forEach(term => {
      safeText = safeText.replace(term, 'tool');
    });
    
    // Verificar se o texto sanitizado ainda contém palavras potencialmente problemáticas
    if (/weapon|knife|blade|sword|axe|hammer|dagger|claw|sharp|metal/i.test(safeText)) {
      return 'magic wand';
    }
    
    return safeText;
  };
  
  const safeWeapon = sanitizeText(equipment.weapon);
  const safeArmor = sanitizeText(equipment.armor);
  const safeItem = sanitizeText(item);
  const safeTalent = sanitizeText(specialTalent);
  const safeLuckDesc = sanitizeText(luckOrCurse.description);
  
  // Traduzir classe para inglês
  const classTranslation: Record<string, string> = {
    'Guerreiro Caótico': 'Chaotic Warrior',
    'Gatuno Trapaceiro': 'Trickster Rogue',
    'Xamã Duvidoso': 'Dubious Shaman',
    'Aventureiro Desastrado': 'Clumsy Adventurer'
  };
  
  const englishClass = classTranslation[classe] || 'Goblin Adventurer';
  
  // Sanitizar cores para evitar termos problemáticos
  const safeSkinColor = skinColor.replace(/sangue|vermelho|escarlate/gi, 'green');
  const safeEyeColor = eyeColor.replace(/sangue|vermelho|escarlate/gi, 'yellow');
  
  // Criar o prompt em inglês - versão extremamente simplificada
  const prompt = `Cute fantasy character sheet for goblin ${name}. 
${safeSkinColor} skin, ${safeEyeColor} eyes. 
Stats: C${combate}, S${habilidade}, W${nocao}, V${vitalidade}. 
Art style: colorful cartoon, child-friendly fantasy illustration.`;

  return prompt;
};

// Função para gerar a imagem do goblin usando a API do OpenAI
export const generateGoblinImage = async (goblin: Goblin, apiKey: string): Promise<ImageGenerationResponse> => {
  try {
    const prompt = generateGoblinPrompt(goblin);
    
    // Verificar o tamanho do prompt
    if (prompt.length > 1000) {
      console.warn(`Prompt excede 1000 caracteres (${prompt.length}). Isso pode causar erros.`);
    }
    
    // Adicionar um estilo extremamente seguro
    const safeStyle = ", children's book illustration style, G-rated content, family-friendly";
    const finalPrompt = prompt.length + safeStyle.length > 1000 ? prompt : prompt + safeStyle;
    
    console.log("Prompt final:", finalPrompt);
    console.log("Tamanho do prompt:", finalPrompt.length);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt: finalPrompt,
        n: 1,
        size: '1024x1024',
        response_format: 'url',
        quality: 'standard'
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Erro na API de imagem:', data.error);
      return { url: '', error: data.error.message || 'Erro ao gerar imagem' };
    }
    
    return { url: data.data[0].url };
  } catch (error) {
    console.error('Erro ao gerar imagem:', error);
    return { url: '', error: 'Erro ao conectar com o serviço de imagem' };
  }
};

// Função para gerar uma imagem de placeholder quando a API não está disponível
export const getPlaceholderImage = (goblin: Goblin): string => {
  // Gerar uma cor de fundo baseada no nome do goblin para ter alguma variação
  const hash = goblin.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  
  // Retornar uma URL para um placeholder com a inicial do nome do goblin
  return `https://via.placeholder.com/512x512/${hue.toString(16)}0/ffffff?text=${goblin.name.charAt(0)}`;
}; 
