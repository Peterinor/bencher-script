
var TPL =
    '#!/bin/bash \n\n\
mkdir -p out\n\n\
{cmd} \n\n\
node ./lib/parse-result.js\n\n\
echo "open group-action.html to view the result"';

var fs = require('fs');
var URL_CMD_TPL = fs.readFileSync(__dirname + '/url-cmd-tpl@ab.sh').toString();

var config = require(__dirname + '/../config.json');

var doT = require(__dirname + '/doT.js');
tpl = doT.template(URL_CMD_TPL.replace("{conc_list}", config.conc_list));

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
        uo.action = uk;
        uo.out_dir = config.out_dir + uo.group;

        all_url_cmd.push(tpl(uo));
    });
});

var shell_cmd = TPL.replace('{cmd}', all_url_cmd.join('\n'));
// console.log(shell_cmd);

fs.writeFileSync('./test-cmd.sh', shell_cmd);
