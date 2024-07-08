const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);




async function generateQuery(id, data, query) {
    return new Promise((resolve, reject) => {
        if (data) {
            for (let rows of data) {
                const _bulkInsert = '(' + db.escape(id) + ',' + db.escape(rows) + ')';
                query = query + _bulkInsert;
                if (rows === data[data.length - 1]) {
                    query += ';';
                } else {
                    query += ',';
                }
            }
            resolve(query);
        } else {
            resolve('');
        }
    });
}

async function generateArray(data) {
    return new Promise((resolve, reject) => {
        if (data) {
            resolve(JSON.parse(data));
        } else {
            resolve([]);
        }
    });
}

router.get('/knit-factory', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitfactory(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, factorys: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/knit', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knit(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/knit/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_knit(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const header = rows.RowDataPacket[0];
                        const line = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            headerData: header,
                            lineData: line
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.post('/knit', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var factory = req.body.factory ? req.body.factory : '';
        var date = req.body.date ? req.body.date : null;
        var allocatedDay = req.body.allocatedDay ? req.body.allocatedDay : 0;
        var houseKeepingStatus = req.body.houseKeepingStatus ? req.body.houseKeepingStatus : '';
        var floorLightingStatus = req.body.floorLightingStatus ? req.body.floorLightingStatus : '';
        var gasElecAvailability = req.body.gasElecAvailability ? req.body.gasElecAvailability : '';
        var storageAreaStatus = req.body.storageAreaStatus ? req.body.storageAreaStatus : '';
        var status = req.body.status ? req.body.status : '';

        var data = [];
        var headerQuery = "INSERT INTO tmp_knit_line(line_id,knitId,buyer,orderno,style,color,size,woId,knitMachineno,yarnLot,dayProductionKgs,noOfRollsProduced,noOfRollsChecked,knittingSL,machineRPM,oilSystem,yarnTension,needleQuality,sinkerQuality,movingFan,allStopMotion,takeupRollerTension,remarks,createdBy,orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var knitId = id;
            var buyer = datalist.buyer ? datalist.buyer : '';
            var orderNo = datalist.orderNo ? datalist.orderNo : '';
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var size = datalist.size ? datalist.size : '';
            var woId = datalist.woId;
            var knitMachineno = datalist.knitMachineno ? datalist.knitMachineno : '';
            var yarnLot = datalist.yarnLot ? datalist.yarnLot : '';
            var dayProductionKgs = datalist.dayProductionKgs ? datalist.dayProductionKgs : '';
            var noOfRollsProduced = datalist.noOfRollsProduced ? datalist.noOfRollsProduced : '';
            var noOfRollsChecked = datalist.noOfRollsChecked ? datalist.noOfRollsChecked : '';
            var knittingSL = datalist.knittingSL ? datalist.knittingSL : '';
            var machineRPM = datalist.machineRPM ? datalist.machineRPM : '';
            var oilSystem = datalist.oilSystem ? datalist.oilSystem : '';
            var yarnTension = datalist.yarnTension ? datalist.yarnTension : '';
            var needleQuality = datalist.needleQuality ? datalist.needleQuality : '';
            var sinkerQuality = datalist.sinkerQuality ? datalist.sinkerQuality : '';
            var movingFan = datalist.movingFan ? datalist.movingFan : '';
            var allStopMotion = datalist.allStopMotion ? datalist.allStopMotion : '';
            var takeupRollerTension = datalist.takeupRollerTension ? datalist.takeupRollerTension : '';
            var remarks = datalist.remarks ? datalist.remarks : '';



            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(knitId)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(knitMachineno)},
                ${db.escape(yarnLot)},
                ${db.escape(dayProductionKgs)},
                ${db.escape(noOfRollsProduced)},
                ${db.escape(noOfRollsChecked)},
                ${db.escape(knittingSL)},
                ${db.escape(machineRPM)},
                ${db.escape(oilSystem)},
                ${db.escape(yarnTension)},
                ${db.escape(needleQuality)},
                ${db.escape(sinkerQuality)},
                ${db.escape(movingFan)},
                ${db.escape(allStopMotion)},
                ${db.escape(takeupRollerTension)},
                ${db.escape(remarks)},
                ${db.escape(loginId)},
                ${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_knit(?,?,?,?,?,?,?,?,?,?,?,?)', [id, factory, date, allocatedDay, houseKeepingStatus, floorLightingStatus, gasElecAvailability, storageAreaStatus, status , headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'added successfully' });
                        } else {
                            res.json({ success: true, message: 'updated successfully' });
                        }

                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.delete('/knit/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_knit(?,?,?)', [id, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;

                    if (result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
                    } else {
                        res.json({ success: true, message: 'delete successfully' });
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/knit-filter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var factory = req.query.factory ? req.query.factory : '';
        var order = req.query.order ? req.query.order : '';
        var status = req.query.status ? req.query.status : '';
        var date = req.query.date ? req.query.date : null;
        var orgId = req.decoded.orgId;

        Query = `SELECT 
        ANY_VALUE(kt.id) as id, 
        ANY_VALUE(kt.factory) as factory, 
        ANY_VALUE(ktl.orderNo) as orderNo,
        ANY_VALUE(kt.knitstatus) as status,
              ANY_VALUE(  (
                SELECT 
                    JSON_ARRAYAGG(JSON_OBJECT('color', color))
                FROM 
                    (SELECT DISTINCT color 
                     FROM knit_line 
                     WHERE knitId = kt.id) AS distinct_colors
           ) ) AS colors,
        ANY_VALUE(kt.allocatedDay) as allocatedDay, 
        ANY_VALUE(DATE_FORMAT(kt.date, '%Y-%m-%d')) as date, 
        sum(ktl.dayProductionKgs) as totalDayProductionKgs, 
        sum(ktl.noOfRollsProduced) as totalNoOfRollsProduced
        FROM 
            knit kt 
        INNER JOIN 
            knit_line ktl ON kt.id = ktl.knitId
        WHERE 
            kt.orgId = ${orgId} 
            AND kt.status = 1 
            AND kt.delStatus = 0 `
    
            if (id != 0) {
                Query = Query + ` and kt.id = ('${id}')`
            }
            if (factory != '') {
                Query = Query + ` and kt.factory = '${factory}'`
            }
            if (date != null) {
                Query = Query + ` and DATE_FORMAT(kt.date, '%Y-%m-%d') = '${date}'`
            }
            if (order != '') {
                Query = Query + ` and orderNo = ${order} GROUP BY 
            kt.id,
            kt.factory, 
            ktl.orderNo,
            DATE_FORMAT(kt.date, '%Y-%m-%d');`
            }

            if (status != '') {
                Query = Query + ` and kt.knitstatus = '${status}' GROUP BY 
            kt.id,
            kt.factory, 
            ktl.orderNo,
            DATE_FORMAT(kt.date, '%Y-%m-%d');`
            }

        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorder: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            knit: rows.RowDataPacket[0],
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});



router.get('/knitwo-details', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        
        var orgId = req.decoded.orgId;

        Query = `select sum(kl.noOfRollsProduced) as noOfRolls from knit k join knit_line kl on k.id = kl.knitId where k.orgId = 1 and k.status = 1 and k.delStatus = 0`
 
if (id > 0) {
Query = Query + `;`
} else {
if (buyer != '') {
    Query = Query + ` and buyer IN ('${buyer}')`
}
if (orderNo != '') {
    Query = Query + ` and orderNo IN ('${orderNo}')`
}
if (style != '') {
    Query = Query + ` and style IN ('${style}')`
}
if (color != '') {
    Query = Query + ` and color IN ('${color}')`
}
if (size != '') {
    Query = Query + ` and size IN ('${size}')`
}
}
    

        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', knitProduction: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            knitProduction: rows.RowDataPacket[0],
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/KnitrateId-details', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        
        var orgId = req.decoded.orgId;

        Query = `select sum(knitRate) as knitRate from knitworkorder kw join knitworkorder_line kwl on kw.id = kwl.knitWoId where kw.orgId = 1 and kw.status = 1 and kw.delStatus = 0`
 
if (id > 0) {
Query = Query + `;`
} else {
if (buyer != '') {
    Query = Query + ` and kw.buyer IN ('${buyer}')`
}
if (orderNo != '') {
    Query = Query + ` and kw.orderNo IN ('${orderNo}')`
}
if (style != '') {
    Query = Query + ` and kwl.style IN ('${style}')`
}
if (color != '') {
    Query = Query + ` and kwl.color IN ('${color}')`
}
if (size != '') {
    Query = Query + ` and kwl.machDia IN ('${size}')`
}
}
    

        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', knitRate: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            knitRate: rows.RowDataPacket[0],
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/order-filter', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;

        Query = `SELECT distinct ktl.orderNo
        FROM 
            knit kt 
        INNER JOIN 
            knit_line ktl ON kt.id = ktl.knitId ;`

        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', order: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            order: rows.RowDataPacket[0],
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});





router.get('/knit-date', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knit_date(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', date: [] });
                    }
                    else {
                        res.send({ success: true, date: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/KF-Inventory', (req, res, next) => {
    try {
        var porgId = req.decoded.porgId;
        var pdate = req.query.date;
        client.executeStoredProcedure('pknitfactoryinventory(?,?)', [pdate, porgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', date: [] });
                    }
                    else {
                        res.send({ success: true, KnitFactoryInventory: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.post('/knitworkorder', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var knitfty = req.body.knitfty;
        var knitfty_details = req.body.knitfty_details;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var woNo = req.body.woNo;
        var woRefNo = req.body.woRefNo;
        var woDate = req.body.woDate;
        var completedDate = req.body.completedDate;
        var knitKgs = req.body.knitKgs;
        var knitValue = req.body.knitValue;
        var notes = req.body.notes;


        var data = [];
        var headerQuery = "INSERT INTO tmp_knitwo_line(line_id, knitWoId, machDia, fabDia, fabType, style, color, fabGSM, KnitSl, knitKg, knitRate, knitValue, remarks, createdBy, orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var knitWoId = id;
            var machDia = datalist.machDia;
            var fabDia = datalist.fabDia;
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var fabType = datalist.fabType;
            var fabGSM = datalist.fabGSM;
            var KnitSl = datalist.KnitSl;
            var knitKg = datalist.knitKg;
            var knitRate = datalist.knitRate;
            var knitValue = datalist.knitValue;
            var remarks = datalist.remarks;


            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(knitWoId)},
                ${db.escape(machDia)},
                ${db.escape(fabDia)},
                ${db.escape(fabType)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(fabGSM)},
                ${db.escape(KnitSl)},
                ${db.escape(knitKg)},
                ${db.escape(knitRate)},
                ${db.escape(knitValue)},
                ${db.escape(remarks)},
                ${db.escape(loginId)},
                ${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_knitWorkOrder(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, knitfty, knitfty_details, buyer, orderNo, woNo, woRefNo, woDate, completedDate, knitKgs, knitValue, notes, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'added successfully' });
                        } else {
                            res.json({ success: true, message: 'updated successfully' });
                        }

                    }
                } catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/knitworkorder', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitworkorder(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/knitworkorder/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_knitworkorder(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', lineData: [] });
                    }
                    else {
                        const header = rows.RowDataPacket[0];
                        const line = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            headerData: header,
                            lineData: line
                        })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.delete('/knitworkorder/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_knitworkorderList(?,?)', [id, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;

                    if (result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
                    } else {
                        res.json({ success: true, message: 'delete successfully' });
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/knitworkorder_Fty_Fillter', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty ? req.query.knitfty : ''
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitWo_fty_filter(?,?)', [knitfty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0], buyer: rows.RowDataPacket[1] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/knitworkorder_buyer_Fillter', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty ? req.query.knitfty : ''
        var buyer = req.query.buyer ? req.query.buyer : ''
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitWo_buyer_filter(?,?,?)', [buyer, knitfty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0], orderNo: rows.RowDataPacket[1] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/knitworkorder_order_Fillter', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty ? req.query.knitfty : ''
        var buyer = req.query.buyer ? req.query.buyer : ''
        var order = req.query.order ? req.query.order : ''
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitWo_order_filter(?,?,?,?)', [order, buyer, knitfty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, workorders: rows.RowDataPacket[0], orderNo: rows.RowDataPacket[1] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

router.get('/Day-Knit', (req, res, next) => {
    try {
        var date = req.query.date ? req.query.date : null;;

        client.executeStoredProcedure('pday_Knit(?)', [date],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
                    }
                    else {
                        res.send({ success: true, data: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});


router.get('/knitauth', (req, res, next) => {
    try {
        var porgId = req.decoded.porgId;
        var pfactory = req.query.factory;
        var pbuyer = req.query.buyer;
        var porder = req.query.orderNo;
        var pstyle = req.query.style;
        var pcolor = req.query.color;
        var psize = req.query.size;
        client.executeStoredProcedure('pget_knitauth(?,?,?,?,?,?)', [pfactory, pbuyer, porder, pstyle, pcolor, psize],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', knitWoDetails: [] });
                    }
                    else {
                        res.send({ success: true, knitWoDetails: rows.RowDataPacket[0] })
                    }
                }
                catch (err) {
                    next(err)
                }
            });
    }
    catch (err) {
        next(err)
    }
});

module.exports = router;







