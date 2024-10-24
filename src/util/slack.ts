import type { HandlerEvent } from "@netlify/functions"
import { createHmac } from "crypto"
import { parse } from "querystring";

export function slackApi(
	endpoint: SlackApiEndpoint,
	body: SlackApiRequestBody,
) {
	return fetch(`https://slack.com/api/${endpoint}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${process.env.SLACK_BOT_AUTH_TOKEN}`,
			'Content-Type': 'application/json; charset=utf-8',
		},
		body: JSON.stringify(body)
	})
}

export function verifySlackRequest(request: Request, body: String) {
	const secret = process.env.SLACK_SIGNING_SECRET!;
	const signature = request.headers.get('x-slack-signature');
	const timestamp = Number(request.headers.get('x-slack-request-timestamp'));
	const now = Math.floor(Date.now() / 1000);
	if (Math.abs(now - timestamp) > 300) {
		return false;
	}
	const hash = createHmac('sha256', secret)
		.update(`v0:${timestamp}:${body}`)
		.digest('hex');

	return `v0=${hash}` === signature;
}
