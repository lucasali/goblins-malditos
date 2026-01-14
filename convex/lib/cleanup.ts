import type { MutationCtx } from '../_generated/server'

export async function cleanupTable(ctx: MutationCtx, tableId: any) {
  const messages = await ctx.db.query('messages').withIndex('by_table', (q) => q.eq('tableId', tableId)).collect()
  const diceRolls = await ctx.db.query('diceRolls').withIndex('by_table', (q) => q.eq('tableId', tableId)).collect()
  const players = await ctx.db.query('players').withIndex('by_table', (q) => q.eq('tableId', tableId)).collect()

  for (const message of messages) {
    await ctx.db.delete(message._id)
  }
  for (const roll of diceRolls) {
    await ctx.db.delete(roll._id)
  }
  for (const player of players) {
    await ctx.db.delete(player._id)
  }

  await ctx.db.delete(tableId)
}
