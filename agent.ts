import "dotenv/config"; // .env を読み込んで環境変数にする（いちばん上で1回だけ）
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "node:readline/promises";

const anthropic = new Anthropic(); // 環境変数 ANTHROPIC_API_KEY を自動で読む
const MODEL = "claude-opus-4-8"; // 賢い既定。コストは付録Fで安いモデルに替えられる

const SYSTEM_PROMPT = "あなたは親切なアシスタントです。日本語で簡潔に答えてください。";

const messages: Anthropic.MessageParam[] = []; // ← 会話の履歴（最初は空っぽ）

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

while (true) {
  const userInput = await rl.question("> ");
  if (userInput === "exit") break;

  messages.push({ role: "user", content: userInput }); // あなたの発言を履歴に積む

  const res = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages, // ← これまでの履歴を毎回まるごと渡す
  });

  const reply = res.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  console.log(reply);

  messages.push({ role: "assistant", content: res.content }); // AIの返事も履歴に積む
}

rl.close();
