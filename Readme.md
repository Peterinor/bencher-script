
#### 配置

    {
        "out_dir": "./out/",
        "conc_list": "1..100 step 2",
        "urls": "./urls.json"
    }


+ our_dir 输出目录
+ conc_list 并发列表，两种格式
  * 1 2 3 4 10 20
  * 5..100 step 5
+ urls 待测试的url列表


#### url配置
以下例说明

    {
        "demo": {
            "index": {
                "url": "http://127.0.0.1/",
                "header": "",
                "pdata": ""
            }
        }
    }

demo为分组名称
index为url实例名称，下面配置url测试所需的url、header、以及post时的post-data

一个分组下面可以有多个url实例，如下

    {
        "shopping": {
            "index": {
                "url": "http://127.0.0.1/",
                "header": "",
                "pdata": ""
            },
            "shopping": "http://127.0.0.1/shopping"
        }
    }

当然，一个url.config文件中也可以包含多个分组
