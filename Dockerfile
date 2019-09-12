FROM node:8.16.0-alpine

RUN echo "http://mirrors.aliyun.com/alpine/v3.8/main" > /etc/apk/repositories \
    && echo "http://mirrors.aliyun.com/alpine/v3.8/community" >> /etc/apk/repositories \
    && apk update upgrade \
    && apk add --no-cache procps unzip curl bash tzdata libc6-compat apache2-utils nginx \
    && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone

COPY lib /app/lib/
COPY node_modules /app/node_modules/
COPY package.json run.sh urls-bench-* config-* post-data-* /app/

COPY fordocker/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /run/nginx

COPY fordocker/startup.sh /startup.sh
RUN dos2unix /startup.sh && chmod +x /startup.sh

EXPOSE 80

CMD ["/startup.sh"]