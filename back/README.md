支持 eslint

```
npm i -g eslint
```

安装 pm2

```
npm i -g pm2
```

需要在 cus 目录下创建测试数据文件，指定测试数据

修改 nginx 的配置文件，进行 url 代理

```
server {
        ...
        location /ue/matter/enroll/ {
            proxy_pass http://localhost:3000/ue/matter/enroll/main.html#;
        }
        ...
    }
```

应用访问地址
/ue/matter/enroll/:siteId/:appId
