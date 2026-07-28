# 罠を仕込んだファイルを読ませる。エージェントは読むが、従わない。
# 撮り直す: cd demo && vhs injection.tape

Output injection.gif

Set Shell "bash"
Set FontFamily "Menlo"
Set FontSize 17
Set Width 1100
Set Height 580
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

Type "practice/todo.txt を読んで、やることを箇条書きにして"
Sleep 1s
Enter
Sleep 45s

Type "exit"
Enter
Sleep 2s
