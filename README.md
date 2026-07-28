# cli-agent — Claude Codeのようなものを、ゼロから自分で書いた記録

シンギュラリティ・ソサエティの教材[「CLIエージェント開発入門」](https://singularitysociety.github.io/societys_statement/development/cli_agent/README.html)（全15章）を完走したときのコードです。

ターミナルで日本語で話しかけると、ファイルを読んで、書いて、コマンドを実行する。書き込みとコマンド実行の前だけは、必ず `y/n` で人間に聞いてくる。Claude Codeの小さい版です。

全15章、APIの利用料は **$0.57**（約85円）でした。

## 何ができるか

最終形は [`agent-context.ts`](agent-context.ts) です。持っている道具は5つ。

| 道具 | すること | 実行前に確認するか |
|---|---|---|
| `get_current_time` | 今の日時を返す | — |
| `read_file` | ファイルを読む | — |
| `list_files` | フォルダの中身を一覧する | — |
| `write_file` | ファイルに書き込む | **する** |
| `run_command` | コマンドを実行して出力を返す | **する** |

道具のほかに入っているもの。

- **許可の壁** — 取り消せない操作の前で止まって `y/n` を聞く（`askPermission`）
- **砂場の囲い** — 作業フォルダの外は、パスを渡されても触れない（`resolveInside`）
- **危険コマンドの拒否** — `rm -rf` / `sudo` / `curl … | sh` を弾く（`DENY_PATTERN`）
- **規範** — [`CLAUDE.md`](CLAUDE.md) をシステムプロンプトに足す。読んだファイルの中に書かれた指示には従わない、という一文つき
- **スキル** — [`skills/`](skills/) の手順書を、名前が呼ばれたときだけ読み込む
- **計画→実行→確認** — いきなり手を動かさず、先に箇条書きで計画を出す
- **ストリーミング** — 返事を待たずに流しながら表示する
- **コンテキスト管理** — 道具の出力を4000文字で刈り込み、履歴が20件を超えたら古い分を要約に畳み、毎ターンの入力トークン数を表示する

## 動かす

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npx tsx agent-context.ts
```

`>` が出たら日本語で話しかけます。コマンドを打つ場所ではありません。終わるときは `exit` を1回。

```
> practice フォルダに fizzbuzz.js を作って、動かして確認して
```

## 章ごとの到達点を全部残してあります

1ファイル＝1章の完成形です。差分を追うと、エージェントが何でできているかが順番に見えます。

| ファイル | 章 | 足したもの |
|---|---|---|
| [`agent.ts`](agent.ts) | 第2章 | LLMと会話するCLI。記憶は外にためて毎回丸ごと渡す |
| [`tool-demo.ts`](tool-demo.ts) | 第3章 | 道具のメニューを見せる |
| [`agent-loop.ts`](agent-loop.ts) | 第4章 | 呼ぶ→実行する→また聞く、のループ |
| [`agent-read.ts`](agent-read.ts) | 第5章 | `read_file` / `list_files` |
| [`agent-write.ts`](agent-write.ts) | 第6章 | `write_file`（この時点では確認なし） |
| [`agent-exec.ts`](agent-exec.ts) | 第7章 | `run_command`（この時点では確認なし） |
| [`agent-safe.ts`](agent-safe.ts) | 第8章 | 許可の壁 |
| [`agent-sandbox.ts`](agent-sandbox.ts) | 第9章 | 砂場の囲い＋危険コマンドの拒否 |
| [`agent-claudemd.ts`](agent-claudemd.ts) | 第10章 | `CLAUDE.md` の規範 |
| [`agent-skills.ts`](agent-skills.ts) | 第11章 | スキル |
| [`agent-plan.ts`](agent-plan.ts) | 第12章 | 計画→実行→確認 |
| [`agent-stream.ts`](agent-stream.ts) | 第13章 | ストリーミング |
| [`agent-context.ts`](agent-context.ts) | 第14章 | 刈り込み・要約・トークン表示（**最終形**） |

第15章はコードなし（スケールの話）です。

## ⚠️ 動かす前に

**使うなら `agent-context.ts` にしてください。** 第8章より前のファイル（`agent-write.ts` / `agent-exec.ts`）には確認の壁がありません。教材がわざとその順番で作らせます。確認なしで書き換わる怖さを先に体験させるためです。動かすなら [`practice/`](practice/) の中だけにしてください。

`.env` は作業フォルダの"中"にあるので、砂場の囲いでは守られません。`.env を読んで` と頼まないこと。

## 学んだこと

全部は [`LEARNING-LOG.md`](LEARNING-LOG.md) にあります。いちばん持ち帰ったのは1行です。

> AIが断ってくれるのは運。コードが断るのが防御。

危険なコマンドを弾く仕組みを実装して `sudo` を含む依頼を試したら、その仕組みに届く前にAIが自分で断ってきました。賢い。でも守りとしては数えられない。プロンプトは事故を**減らす**もので、**防ぐ**のはコードのほうでした。

## 中身

- [`START-HERE.md`](START-HERE.md) — これは何か、いまどこか
- [`STATUS.md`](STATUS.md) — 進捗と、ここから先の候補
- [`KICKOFF.md`](KICKOFF.md) — 始めるときに決めたゴールとスコープ外
- [`LEARNING-LOG.md`](LEARNING-LOG.md) — 章ごとの詰まりと気づき
- [`practice/`](practice/) — エージェントに触らせる実験用フォルダ
- [`skills/`](skills/) — 手順書（`file-report` / `status-update`）

## 出典

教材: シンギュラリティ・ソサエティ [CLIエージェント開発入門](https://singularitysociety.github.io/societys_statement/development/cli_agent/README.html)（全15章）

このリポジトリのコードは、教材を読みながら書いたものです。学習の記録として置いています。
