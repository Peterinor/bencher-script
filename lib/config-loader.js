(function () {
    "use strict";

    var loader = {};

    if (typeof module !== "undefined" && module.exports) {
        module.exports = loader;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return loader;
        });
    } else {
        _globals.loader = loader;
    }


    loader.load = function (args) {

        var program = require('commander');
        program
            .version('0.1.0')
            .option('-C, --config [value]', 'config file: demo: ./config.json')
            .option('-x, --shell [value]', 'shell type: linux shell(sh) or windows bat(bat)')
            .option('-e, --benchtool [value]', 'executable benchtool used for benching, like ab/abs')
            .option('-c, --conc_list [value]', 'concurrency list')
            .option('-t, --timelimit [value]', 'max duration for a test in second')
            .option('-n, --count [value]', 'requests per concurrency, total request number = concurrency * count')
            .option('-o, --out_dir [value]', 'out dir - demo: ./out/')
            .option('-i, --input [value]', 'test scenes config file - demo: urls.json')
            .option('-s, --scenes [value]', 'scenes and actions to be benched - demo: scence1/x1,x2;scence2/y1,y2;scence3')
            .parse(args);

        var path = require('path');

        var configFile = __dirname + '/../config.json'
        if (program.config) {
            configFile = path.resolve(program.config);
        }

        console.log("config file path:" + configFile);
        var config = require(configFile);

        var cmder = ['shell', 'benchtool', 'conc_list', 'out_dir', 'input', 'timelimit', 'count']
        cmder.forEach(cmd => {
            if (program.hasOwnProperty(cmd)) {
                config[cmd] = program[cmd];
            }
        });

        var actionsOfScenes = {};
        if (program.scenes) {
            // scence1/x1,x2;scence2/y1,y2;scence3;
            config.scenes = [];
            console.log(program.scenes);
            program.scenes.split(/;/g).forEach(ss => {
                var sx = ss.split(/[\/,]/g);
                config.scenes.push(sx[0]);
                if (sx.length > 1) {
                    actionsOfScenes[sx[0]] = sx.slice(1);
                }
            });
        }
        config.actionsOfScenes = actionsOfScenes;
        if (config.global) {
            config.global = interpolate(config.global, config.variables);
        }

        return config;
    }


    function interpolate(input, variables) {
        if (typeof (input) === 'string') {
            var reg = /\{\{([\s\S]+?)\}\}/g;
            input = input.replace(reg, function (m, code) {
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
                    input[k] = interpolate(input[k], variables);
                });
            }
        }
        return input;
    }

    loader.interpolate = interpolate;


})();