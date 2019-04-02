/**
 * https协议发送工具，此类为单利对象。
 * 对外提供方法：
 *
 */
const https = require("https");
const fs = require("fs");
const zlib = require("zlib");
class HttpsUtils {
  constructor() {
    this.option = {
      hostname: "client.caizhanbao.cn",
      port: 443,
      path: "https://client.caizhanbao.cn/graphql-merger/graphql/1/1/1",
      method: "POST",
      key: fs.readFileSync("./client.caizhanbao.key"),
      cert: fs.readFileSync("./client.caizhanbao.pem"),
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate", //这里设置返回的编码方式 设置其他的会是乱码
        "Accept-Language": "zh-CN",
        Connection: "keep-alive",
        host: "client.caizhanbao.cn",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) czbpc/1.2.28 Chrome/59.0.3071.115 Electron/1.8.8 Safari/537.36",
        "content-type": "application/json"
      }
    };
  }
  /**
   * 发送数据
   * @param option 对象必须包含
   */
  sendData(option, sendData) {
    //直接继承基础的option对象
    let target = this.extend(option || {});
    return new Promise((resolve, reject) => {
      const req = https.request(target, res => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);
      });
      req.on("response", function(response) {
        switch (response.headers["content-encoding"]) {
          case "gzip":
            var body = "";
            var gunzip = zlib.createGunzip();
            response.pipe(gunzip);
            gunzip.on("data", function(data) {
              body += data;
            });
            gunzip.on("end", function() {
              var returndatatojson = JSON.parse(body);
              resolve(returndatatojson);
              req.end();
            });
            gunzip.on("error", function(e) {
              console.log("error" + e.toString());
              reject(e.toString());
              req.end();
            });
            break;
          case "deflate":
            var output = fs.createWriteStream("./temp.txt");
            response.pipe(zlib.createInflate()).pipe(output);
            req.end();
            break;
          default:
            req.end();
            break;
        }
      });
      //   let sendData = {"query":"mutation LoginMutation($input_0:loginAdminMutationInput!) { loginAdminMutation(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on loginAdminMutationPayload { adminTokenResult { errorCode, adminToken { createTime, type, token, adminId, admin { cashPassword, status, registerDate, adminiconURL, id, clientIcon, name, nickname, idCode, phone, weiChat, password, adminname, alipay, isSetPassword, clienturl, androidUrl, packageStatus, idcodeUrl, storeUrl3, storeUrl2, storeUrl1, trainUrl, sellUrl, authStatus, auditMsg, address, paymentWay }, validTime }, value, id } }","variables":{"input_0":{"argsInput":{"phone":"17521014223","password":"b123y456","resource":"pc|123","token":null,"storeId":"","clientType":"store","appVersion":"1.2.28","phoneType":"Win32"},"clientMutationId":"V"}}};
      //   console.info(JSON.stringify(sendData));
      req.write(JSON.stringify(sendData));

      req.on("error", e => {
        reject(e);
      });
      req.end();
    });
  }

  extend(options) {
    let target = this.option;
    for (name in options) {
      target[name] = options[name];
    }
    return target;
  }
}

module.exports = new HttpsUtils();
