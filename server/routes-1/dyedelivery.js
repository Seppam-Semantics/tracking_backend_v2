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


router.get('/dye-delivery', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dye_delivery(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeDelivery: [] });
                    }
                    else {
                        res.send({ success: true, dyeDelivery: rows.RowDataPacket[0] })
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

router.get('/dye-delivery/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pview_dye_delivery(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeDelivery: [] });
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

router.post('/dye-delivery', async (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var factory = req.body.factory ? req.body.factory : '';
        var date = req.body.date ? req.body.date : null;

        var data = [];
        var headerQuery = "INSERT INTO tmp_dye_delivery_line(line_id,dyeDelId,dyeChallan,batchNo,buyer,orderno,style,color,size,woId,griegeRolls,griegeDeliveryKgs,finishDeliveryKgs,finishRolls,dyeRate,dyeValue,createdBy,orgId) values "

        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var dyeDelId = id;
            var dyeChallan = datalist.dyeChallan? datalist.dyeChallan : '';
            var batchNo = datalist.batchNo? datalist.batchNo : '';
            var buyer = datalist.buyer ? datalist.buyer : '';
            var orderNo = datalist.orderNo ? datalist.orderNo : '';
            var style = datalist.style ? datalist.style : '';
            var color = datalist.color ? datalist.color : '';
            var size = datalist.size ? datalist.size : '';
            var woId = datalist.woId ? datalist.woId : null;
            var griegeRolls = datalist.griegeRolls ? datalist.griegeRolls : null;
            var griegeDeliveryKgs = datalist.griegeDeliveryKgs ? datalist.griegeDeliveryKgs : null;
            var finishDeliveryKgs = datalist.finishDeliveryKgs ? datalist.finishDeliveryKgs : '';
            var finishRolls = datalist.finishRolls ? datalist.finishRolls : '';
            var dyeRate = datalist.dyeRate ? datalist.dyeRate : '';
            var dyeValue = datalist.dyeValue ? datalist.dyeValue : '';

            bulkInsert =
                `(${db.escape(line_id)},
                ${db.escape(dyeDelId)},
                ${db.escape(dyeChallan)},
                ${db.escape(batchNo)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(griegeRolls)},
                ${db.escape(griegeDeliveryKgs)},
                ${db.escape(finishDeliveryKgs)},
                ${db.escape(finishRolls)},
                ${db.escape(dyeRate)},
                ${db.escape(dyeValue)},
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

        client.executeNonQuery('ppost_dye_delivery(?,?,?,?,?,?)', [id, factory, date, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'Something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Added Successfully' });
                        } else {
                            res.json({ success: true, message: 'Updated Successfully' });
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

router.delete('/dye-delivery/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_dye_delivery(?,?,?)', [id, loginId, orgId],
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

router.get('/dye-delivery-filter', (req, res, next) => {
    try {

        var id = req.query.id ? req.query.id : 0;
        var factory = req.query.factory ? req.query.factory : '';
        var date = req.query.date ? req.query.date : null;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select kt.id,kt.factory,kt.date,totalrolls,totalKg from knit_delivery kt
        where kt.orgId = ${orgId}  and kt.status = 1 and kt.delStatus = 0`

        if (id != 0) {
            Query = Query + ` and kt.id = ('${id}')`
        }
        if (factory != '') {
            Query = Query + ` and kt.factory = ('${factory}')`
        }
        if (date != null) {
            Query = Query + ` and kt.date = ('${date}')`
        }
        if (buyer != '') {
            Query = Query + ` and ktl.buyer IN ('${buyer}')`
        }
        if (orderNo != '') {
            Query = Query + ` and ktl.orderNo IN ('${orderNo}')`
        }
        if (style != '') {
            Query = Query + ` and ktl.style IN ('${style}')`
        }
        if (color != '') {
            Query = Query + ` and ktl.color IN ('${color}')`
        }
        if (size != '') {
            Query = Query + ` and ktl.size IN ('${size}')`
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



module.exports = router;







