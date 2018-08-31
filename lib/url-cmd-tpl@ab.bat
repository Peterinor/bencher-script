
if not exist {{=it.out_dir}} mkdir {{=it.out_dir.replace(/\//g, '\\')}}
{{~it.conc_list:i}}{{var count = i * 50; if(count < 250) count = 250; }}
echo benching with ab -n {{=count}} -c {{=i}} {{=it.url.replace(/&/g, '^&')}}
ab -n {{=count}} -c {{=i}} {{?it.header}}-H "{{=it.header}}"{{?}} {{?it.postfile}}-p "{{=it.postfile}}"{{?}} "{{=it.url}}"  >  {{=it.out_dir}}/{{=it.group}}-{{=it.action}}-{{=i}}.txt
{{~}}