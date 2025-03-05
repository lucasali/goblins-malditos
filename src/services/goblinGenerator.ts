import {
  describerModifiers,
  describers,
  goblinNames,
  miscEquipment,
  occupationEquipment,
  occupationModifiers,
  occupations,
  occupationTechniques,
  protections,
  spells,
  traits,
  weapons,
} from '../data/goblinData'

// Interface para o goblin gerado
export interface Goblin {
  id: string
  name: string
  level: number
  occupation: string
  describer: string
  technique: {
    title: string
    description: string
  }
  attributes: {
    combate: number
    habilidade: number
    noção: number
    vitalidade: number
  }
  physicalAttributes: {
    trait: string
    height: string
    weight: string
    skinColor: string
    eyeColor: string
  }
  personality: string[]
  equipment: {
    weapon: string
    weaponDetails?: {
      uso: string
      ataque: string
      bônus: number
      especial: string
    }
    armor: string
    armorDetails?: {
      uso: string
      durabilidade: number
      especial: string
    }
    items: string[]
  }
  spells?: string[]
  luckOrCurse?: {
    type: 'luck' | 'curse'
    description: string
  }
  seed: string
}

// Interface para os índices usados na seed
/* interface GoblinIndices {
  nameRow: number
  nameCol: number
  lastName?: { row: number, col: number }
  occupation: number
  describer: number
  trait: { row: number, col: number }
  height: number
  weight: number
  skinColor: number
  eyeColor: number
  personality: number[]
  equipment: number
  items: number[]
  spells?: number[]
  isLucky?: boolean
  luckOrCurse?: number
} */

// Função para selecionar um item aleatório de um array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Função para selecionar múltiplos itens aleatórios de um array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

// Função para gerar um ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

// Função para rolar um dado de 6 lados
function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

// Função para gerar um nome de goblin usando a tabela 6x6
function generateGoblinName(): { name: string, row: number, col: number } {
  const row = rollD6() - 1
  const col = rollD6() - 1

  // Tratamento especial para a última linha da tabela
  if (row === 5) {
    if (col === 0) {
      // [Última coisa que comeu]
      const foods = ['Rato', 'Cogumelo', 'Inseto', 'Pão Mofado', 'Sopa', 'Lixo']
      return { name: getRandomItem(foods), row, col }
    }
    else if (col === 1) {
      // [Inverta seu nome]
      const randomNameRow = Math.floor(Math.random() * 5)
      const randomNameCol = Math.floor(Math.random() * 5)
      const randomName = goblinNames[randomNameRow][randomNameCol]
      return { name: randomName.split('').reverse().join(''), row, col }
    }
  }

  return { name: goblinNames[row][col], row, col }
}

// Função para gerar uma característica distinta usando a tabela 6x6
function generateTrait(): { trait: string, row: number, col: number } {
  const row = rollD6() - 1
  const col = rollD6() - 1

  // Tratamento especial para [Role 2 vezes]
  if ((row === 0 && col === 5) || (row === 5 && col === 0)) {
    const trait1 = generateTrait()
    const trait2 = generateTrait()
    return {
      trait: `${trait1.trait} e ${trait2.trait}`,
      row,
      col,
    }
  }

  return { trait: traits[row][col], row, col }
}

// Função para gerar atributos base
function generateBaseAttributes(): { combate: number, habilidade: number, noção: number, vitalidade: number } {
  return {
    combate: 2,
    habilidade: 2,
    noção: 2,
    vitalidade: 2,
  }
}

// Tipo para os atributos
interface Attributes {
  combate: number
  habilidade: number
  noção: number
  vitalidade: number
}

// Função para aplicar modificadores de ocupação e descritor
function applyModifiers(baseAttributes: Attributes, occupation: string, describer: string): Attributes {
  const attributes = { ...baseAttributes }

  // Aplicar modificadores de ocupação
  if (occupation in occupationModifiers) {
    const occupationMod = occupationModifiers[occupation as keyof typeof occupationModifiers]

    // Verificar cada modificador individualmente
    if ('combate' in occupationMod) {
      attributes.combate += occupationMod.combate
    }
    if ('habilidade' in occupationMod) {
      attributes.habilidade += occupationMod.habilidade
    }
    if ('noção' in occupationMod) {
      attributes.noção += occupationMod.noção
    }
    if ('vitalidade' in occupationMod) {
      attributes.vitalidade += occupationMod.vitalidade
    }
  }

  // Aplicar modificadores de descritor
  if (describer in describerModifiers) {
    const describerMod = describerModifiers[describer as keyof typeof describerModifiers]

    // Verificar cada modificador individualmente
    if ('combate' in describerMod) {
      attributes.combate += describerMod.combate
    }
    if ('habilidade' in describerMod) {
      attributes.habilidade += describerMod.habilidade
    }
    if ('noção' in describerMod) {
      attributes.noção += describerMod.noção
    }
    if ('vitalidade' in describerMod) {
      attributes.vitalidade += describerMod.vitalidade
    }

    // Caso especial para "Supimpa" - escolher aleatoriamente um atributo para aumentar
    if ('escolha' in describerMod) {
      const attributeKeys: (keyof Attributes)[] = ['combate', 'habilidade', 'noção', 'vitalidade']
      const randomAttribute = getRandomItem(attributeKeys)
      attributes[randomAttribute] += describerMod.escolha
    }
  }

  return attributes
}

// Função para gerar equipamento baseado na ocupação
function generateEquipment(occupation: string): { weapon: string, armor: string, items: string[], equipmentIndex: number } {
  if (!(occupation in occupationEquipment)) {
    // Fallback para caso a ocupação não seja encontrada
    return {
      weapon: 'Adaga',
      armor: 'Broquel',
      items: ['Corda e Gancho'],
      equipmentIndex: 0,
    }
  }

  const occupationEquipmentList = occupationEquipment[occupation as keyof typeof occupationEquipment]
  const equipmentIndex = Math.floor(Math.random() * occupationEquipmentList.length)
  const equipmentSet = occupationEquipmentList[equipmentIndex]

  // Separar armas e proteções
  let weapon = ''
  let armor = ''

  if (equipmentSet[0].includes(' e ')) {
    const parts = equipmentSet[0].split(' e ')
    weapon = parts[0]
    armor = parts[1]
  }
  else {
    weapon = equipmentSet[0]

    // Gerar uma proteção aleatória
    const protectionKeys = Object.keys(protections)
    armor = getRandomItem(protectionKeys)
  }

  // Gerar itens aleatórios
  const miscEquipmentKeys = Object.keys(miscEquipment)
  const items = getRandomItems(miscEquipmentKeys, Math.floor(Math.random() * 2) + 1)

  return { weapon, armor, items, equipmentIndex }
}

// Função para gerar magias para bruxos
function generateSpells(): string[] {
  return getRandomItems(spells, 3)
}

// Função para gerar um goblin a partir de uma seed
export function generateGoblinFromSeed(seed: string): Goblin | null {
  try {
    // Decodificar a seed de base64 para JSON
    const decodedSeed = atob(seed)
    const goblinData = JSON.parse(decodedSeed)

    // Garantir que o goblin tenha a seed e um ID único
    const goblin: Goblin = {
      ...goblinData,
      id: goblinData.id || generateId(), // Manter o ID original ou gerar um novo
      seed, // Adicionar a seed original
    }

    return goblin
  }
  catch (error) {
    console.error('Erro ao gerar goblin a partir da seed:', error)
    return null
  }
}

// Função para gerar uma seed a partir de um goblin
export function generateSeedFromGoblin(goblin: Goblin): string {
  try {
    // Criar uma cópia do goblin sem a propriedade seed para evitar recursão
    const { seed, ...goblinWithoutSeed } = goblin

    // Converter o goblin para JSON e depois para base64
    return btoa(JSON.stringify(goblinWithoutSeed))
  }
  catch (error) {
    console.error('Erro ao gerar seed a partir do goblin:', error)
    // Retornar uma string vazia em caso de erro
    throw new Error('Falha ao gerar seed para o goblin')
  }
}

// Função principal para gerar um goblin aleatório
export function generateGoblin(): Goblin {
  // Gerar nome aleatório
  const firstName = generateGoblinName()
  let lastName = null

  // 50% de chance de ter sobrenome
  if (Math.random() >= 0.5) {
    lastName = generateGoblinName()
  }

  const name = lastName ? `${firstName.name} ${lastName.name}` : firstName.name

  // Gerar ocupação e descritor
  const occupation = getRandomItem(occupations)
  const describer = getRandomItem(describers)

  // Gerar técnica baseada na ocupação (nível 1)
  const techniqueText = occupationTechniques[occupation as keyof typeof occupationTechniques][1]
  const [title, description] = techniqueText.split(': ')
  const technique = {
    title,
    description,
  }

  // Gerar atributos base e aplicar modificadores
  const baseAttributes = generateBaseAttributes()
  const attributes = applyModifiers(baseAttributes, occupation, describer)

  // Gerar característica física distinta
  const distinctTrait = generateTrait()

  // Gerar características físicas
  const heights = ['Muito baixo (60-80cm)', 'Baixo (80-100cm)', 'Médio (100-120cm)', 'Alto (120-140cm)']
  const weights = ['Magricela (10-20kg)', 'Magro (20-30kg)', 'Normal (30-40kg)', 'Gordo (40-50kg)', 'Obeso (50-60kg)']
  const skinColors = ['Verde claro', 'Verde escuro', 'Verde amarelado', 'Verde azulado', 'Marrom esverdeado']
  const eyeColors = ['Vermelho', 'Amarelo', 'Laranja', 'Preto', 'Branco']

  const goblinHeight = getRandomItem(heights)
  const goblinWeight = getRandomItem(weights)
  const goblinSkinColor = getRandomItem(skinColors)
  const goblinEyeColor = getRandomItem(eyeColors)

  // Gerar traços de personalidade
  const personalityTraits = [
    'Medroso',
    'Ganancioso',
    'Preguiçoso',
    'Glutão',
    'Curioso',
    'Desconfiado',
    'Impulsivo',
    'Irritadiço',
    'Trapaceiro',
    'Vaidoso',
    'Invejoso',
    'Fofoqueiro',
  ]
  const goblinPersonality = getRandomItems(personalityTraits, Math.floor(Math.random() * 2) + 1)

  // Gerar equipamento
  const { weapon, armor, items } = generateEquipment(occupation)

  // Adicionar detalhes das armas e proteções
  let weaponDetails
  if (weapon in weapons) {
    weaponDetails = weapons[weapon as keyof typeof weapons]
  }

  let armorDetails
  if (armor in protections) {
    armorDetails = protections[armor as keyof typeof protections]
  }

  // Gerar magias para bruxos
  let goblinSpells
  if (occupation === 'Bruxo') {
    goblinSpells = generateSpells()
  }

  // Gerar sorte ou maldição (30% de chance)
  let luckOrCurse
  if (Math.random() < 0.3) {
    const isLucky = Math.random() >= 0.5
    const luckTraits = [
      'Você tem sorte em jogos de azar.',
      'Você sempre encontra comida quando está com fome.',
      'Você sempre encontra abrigo quando está cansado.',
      'Você sempre escapa por pouco de situações perigosas.',
      'Você sempre encontra itens úteis em lugares inusitados.',
    ]
    const curseTraits = [
      'Você sempre tropeça em momentos importantes.',
      'Você sempre atrai a atenção de predadores.',
      'Você sempre quebra itens frágeis que toca.',
      'Você sempre perde coisas importantes.',
      'Você sempre é o primeiro a ser atacado em uma emboscada.',
    ]

    luckOrCurse = {
      type: isLucky ? 'luck' as const : 'curse' as const,
      description: isLucky ? getRandomItem(luckTraits) : getRandomItem(curseTraits),
    }
  }

  // Criar o goblin
  const goblinData = {
    id: generateId(),
    name,
    level: 1,
    occupation,
    describer,
    technique,
    attributes,
    physicalAttributes: {
      trait: distinctTrait.trait,
      height: goblinHeight,
      weight: goblinWeight,
      skinColor: goblinSkinColor,
      eyeColor: goblinEyeColor,
    },
    personality: goblinPersonality,
    equipment: {
      weapon,
      weaponDetails,
      armor,
      armorDetails,
      items,
    },
    spells: goblinSpells,
    luckOrCurse,
  }

  try {
    // Criar o objeto goblin com a seed
    const goblin: Goblin = {
      ...goblinData,
      seed: btoa(JSON.stringify(goblinData)),
    }

    return goblin
  }
  catch (error) {
    console.error('Erro ao gerar seed para o goblin:', error)

    // Em caso de erro, retornar o goblin com uma seed vazia
    // Isso não deve acontecer em condições normais
    return {
      ...goblinData,
      seed: 'error-generating-seed',
    } as Goblin
  }
}
