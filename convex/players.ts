import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { cleanupTable } from './lib/cleanup'

const MAX_PLAYERS = 12

export const joinTable = mutation({
  args: {
    slug: v.string(),
    sessionId: v.string(),
    nickname: v.string(),
  },
  handler: async (ctx, args) => {
    const table = await ctx.db
      .query('tables')
      .withIndex('by_slug', q => q.eq('slug', args.slug))
      .unique()

    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    const existingPlayer = await ctx.db
      .query('players')
      .withIndex('by_table_session', q => q.eq('tableId', table._id).eq('sessionId', args.sessionId))
      .unique()

    if (existingPlayer) {
      if (existingPlayer.nickname !== args.nickname) {
        await ctx.db.patch(existingPlayer._id, { nickname: args.nickname })
      }

      return { tableId: table._id, playerId: existingPlayer._id, isMaster: existingPlayer.isMaster }
    }

    const players = await ctx.db
      .query('players')
      .withIndex('by_table', q => q.eq('tableId', table._id))
      .collect()

    if (players.length >= MAX_PLAYERS) {
      throw new Error('A mesa já atingiu o limite de 12 jogadores.')
    }

    const playerId = await ctx.db.insert('players', {
      tableId: table._id,
      sessionId: args.sessionId,
      nickname: args.nickname,
      goblinSeed: undefined,
      isMaster: false,
      joinedAt: Date.now(),
    })

    return { tableId: table._id, playerId, isMaster: false }
  },
})

export const leaveTable = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_table_session', q => q.eq('tableId', args.tableId).eq('sessionId', args.sessionId))
      .unique()

    if (!player) {
      return { left: false }
    }

    await ctx.db.delete(player._id)

    const remaining = await ctx.db
      .query('players')
      .withIndex('by_table', q => q.eq('tableId', args.tableId))
      .collect()

    if (remaining.length === 0) {
      await cleanupTable(ctx, args.tableId)
      return { left: true, cleaned: true }
    }

    return { left: true, cleaned: false }
  },
})

export const updateGoblin = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
    goblinSeed: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_table_session', q => q.eq('tableId', args.tableId).eq('sessionId', args.sessionId))
      .unique()

    if (!player) {
      throw new Error('Jogador não encontrado.')
    }

    await ctx.db.patch(player._id, { goblinSeed: args.goblinSeed })
    return { updated: true }
  },
})

export const kickPlayer = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
    playerId: v.id('players'),
  },
  handler: async (ctx, args) => {
    const table = await ctx.db.get(args.tableId)
    if (!table) {
      throw new Error('Mesa não encontrada.')
    }

    if (table.masterSessionId !== args.sessionId) {
      throw new Error('Somente o mestre pode remover jogadores.')
    }

    const target = await ctx.db.get(args.playerId)
    if (!target || target.tableId !== args.tableId) {
      return { kicked: false }
    }

    await ctx.db.delete(args.playerId)

    const remaining = await ctx.db
      .query('players')
      .withIndex('by_table', q => q.eq('tableId', args.tableId))
      .collect()

    if (remaining.length === 0) {
      await cleanupTable(ctx, args.tableId)
      return { kicked: true, cleaned: true }
    }

    return { kicked: true, cleaned: false }
  },
})

export const getTablePlayers = query({
  args: { tableId: v.optional(v.id('tables')) },
  handler: async (ctx, args) => {
    if (!args.tableId) {
      return []
    }
    const tableId = args.tableId
    return await ctx.db
      .query('players')
      .withIndex('by_table', q => q.eq('tableId', tableId))
      .collect()
  },
})
