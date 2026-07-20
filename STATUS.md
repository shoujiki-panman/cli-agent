# 進捗ボード — cli-agent（2026-07-18）

## ✅ 完了したこと
- [x] プロジェクト立ち上げ（4点セット作成、完成の定義＝全15章完走で合意）
- [x] Phase 0: 環境確認 Node.js v24.16.0 / npm 11.13.0 ✅
- [x] Phase 0: Anthropic APIキー取得（$5クレジット購入・自動リロードOFF・キー有効期限30日）→ .env に貼付、形式OK（sk-ant-、108文字）
- [x] Phase 0: 第1章読了＋自分の言葉でLEARNING-LOGに記録
- [x] Phase 1（第2章）: agent.ts 作成・npm install（@anthropic-ai/sdk, dotenv）・実行してLLMと往復成功 ✅（「何ができますか？」に実際に応答が返った）

- [x] Phase 1（第2章）完了: 本人が対話実行し記憶が効くのを体感（名前を覚えていた）＋他プロジェクト（ツイッター/ChatGPTクローン）と骨が同じと接続できた
- [x] Phase 2の第3章完了: tool-demo.ts を実行し get_current_time が発火（「AIが道具を指さす→コードが実行→結果を文章化」を体感）
- [x] Phase 2の第4章完了: agent-loop.ts を実行。道具が複数回・複数種ループして使われ、結果を見て次を考える様子を体感（エージェントの心臓）＋上限10回の暴走ブレーキを理解
- [x] Phase 2の第5章完了: agent-read.ts で list_files / read_file が発火。自作エージェントが自分のSTATUS.mdを読んで要約した（エージェントが「見る目」を獲得）
- [x] Phase 2の第6章完了: agent-write.ts で practice/memo.txt を実際に書き換え（3行→4行）。確認なしで書き込まれる怖さを体感＝第8章の動機
- [x] **Phase 2 完了**（第7章）: agent-exec.ts で run_command が発火。AIが日本語を `ls -la practice` / `wc -l ...` に翻訳して実行。読む・書く・コマンドの3道具が揃った

- [x] Phase 3の第8章完了: agent-safe.ts で askPermission を実装。拒否(n)→AIが引き下がる／許可(y)→実行、を体験。Claude Codeの「実行していい?」を自作できた

## 🔨 いまやっていること
- （小休止）次は 第9章「サンドボックスと最小権限」＝そもそも触れる範囲を狭める（.envが読める穴・`../..`で外に出られる穴を塞ぐ）

## ⏭ 残り
- Phase 3の残り: 第9章（サンドボックス）→ 第10章（システムプロンプト/CLAUDE.md）→ Phase 4（第11〜14章）→ Phase 5（第15章）

## 🛡 安全メモ
- agent-safe.ts が現時点の最新・安全版。agent-write.ts / agent-exec.ts は確認の壁が無い旧版なので、練習フォルダ以外に向けて動かさない

## 🧪 練習用
- practice/ … 消えても困らない実験用フォルダ（memo.txt）。書き込み系の実験は必ずこの中だけで行う

## ⚠️ 操作の注意（つまずいた点）
- `>` が出ていたら「AIと会話中」、`ユーザー名 ... %` が出ていたらターミナル。ここを取り違えてコマンドをAIに話しかける事故が2回。`exit` の連打はターミナルごと閉じるので1回だけ

## 📁 ファイルメモ
- agent.ts … 第2章のおしゃべりCLI（対話実行、exitで終了）
- tool-demo.ts … 第3章の道具デモ（1往復、自動で走って終わる）
- agent-loop.ts … 第4章のループ版（道具=時刻+足し算、対話実行、exitで終了）

## ⚠️ ハマりどころメモ
- 教材ページにpackage.json設定の記載が無いが、agent.tsはトップレベルawait＋ESM importなので package.json に `"type": "module"` が必須。無いと tsx が cjs 扱いで "Top-level await is currently not supported" エラー → 追記して解決
- 入力をパイプで流すと最後に `ERR_USE_AFTER_CLOSE: readline was closed` が出るが、これはテスト方法の副作用。対話実行（手で入力）なら出ない
- 教材は「Anthropic Claude推奨、OpenAI対応可（付録B）」。手持ちキーはOpenAIのみだったのでAnthropicを新規取得した
