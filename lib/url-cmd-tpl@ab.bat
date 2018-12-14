
if not exist {{=it.out_dir}} mkdir {{=it.out_dir.replace(/\//g, '\\')}}
if not exist {{=it.out_dir}}\\data mkdir {{=it.out_dir.replace(/\//g, '\\')}}\\data
{{~it.conc_list:i}}{{var count = i * 50; if(count < 250) count = 250; }}
echo benching with ab -n {{=count}} -c {{=i}} {{=it.url.replace(/&/g, '^&')}}
ab -n {{=count}} -c {{=i}} ^
    -g {{=it.out_dir}}/data/{{=it.scene}}-{{=it.action}}-{{=i}}.dat ^
    {{~it.headers:header}} -H "{{=header}}"{{~}} ^
    {{?it.contentType}} -T "{{=it.contentType}}"{{?}} ^
    -k -l -r ^
    {{?it.timeout}} -s "{{=it.timeout}}"{{?}} ^
    {{?it.postfile}} -p "{{=it.postfile}}"{{?}} ^
    "{{=it.url}}" >  {{=it.out_dir}}/{{=it.scene}}-{{=it.action}}-{{=i}}.txt
{{~}}