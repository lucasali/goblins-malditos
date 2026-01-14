import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tables: defineTable({
    slug: v.string(),
    masterSessionId: v.string(),
    createdAt: v.number(),
  }).index('by_slug', ['slug']),
  players: defineTable({
    tableId: v.id('tables'),
    sessionId: v.string(),
    nickname: v.string(),
    goblinSeed: v.optional(v.string()),
    isMaster: v.boolean(),
    joinedAt: v.number(),
  })
    .index('by_table', ['tableId'])
    .index('by_table_session', ['tableId', 'sessionId']),
  messages: defineTable({
    tableId: v.id('tables'),
    playerId: v.id('players'),
    nickname: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index('by_table', ['tableId']),
  diceRolls: defineTable({
    tableId: v.id('tables'),
    playerId: v.id('players'),
    nickname: v.string(),
    dice: v.string(),
    result: v.number(),
    createdAt: v.number(),
  }).index('by_table', ['tableId']),
})
