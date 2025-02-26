import {
  firstNames,
  lastNames,
  height,
  weight,
  skinColor,
  eyeColor,
  physicalTraits,
  personalityTraits,
  weapons,
  armor,
  items,
  specialTalents,
  luckTraits,
  curseTraits
} from '../data/goblinData';

// Interface para o goblin gerado
export interface Goblin {
  id: string;
  name: string;
  physicalAttributes: {
    height: string;
    weight: string;
    skinColor: string;
    eyeColor: string;
    physicalTraits: string[];
  };
  personality: string[];
  equipment: {
    weapon: string;
    armor: string;
    items: string[];
  };
  specialTalent: string;
  luckOrCurse: {
    type: 'luck' | 'curse';
    description: string;
  };
  seed?: string; // Adicionando campo opcional para a seed
}

// Interface para os índices usados na seed
interface GoblinIndices {
  firstName: number;
  lastName: number;
  height: number;
  weight: number;
  skinColor: number;
  eyeColor: number;
  physicalTraits: number[];
  personality: number[];
  weapon: number;
  armor: number;
  items: number[];
  specialTalent: number;
  isLucky: boolean;
  luckOrCurse: number;
}

// Função para selecionar um item aleatório de um array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Função para selecionar um item específico de um array com base em um índice
const getItemByIndex = <T>(array: T[], index: number): T => {
  return array[index % array.length];
};

// Função para selecionar múltiplos itens aleatórios de um array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Função para selecionar múltiplos itens específicos de um array com base em índices
const getItemsByIndices = <T>(array: T[], indices: number[]): T[] => {
  return indices.map(index => array[index % array.length]);
};

// Função para gerar um ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para gerar uma seed a partir de um goblin
export const generateSeedFromGoblin = (goblin: Goblin): string => {
  // Encontrar os índices de cada elemento do goblin
  const indices: GoblinIndices = {
    firstName: firstNames.indexOf(goblin.name.split(' ')[0]),
    lastName: lastNames.indexOf(goblin.name.split(' ')[1]),
    height: height.indexOf(goblin.physicalAttributes.height),
    weight: weight.indexOf(goblin.physicalAttributes.weight),
    skinColor: skinColor.indexOf(goblin.physicalAttributes.skinColor),
    eyeColor: eyeColor.indexOf(goblin.physicalAttributes.eyeColor),
    physicalTraits: goblin.physicalAttributes.physicalTraits.map(trait => physicalTraits.indexOf(trait)),
    personality: goblin.personality.map(trait => personalityTraits.indexOf(trait)),
    weapon: weapons.indexOf(goblin.equipment.weapon),
    armor: armor.indexOf(goblin.equipment.armor),
    items: goblin.equipment.items.map(item => items.indexOf(item)),
    specialTalent: specialTalents.indexOf(goblin.specialTalent),
    isLucky: goblin.luckOrCurse.type === 'luck',
    luckOrCurse: goblin.luckOrCurse.type === 'luck' 
      ? luckTraits.indexOf(goblin.luckOrCurse.description)
      : curseTraits.indexOf(goblin.luckOrCurse.description)
  };

  // Converter para JSON e codificar em base64
  return btoa(JSON.stringify(indices));
};

// Função para gerar um goblin a partir de uma seed
export const generateGoblinFromSeed = (seed: string): Goblin | null => {
  try {
    // Decodificar a seed de base64 para JSON
    const indices: GoblinIndices = JSON.parse(atob(seed));
    
    // Verificar se todos os índices são válidos
    if (
      indices.firstName < 0 || indices.firstName >= firstNames.length ||
      indices.lastName < 0 || indices.lastName >= lastNames.length
    ) {
      return null;
    }
    
    // Gerar o nome a partir dos índices
    const firstName = getItemByIndex(firstNames, indices.firstName);
    const lastName = getItemByIndex(lastNames, indices.lastName);
    const name = `${firstName} ${lastName}`;
    
    // Gerar características físicas a partir dos índices
    const goblinHeight = getItemByIndex(height, indices.height);
    const goblinWeight = getItemByIndex(weight, indices.weight);
    const goblinSkinColor = getItemByIndex(skinColor, indices.skinColor);
    const goblinEyeColor = getItemByIndex(eyeColor, indices.eyeColor);
    const goblinPhysicalTraits = getItemsByIndices(physicalTraits, indices.physicalTraits);
    
    // Gerar traços de personalidade a partir dos índices
    const goblinPersonality = getItemsByIndices(personalityTraits, indices.personality);
    
    // Gerar equipamentos a partir dos índices
    const goblinWeapon = getItemByIndex(weapons, indices.weapon);
    const goblinArmor = getItemByIndex(armor, indices.armor);
    const goblinItems = getItemsByIndices(items, indices.items);
    
    // Gerar talento especial a partir do índice
    const goblinSpecialTalent = getItemByIndex(specialTalents, indices.specialTalent);
    
    // Gerar sorte ou maldição a partir dos índices
    const luckOrCurse = {
      type: indices.isLucky ? 'luck' as const : 'curse' as const,
      description: indices.isLucky 
        ? getItemByIndex(luckTraits, indices.luckOrCurse)
        : getItemByIndex(curseTraits, indices.luckOrCurse)
    };
    
    // Retornar o goblin completo
    return {
      id: generateId(),
      name,
      physicalAttributes: {
        height: goblinHeight,
        weight: goblinWeight,
        skinColor: goblinSkinColor,
        eyeColor: goblinEyeColor,
        physicalTraits: goblinPhysicalTraits
      },
      personality: goblinPersonality,
      equipment: {
        weapon: goblinWeapon,
        armor: goblinArmor,
        items: goblinItems
      },
      specialTalent: goblinSpecialTalent,
      luckOrCurse,
      seed
    };
  } catch (error) {
    console.error('Erro ao gerar goblin a partir da seed:', error);
    return null;
  }
};

// Função principal para gerar um goblin aleatório
export const generateGoblin = (): Goblin => {
  // Gerar nome aleatório
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const name = `${firstName} ${lastName}`;

  // Gerar características físicas
  const goblinHeight = getRandomItem(height);
  const goblinWeight = getRandomItem(weight);
  const goblinSkinColor = getRandomItem(skinColor);
  const goblinEyeColor = getRandomItem(eyeColor);
  const goblinPhysicalTraits = getRandomItems(physicalTraits, Math.floor(Math.random() * 3) + 1);

  // Gerar traços de personalidade
  const goblinPersonality = getRandomItems(personalityTraits, Math.floor(Math.random() * 3) + 1);

  // Gerar equipamentos
  const goblinWeapon = getRandomItem(weapons);
  const goblinArmor = getRandomItem(armor);
  const goblinItems = getRandomItems(items, Math.floor(Math.random() * 3) + 1);

  // Gerar talento especial
  const goblinSpecialTalent = getRandomItem(specialTalents);

  // Gerar sorte ou maldição (50% de chance para cada)
  const isLucky = Math.random() >= 0.5;
  const luckOrCurse = {
    type: isLucky ? 'luck' as const : 'curse' as const,
    description: isLucky ? getRandomItem(luckTraits) : getRandomItem(curseTraits)
  };

  // Criar o goblin
  const goblin = {
    id: generateId(),
    name,
    physicalAttributes: {
      height: goblinHeight,
      weight: goblinWeight,
      skinColor: goblinSkinColor,
      eyeColor: goblinEyeColor,
      physicalTraits: goblinPhysicalTraits
    },
    personality: goblinPersonality,
    equipment: {
      weapon: goblinWeapon,
      armor: goblinArmor,
      items: goblinItems
    },
    specialTalent: goblinSpecialTalent,
    luckOrCurse
  };
  
  // Gerar e adicionar a seed
  const seed = generateSeedFromGoblin(goblin);
  return { ...goblin, seed };
}; 
