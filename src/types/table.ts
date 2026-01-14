export interface Table {
  _id: string
  slug: string
  masterSessionId: string
  createdAt: number
}

export interface Player {
  _id: string
  tableId: string
  sessionId: string
  nickname: string
  goblinSeed?: string | null
  isMaster: boolean
  joinedAt: number
}

export interface TableMessage {
  _id: string
  tableId: string
  playerId: string
  nickname: string
  content: string
  createdAt: number
}

export interface DiceRoll {
  _id: string
  tableId: string
  playerId: string
  nickname: string
  dice: string
  result: number
  createdAt: number
}
