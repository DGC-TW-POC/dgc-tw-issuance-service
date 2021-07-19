# dgc-tw-vaccine-service
EU疫苗護照概念式驗證開發後端。
- 語言: Node.js
- 資料庫採ORM , 目前使用mssql開發

## 進度
目前有的功能如下
- 儲存CDC在EU所需欄位的資料

## 設定

請複製`config.template.js`並命名為`config.js`
```javascript=
module.exports = {
    server : {
        port : "9191" ,
        hostName : "localhost"
    } , 
    db : {
        service : "mssql" , /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
        username : "username",
        password : "password",
        database : "database" ,
        hostName : "localhost",
        init: false, //如果你是第一次使用，請改成true，會強制產生空的table以及產生固定資料(醫事機構)
        fakeData: false //需要跟init一起使用，產生假資料
    }
}
```
### 產生假資料
- 請將`config/config.js`的`init`及`fakeData`都設為true
- 產生筆數->更改`models/sql/index.js`中`doFakeData function`的`generateCount`
- 睡覺等假資料產生完畢
## 啟動
- Run `npm install` 
- Run `node server.js`