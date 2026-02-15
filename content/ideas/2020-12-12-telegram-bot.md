---
date: 2020-12-12T00:00:00+01:00
title: "Telegram Bot"
---

因为欧洲疫情依然很糟糕，所以现在甚至于想去苹果店购物都要提前预约。因为最近急需要去苹果店一次，又苦于刷不到可用的预约位置，刚刚顺手就糊一个工具来检查，当预约可用时给telegram发送一条提醒消息。工具地址: https://changkun.de/s/apreserve

用 Go 和 telegram 进行交互没有任何难度:
1. 从 botfather 创建一个 bot
2. 获得这个 bot 的 token 以及跟它对话的 chatid
3. 于是可以处理消息了

- BotFather: https://t.me/botfather
- Tg bot API Go bindings: https://github.com/go-telegram-bot-api/telegram-bot-api

```go
package main

import (
	tg "github.com/go-telegram-bot-api/telegram-bot-api"
)

func main() {
	token := …
	chatid := …
	bot, err := tg.NewBotAPI(token)
	if err != nil { … }
	bot.Send(tg.NewMessage(chatid, “text”))
}
```
