title: Electron 编写跨平台客户端的若干最佳实践
id: 102
date: 2016-09-27 00:03:34
tags:
  - 前端
  - JavaScript
  - Electron
---

[Electron](http://electron.atom.io) 是从 [Atom](https://atom.io) 项目中析出的一个很有意思的框架，这为我们 ES6 来编写跨平台桌面应用的可能性。去年实习的时候一直在研究实践此框架，对于这里面现存的坑也踩了有不少。如今产品基本上稳定运行两三个月，因此写一篇文章来总结一下这个框架的一些最佳实践。

## 相关依赖

在前端的世界里很奇怪，开发者似乎非常乐于引入各种各样的依赖。最近有一篇非常著名的文章：[在 2016 年学 JavaScript 是一种什么样的体验？][js-2016]

我本人也是非常不喜欢随意的引入一对乱七八糟的框架。但是在早期的时候我曾今为了实现一个能够在 Electron 应用内执行命令行的功能而引入了一个非常简单的框架 `terminal-tab`。而实际上 NodeJS 本身可以使用 child_process 来执行一些命令，因此：

```js
require('child_process').exec(command, (error, stdout, stderr) => {
	//...处理错误
});
```

## 菜单与多窗口管理

既然是桌面应用，我们就绕不开需要设置应用的菜单选项。一个常见的需求就是对应用菜单在运行时动态修改。而这一点在 Electron 1.x 的版本中是做不到这一点的。因为我们在通过 `Menu.setApplicationMenu(menu)` 设置好菜单后对 menu 的修改就不会被响应了。官方建议的做法是对整个菜单进行重新创建。

这是不够友好的，如果我们希望某些菜单选项在某些情况下不能被点击，这就必须要在运行时将菜单进行修改。

在 [Menu](http://electron.atom.io/docs/api/menu/) 文档中提到了一种能够在 Render process 中创建菜单，如果结合 Electron 本身所具有的 Main process 和 Render process 的消息通信机制，就有可能实现这一点。

我们看下面的代码：

```js
//
// package.json
//
{
  "name": "electron-test",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "electron index.js"
  },
  "devDependencies": {
    "electron": "1.4.1"
  }
}

//
// index.js
//
'use strict'
const {app, BrowserWindow, ipcMain} = require('electron');

let win;
function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
          preload: `${__dirname}/preload.js`,
        }
    });
    win.loadURL(`https://changkun.de/blog`);
    win.on('closed', () => {
        app.exit(0);
    });
}

app.on('ready', createWindow);
ipcMain.on('menu', (event, status) => {
  switch(status) {
    case 'created':
      console.log(status);
      event.sender.send('menu', 'disable');
      break;
  }
});

//
// preload.js
//
'use strict';

const menu = require('./menu');
const {ipcRenderer} = require('electron');

menu.createMenu();
ipcRenderer.send('menu', 'created');

//
// menu.js
//
'use strict';

const electron = require('electron');
const remote   = electron.remote;
const Menu      = remote.Menu;
const ipcRenderer = electron.ipcRenderer;

function createMenu() {
    let menu = [{
      label: 'options',
      submenu: [{
            label: 'test1'
        }, {
            label: 'test2'
        }, {
          label: 'dev-tool',
          click: (item, focusedWindow) => {
            if (focusedWindow)
              focusedWindow.toggleDevTools();
          }
        }
      ]
    }];
    menu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(menu);
    ipcRenderer.on('menu', (event, arg) => {
      console.log('menu message reviced'); // appear on macOS, not appear on Windows.
      if (arg == 'disable')
        menu.items[0].submenu.items[1].enabled = false;
    });
}

module.exports.createMenu = createMenu;
```

在上面的代码中，我们将菜单的创建逻辑写在了 preload.js 中，也就是菜单的创建会在 Renderer 进行里进行。

而与此同时，在 menu.js 里的 createMenu 方法会创建一个对 `'menu'` 事件的监听，当收到消息时，将 `test2` 菜单 disable 。



但上面的代码如果仔细测试就会发现一个奇怪的地方，在 Mac 平台下，`test2` 被成功 disable 掉了，但 Windows 平台下却没有。这里面涉及一些 Electron 底层机制的问题：Electron 的 Renderer 进程只会在 `document` 对象创建后才会执行 `preload` 脚本，那么在应用创建的早期，如果一条消息从 Main 进程下发给 Renderer 进程，是不一定能够被收到的。为了保证消息能够被收到，我们应该让 DOM 被完整加载后，再通知主进程发送消息。

即：

```js
//
// preload.js
//
'use strict';

const menu = require('./menu');
const {ipcRenderer} = require('electron');

menu.createMenu();

// send the message when DOMConentLoaded event trigger
document.addEventListener('DOMContentLoaded', function() {
    ipcRenderer.send('menu', 'created');
});
```

## Electron 应用体积问题与业务逻辑层分离

Electron 饱受诟病的一个问题就是应用的体积大小问题。如果我们使用 Electron 官方提供的 `electron-packager` 对应用进行打包和发布，哪怕是一个简单的 `openURL` 应用，整个软件大小都高达 120M 左右。这不是我们希望看到的。应用之所以这么大的原因在于 Electron 打包后的应用会将整个 NodeJS 以及 Chromium 内核一起打包，相当于将一个完整的浏览器给打包了进去，这就是导致 Electron 应用体积巨大的原因，那么有什么办法可以解决这个问题呢？

答案是：不完全依赖 Electron。

如果你是一个早期的 Slack Mac 端用户，那么你可能会注意到 Slack 是基于 Electron 编写的，但是他们的客户端只有 36M，这是不可思议的。事实上那是因为他们的 Mac 端并没有使用 Electron，而是一个叫做 MacGap 的框架。

以 Windows 为例，一个 Electron 应用，通过 electron-packager 打包后会得到一个完整的应用程序包，而不是一个安装文件。但这对于普通 Windows 用户来说，一个安装程序才是他们所需要的。



## 打包与签名

我们最终希望将应用正式进行发布，这就需要我们对应用的代码进行签名，关于这个内容在 Electron 的


## 应用安全

杀毒软件是一个非常恶心人的东西，所以从我换成 Mac 后这个问题就再也没有困扰过我了。但是在开发一个 Windows 平台的应用时，不可避免的需要

## 参考资料

1. Process Message doesn't Send Back to Renderer Process, https://github.com/electron/electron/issues/7455
2. Electron-Builder Code Sign Wiki, https://github.com/electron-userland/electron-builder/wiki/Code-Signing
3. Atom detected as malware by antiviruses, https://github.com/atom/atom/issues/3927
4. Command prompt in Nodejs, https://github.com/miguelmota/terminal-tab/issues/1
5. MacGap Project, https://macgapproject.github.io


[atom-editor]: https://atom.io
[electron-framework]: http://electron.atom.io
[Changkun's Blog Clients]: https://github.com/changkun/changkun-blog-clients
[js-2016]: https://zhuanlan.zhihu.com/p/22782487

