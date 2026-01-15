import { httpRouter } from 'convex/server'
import { api } from './_generated/api'
import { httpAction } from './_generated/server'

const http = httpRouter()

http.route({
  path: '/leave',
  method: 'POST',
  handler: httpAction(async (ctx, request) => {
    let body: { tableId?: string, sessionId?: string } | null = null
    try {
      body = await request.json()
    }
    catch {
      return new Response('Invalid JSON body.', { status: 400 })
    }

    if (!body?.tableId || !body?.sessionId) {
      return new Response('Missing tableId or sessionId.', { status: 400 })
    }

    await ctx.runMutation(api.players.leaveTable, {
      tableId: body.tableId as any,
      sessionId: body.sessionId,
    })

    return new Response(null, { status: 204 })
  }),
})

export default http
