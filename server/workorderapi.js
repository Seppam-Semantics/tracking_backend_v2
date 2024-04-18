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

router.get('/workorder', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_workorder(?)', [orgId],
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





router.get('/workorder/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_workorder(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', employee: [] });
                    }
                    else {
                        const basicData = rows.RowDataPacket[0][0];
                        res.send({
                            success: true,
                            // employee: basicData
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

router.post('/workorder', async (req, res, next) => {
    try {
        console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_workorder(id,buyer,orderno,style,color,size,fabType,fabDia,fabGsm,yarnKg,greigeKg,yarnType,finishKg,knitSL,spinFty,knitFty,dyeinFty,noDays,createdBy,orgId) values "

        var data = req.body;
        var i = 0;
        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var buyer = datalist.buyer;
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var fabType = datalist.fabType;
            var fabDia = datalist.fabDia;
            var fabGsm = datalist.fabGsm;
	    var yarnKg = datalist.yarnKg;
	    var greigeKg = datalist.greigeKg;
            var yarnType = datalist.yarnType;
            var finishKg = datalist.finishKg;
            var knitSL = datalist.knitSL;
            var spinFty = datalist.spinFty;
            var knitFty = datalist.knitFty;
            var dyeinFty = datalist.dyeinFty;
            var noDays = datalist.noDays;


            bulkInsert =

                `(${db.escape(id)},${db.escape(buyer)},${db.escape(orderNo)},${db.escape(style)},${db.escape(color)},${db.escape(size)},${db.escape(fabType)},${db.escape(fabDia)},${db.escape(fabGsm)},${db.escape(yarnKg)},${db.escape(greigeKg)},${db.escape(yarnType)},${db.escape(finishKg)},${db.escape(knitSL)},${db.escape(spinFty)},${db.escape(knitFty)},${db.escape(dyeinFty)},${db.escape(noDays)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_workorder(?,?,?,?)', [id, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'added successfully' });
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

router.delete('/workorder/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_workorder(?,?,?)', [id, loginId, orgId],
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

router.get('/workorders-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select A.id,A.buyer,A.orderNo,A.style,A.color,A.size,A.fabType, 
                    A.fabDia, A.fabGsm, A.yarnKg, greigeKg, A.yarnType, A.finishKg, A.knitSL, A.spinFty, A.knitFty, A.dyeinFty, A.noDays, A.isPrint, A.status, A.printCount, 
                    (select sum(entry_1) from transcation_entry1 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_1,
                    (select sum(noOfRolls) from transcation_entry1 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_1,
                    (select sum(entry_2) from transcation_entry2 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_2,
                    (select sum(noOfRolls) from transcation_entry2 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_2,
                    (select sum(entry_3) from transcation_entry3 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_3,
                    (select sum(noOfRolls) from transcation_entry3 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_3,
                    (select sum(entry_4) from transcation_entry4 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_4,
                    (select sum(noOfRolls) from transcation_entry4 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_4,
                    (select sum(entry_5) from transcation_entry5 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_5,
                    (select sum(noOfRolls) from transcation_entry5 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_5,
                    (select sum(entry_6) from transcation_entry6 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_6,
                    (select sum(noOfRolls) from transcation_entry6 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_6,
                    (select sum(entry_7) from transcation_entry7 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) AS total_7,
                    (select sum(noOfRolls) from transcation_entry7 where workorderId = A.id and orgId = ${orgId} and status = 1 and delStatus = 0) as totalRolls_7
                    from workorder A where A.orgId = ${orgId} and A.delStatus = 0`

        if (id > 0) {
            Query = Query + ` and A.id IN (${id})`
        } else {
            if (buyer != '') {
                Query = Query + ` and A.buyer IN ('${buyer}')`
            }
            if (orderNo != '') {
                Query = Query + ` and A.orderNo IN ('${orderNo}')`
            }
            if (style != '') {
                Query = Query + ` and A.style IN ('${style}')`
            }
            if (color != '') {
                Query = Query + ` and A.color IN ('${color}')`
            }
            if (size != '') {
                Query = Query + ` and A.size IN ('${size}')`
            }
        }
        // console.log(Query);
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
                            workorders: rows.RowDataPacket[0],
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

router.put('/workorder/:id', async (req, res, next) => {
    try {
        // console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.params.id;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        var fabType = req.body.fabType;
        var fabDia = req.body.fabDia;
        var fabGsm = req.body.fabGsm;
	var yarnKg = req.body.yarnKg;
	var greigeKg = req.body.greigeKg;
        var yarnType = req.body.yarnType;
        var finishKg = req.body.finishKg;
        var knitSL = req.body.knitSL;
        var spinFty = req.body.spinFty;
        var knitFty = req.body.knitFty;
        var dyeinFty = req.body.dyeinFty;
        var noDays = req.body.noDays;
        var status = req.body.status

        client.executeNonQuery('pput_workorder(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, buyer, orderNo, style, color, size, fabType, fabDia, fabGsm, yarnKg, greigeKg, yarnType, finishKg, knitSL, spinFty, knitFty, dyeinFty, noDays, status, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        res.json({ success: true, message: 'updated successfully' });
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







