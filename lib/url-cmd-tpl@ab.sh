
# {{=it.group}}-{{=it.action}}
mkdir -p "{{=it.out_dir}}"
for i in {{=it.conc_list.join(' ')}}
do
    let "count=i * 50"
    # if [ $count -gt 1000 ]; then
    #     count=1000
    # fi
    if [ $count -lt 250 ]; then
        count=250;
    fi
    echo "ab -n $count -c $i {{?it.header}}-H "{{=it.header}}"{{?}} {{?it.postfile}}-p "{{=it.postfile}}"{{?}} {{=it.url}} > {{=it.out_dir}}/{{=it.group}}-{{=it.action}}-$i.txt"
    ab -n $count -c $i {{~it.headers:header}} -H "{{=header}}"{{~}} {{?it.contentType}}-T "{{=it.contentType}}"{{?}} {{?it.postfile}}-p "{{=it.postfile}}"{{?}} "{{=it.url}}" > {{=it.out_dir}}/{{=it.group}}-{{=it.action}}-$i.txt
done
#