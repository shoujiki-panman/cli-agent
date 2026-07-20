# START HERE — cli-agent（CLIエージェント自作学習）

新しいAIセッションを始めたら、このファイルと STATUS.md を最初に読む。
セッションを終える前に、必ず STATUS.md を今日の状態に更新する。

## これは何
Claude Codeのようなエージェントを自作しながら仕組みを学ぶ（教材＝シンギュラリティ・ソサエティ「CLIエージェント開発入門」全15章）。
背骨は2本：「AIは思考のみ・実行は道具」「能力拡張は危険と表裏一体（人間確認・最小権限）」。

## いまの状態
**🎓 2026-07-20に全15章を完走。完成の定義を達成した。**
最終形は `agent-context.ts`。学びの総括は LEARNING-LOG.md の末尾にある。

## 動かし方
```
cd /Users/tanumashuu/Documents/Codex/2026-06-24/handoff-next-chat-2026-06-24/work/cli-agent
npx tsx agent-context.ts
```
`>` が出たら日本語で話しかける（コマンドを打つ場所ではない）。終わるときは `exit` を1回。
書き込み・コマンド実行の前には確認(y/n)が出る。実験は `practice/` の中だけで行う。

## 次の一手（やるなら）
教材の締めの推奨どおり、`agent-context.ts` に**新しい道具を1つ足す**のが小さくて良い一歩。
未読の付録（B: 別のLLM / C: JSON Schema / F: コスト管理 / G: MCP）もある。
