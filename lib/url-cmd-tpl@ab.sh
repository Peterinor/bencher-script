
# {{=it.group}}-{{=it.action}}
mkdir -p "{{=it.out_dir}}"
mkdir -p "{{=it.out_dir}}/data"
for i in {{=it.conc_list.join(' ')}}
do
    let "count=i * 50"
    # if [ $count -gt 1000 ]; then
    #     count=1000
    # fi
    if [ $count -lt 250 ]; then
        count=250;
    fi
    echo "ab -n $count -c $i {{?it.header}}-H "{{=it.header}}"{{?}} \
        {{?it.postfile}}-p "{{=it.postfile}}"{{?}} {{=it.url}} > {{=it.out_dir}}/{{=it.group}}-{{=it.action}}-$i.txt"
    ab -n $count -c $i \
        -g {{=it.out_dir}}/data/{{=it.group}}-{{=it.action}}-$i.dat \
        {{~it.headers:header}} -H "{{=header}}"{{~}} \
        {{?it.contentType}} -T "{{=it.contentType}}"{{?}} \
        -k -l -r \
        {{?it.timeout}} -s "{{=it.timeout}}"{{?}} \
        {{?it.postfile}} -p "{{=it.postfile}}"{{?}} \
        "{{=it.url}}" > {{=it.out_dir}}/{{=it.group}}-{{=it.action}}-$i.txt
done
#