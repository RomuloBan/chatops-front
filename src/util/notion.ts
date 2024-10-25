export async function notionApi(endpoint: String, body: {} = Object) {
	const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
		method: 'POST',
		headers: {
			'accept': 'application/json',
			Authorization: `Bearer ${process.env.NOTION_SECRET}`,
			'Content-Type': 'application/json',
			'Notion-Version': '2022-06-28',
		},
		body: JSON.stringify(body),
	}).catch((err) => console.log(err));

	if (!res?.ok) {
		console.log(res);
	}

	const data = await res?.json();
	return	data;
}

export async function getNewItems(): Promise<NewItem[]> {
	const notionData = await notionApi(`databases/${process.env.NOTION_DATABASE_ID}/query`, {
		filter: {
			property: 'Status',
			status: {
				equals: 'new',
			},
			page_size: 100,
		},
	});

	const newItems = notionData.results.map((item: NotionItem) => {
		return {
			opinion: item.properties.opinion.title[0].text.content,
			spiceLevel: item.properties.spiceLevel.select.name,
			status: item.properties.Status.status.name,
		};
	});

	return newItems;
}

export async function saveItem(item: NewItem) {
	const res = await notionApi(`/pages`, {
		parent : {
			database_id: process.env.NOTION_DATABASE_ID,
		},
		properties: {
			opinion: {
				title: [{ text: { content: item.opinion } }],
			},
			spiceLevel: {
				select: {
					name: item.spiceLevel,
				},
			},
			submitter: {
				rich_text: [{ text: { content: `@${item.submitter} on Slack` } }],
			}
		}
	});

	if (!res?.ok) {
		console.log(res);
	}
}