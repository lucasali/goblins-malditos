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
}

// Função para selecionar um item aleatório de um array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Função para selecionar múltiplos itens aleatórios de um array
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Função para gerar um ID único
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
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
    luckOrCurse
  };
}; 
