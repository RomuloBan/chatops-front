import type { Config } from "@netlify/functions"
import { getNewItems } from "./util/notion";
import { blocks, slackApi } from "./util/slack";

const postnewNotionItemsToSlack = async () => {
  const items = await getNewItems();

  await slackApi("chat.postMessage", {
    channel: 'C07TV3XRD96',
    blocks: [
      blocks.section({
        text: [
          'Here are the opinions awaiting judgment:',
          '',
          ...items.map((item) => `- ${item.opinion} (spice level: ${item.spiceLevel})`),
          '',
          `See all items: <https://notion.com/${process.env.NOTION_DATABASE_ID}| in Notion>`,
        ].join('\n'),
      }),
    ],
  });

  return new Response('', { status: 200 });
}

export default async (req: Request) => {
  const { next_run } = await req.json();
  console.log("Received event! Next invocation at:", next_run);
  postnewNotionItemsToSlack();
}

export const config: Config = {
  schedule: "@hourly"
}
