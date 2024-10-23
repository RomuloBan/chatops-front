import type { Context } from "@netlify/functions";


export default async (req: Request, context: Context) => {
	return new Response('{ "message": "Helloooo"}', { status: 200, headers: { 'Content-Type': 'application/json' } })
};