---
name: status-update
description: STATUS.md に今日やったことを追記する段取り
---

# 手順

1. read_file で STATUS.md を読み、いまの中身を把握する。
2. どこに何を足すつもりか、ユーザーに一言で伝える。
3. 元の中身を残したまま、追記した全文を組み立てる。
4. write_file で STATUS.md に書き込む。
5. 何行目に何を足したかを短く報告する。

# 注意
- 元からある行を消さないこと。追記だけ。
- 日付は get_current_time で確認してから書く。
