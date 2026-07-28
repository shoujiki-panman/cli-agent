# 書き込みとコマンド実行の前で、必ず人間に聞いて止まる。
# 撮り直す: cd demo && vhs permission.tape

Output permission.gif

Set Shell "bash"
Set FontFamily "Menlo"
Set FontSize 17
Set Width 1100
Set Height 640
Set Padding 24
Set Framerate 12
Set TypingSpeed 55ms
Set Theme "Catppuccin Mocha"

Hide
Type "cd .. && clear"
Enter
Sleep 1s
Show

Type "npx tsx agent-context.ts"
Enter
Sleep 6s

Type "practice/hello2.js を作って、実行して動くか確認して"
Sleep 1s
Enter
Sleep 30s

Type "y"
Sleep 800ms
Enter
Sleep 25s

Type "y"
Sleep 800ms
Enter
Sleep 30s

Type "exit"
Enter
Sleep 2s
