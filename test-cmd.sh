#!/bin/bash 

mkdir -p out


# marketing-flight-30JUN-8117
mkdir -p ./out/marketing-flight
for i in 5 10 20 30 40 50 80 100 120 150 180 200 300
do
    let "count=i * 50"
    # if [ $count -gt 1000 ]; then
    #     count=1000
    # fi
    if [ $count -lt 500 ]; then
        count=500;
    fi
    echo "ab -n $count -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-30&flightNo=8117 > ./out/marketing-flight/marketing-flight-30JUN-8117-$i.txt"
    # echo "ab -t 300 -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-30&flightNo=8117 > ./out/marketing-flight/marketing-flight-30JUN-8117-$i.txt"
    ab -n $count -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" "http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-30&flightNo=8117" > ./out/marketing-flight/marketing-flight-30JUN-8117-$i.txt
    # ab  -t 300 -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" "http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-30&flightNo=8117" > ./out/marketing-flight/marketing-flight-30JUN-8117-$i.txt
done
#

# marketing-flight-28JUN-XMN-PEK
mkdir -p ./out/marketing-flight
for i in 5 10 20 30 40 50 80 100 120 150 180 200 300
do
    let "count=i * 50"
    # if [ $count -gt 1000 ]; then
    #     count=1000
    # fi
    if [ $count -lt 500 ]; then
        count=500;
    fi
    echo "ab -n $count -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-28&orig=XMN&dest=PEK > ./out/marketing-flight/marketing-flight-28JUN-XMN-PEK-$i.txt"
    # echo "ab -t 300 -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-28&orig=XMN&dest=PEK > ./out/marketing-flight/marketing-flight-28JUN-XMN-PEK-$i.txt"
    ab -n $count -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" "http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-28&orig=XMN&dest=PEK" > ./out/marketing-flight/marketing-flight-28JUN-XMN-PEK-$i.txt
    # ab  -t 300 -c $i -H "User-Agent: Mozilla/5.0 AppleWebKit/537.36 Chrome/67.0.3396.99 Safari/537.36" "http://11.4.64.27:8011/marketing/flight?departureDate=2018-06-28&orig=XMN&dest=PEK" > ./out/marketing-flight/marketing-flight-28JUN-XMN-PEK-$i.txt
done
# 

node ./lib/parse-result.js

echo "open group-action.html to view the result"