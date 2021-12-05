#! /usr/bin/env node
// 引入commander模块
const {Command, Option} = require('commander');
const program = new Command();
program.version('0.0.1', '-v, --version', '版本信息');

// 导入fs模块
var fs = require('fs');
// 导入path模块
var path = require('path');
// 导入config模块
var config = require('config');
// 导入init模块
var ini = require('ini');

// 设置选项
// `-r, --remove <file>`选项表示将指定或目录移到回收站
program.option('-r, --remove <file|directory>', '将指定文件或目录移到回收站');
// `-l, --list`选项表示列出回收站文件
program.option('-l, --list', '列出回收站文件');

program.parse();

// 回收站文件的位置在配置文件中的trash字段中
var trashPath = config.get('files');// 回收站存放文件的目录
var infoPath = config.get('info');// 回收站存放文件删除信息的目录
// 如果回收站目录不存在则进行创建
if (!fs.existsSync(trashPath)) {
    fs.mkdirSync(trashPath, {recursive: true});
}
if (!fs.existsSync(infoPath)) {
    fs.mkdirSync(infoPath, {recursive: true});
}


// 选项处理
var options = program.opts();
// `remove`选项
if (options.remove) {
    var currentPath = process.cwd();// 获取当前执行命令所在的路径
    var deletedFile = options.remove;// 待删除文件名
    var deletedFileName = deletedFile.substring(0, deletedFile.indexOf('.'));// 待删除文件名但不包括后缀
    var deletedFilePath = path.join(currentPath, deletedFile);// 待删除文件的绝对路径
    var trashFilePath = path.join(trashPath, deletedFile);// 要将该文件保存到回收站的绝对路径
    if (fs.existsSync(deletedFilePath)) {
        // 判断传入的路径是文件还是目录，分别进行处理
        var isDir = fs.lstatSync(deletedFilePath).isDirectory();
        if (isDir) {// 将目录及其目录下所有文件移到回收站
            copyDirectory(deletedFilePath, path.join(trashPath, deletedFile));
            deletedFileName = deletedFile;// 目录没有后缀名，所以保持原有名字
        } else {// 将文件移到回收站
            // 将文件剪切到回收站files目录下
            var rs = fs.createReadStream(deletedFilePath);
            var ws = fs.createWriteStream(trashFilePath);
            rs.pipe(ws);
            rs.on('end', () => fs.unlinkSync(deletedFilePath));
        }
        // 并且将删除文件或目录的一些信息写入到配置文件中
        var trashInfo = "[Trash Info]\n";
        trashInfo += "Path=" + deletedFilePath + "\n";
        var date = new Date();
        var time = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        trashInfo += "DeletionDate=" + time + "\n";
        fs.writeFileSync(path.join(infoPath, deletedFileName + '.trashinfo'), trashInfo);
    } else {
        console.log('路径不存在: ' + deletedFilePath);
    }
}
// `list`选项
if (options.list) {
    // 获取回收站info目录下的文件名数组
    var names = fs.readdirSync(infoPath);
    // 处理成绝对路径
    names = names.map(name => {
        return path.join(infoPath, name);
    });
    var list = [];
    names.forEach((path, index) => {
        // 使用ini模块读取日志文件.trashinfo的内容
        var info = ini.parse(fs.readFileSync(path).toString());
        // 提取Path和DeletionDate属性值
        list.push({DeletionDate: info['Trash Info'].DeletionDate, Path: info['Trash Info'].Path});
    });
    console.table(list);
}

/**
 * 将指定src目录下的所有文件复制（剪切）到指定目标dest目录下
 * @param src 源目录
 * @param dest 目标目录
 */
function copyDirectory(src, dest) {
    var files = fs.readdirSync(src);
    files.forEach((item, index) => {
        var itemPath = path.join(src, item);
        var itemStat = fs.statSync(itemPath);// 获取文件信息
        var savedPath = path.join(dest, itemPath.replace(src, ''));
        var savedDir = savedPath.substring(0, savedPath.lastIndexOf(path.sep));// path.sep根据系统获取文件路径分隔符
        if (itemStat.isFile()) {
            // 如果目录不存在则进行创建
            if (!fs.existsSync(savedDir)) {
                fs.mkdirSync(savedDir, {recursive: true});
            }
            // 写入到新目录下
            var data = fs.readFileSync(itemPath);
            fs.writeFileSync(savedPath, data);
            // 并且删除原文件
            fs.unlinkSync(itemPath);
        } else if (itemStat.isDirectory()) {
            copyDirectory(itemPath, path.join(savedDir, item));
        }
    });
    // 并且删除原目录
    fs.rmdirSync(src);
}
