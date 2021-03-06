var loader = require('./config-loader.js');
var config = loader.load(process.argv);
// console.log(config);

var path = require('path');
var fs = require('fs');
var url_dict = require(path.join(__dirname, '../', config.input));

var doT = require(path.join(__dirname, 'doT.js'));
tpl = doT.template(fs.readFileSync(path.join(__dirname, 'tpl.html')));

Object.keys(url_dict).forEach(scene => {
    var urls = url_dict[scene];
    var ro = {
        name: scene,
        results: []
    };
    if (config.scenes && config.scenes.indexOf(scene) == -1) return;

    var out_dir = path.join(config.out_dir, scene);
    if (!fs.existsSync(out_dir)) return;
    var files = fs.readdirSync(out_dir);

    Object.keys(urls).forEach(action => {
        var res_every_concurrency = files.filter(f => {
            var file_matcher = new RegExp('^' + action + '-\\d+.txt');
            return file_matcher.test(f);
        }).map(file => {
            var file_path = path.join(out_dir, file);
            try {
                var r = createRes(fs.readFileSync(file_path).toString());
            } catch (e) {
                // console.log(e);
                console.log('parse file [%s] failed.', file_path);
                r = {
                    clients: -1
                }
            }
            r.out_file = path.join('./', scene, file);
            return r;
        }).sort((r1, r2) => {
            return r1.clients - r2.clients;
        });

        if (res_every_concurrency.length == 0) return;
        ro.results.push({
            action: action,
            result: res_every_concurrency.filter(r => r.clients != -1)
        });
    });
    fs.writeFileSync(path.join(config.out_dir, scene + '-report.html'), tpl(ro));
});


function createRes(cnt) {
    cnt = cnt.replace(/\r\n/g, '\n');
    var matcher = /(.*?):\s*?(.*?)\n/g;

    var rx = {};
    var mr;
    while ((mr = matcher.exec(cnt))) {
        var k = mr[1],
            v = mr[2].trim();
        if (mr[1] == 'Time per request' && mr[2].indexOf('across') != -1) {
            k = 'Time per request2';
        }
        rx[k] = v;
    }

    var failedMatcher = /Connect: (\d+), Receive: (\d+), Length: (\d+), Exceptions: (\d+)/g
    var failedRes = failedMatcher.exec(cnt);

    r = {
        server_name: rx['Server Software'],
        document: {
            path: rx["Document Path"],
            length: parseInt((rx["Document Length"] || "0").replace('bytes', ''))
        },
        clients: rx['Concurrency Level'],
        duration: rx['Time taken for tests'],
        total: parseInt(rx['Total transferred']),
        html: parseInt(rx['HTML transferred']),
        rate: (rx['Transfer rate'] || '').replace(' received', '').replace('Kbytes/sec', 'KB/sec'),
        qps: (rx['Requests per second'] || '').replace(' [#/sec] (mean)', ''),
        avg_res_time: (rx['Time per request'] || '').replace(' [ms] (mean)', ''),
        avg_server_time: (rx['Time per request2'] || '').replace(' [ms] (mean, across all concurrent requests)', ''),
        requests: {
            failed: rx['Failed requests'],
            failedDetail: failedRes ? failedRes[0].replace(/[a-z ]/g, x => ''): '',
            completed: rx['Complete requests'],
            non2xx: rx['Non-2xx responses'] || '0'
        }
    };
    ['total', 'html'].forEach(k => r[k] = Math.round(r[k] / 1024 * 10) / 10 + "KB");

    // 网络上消耗的时间的分解
    r.conn_time = {};

    ['Connect', 'Processing', 'Waiting', 'Total'].forEach((ct) => {
        var values = rx[ct].split(/\s+/g);
        r.conn_time[ct.toLocaleLowerCase()] = {
            min: values[0],
            mean: values[1],
            mean2: values[2],
            median: values[3],
            max: values[4]
        }
    })

    // 每个请求处理时间的分布情况
    var per_matcher = /(\d+[\%]{1}).*?(\d+)/g;
    var pmr;
    r.rate_by_time = {};
    while (pmr = per_matcher.exec(cnt)) {
        r.rate_by_time[pmr[1]] = pmr[2];
    }

    return r;
}