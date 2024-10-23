import type { Context } from "@netlify/functions";

import { parse } from "querystring";
import { slackApi } from "./util/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case '/foodfight':
			const joke = await fetch('https://icanhazdadjoke.com', {
				headers: { 'accept': 'text/plain' }
			})
			const response = await slackApi('chat.postMessage', {
				channel: payload.channel_id,
				text: await joke.text(),
			})

			if (!response.ok) {
				console.log(response);
			}
			break;
		default:
			return new Response(`Command ${payload.command} is not recognized`, { status: 200})
	}

	return new Response('', { status: 200})
}

export default async (req: Request, context: Context) => {

	const body = await req.text();
	const parsedBody = parse(body) as SlackPayload;
	if (parsedBody.command) {
		return handleSlashCommand(parsedBody as SlackSlashCommandPayload);
	}
	
	return new Response('{"message": "helo slack"}', { status: 200, headers: { 'Content-Type': 'application/json' } })
};