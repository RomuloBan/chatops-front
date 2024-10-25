import type { Context } from "@netlify/functions";

import { parse } from "querystring";
import { modal, slackApi, verifySlackRequest, blocks } from "./util/slack";

async function handleSlashCommand(payload: SlackSlashCommandPayload) {
	switch (payload.command) {
		case '/foodfight':
			const response = await slackApi('views.open',
				modal({
						id: 'foodfight-modal',
						title: 'Start a food fight!',
						trigger_id: payload.trigger_id,
						blocks: [
							blocks.section({
								text: 'The discourse demands food drama! *Send in your spiciest food takes so we can all argue about them and feel alive.*',
							}),
							blocks.input({
								id: 'opinion',
								label: 'Deposit your controversial food opinions here.',
								placeholder:
									'Example: peanut butter and mayonnaise sandwiches are delicious!',
								initial_value: payload.text ?? '',
								hint: 'What do you believe about food that people find appalling? Say it with your chest!',
							}),
							blocks.select({
								id: 'spice_level',
								label: 'How spicy is this opinion?',
								placeholder: 'Select a spice level',
								options: [
									{ label: 'mild', value: 'mild' },
									{ label: 'medium', value: 'medium' },
									{ label: 'spicy', value: 'spicy' },
									{ label: 'nuclear', value: 'nuclear' },
								],
							}),
						],
					})
			);

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
	const isValid = verifySlackRequest(req, body);

	if (!isValid) {
		console.log('invalid request');
		return new Response('invalid request', { status: 400 })
	}


	if (parsedBody.command) {
		return handleSlashCommand(parsedBody as SlackSlashCommandPayload);
	}
	
	return new Response('{"message": "helo slack"}', { status: 200, headers: { 'Content-Type': 'application/json' } })
};