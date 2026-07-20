import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";
import * as fs from "node:fs/promises";
import path from "node:path";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCb);

const anthropic = new Anthropic();
const MODEL = "claude-opus-4-8";
const SYSTEM_PROMPT = "あなたは親切なアシスタントです。日本語で簡潔に答えてください。";

// ★第9章①：砂場の囲い。ここより外は触らせない
const WORK_DIR = process.cwd();

function resolveInside(p: string): string {
  const abs = path.resolve(WORK_DIR, p); // ../.. をほどいて絶対パスにしてから判定する
  if (!abs.startsWith(WORK_DIR)) {
    throw new Error("作業フォルダの外は触れません");
  }
  return abs;
}

// ★第9章②：危険コマンドの拒否（※拒否リストは必ず漏れる。本来は許可リスト方式が堅牢）
const DENY_PATTERN = /rm\s+-rf|sudo|curl\s+.*\|\s*sh/;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 人間に「実行していい？」と聞く。はっきり y のときだけ true（迷ったら安全側）
async function askPermission(question: string): Promise<boolean> {
  const answer = await rl.question(`${question} (y/n) `);
  return answer.trim().toLowerCase() === "y";
}

// 危ない道具の名簿。ここに追加すれば自動的に確認が入る
const DANGEROUS = new Set(["write_file", "run_command"]);

async function run_command(command: string): Promise<string> {
  if (DENY_PATTERN.test(command)) {
    return "危険なコマンドのため拒否しました";
  }
  const { stdout, stderr } = await exec(command, { cwd: WORK_DIR });
  return stdout + stderr;
}

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
  {
    name: "run_command",
    description: "ターミナルでコマンドを実行し、その出力（標準出力＋エラー出力）を返す。例：npm test",
    input_schema: {
      type: "object",
      properties: {
        command: { type: "string", description: "実行するコマンド。例: 'npm test'" },
      },
      required: ["command"],
    },
  },
];

async function executeTool(name: string, input: any): Promise<string> {
  // 第8章：危険な道具は、実行前に必ず人間に聞く
  if (
    DANGEROUS.has(name) &&
    !(await askPermission(`${name} を実行していい？ ${JSON.stringify(input)}`))
  ) {
    return "ユーザーが拒否しました";
  }

  try {
    switch (name) {
      case "get_current_time": return new Date().toString();
      case "add": return String(input.a + input.b);
      // 第9章：ファイル操作はすべて resolveInside の関所を通す
      case "read_file": return await fs.readFile(resolveInside(input.path), "utf-8");
      case "list_files": return (await fs.readdir(resolveInside(input.dir))).join("\n");
      case "write_file":
        await fs.writeFile(resolveInside(input.path), input.content);
        return `書き込みました: ${input.path}`;
      case "run_command": return await run_command(input.command);
      default: return `不明な道具: ${name}`;
    }
  } catch (e) {
    return `エラー: ${e instanceof Error ? e.message : String(e)}`;
  }
}

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
      printText(res);
      return;
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      console.log(`（${step + 1}回目：AIが道具「${block.name}」を使いたがっている）`);
      const result = await executeTool(block.name, block.input);
      toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result });
    }
    messages.push({ role: "user", content: toolResults });
  }
}

while (true) {
  const userInput = await rl.question("> ");
  if (userInput === "exit") break;
  await runAgent(userInput);
}
rl.close();
