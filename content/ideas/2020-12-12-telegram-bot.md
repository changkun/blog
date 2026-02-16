---
date: 2020-12-12T00:00:00
title: "Telegram Bot"
title_zh: "Telegram 机器人"
---

{{% en %}}
Because the COVID situation in Europe is still terrible, even shopping at an Apple Store requires an appointment in advance. Since I urgently needed to visit an Apple Store recently but couldn't find any available appointment slots, I quickly hacked together a tool to check availability and send a reminder message via Telegram when an appointment becomes available. Tool link: https://changkun.de/s/apreserve

Interacting with Telegram using Go is straightforward:
1. Create a bot from BotFather
2. Obtain the bot's token and the chat ID for your conversation with it
3. Then you can handle messages

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
	bot.Send(tg.NewMessage(chatid, "text"))
}
```
{{% /en %}}

{{% zh %}}
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
	bot.Send(tg.NewMessage(chatid, "text"))
}
```
{{% /zh %}}
