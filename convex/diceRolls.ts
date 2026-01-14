import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

const MAX_ROLLS = 50

function parseDice(dice: string) {
  const normalized = dice.trim().toLowerCase()
  const match = normalized.match(/^d(\d+)$/)
  if (!match) {
    return null
  }
  const sides = Number.parseInt(match[1], 10)
  if (!Number.isFinite(sides) || sides < 2 || sides > 100) {
    return null
  }
  return { sides, label: `d${sides}` }
}

export const rollDice = mutation({
  args: {
    tableId: v.id('tables'),
    sessionId: v.string(),
    dice: v.string(),
  },
  handler: async (ctx, args) => {
    const player = await ctx.db
      .query('players')
      .withIndex('by_table_session', (q) => q.eq('tableId', args.tableId).eq('sessionId', args.sessionId))
      .unique()

    if (!player) {
      throw new Error('Jogador não encontrado.')
    }

    const parsed = parseDice(args.dice)
    if (!parsed) {
      throw new Error('Tipo de dado inválido.')
    }

    const result = Math.floor(Math.random() * parsed.sides) + 1

    await ctx.db.insert('diceRolls', {
      tableId: args.tableId,
      playerId: player._id,
      nickname: player.nickname,
      dice: parsed.label,
      result,
      createdAt: Date.now(),
    })

    const allRolls = await ctx.db
      .query('diceRolls')
      .withIndex('by_table', (q) => q.eq('tableId', args.tableId))
      .order('asc')
      .collect()

    if (allRolls.length > MAX_ROLLS) {
      const excess = allRolls.slice(0, allRolls.length - MAX_ROLLS)
      for (const roll of excess) {
        await ctx.db.delete(roll._id)
      }
    }

    return { result }
  },
})

export const getDiceRolls = query({
  args: { tableId: v.optional(v.id('tables')) },
  handler: async (ctx, args) => {
    if (!args.tableId) {
      return []
    }
    const tableId = args.tableId
    return await ctx.db
      .query('diceRolls')
      .withIndex('by_table', (q) => q.eq('tableId', tableId))
      .order('asc')
      .collect()
  },
})
