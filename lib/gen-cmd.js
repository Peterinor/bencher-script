var bash_cmd = 'sh';

var program = require('commander');
program
    .version('0.1.0')
    .option('-C, --config [value]', 'config file: demo: ./config.json')
    .option('-x, --shell [value]', 'shell type: linux shell(sh) or windows bat(bat)')
    .option('-c, --conc_list [value]', 'concurrency list')
    .option('-o, --out_dir [value]', 'out dir - demo: ./out/')
    .option('-i, --urls [value]', 'test scenes config file - demo: urls.json')
    .option('-s, --scenes [value]', 'scenes to be benched - demo: scence1/x1,x2;scence2/y1,y2;scence3')
    .parse(process.argv);

var path = require('path');

var configFile = __dirname + '/../config.json'
if (program.config) {
    configFile = path.resolve(program.config);
}

console.log("config file path:" + configFile);
var config = require(configFile);

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

var actionsOfScenes = {};
if (program.scenes) {
    // scence1/x1,x2;scence2/y1,y2;scence3;
    config.scenes = [];
    program.scenes.split(/;/g).forEach(ss => {
        var sx = ss.split(/[\/,]/g);
        config.scenes.push(sx[0]);
        if (sx.length > 1) {
            actionsOfScenes[sx[0]] = sx.slice(1);
        }
    });
}
if (config.global) {
    config.global = interpolate(config.global, config.variables);
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
    var aos = null;
    if (config.scenes) {
        if (config.scenes.indexOf(scene) == -1) {
            console.log('skip test scenes:' + scene);
            return;
        } else {
            aos = actionsOfScenes[scene];
        }
    }
    var urls = url_dict[scene];
    Object.keys(urls).forEach(uk => {
        if (aos && aos.indexOf(uk) == -1) {
            console.log('skip test action:' + uk);
            return;
        }
        var uo = urls[uk];
        if (typeof(uo) == 'string') {
            uo = {
                url: uo,
                headers: [],
                pdata: '',
                contentType: ''
            };
        }
        interpolate(uo, config.variables);

        uo.scene = scene;
        uo.conc_list = conc_list;
        uo.action = uk;
        uo.out_dir = config.out_dir + uo.scene;

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


function interpolate(input, variables) {
    if (typeof(input) === 'string') {
        var reg = /\{\{([\s\S]+?)\}\}/g;
        input = input.replace(reg, function(m, code) {
            return variables[code];
        });
    } else {
        if (input instanceof Array) {
            input.forEach((a, i) => {
                input[i] = interpolate(a, variables);
            });
        }
        if (input instanceof Object) {
            Object.keys(input).forEach(k => {
                input[k] = interpolate(input[k], config.variables);
            });
        }
    }
    return input;
}