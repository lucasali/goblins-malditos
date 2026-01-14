import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { cleanupTable } from './lib/cleanup'

export const createTable = mutation({
  args: {
    slug: v.string(),
    sessionId: v.string(),
    nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('tables')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique()

    if (existing) {
      throw new Error('Uma mesa com essa slug já existe.')
    }

    const tableId = await ctx.db.insert('tables', {
      slug: args.slug,
      masterSessionId: args.sessionId,
      createdAt: Date.now(),
    })

    const playerId = await ctx.db.insert('players', {
      tableId,
      sessionId: args.sessionId,
      nickname: args.nickname,
      goblinSeed: undefined,
      isMaster: true,
      joinedAt: Date.now(),
    })

    return { tableId, playerId }
  },
})

export const getTableBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('tables')
      .withIndex('by_slug', (q) => q.eq('slug', args.slug))
      .unique()
  },
})

export const deleteTable = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const table = await ctx.db.get(args.tableId)
    if (!table) {
      return null
    }

    if (table.masterSessionId !== args.sessionId) {
      throw new Error('Somente o mestre pode deletar a mesa.')
    }

    await cleanupTable(ctx, args.tableId)
    return { deleted: true }
  },
})
