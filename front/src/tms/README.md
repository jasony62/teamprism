#apis

##封装 axios 模块

1. 给所有的 api 请求自动添加 access_token
2. 默认处理业务逻辑错误（code!==0）。

所有 api 返回的请求都具有如下格式：

```javascript
{
  code: xxx,
  msg: '返回内容描述',
  result: '返回的内容'
}
```

#components

##提示框（noticebox）
