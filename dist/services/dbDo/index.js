"use strict";
const models_1 = require("../../models");
module.exports = {
    /**
     * 返还佣金
     * money 任务的奖金
     * 添加一份订单
     */
    returnMoney: async (orders, totalFee) => {
        return new Promise(async (resolve) => {
            for (var order of orders) {
                await models_1.db.userModel.findById(order.userId).update({ $inc: { todayMoney: order.money, totalMoney: order.money, historyMoney: order.money } }).exec();
            }
            var shareDetail = orders.map(order => { return { user: order.userId, money: order.money }; });
            // 每次插入一个订单
            let taskRecord = { task: order.task, shareDetail: shareDetail, totalFee: totalFee };
            console.log(taskRecord);
            let newTaskRecord = await new models_1.db.taskRecordModel(taskRecord).save();
            newTaskRecord = await newTaskRecord.populate('shareDetail.user');
            resolve(newTaskRecord);
        });
    }
};
