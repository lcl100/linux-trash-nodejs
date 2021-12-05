# linux-trash-nodejs

## 概述
Linux系统上的回收站。

## 安装
1. 前往[linux-trash-nodejs](https://github.com/lcl100/linux-trash-nodejs/releases/)下载`.tar.gz`压缩包
2. 将`.tar.gz`压缩包上传到Linux系统上
3. 执行`tar -xvf linux-trash-nodejs-1.0.4.tar.gz`解压，注意不同压缩包版本不同
4. 执行`cd linux-trash-nodejs-1.0.4`命令进入到linux-trash-nodejs目录下
5. 执行`npm install`命令安装需要用到的第三方模块
6. 执行`npm install . -g`命令全局安装
7. 执行`export PATH=/usr/local/node.js/bin:$PATH`命令配置环境变量，注意node.js环境变量位置可通过`find / -name trash`查找

## 使用
`trash --help`
```bash
Usage: trash [options]

Options:
  -v, --version                  版本信息
  -r, --remove <file|directory>  将指定文件或目录移到回收站
  -l, --list                     列出回收站文件
  -c, --clear                    清空回收站
  -d, --delete <file|directory>  删除回收站指定文件或目录
  --restore <file|directory>     还原回收站指定文件或目录
  -h, --help                     display help for command
```
