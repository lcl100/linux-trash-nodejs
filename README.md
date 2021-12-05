# linux-trash-nodejs

## 概述
Linux系统上的回收站。

## 使用
`node trash.js --help`
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

## Bug
- ~~当文件名（不包括后缀）和目录名同名时，没有保存到`.trashinfo`文件中，因为同名冲突~~。
- ~~当清空回收站时会删除掉files和info目录，导致`-l`选项显示的表格内容不正确。~~
- ~~不能删除info对应的`.trashinfo`文件，因为前面将文件如`hello.txt`移到回收站，应该在info下创建一个名为`hello.txt.trashinfo`的文件而不是`hello.trashinfo`文件，所以无法正确删除~~。