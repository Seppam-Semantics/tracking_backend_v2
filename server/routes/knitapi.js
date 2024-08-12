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
        var color = req.query.color ? req.query.color : '';
        var orgId = req.decoded.orgId;

        Query = `select * from (
                    SELECT
                            kt.id, 
                            kt.code, 
                            kt.factory, 
                            ktl.orderNo,
                            ANY_VALUE(kt.knitstatus) as status,
                            (
                                SELECT 
                                    JSON_ARRAYAGG(JSON_OBJECT('color', color))
                                FROM 
                                    (SELECT DISTINCT color 
                                    FROM knit_line 
                                    WHERE knitId = kt.id) AS distinct_colors
                            ) AS colors,
                            kt.allocatedDay, 
                            DATE_FORMAT(kt.date, '%Y-%m-%d') AS date, 
                            SUM(ktl.dayProductionKgs) AS totalDayProductionKgs, 
                            SUM(ktl.noOfRollsProduced) AS totalNoOfRollsProduced
                        FROM 
                            knit kt 
                        INNER JOIN 
                            knit_line ktl ON kt.id = ktl.knitId
                        WHERE 
                            kt.orgId = 1
                            AND kt.status = 1 
                            AND kt.delStatus = 0 
                            GROUP BY 
                                    kt.id, 
                                    kt.code, 
                                    kt.factory, 
                                    ktl.orderNo,
                                    kt.allocatedDay, 
                                    DATE_FORMAT(kt.date, '%Y-%m-%d')
                            ) as knitproduction   `
    
            if (order != '') {
                Query = Query + ` where orderNo = ${order} ;`
            }

            if (status != '') {
                Query = Query + ` where status = '${status}';`
            }

            if (color != '') {
                Query = Query + ` where  JSON_CONTAINS(colors, JSON_OBJECT('color','${color}'));`
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

router.get('/knit_Total_filter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var factory = req.query.factory ? req.query.factory : '';
        var order = req.query.order ? req.query.order : '';
        var status = req.query.status ? req.query.status : '';
        var color = req.query.color ? req.query.color : '';
        var date = req.query.date ? req.query.date : null;
        var orgId = req.decoded.orgId;

        Query = `select sum(totalDayProductionKgs) as totalDayProductionKgs from (
                    SELECT
                            kt.id, 
                            kt.code, 
                            kt.factory, 
                            ktl.orderNo,
                            ANY_VALUE(kt.knitstatus) as status,
                            (
                                SELECT 
                                    JSON_ARRAYAGG(JSON_OBJECT('color', color))
                                FROM 
                                    (SELECT DISTINCT color 
                                    FROM knit_line 
                                    WHERE knitId = kt.id) AS distinct_colors
                            ) AS colors,
                            kt.allocatedDay, 
                            DATE_FORMAT(kt.date, '%Y-%m-%d') AS date, 
                            SUM(ktl.dayProductionKgs) AS totalDayProductionKgs, 
                            SUM(ktl.noOfRollsProduced) AS totalNoOfRollsProduced
                        FROM 
                            knit kt 
                        INNER JOIN 
                            knit_line ktl ON kt.id = ktl.knitId
                        WHERE 
                            kt.orgId = 1
                            AND kt.status = 1 
                            AND kt.delStatus = 0 
                            GROUP BY 
                                    kt.id, 
                                    kt.code, 
                                    kt.factory, 
                                    ktl.orderNo,
                                    kt.allocatedDay, 
                                    DATE_FORMAT(kt.date, '%Y-%m-%d')
                            ) as knitproduction   `
    
            if (order != '') {
                Query = Query + ` where orderNo = ${order} ;`
            }

            if (status != '') {
                Query = Query + ` where status = '${status}';`
            }

            if (color != '') {
                Query = Query + ` where  JSON_CONTAINS(colors, JSON_OBJECT('color','${color}'));`
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
                            knitTotal: rows.RowDataPacket[0],
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


router.get('/knit_color_list', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var factory = req.query.factory ? req.query.factory : '';
        var order = req.query.order ? req.query.order : '';
        var status = req.query.status ? req.query.status : '';
        var date = req.query.date ? req.query.date : null;
        var orgId = req.decoded.orgId;

        Query = `SELECT DISTINCT color FROM knit_line where orgId = 1 AND status = 1  AND delStatus = 0 `
    
        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', color: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            color: rows.RowDataPacket[0],
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
                        res.send({ success: true, knitKgTotal: rows.RowDataPacket[0] , workorders: rows.RowDataPacket[1] })
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
                        res.send({ success: true, knitKgTotal: rows.RowDataPacket[0],workorders: rows.RowDataPacket[1], buyer: rows.RowDataPacket[2] })
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
                        res.send({ success: true, knitKgTotal: rows.RowDataPacket[0], workorders: rows.RowDataPacket[1], orderNo: rows.RowDataPacket[2] })
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
                        res.send({ success: true, knitKgTotal: rows.RowDataPacket[0], workorders: rows.RowDataPacket[1], orderNo: rows.RowDataPacket[2] })
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

router.get('/Dayknitfilter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var order = req.query.order ? req.query.order : '';
        var status = req.query.status ? req.query.status : '';
        var date1 = req.query.date1 ? req.query.date1 : '';
        var date2 = req.query.date2 ? req.query.date2: '';
        var orgId = req.decoded.orgId;

        Query = `SELECT 
    ANY_VALUE(k.factory) AS factory,
    kl.buyer,
    kl.orderNo,
    kl.style,
    kl.color,
    kl.size,
    Any_value(k.knitstatus) as knitstatus,
    ANY_VALUE(wo.greigeKg) AS greigeKg ,
     sum( CASE
    WHEN k.date BETWEEN ${date1} AND ${date2} THEN kl.dayProductionKgs 
    ELSE "NoEntry"
    END) AS OnedayProductionKgs , 
       sum( CASE
    WHEN k.date BETWEEN ${date1} AND ${date2} THEN kl.dayProductionKgs 
    ELSE "NoEntry"
    END) AS AlldayProductionKgs
FROM
    knit k
JOIN
    knit_line kl ON k.id = kl.knitId
JOIN
    workorder wo ON wo.buyer = kl.buyer AND wo.orderNo = kl.orderNo AND wo.style = kl.style AND wo.color = kl.color AND wo.size = kl.size `

        if (date1 != '' && date2 != '') {
            Query = Query + `where k.date BETWEEN ${date1} AND ${date2} `
        }
        if (order != '') {
            Query = Query + `and kl.orderNo = ${order} `
        }
        if (status != '') {
            Query = Query + `and k.knitstatus = ${status} `
        }
        Query += ` GROUP BY kl.buyer, kl.orderNo, kl.style, kl.color, kl.size ;`;


        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

// ========================= Knit Machine List =====================================================================================

router.get('/machine-allocation-entry', (req, res, next) => {
    try {
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var orgId = req.decoded.orgId;

        Query = `SELECT * from knit_machine_allocation_line where orgId = ${orgId} and delStatus = 0 and Status = 1 `

        if (orderNo != '') {
            Query = Query + `and orderNo =  '${orderNo}' ; `
        }
        if(startDate != ''){
            Query = Query + ` and startDate >= '${startDate}'`
        }


        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.get('/machine-allocation-entry-filter', (req, res, next) => {
    try {
        var id = req.query.id;
        var orgId = req.decoded.orgId;
        var knitFty = req.query.knitFty ?req.query.knitFty :'';
        var machineDia = req.query.machineDia ? req.query.machineDia : '' ;

        Query = `SELECT id, headId, style, color, size, woId, greigeKg, machineDia, fsize_id, knitFty, knitFty_id, allocated, date_format(startDate, '%Y-%m-%d') as startDate , daysrequired, date_format(endDate, '%Y-%m-%d') as endDate, orgId, status, delStatus, createdBy, createdAt, modifiedBy, modifiedAt, seqId, oldId, buyer, orderNo from knit_machine_allocation_line
                    where orgId = ${orgId} and delStatus = 0 and Status = 1 `

                    if (knitFty != '' && machineDia != '') {
                        Query = Query + `and knitFty = '${knitFty}' and machineDia = ${machineDia} ORDER BY seqId`
            }
        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query], 
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.post('/machine-allocation-entry', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.params.id

        var data = [];
        var headerQuery = "INSERT INTO tmp_knit_machine_allocation_line(line_id, buyer, orderNo, style, color, size, woId, greigeKg, machineDia, fsize_id, knitFty, knitFty_id, allocated, startDate, daysrequired, endDate, seqId , oldId ,createdBy, orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var buyer = datalist.buyer ? datalist.buyer : '';
            var orderNo = datalist.orderNo ? datalist.orderNo : '';
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var size = datalist.size ? datalist.size : '';
            var woId = datalist.woId;
            var greigeKg = datalist.greigeKg;
            var machineDia = datalist.machineDia;
            var fsize_id = datalist.fsize_id;
            var knitFty = datalist.knitFty;
            var knitFty_id = datalist.knitFty_id;
            var allocated = datalist.allocated;
            var startDate = datalist.startDate;
            var daysrequired = datalist.daysrequired;
            var endDate = datalist.endDate;
            var seqId = datalist.seqId;
            var oldId = datalist.oldId;

            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(greigeKg)},
                ${db.escape(machineDia)},
                ${db.escape(fsize_id)},
                ${db.escape(knitFty)},
                ${db.escape(knitFty_id)},
                ${db.escape(allocated)},
                ${db.escape(startDate)},
                ${db.escape(daysrequired)},
                ${db.escape(endDate)},
                ${db.escape(seqId)},
                ${db.escape(oldId)},
                ${db.escape(loginId)},
                ${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','
            }
            i = i + 1;
        }

        // console.log(headerQuery)

        client.executeNonQuery('ppost_knit_machine_allocation(?,?,?,?)', [id, headerQuery, loginId, orgId],
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

router.get('/productionDays', (req, res, next) => {
    try {
        var knitFty = req.query.knitFty;
        var machineDia = req.query.machineDia;
        var orgId = req.decoded.orgId;

        Query = `SELECT * from knit_machine_list where orgId = ${orgId} and delStatus = 0 and Status = 1 and knitFty = '${knitFty}' and machineDia = ${machineDia}`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.put('/machine-allocation-update', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var data = [];


        var headerQuery = "INSERT INTO tmp_machine_allocation(lineId, headId, seqId, style, color, size, woId, greigeKg, machineDia, knitFty, allocated, startDate, daysrequired, endDate, oldId, createdBy, orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var lineid = datalist.id ? datalist.id : 0;
            var headId = datalist.headId;
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var size = datalist.size ? datalist.size : '';
            var woId = datalist.woId;
            var greigeKg = datalist.greigeKg;
            var machineDia = datalist.machineDia;
            var knitFty = datalist.knitFty;
            var allocated = datalist.allocated;
            var startDate = datalist.startDate;
            var daysrequired = datalist.daysrequired;
            var endDate = datalist.endDate;
            var seqId = datalist.seqId;
            var oldId = datalist.oldId;

            bulkInsert =
              `(${db.escape(lineid)},
                ${db.escape(headId)},
                ${db.escape(seqId)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(greigeKg)},
                ${db.escape(machineDia)},
                ${db.escape(knitFty)},
                ${db.escape(allocated)},
                ${db.escape(startDate)},
                ${db.escape(daysrequired)},
                ${db.escape(endDate)},
                ${db.escape(oldId)},
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

        client.executeNonQuery('pput_machine_allocation(?,?,?,?)', [id, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Updated successfully' });
                        } else {
                            res.json({ success: true, message: 'Updated successfully' });
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

router.get('/startDate', (req, res, next) => {
    try {
        var knitFty = req.query.knitFty;
        var machineDia = req.query.machineDia;
        var orgId = req.decoded.orgId;

        Query = `SELECT date_format(MAX(endDate), "%Y-%m-%d") endDate from knit_machine_allocation_line where orgId = ${orgId} and delStatus = 0 and Status = 1 and knitFty = '${knitFty}' and machineDia = ${machineDia}`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.get('/machineDiatoKnitFactory', (req, res, next) => {
    try {
        var machineDia = req.query.machineDia;
        var orgId = req.decoded.orgId;

        Query = `SELECT knitFty from knit_machine_list where orgId = ${orgId} and delStatus = 0 and Status = 1 and machineDia = ${machineDia}`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.get('/KnitFactoryfordrag', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `SELECT distinct knitFty from knit_machine_allocation_line where orgId = ${orgId} and delStatus = 0 and Status = 1`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.get('/machineDiafordrag', (req, res, next) => {
    try {
        var knitFty = req.query.knitFty;
        var orgId = req.decoded.orgId;

        Query = `SELECT distinct machineDia from knit_machine_allocation_line where orgId = ${orgId} and delStatus = 0 and Status = 1 and knitFty = ${knitFty}`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

router.get('/KnitMachineorderNoFilter', (req, res, next) => {
    try {
        var knitFty = req.query.knitFty;
        var orgId = req.decoded.orgId;

        Query = `SELECT distinct orderNo from knit_machine_allocation_line where orgId = ${orgId} and delStatus = 0 and Status = 1`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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

module.exports = router;







