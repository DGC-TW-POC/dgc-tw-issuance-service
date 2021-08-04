module.exports = {
    server : {
        port : "9191" ,
        hostName : "localhost"
    } , 
    db : {
        service : "mssql" , /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */ /* sudo apt install unixodbc-dev */
        username : "username",
        password : "password",
        database : "database" ,
        hostName : "localhost",
        init: false,
        fakeData: false
    } ,
    mail : {
        service: "Gmail",
        auth: {
            user: "user@gmail.com", 
            pass: "password"
        }
    }
}