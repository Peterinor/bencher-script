
#### 运行选项
#### *nux 系统执行

    ./run.sh

#### windows 系统执行

    ./run.bat

当然，前提是系统有安装了相应的测试工具，并正确配置了环境变量

命令选项：

    Options:
    -V, --version            output the version number
    -C, --config [value]     config file: demo: ./config.json
    -x, --shell [value]      shell type: linux shell(sh) or windows bat(bat)
    -c, --conc_list [value]  concurrency list
    -t, --timelimit [value]  max duration for a test in second
    -n, --count [value]      requests per concurrency, total request count = concurrency * factor
    -o, --out_dir [value]    out dir - demo: ./out/
    -i, --input [value]      test scenes config file - demo: urls.json
    -s, --scenes [value]     scenes and actions to be benched - demo: scence1/x1,x2;scence2/y1,y2;scence3
    -h, --help               output usage information


测试脚本会默认使用./config.json作为测试配置文件，当然，配置文件中的所有配置，均可以通过命令选项进行调整，比如：

    ./run.sh -c "5..100 step 5"    // 调整测试并发，从5到100，步长为5
    ./run.sh -n 500                // 指定测试次数
    ./run.sh -C config-deve.json   // 从config-deve.json读取配置

#### 配置

    {
        "out_dir": "./out/",
        "conc_list": "5..10 step 10",
        "timelimit": 5000, 
        "count": 250,
        "factor": 250, 
        "input": "./urls.json",
        "variables": {
            "server": "http://192.168.10.100:8080",

            "userAgent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36",
            "apiKey": "bMf3xVVZ8KUly1lr3wCV4G54Xd8tRIzw",
            "channel": "APP"
        },
        "global": {
            "headers": ["User-Agent: {{userAgent}}", "APIKey: {{apiKey}}", "channel: {{channel}}"],
            "contentType": "application/json;charset=UTF-8"
        }
    }


+ our_dir 输出目录 [-o]
+ conc_list 并发列表，两种格式 [-c]
  * 1 2 3 4 10 20
  * 5..100 step 5
+ timelimit/count/factor 这三个参数用于指定压测时长或者次数
  * timelimit - 指定压测的最大时长，单位秒 [-t]
  * count - 直接指定压测中每个并发的请求的数量 [-n]
  * factor - 间接指定压测请求的数量，请求数量 = 并发数 × factor [-f]
  
  此三者的优先级为 timelimit > count > factor
  
+ input 为测试场景列表文件，测试场景见后续说明。  [-i]
+ variables 全局定义的一些变量，这些变了可以在测试`场景配置`中引用，格式为`{{variable}}`，例：

        "url": "{{server}}/",

+ global 全局定义的压测参数，等效于在每个url上面手动设置这些参数

上述命令大部分可被命令选项覆盖，可被覆盖的均已 `[option]` 的形式在参数后面标出

#### 测试场景
以下例说明

    {
        "demo": {
            "index": {
                "url": "{{server}}/",
                "headers": ["{{userAgent}}"]
            }
        }
    }

demo为场景名称
index、post-index为具体的测试项，信息包括一项测试所需的url、header、以及post时的post-data所在文件等信息

一个场景下面可以有多个url实例，如下

    {
        "shopping": {
            "index": {
                "url": "{{server}}/",
                "header": ["content-type:application/json"],
                "postfile": "post-data.json"
            },
            "shopping": "{{server}}/shopping"
        }
    }

当然，一个`场景配置`文件中也可以包含多个场景
