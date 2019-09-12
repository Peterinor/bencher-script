var bash_cmd = 'sh';

var loader = require('./config-loader.js');
var config = loader.load(process.argv);
console.log(config);

var path = require('path');
var fs = require('fs');

if (config.shell) {
    bash_cmd = config.shell;
}

var TPL = fs.readFileSync(path.join(__dirname, 'test-cmd-tpl.' + bash_cmd)).toString();
var URL_CMD_TPL = fs.readFileSync(path.join(__dirname, 'url-cmd-tpl@ab.' + bash_cmd)).toString();

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
var doT = require(path.join(__dirname, 'doT.js'));
tpl = doT.template(URL_CMD_TPL);

var url_dict = require(path.join(__dirname, '../', config.input));

var all_url_cmd = [];
Object.keys(url_dict).forEach(scene => {
    var aos = null;
    if (config.scenes) {
        if (config.scenes.indexOf(scene) == -1) {
            console.log('skip test scenes:' + scene);
            return;
        } else {
            aos = config.actionsOfScenes[scene];
        }
    }
    var urls = url_dict[scene];
    Object.keys(urls).forEach(uk => {
        if (aos && aos.indexOf(uk) == -1) {
            console.log('skip test action:' + uk);
            return;
        }
        var uo = urls[uk];
        if (typeof (uo) == 'string') {
            uo = {
                url: uo,
                headers: [],
                pdata: '',
                contentType: ''
            };
        }
        loader.interpolate(uo, config.variables);

        uo.scene = scene;
        uo.conc_list = conc_list;
        uo.action = uk;
        uo.out_dir = path.join(config.out_dir, uo.scene);

        uo.variable = config.variable;
        uo.cmd_options = config.cmd_options;

        var options = ['timelimit', 'count']
        options.forEach(ops => {
            if (config.hasOwnProperty(ops)) {
                uo[ops] = config[ops];
            }
        });

        if (config.global) {
            Object.assign(uo, config.global);
        }
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