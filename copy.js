let fs = require('fs');

//调用node 子进程

var callfile = require('child_process');
//const { execFile } = require('child_process');

// 复制文件
/*fs.copyFile('./testa/testaa/testaa.js','./result/copy1.js',(err)=>{
    console.log(err)
});*/

//删除文件
/*fs.unlink('./result/copy1.js',(err)=>{
    console.log(err)
})*/
/*fs.unlink('/temp/hello', (err) => {
    try {
        fs.unlinkSync('/temp/hello');
        console.log('已成功删除 /temp/hello');
    } catch (err) {
        // 处理错误
        fs.rmdir('/temp/hello',(err)=>{
            console.log('已成功删除 /temp/hello')
        })
    }
});*/
//重命名文件夹名或者文件夹名
/*fs.renameSync('./temp', './tmp', (err) => {
    if (err) throw err;
    console.log('重命名完成');
});
fs.rmdirSync('./tmp/hello',(err)=>{
    console.log('err')
})*/
//读取文件夹 []
/*fs.readdir('./testa',(err,files)=>{
    console.log(files)
});*/

// 创建文件夹 不能创建已存在的文件夹
/*fs.mkdir('./result/apple',(err)=>{
    console.log(err)
})*/
//删除文件（只能删除空文件夹）
/*fs.rmdirSync('./testa',(err)=>{
    console.log(err)
})*/

/*console.log('======================')
console.log(fs.statSync('./result/').isDirectory())
//判断当前路径是否存在 返回stat类
console.log(fs.statSync('./result/'))
console.log('======================')
//判断当前路径是否存在 返回true，false
console.log(fs.existsSync('./result/'))
console.log('======================')*/
//是否存在文件或者文件夹 成功返回undefind或者抛错
/*fs.access('./result',fs.constants.F_OK,(err)=>{
    console.log(`${err ? '不存在' : '存在'}`);
})*/
//console.log(fs.existsSync('./result/').isDirectory());
//console.log(fs.statSync('./result/').isDirectory());
//console.log(fs.accessSync('./result').isDirectory());

var path = require('path');
var exePath = path.resolve(__dirname, './copyfile.sh');
/*callfile.execFile('./copyfile.sh',function (err, stdout, stderr) {
    callback(err,stdout,stderr)
});*/
callfile.execFile(exePath,function (err, stdout, stderr) {
    callback(err,stdout,stderr)
});
function callback(err,stdout,stderr){
    console.log(err)
    console.log('=======')
    console.log(stdout)
    console.log('=======')
    console.log(stderr)
}
//删除文件夹

function delteFolder(path) {
    let files = []
    if (fs.existsSync(path)) {
        //如果存在改路径
        if (fs.statSync(path).isDirectory()) {
            //判断此文件url是否是文件夹
            files = fs.readdirSync(path);
            files.forEach((file) => {
                let curPath = path + "/" + file;
                if (fs.statSync(curPath).isDirectory()) {
                    delteFolder(curPath)
                } else {
                    //删除文件
                    fs.unlinkSync(curPath);
                }
            });
            //删除文件夹
            fs.rmdirSync(path);
        }else {
            //删除文件
            fs.unlinkSync(path);
        }
    }
}


/*copyFolder('./testa','./resultss')
delteFolder('./testa')*/

//封装文件夹复制
function copyFolder(from, to) {        // 复制文件夹到指定目录
    let files = [];
    if (fs.existsSync(to)) {           // 文件是否存在 如果不存在则创建
        files = fs.readdirSync(from);
        files.forEach(function (file, index) {
            var targetPath = from + "/" + file;
            var toPath = to + '/' + file;
            if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
                copyFolder(targetPath, toPath);
            } else {                                    // 拷贝文件
                fs.copyFileSync(targetPath, toPath);
            }
        });
    } else {
        fs.mkdirSync(to);
        copyFolder(from, to);
    }
}

//copyFolder('./testa','./result');