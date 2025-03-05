export interface Attributes {
  combate: number
  habilidade: number
  noção: number
  vitalidade: number
}

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
  seed?: string
}
