
# {{=it.scene}}-{{=it.action}}
mkdir -p "{{=it.out_dir}}"
mkdir -p "{{=it.out_dir}}/data"
{{~it.conc_list:conc}}
{{var count = Math.max((it.count || 50) * conc, 250);}}
echo "ab -c {{=conc}} {{?it.timelimit}} -t {{=it.timelimit}} {{?}} {{?it.count || !it.timelimit}} -n {{=count}} {{?}} \
    {{?it.postfile}}-p '{{=it.postfile}}' {{?}} {{=it.url}} > {{=it.out_dir}}/{{=it.action}}-{{=conc}}.txt"
ab  -c {{=conc}} \
    {{?it.timelimit}} -t {{=it.timelimit}} {{?}} \
    {{?it.count || !it.timelimit}} -n {{=count}} {{?}} \
    -g {{=it.out_dir}}/data/{{=it.action}}-{{=conc}}.dat \
    {{~it.headers:header}} -H '{{=header}}' {{~}} \
    {{?it.contentType}} -T "{{=it.contentType}}" {{?}} \
    -k {{?it.variable}} -l {{?}} -r \
    {{?it.cmd_options}} {{=it.cmd_options}} {{?}} \
    {{?it.timeout}} -s {{=it.timeout}} {{?}} \
    {{?it.postfile}} -p "{{=it.postfile}}" {{?}} \
    "{{=it.url}}" > {{=it.out_dir}}/{{=it.action}}-{{=conc}}.txt
echo "rest for 7 seconds"
sleep 7
{{~}}
#