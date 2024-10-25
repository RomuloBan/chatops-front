export async function notionApi(endpoint: String, body: {} = Object) {
	const res = await fetch(`https://api.notion.com/v1/${endpoint}`, {
		method: 'POST',
		headers: {
			'accpet': 'application/json',
			Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
			'Content-Type': 'application/json',
			'Notion-Version': '2022-06-2828',
		},
		body: JSON.stringify(body),
	}).catch((err) => console.log(err));

	if (!res?.ok) {
		console.log(res);
	}

	const data = await res?.json();
	return	data;
}