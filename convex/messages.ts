import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const MAX_MESSAGES = 100

export const sendMessage = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_table_session', q => q.eq('tableId', args.tableId).eq('sessionId', args.sessionId))
      .unique()

    if (!player) {
      throw new Error('Jogador não encontrado.')
    }

    const trimmed = args.content.trim()
    if (!trimmed) {
      return null
    }

    await ctx.db.insert('messages', {
      tableId: args.tableId,
      playerId: player._id,
      nickname: player.nickname,
      content: trimmed.slice(0, 400),
      createdAt: Date.now(),
    })

    const allMessages = await ctx.db
      .query('messages')
      .withIndex('by_table', q => q.eq('tableId', args.tableId))
      .order('asc')
      .collect()

    if (allMessages.length > MAX_MESSAGES) {
      const excess = allMessages.slice(0, allMessages.length - MAX_MESSAGES)
      for (const message of excess) {
        await ctx.db.delete(message._id)
      }
    }

    return { sent: true }
  },
})

export const getMessages = query({
  args: { tableId: v.optional(v.id('tables')) },
  handler: async (ctx, args) => {
    if (!args.tableId) {
      return []
    }
    const tableId = args.tableId
    return await ctx.db
      .query('messages')
      .withIndex('by_table', q => q.eq('tableId', tableId))
      .order('asc')
      .collect()
  },
})
