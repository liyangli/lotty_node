/**
 * 数据库处理工具类
 * 该对象为单利对象；
 * 1、获取一个连接后直接进行其他操作；
 */
let mysql = require("mysql");
class DBDeal {
  constructor() {
    this.mysqlConn = mysql.createConnection({
      host: "127.0.0.1",
      port: 3308,
      user: "root",
      password: "123456",
      database: "lotty"
    });
    this.mysqlConn.connect();
  }

  async execSql(sql) {
    let self = this;
    return new Promise((resolve, reject) => {
      self.mysqlConn.query(sql, function(error, results, fields) {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
      //   self.mysqlConn.end();
    });
  }
}

module.exports = new DBDeal();
