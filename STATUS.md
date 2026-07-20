# 進捗ボード — cli-agent（2026-07-20）

# 🎓 全15章 完走 — 完成の定義を達成

## ✅ 完了したこと
- [x] Phase 0: 環境確認（Node v24.16.0）＋Anthropicキー取得（$5クレジット・自動リロードOFF・30日期限）＋第1章
- [x] Phase 1（第2章）: agent.ts — LLMと会話するCLI。記憶は外にためて毎回渡す
- [x] Phase 2（第3〜7章）: 道具メニュー → ループ → 読む → 書く → コマンド実行
- [x] Phase 3（第8〜10章）: 許可確認 → サンドボックス＋git → CLAUDE.md（罠入りファイルでインジェクション防御を確認）
- [x] Phase 4（第11〜14章）: スキル → 計画→実行→確認 → ストリーミング → コンテキストとコスト
- [x] Phase 5（第15章）: スケールの物語（読了）
- [x] 実地デバッグ1件: max_tokens 超過による tool_use/tool_result の不整合（400）を自力で診断・修正

## 📦 成果物
- **agent-context.ts … 最終形**（道具5つ＋ループ＋許可＋囲い＋規範＋スキル＋計画→確認＋ストリーミング＋刈り込み/要約/トークン表示）
- agent.ts / tool-demo.ts / agent-loop.ts / agent-read.ts / agent-write.ts / agent-exec.ts / agent-safe.ts / agent-sandbox.ts / agent-claudemd.ts / agent-skills.ts / agent-plan.ts / agent-stream.ts … 各章の到達点（学習用に残してある）
- CLAUDE.md（規範）／skills/（file-report, status-update）／practice/（実験用）

## 💰 コスト実績
全15章で **$0.57**（残高 $4.44 / トークン1万）。1章あたり4〜5円

## 🛡 安全メモ
- 使うなら **agent-context.ts**。第8章より前の版は確認の壁が無いので、練習フォルダ以外に向けて動かさない
- .env は作業フォルダの"中"なのでサンドボックスでは守られない。`.env を読んで` は禁止
- git のセーブポイントあり。何かあったら `git restore .`

## ⏭ ここから（教材の締めの言葉＝「終わりではなく、ここから歩き出すだけ」）
- 次の一歩の候補: agent-context.ts に**新しい道具を1つ足す**（教材の推奨）
- 付録も未読: 付録B（別のLLM）／付録C（JSON Schema）／付録F（コスト管理）／付録G（MCPの考え方）
- 実務転用の芽: チームにんにくのエージェント設計に「4層の防御」と「取り消せない操作はコードで止める」を適用する
