支持 eslint

```
npm i -g eslint
```

安装 pm2

```
npm i -g pm2
```

分别在`back`和`ue`目录下安装项目依赖包

```
cnpm i
```

需要建立`config`目录，在里面建立 3 个文件，具体的参数根据实际情况指定。

app.js

```
module.exports = {
    port: 3000,
    name: 'teamprism',
    router: {
        auth: {
            prefix: '/ue'
        },
        controllers: {
            prefix: '/api'
        }
    }
}
```

db.js

```
module.exports = {
    master: {
        connectionLimit: 2,
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "xxt",
        acquireTimeout: 100,
        waitForConnections: false
    },
    write: {
        connectionLimit: 1,
        host: "localhost",
        port: "3306",
        user: "root",
        password: "",
        database: "xxt",
        acquireTimeout: 100,
        waitForConnections: false
    }
}
```

redis.js

```
module.exports = {
    host: '127.0.0.1',
    port: 6379
}
```

修改 nginx 的配置文件，进行 url 代理

```
server {
        ...
        location /ue/matter/enroll/ {
            proxy_pass http://localhost:3000/ue/matter/enroll/main.html#;
        }
        location /ue/matter/article/ {
            proxy_pass http://localhost:3000/ue/matter/article/main.html#;
        }
        location /ue/matter/channel/ {
            proxy_pass http://localhost:3000/ue/matter/channel/main.html#;
        }
        location /ue/matter/link/ {
            proxy_pass http://localhost:3000/ue/matter/link/main.html#;
        }
        location /ue {
            proxy_pass http://localhost:3000/ue;
        }
        location /api {
            proxy_pass http://localhost:3000/api;
        }
        ...
    }
```

应用访问地址

- 单图文：/ue/matter/article/:siteId/:appId
- 频道：/ue/matter/channel/:siteId/:appId
- 链接：/ue/matter/link/:siteId/:appId
- 记录活动：/ue/matter/enroll/:siteId/:appId
