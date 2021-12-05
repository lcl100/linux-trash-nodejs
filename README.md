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
  -h, --help                     display help for command
```

## Bug
- 当文件名（不包括后缀）和目录名同名时，没有保存到`.trashinfo`文件中，因为同名冲突。