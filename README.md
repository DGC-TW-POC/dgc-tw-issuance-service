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
        hostName : "localhost"
    }
}
```

## 啟動
- Run `npm install` 
- Run `node server.js`