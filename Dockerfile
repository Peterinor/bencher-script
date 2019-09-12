FROM node:8.16.0-alpine

RUN echo "http://mirrors.aliyun.com/alpine/v3.8/main" > /etc/apk/repositories \
    && echo "http://mirrors.aliyun.com/alpine/v3.8/community" >> /etc/apk/repositories \
    && apk update upgrade \
    && apk add --no-cache procps unzip curl bash tzdata libc6-compat apache2-utils nginx \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

COPY lib /app/lib/
COPY node_modules /app/node_modules/
COPY run.sh urls-bench-ecip.json urls-bench-istio.json urls-bench-istio.rev.json urls-bench-file.json package.json \
     config-just.json config-istio.json config-offer-ingress-test.json config-offer-ingress-istio.json \
     config-offer-istio.json config-offer-test.json config-file.json \
     post-data-offer-xmn-ams.json post-data-offer-xmn-pek.json \
     /app/

COPY fordocker/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /run/nginx

COPY fordocker/startup.sh /startup.sh
RUN dos2unix /startup.sh && chmod +x /startup.sh

EXPOSE 80

CMD ["/startup.sh"]