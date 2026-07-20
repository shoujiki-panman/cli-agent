import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();
const MODEL = "claude-opus-4-8";
const SYSTEM_PROMPT = "あなたは親切なアシスタントです。日本語で簡潔に答えてください。";

// ① 道具メニュー定義（説明書だけ。中身の実装はここには無い）
const tools: Anthropic.Tool[] = [{
  name: "get_current_time",
  description: "今の日時を返す。引数は不要。",
  input_schema: {
    type: "object",
    properties: {},
    required: [],
  },
}];

// ④ 実行処理の実装（説明書に対応する「実際の料理」）
async function executeTool(name: string, input: any): Promise<string> {
  switch (name) {
    case "get_current_time":
      return new Date().toLocaleString("ja-JP");
    default:
      return `不明な道具: ${name}`;
  }
}

// ② LLMへ、メニューを添えて質問する
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "いま何時？" },
];

const res = await anthropic.messages.create({
  model: MODEL,
  max_tokens: 1024,
  system: SYSTEM_PROMPT,
  messages,
  tools,
});

// ③ 道具を使いたいと言ってきたか判定して、実際に実行する
if (res.stop_reason === "tool_use") {
  for (const block of res.content) {
    if (block.type !== "tool_use") continue;
    console.log(`（AIが道具「${block.name}」を指さした）`);
    const result = await executeTool(block.name, block.input);

    // ⑤ 「呼んだ発言(assistant)」と「その結果(tool_result)」をセットで積む
    messages.push({ role: "assistant", content: res.content });
    messages.push({
      role: "user",
      content: [
        { type: "tool_result", tool_use_id: block.id, content: result },
      ],
    });
  }

  // ⑥ もう一度呼んで、結果を文章にまとめてもらう
  const final = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
    tools,
  });

  const text = final.content.find((b) => b.type === "text");
  if (text && text.type === "text") console.log(text.text);
}
