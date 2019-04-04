/**
 * 初始化方法
 * 设定的顺序：
 * 1、登录
 * 2、维持登录状态
 * 3、获取订单信息
 * 2、获取用户基本信息
 */
const HttpUtils = require("./https_utils");
const DBDeal = require("./db/db_deal");

class Index {
  constructor() {
    //初始化时先从数据库中获取所有的用户信息进行入库
    this.cache = {
      betUser: {
        tableName: "T_Bets_User",
        data: []
      },
      //已出票
      order: {
        tableName: "T_User_Order",
        data: []
      },
      //未出票
      noTicket: {
        tableName: "T_User_No_Ticket_Order",
        data: []
      },
      //撤单
      cancelOrder:{
        tableName: "T_User_Cancel_Order",
        data: []
      }
    };
    this.betUser = this.cache.betUser.tableName;
    this.betUserAccount = "T_Bets_User_Account";
    this.userOrder = this.cache.order.tableName;
  }

  async _init() {
    //初始化获取数据
    let cache = this.cache;
    for (let attr in cache) {
      let obj = cache[attr];
      let tableName = obj.tableName;
      try {
        let sql = "select id from " + tableName;
        let result = await DBDeal.execSql(sql);
        for (let idObj of result) {
          obj.data.push(idObj.id);
        }
      } catch (e) {
        console.error("初始化数据时出错了：" + e);
      }
    }

    //获取对应
  }

  async login() {
    /**
     * 开始进行登录操作
     */
    let loginData = {
      query:
        "mutation LoginMutation($input_0:loginAdminMutationInput!) { loginAdminMutation(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on loginAdminMutationPayload { adminTokenResult { errorCode, adminToken { createTime, type, token, adminId, admin { cashPassword, status, registerDate, adminiconURL, id, clientIcon, name, nickname, idCode, phone, weiChat, password, adminname, alipay, isSetPassword, clienturl, androidUrl, packageStatus, idcodeUrl, storeUrl3, storeUrl2, storeUrl1, trainUrl, sellUrl, authStatus, auditMsg, address, paymentWay }, validTime }, value, id } }",
      variables: {
        input_0: {
          argsInput: {
            phone: "17521014223",
            password: "b123y456",
            resource: "pc|123",
            token: null,
            storeId: "",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "1p"
        }
      }
    };
    let result = await HttpUtils.sendData({}, loginData);
    return result;
  }

  async findUsers(adminToken) {
    let data = {
      query:
        "mutation UserListMutation($input_0:getUserListsInput!) { getUserLists(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on getUserListsPayload { getUserLists { errorCode, totalResult, list { taccount { lastprizeamt, userno, balance }, user { phone, idCode, usericonURL, username, status, registerDate, name, nickname, id, allowPublish, remark, inviteId, channel } }, value, id }, clientMutationId }",
      variables: {
        input_0: {
          argsInput: {
            pageNum: 1,
            pageSize: 999999,
            token: adminToken.token,
            storeId: "ds" + adminToken.adminId,
            resource: "pc|123",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "Q"
        }
      }
    };
    return HttpUtils.sendData({}, data);
  }

  /**
   * 获取撤票信息
   */
  async findCancelOrder(adminToken) {
    let data = {
      query:
        "mutation GetAllOrdersMutation($input_0:getAllOrdersInput!) { getAllOrders(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on getAllOrdersPayload { getAllOrders { errorCode, totalResult, torderDomains { ordertype, desc, prizestate, orderstate, orderamt, id, orderprizeamt, batchcode, orderprize, lotno, betcode, lotmulti, latedteamid, storeId, endtime, openTime, caselotStarter, userno, canceltime, playtype, hasachievement, createtime, subaccountType, successtime, eventcode, errorcode, winbasecode, betnum, prizeinfo, orderpreprizeamt, orderinfo, buyuserno, amt, modifytime, subchannel, bettype, isNeedPhoto, realPrizeAmt, cpId, isCooperate, isLeague, isWhole, isPushed, cooperateOrder { fee, id }, userPhone, jingcaiResults { peilvs { peilv, type }, dxf, day, firsthalfresult, result, team, week, enddate, letpoint, teamId, league } }, value, id } }",
      variables: {
        input_0: {
          argsInput: {
            type: "",
            pageNum: 1,
            orderStatus: 2,
            pageSize: 9999999,
            token: adminToken.token,
            storeId: "ds" + adminToken.adminId,
            resource: "pc|123",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "F"
        }
      }
    };
    return await HttpUtils.sendData({}, data);
  }

  /**
   * 获取出票信息
   */
  async findEmergeOrder(adminToken) {
    let data = {
      query:
        "mutation GetAllOrdersMutation($input_0:getAllOrdersInput!) { getAllOrders(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on getAllOrdersPayload { getAllOrders { errorCode, totalResult, torderDomains { ordertype, desc, prizestate, orderstate, orderamt, id, orderprizeamt, batchcode, orderprize, lotno, betcode, lotmulti, latedteamid, storeId, endtime, openTime, caselotStarter, userno, canceltime, playtype, hasachievement, createtime, subaccountType, successtime, eventcode, errorcode, winbasecode, betnum, prizeinfo, orderpreprizeamt, orderinfo, buyuserno, amt, modifytime, subchannel, bettype, isNeedPhoto, realPrizeAmt, cpId, isCooperate, isLeague, isWhole, isPushed, cooperateOrder { fee, id }, userPhone, jingcaiResults { peilvs { peilv, type }, dxf, day, firsthalfresult, result, team, week, enddate, letpoint, teamId, league } }, value, id } }",
      variables: {
        input_0: {
          argsInput: {
            type: "",
            pageNum: 1,
            orderStatus: "1,7",
            pageSize: 999999,
            token: adminToken.token,
            storeId: "ds" + adminToken.adminId,
            resource: "pc|123",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "b"
        }
      }
    };
    return await HttpUtils.sendData({}, data);
  }

  /**
   * 获取未出票信息
   */
  async findNoTicketOrder(adminToken) {
    let data = {
      query:
        "mutation GetNoTicketOrdersForAdminMutation($input_0:getNoTicketOrdersForAdminInput!) { getNoTicketOrdersForAdmin(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on getNoTicketOrdersForAdminPayload { getNoTicketOrdersForAdmin { errorCode, totalResult, torderDomains { ordertype, desc, prizestate, orderstate, orderamt, id, orderprizeamt, batchcode, orderprize, lotno, betcode, lotmulti, latedteamid, storeId, endtime, caselotStarter, userno, canceltime, playtype, hasachievement, createtime, subaccountType, successtime, eventcode, errorcode, winbasecode, betnum, prizeinfo, orderpreprizeamt, orderinfo, buyuserno, amt, modifytime, subchannel, bettype, isLeague, isWhole, cpId, isCooperate, isPushed, userPhone, lastprinttime, waitTime, isPrinted, jingcaiResults { peilvs { peilv, type }, dxf, day, firsthalfresult, result, team, week, enddate, letpoint, teamId, league } }, value, id } }",
      variables: {
        input_0: {
          argsInput: {
            type: "",
            pageNum: 1,
            orderStatus: 0,
            pageSize: 9999999,
            token: adminToken.token,
            storeId: "ds" + adminToken.adminId,
            sortBy: "lastprinttime",
            resource: "pc|123",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "2"
        }
      }
    };
    return await HttpUtils.sendData({}, data);
  }

  maintain(adminToken) {
    /**
     * 维持心跳处理；
     */
    let maintainData = {
      query:
        "mutation GetUnprintCountMutation($input_0:getWaitTicketTordersInput!) { getWaitTicketTorders(input:$input_0) { clientMutationId, ...F0 } } fragment F0 on getWaitTicketTordersPayload { getWaitTicketTorders { errorCode, value, totalNum, id } }",
      variables: {
        input_0: {
          argsInput: {
            lotNo: "",
            pageNum: 1,
            pageSize: 1,
            storeId: "ds" + adminToken.adminId,
            orderState: 0,
            token: adminToken.token,
            resource: "pc|123",
            clientType: "store",
            appVersion: "1.2.28",
            phoneType: "Win32"
          },
          clientMutationId: "1t"
        }
      }
    };
    let self = this;
    this.handler = setInterval(() => {
      HttpUtils.sendData({}, maintainData).then(result => {
        let getNoTicketOrdersForAdmin =
          result.data.getNoTicketOrdersForAdmin.getNoTicketOrdersForAdmin;
        if (getNoTicketOrdersForAdmin.errorCode != 0) {
          console.error("出现的错误信息为：" + getNoTicketOrdersForAdmin.value);
          clearInterval(self.handler);
          return;
        }
        console.info("维持心跳的结果为：" + JSON.stringify(result));
      });
    }, 2 * 1000);
  }

  async main() {
    await this._init();
    /**
     * 执行主方法
     */
    let result = await this.login();

    let adminTokenResult = result.data.loginAdminMutation.adminTokenResult;
    if (adminTokenResult.errorCode != 0) {
      console.error(adminTokenResult.value);
      return;
    }
    //定时每10分钟进行获取1次相关数据
   

    let adminToken = adminTokenResult.adminToken;
    let self = this;
    setInterval(()=>{
      self.doUserDeal(adminToken).then((result)=>{
        console.info("执行完毕。。。。");
      });
    },10*1000);


    //每10分钟获取一次订单信息
    setInterval(()=>{
      Promise.all([self.doNoTicketOrderDeal(adminToken),self.doEmergeOrder(adminToken),self.doCancelOrder(adminToken)]).then((results)=>{
          console.info("获取订单信息完毕.");
      });
      //开始获取所有未出票信息，存入到数据库中；
    },10*60*1000);


  }

  async doCancelOrder(adminToken) {
    let result = await this.findCancelOrder(adminToken);
    let data = result.data.getAllOrders.getAllOrders.torderDomains;
    //获取到的数据，进行判断是否已经含有了直接调整具体的ID;
    if (!data || data.length == 0) {
      return;
    }

    //缓存中没有的进行添加入库。如果含有状态不正确的进行修改
    let cancelOrderCache = this.cache.cancelOrder.data;
    await this.doDealOrder(data,cancelOrderCache,this.cache.cancelOrder.tableName);
  }

  async doEmergeOrder(adminToken) {
    let result = await this.findEmergeOrder(adminToken);
    let data = result.data.getAllOrders.getAllOrders.torderDomains;

    try{
      await this.doDealOrder(data,this.cache.order.data,this.cache.order.tableName);
    }catch(e){
      console.error("解析数据后出现问题了。。。"+e);
    }
  }
  


  /**
   * 处理所有未出票数据。
   * @param {*} adminToken
   */
  async doNoTicketOrderDeal(adminToken) {
    console.info("======come in doOrderDeal method......");
    let result = await this.findNoTicketOrder(adminToken);
    let data =
      result.data.getNoTicketOrdersForAdmin.getNoTicketOrdersForAdmin
        .torderDomains;
    console.info("获取到未出票的数据为。。");
    console.info(data);
    //判断缓存中是否已经存在，如果存在则直接丢弃。
    let noTicketCache = this.cache.noTicket.data;
    await this.doDealOrder(data,noTicketCache,this.cache.noTicket.tableName);

  }

  async doDealOrder(data,cache,tableName){
    if(!data || data.length == 0){
        return;
    }
    let self = this;
    let addOrders = [];
    for (let order of data) {
      let flag = false;
      for (let oldOrder of cache) {
        if (order.id == oldOrder) {
          flag = true;
          break;
        }
      }
      if(!flag){
        addOrders.push(order);
      }

    }

    //遍历需要删除的订单
    let len = cache.length;
    let delDatas = [];
    for(let i = len -1;i>=0;i--){
      let noTicket = cache[i];
      let flag = false;
      for (let order of data) {
        if (order.id == noTicket) {
          flag = true;
          break;
        }
      }
      if(!flag){
        delDatas.push(noTicket);
        cache.splice(i,1);
      }
    }
    for (let order in addOrders) {
      cache.push(order.id);
    }
    if(addOrders.length > 0){
      console.info(addOrders);
      await self.doSaveAccount(addOrders, tableName);
    }

    //同时删除指定数据
    if(delDatas.length > 0){
      await self.doRemoveOrder(delDatas, tableName);
    }
  }
  /**
   * 处理爬取的用户信息；
   * 处理步骤：
   * 1、https方式获取到所有的用户信息；
   * 2、和缓存中用户信息进行对比；
   * 3、如果缓存不存在则添加缓存中并且入库操作
   * @param {*} adminToken
   */
  async doUserDeal(adminToken) {
    let self = this;
    let result = await this.findUsers(adminToken);
    //数据存入到数据库中,整体结构不变入库
    let users = result.data.getUserLists.getUserLists.list;
    //调用数据库进行批量入库操作；
    let userCache = self.cache.betUser.data;
    let addUsers = [];
    let addUserAccount = [];
    for (let userInfo of users) {
      let taccount = userInfo.taccount;
      let user = userInfo.user;
      //进行判断对应数据是否存在，如果存在不进行保存
      let flag = false;
      for (let userId of userCache) {
        if (user.id == userId) {
          flag = true;
          break;
        }
      }
      if (flag) {
        continue;
      }
      //表明不存在，直接进行操作先存入到缓存中，然后进行
      //单独调用保存方法；
      addUsers.push(user);
      addUserAccount.push(taccount);
    }
    if (addUsers.length == 0) {
      return;
    }
    // console.info("添加的用户信息为：" + JSON.stringify(addUsers));
    for (let user of addUsers) {
      //添加到缓存中
      userCache.push(user.id);
    }
    //进行批量操作入库操作
    await self.doSaveAccount(addUsers, self.betUser);
    await self.doSaveAccount(addUserAccount, self.betUserAccount);
  }

  async doRemoveOrder(ids,table){
    if(!ids|| ids.length == 0){
      console.error("传入的ids不允许为空");
      return;
    }
    let sql = "delete from "+ table +" where 1=1 and id in (";
    let flag = false;
    for(let id of ids){
        if(!flag){
          flag = true;
        }else{
          sql += ","
        }
      sql += "'"+id+"'";
    }
    sql += ")";
    await DBDeal.execSql(sql);
  }

  async doSaveAccount(accounts, table) {
    let self = this;
    //根据属性进行组装sql语句；
    if (!accounts || accounts.length == 0) {
      console.error("传入的数据为空,表名称为：" + table);
      return;
    }

    let account = accounts[0];

    // let multFlag = false;
    for (let user of accounts) {
      // if (multFlag) {
      //   sql += ",";
      // } else {
      //   multFlag = true;
      // }
      let sql = "insert " + table + "(";
      let flag = false;
      for (let attr in account) {
        //判断对应属性是否为对象，如果为对象进行continue
        if (flag) {
          sql += ",";
        } else {
          flag = true;
        }
        sql += "`"+attr+"`";
      }
      sql += ") values ";
      sql += "(";
      let sendFlag = false;
      for (let attr in user) {
        if (sendFlag) {
          sql += ",";
        } else {
          sendFlag = true;
        }
        if (user[attr] == null) {
          sql += null;
        } else if (typeof user[attr] == "object") {
          sql += "'" + JSON.stringify(user[attr]) + "'";
        } else {
          sql += "'" + user[attr] + "'";
        }
      }
      sql += ")";
      console.info(sql);
      await DBDeal.execSql(sql);
    }

  }
}

let index = new Index();
index.main().then(() => {
  console.info("ok");
});
