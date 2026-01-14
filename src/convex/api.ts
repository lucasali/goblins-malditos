import { makeFunctionReference } from 'convex/server'

export const api = {
  tables: {
    createTable: makeFunctionReference<'mutation'>('tables:createTable'),
    getTableBySlug: makeFunctionReference<'query'>('tables:getTableBySlug'),
    deleteTable: makeFunctionReference<'mutation'>('tables:deleteTable'),
  },
  players: {
    joinTable: makeFunctionReference<'mutation'>('players:joinTable'),
    leaveTable: makeFunctionReference<'mutation'>('players:leaveTable'),
    updateGoblin: makeFunctionReference<'mutation'>('players:updateGoblin'),
    kickPlayer: makeFunctionReference<'mutation'>('players:kickPlayer'),
    getTablePlayers: makeFunctionReference<'query'>('players:getTablePlayers'),
  },
  messages: {
    sendMessage: makeFunctionReference<'mutation'>('messages:sendMessage'),
    getMessages: makeFunctionReference<'query'>('messages:getMessages'),
  },
  diceRolls: {
    rollDice: makeFunctionReference<'mutation'>('diceRolls:rollDice'),
    getDiceRolls: makeFunctionReference<'query'>('diceRolls:getDiceRolls'),
  },
} as const
