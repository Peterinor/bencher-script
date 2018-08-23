
var bash_cmd = 'sh';
if (process.argv[2]) {
    bash_cmd = process.argv[2];
}
var fs = require('fs');

var TPL = fs.readFileSync(__dirname + '/test-cmd-tpl.' + bash_cmd).toString();
var URL_CMD_TPL = fs.readFileSync(__dirname + '/url-cmd-tpl@ab.' + bash_cmd).toString();

var config = require(__dirname + '/../config.json');
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
Object.keys(url_dict).forEach(g => {
    var urls = url_dict[g];
    Object.keys(urls).forEach(uk => {
        var uo = urls[uk];
        if (typeof (uo) == 'string') {
            uo = {
                url: uo,
                header: '',
                pdata: '',
            };
        }
        uo.group = g;
        uo.conc_list = conc_list;
        uo.action = uk;
        uo.out_dir = config.out_dir + uo.group;

        all_url_cmd.push(tpl(uo));
    });
});

var shell_cmd = TPL.replace('{cmd}', all_url_cmd.join('\n'));
// console.log(shell_cmd);

fs.writeFileSync('./test-cmd.' + bash_cmd, shell_cmd.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
