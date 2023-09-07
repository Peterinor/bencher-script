
if not exist {{=it.out_dir}} mkdir {{=it.out_dir.replace(/\//g, '\\')}}
if not exist {{=it.out_dir}}\\data mkdir {{=it.out_dir.replace(/\//g, '\\')}}\\data
{{~it.conc_list:conc}}
{{var count = Math.max((it.count || 50) * conc, 250);}}
echo benching with abs -c {{=conc}} {{?it.timelimit}} -t {{=it.timelimit}} {{??}} -n {{=count}} {{?}} {{=it.url.replace(/&/g, '^&')}}
abs  -c {{=conc}} ^
    {{?it.timelimit}} -t {{=it.timelimit}} {{??}} -n {{=count}} {{?}} ^
    -g {{=it.out_dir}}/data/{{=it.action}}-{{=conc}}.dat ^
    {{~it.headers:header}} -H "{{=header}}"{{~}} ^
    {{?it.contentType}} -T "{{=it.contentType}}"{{?}} ^
    -k {{?it.variable}} -l {{?}} -r ^
    {{?it.timeout}} -s "{{=it.timeout}}"{{?}} ^
    {{?it.postfile}} -p "{{=it.postfile}}"{{?}} ^
    "{{=it.url}}" >  {{=it.out_dir}}/{{=it.action}}-{{=conc}}.txt
{{~}}


