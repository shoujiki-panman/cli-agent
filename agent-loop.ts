import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";

const anthropic = new Anthropic();
const MODEL = "claude-opus-4-8";
const SYSTEM_PROMPT = "あなたは親切なアシスタントです。日本語で簡潔に答えてください。";

// 道具メニュー（説明書だけ）。今回は2つ：時刻と足し算
const tools: Anthropic.Tool[] = [
  {
    name: "get_current_time",
    description: "今の日時を返す。引数は不要。",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "add",
    description: "2つの数 a と b を足し算して返す。",
    input_schema: {
      type: "object",
      properties: { a: { type: "number" }, b: { type: "number" } },
      required: ["a", "b"],
    },
  },
];

// 実体（実際に手を動かす普通のコード）
async function executeTool(name: string, input: any): Promise<string> {
  switch (name) {
    case "get_current_time":
      return new Date().toString();
    case "add":
      return String(input.a + input.b);
    default:
      return `不明な道具: ${name}`;
  }
}

// 最終回答（テキスト）を表示する
function printText(res: Anthropic.Message) {
  const text = res.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.TextBlock).text)
    .join("");
  if (text) console.log(text);
}

const messages: Anthropic.MessageParam[] = [];

async function runAgent(userInput: string) {
  messages.push({ role: "user", content: userInput });

  for (let step = 0; step < 10; step++) { // 暴走防止に上限10回
    const res = await anthropic.messages.create({
      model: MODEL, max_tokens: 1024, system: SYSTEM_PROMPT, messages, tools,
    });
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      printText(res); // 最終回答を表示して終了
      return;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      console.log(`（${step + 1}回目：AIが道具「${block.name}」を使った）`);
      const result = await executeTool(block.name, block.input);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }
    messages.push({ role: "user", content: toolResults });
  }
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
while (true) {
  const userInput = await rl.question("> ");
  if (userInput === "exit") break;
  await runAgent(userInput);
}
rl.close();
