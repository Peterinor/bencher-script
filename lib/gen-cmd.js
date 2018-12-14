var bash_cmd = 'sh';
console.log(process.argv);

var config = require(__dirname + '/../config.json');
var program = require('commander');
program
    .version('0.1.0')
    .option('-x, --shell [value]', 'shell type: linux shell(sh) or windows bat(bat)')
    .option('-c, --conc_list [value]', 'concurrency list')
    .option('-o, --out_dir [value]', 'out dir')
    .option('-i, --urls [value]', 'url group file')
    .option('-s, --scenes [value]', 'scenes to be benched')
    .parse(process.argv);

if (program.shell == 'bat') {
    bash_cmd = 'bat';
}
if (program.conc_list) {
    config.conc_list = program.conc_list;
}
if (program.out_dir) {
    config.out_dir = program.out_dir;
}
if (program.urls) {
    config.urls = program.urls;
}
if (program.scenes) {
    config.scenes = program.scenes.split(/[,\/，;；]{1}/g);
}
console.log(config);

var fs = require('fs');

var TPL = fs.readFileSync(__dirname + '/test-cmd-tpl.' + bash_cmd).toString();
var URL_CMD_TPL = fs.readFileSync(__dirname + '/url-cmd-tpl@ab.' + bash_cmd).toString();

var concReg = /(\d+)\.\.(\d+) step (\d+)/;
var conc_list = config.conc_list.split(' ');
var x = concReg.exec(config.conc_list);
if (x) {
    var arr = [];
    for (var i = parseInt(x[1]); i <= parseInt(x[2]); i += parseInt(x[3])) {
        arr.push(i);
    }
    conc_list = arr;
}
var doT = require(__dirname + '/doT.js');
tpl = doT.template(URL_CMD_TPL);

var url_dict = require(__dirname + '/../' + config.urls);

var all_url_cmd = [];
Object.keys(url_dict).forEach(scene => {
    if (config.scenes && config.scenes.indexOf(scene) == -1) {
        console.log('ignore test scenes:' + scene);
        return;
    }
    var urls = url_dict[scene];
    Object.keys(urls).forEach(uk => {
        var uo = urls[uk];
        if (typeof(uo) == 'string') {
            uo = {
                url: uo,
                headers: [],
                pdata: '',
                contentType: ''
            };
        }
        uo.group = scene;
        uo.conc_list = conc_list;
        uo.action = uk;
        uo.out_dir = config.out_dir + uo.group;

        all_url_cmd.push(tpl(uo));
    });
});

var shell_cmd = TPL.replace('{cmd}', all_url_cmd.join('\n'));
// console.log(shell_cmd);

shell_cmd = shell_cmd.replace(/\r\n/g, '\n');
if (bash_cmd == 'bat') {
    shell_cmd.replace(/\n/g, '\r\n')
}
fs.writeFileSync('./test-cmd.' + bash_cmd, shell_cmd);