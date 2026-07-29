# わざと壊したファイルを、実行→失敗→原因を読む→直す→もう一度実行、まで自分でやらせる。
# 撮る前に practice/greet.js の name を nama に書き換えて壊しておくこと。
# 撮り直す: cd demo && vhs selfrepair.tape

Output selfrepair.gif

Set Shell "bash"
Set FontFamily "Menlo"
Set FontSize 17
Set Width 1100
Set Height 700
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

Type "practice/greet.js を実行して、動くように直して"
Sleep 1s
Enter
Sleep 28s

Type "y"
Sleep 800ms
Enter
Sleep 28s

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
