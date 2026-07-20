import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import * as fs from "node:fs/promises";

const anthropic = new Anthropic();
const MODEL = "claude-opus-4-8";
const SYSTEM_PROMPT = "あなたは親切なアシスタントです。日本語で簡潔に答えてください。";

// 道具メニュー。第5章までの道具に write_file を追加
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
  {
    name: "read_file",
    description: "指定したパスのファイルの中身を、文字列で返して読む。",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "読みたいファイルのパス。例: src/index.ts" },
      },
      required: ["path"],
    },
  },
  {
    name: "list_files",
    description: "指定したフォルダの中にあるファイル・フォルダの名前を一覧する。",
    input_schema: {
      type: "object",
      properties: {
        dir: { type: "string", description: "中身を見たいフォルダのパス。例: src" },
      },
      required: ["dir"],
    },
  },
  // ⚠️ 危険：既存ファイルを丸ごと上書きする。確認機能はまだ無い（第8章で追加）
  {
    name: "write_file",
    description: "指定したパスのファイルに content を書き込む。ファイルが既にあれば上書きする。",
    input_schema: {
      type: "object",
      properties: {
        path: { type: "string", description: "書き込むファイルのパス" },
        content: { type: "string", description: "ファイルに書き込む中身（全文）" },
      },
      required: ["path", "content"],
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

    case "read_file":
      try {
        return await fs.readFile(input.path, "utf-8");
      } catch (e) {
        return `読み込み失敗: ${(e as Error).message}`;
      }

    case "list_files":
      try {
        const names = await fs.readdir(input.dir);
        return names.join("\n");
      } catch (e) {
        return `一覧の取得に失敗: ${(e as Error).message}`;
      }

    // ⚠️ 上書き注意：前の中身は消える。取り消しできない
    case "write_file":
      await fs.writeFile(input.path, input.content);
      return `書き込み成功: ${input.path}`;

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
