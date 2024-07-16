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
        var headerQuery = `INSERT INTO tmp_workorder (poid, polineId, buyer, orderNo, style, color, size, sizeid, fabType, fabricTypeId, fabDia, fabdiaId, fabGsm, fabrGSMId, greigeKg, finishKg, knitSL, spinFty, spinFtyId, knitFty, knitFtyId, dyeinFty, dyeinFtyId, yarnKg, orgId,createdBy, yarnType, yarnTypeId, orderPcs, orderFOBRate, knitRate, dyeRate, fSize, dyetype, dyeTypeId) values `
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var poid = datalist.poid;
            var polineId = datalist.polineId;
            var buyer = datalist.Buyer;
            var orderNo = datalist.OrderNo;
            var style = datalist.Style;
            var color = datalist.Color;
            var size = datalist.Size;
            var sizeId = datalist.SizeId;
            var fabType = datalist.FabType;
            var fabTypeId = datalist.fabricTypeId;
            var fabDia = datalist.FabDia;
            var fabDiaId = datalist.FabDiaId;
            var fabGsm = datalist.FabGsm;
            var fabGsmId = datalist.FabGsmId;
            var yarnKg = datalist.YarnKg;
            var greigeKg = datalist.GreigeKg;
            var yarnType = datalist.YarnType;
            var yarnTypeId = datalist.YarnTypeId;
            var finishKg = datalist.FinishKg;
            var knitSL = datalist.KnitSL;
            var spinFty = datalist.SpinFty;
            var spinFtyId = datalist.SpinFtyId;
            var knitFty = datalist.KnitFty;
            var knitFtyId = datalist.KnitFtyId;
            var dyeinFty = datalist.DyeinFty;
            var dyeinFtyId = datalist.DyeinFtyId;
            var OrderPcs = datalist.OrderPcs;
            var OrderFOBRate = datalist.OrderFOBRate;
            var KnitRate = datalist.KnitRate;
            var DyeRate = datalist.DyeRate;
            var FSize = datalist.FSize;
            var dyetype = datalist.dyetype;
            var dyeTypeId = datalist.dyeTypeId;


            bulkInsert =
            `(${db.escape(poid)},
                ${db.escape(polineId)},
                ${db.escape(buyer)},                
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(sizeId)},
                ${db.escape(fabType)},
                ${db.escape(fabTypeId)},
                ${db.escape(fabDia)},
                ${db.escape(fabDiaId)},
                ${db.escape(fabGsm)},
                ${db.escape(fabGsmId)},
                ${db.escape(greigeKg)},
                ${db.escape(finishKg)},
                ${db.escape(knitSL)},
                ${db.escape(spinFty)},
                ${db.escape(spinFtyId)},
                ${db.escape(knitFty)},
                ${db.escape(knitFtyId)},
                ${db.escape(dyeinFty)},
                ${db.escape(dyeinFtyId)},
                ${db.escape(yarnKg)},
                ${db.escape(orgId)},
                ${db.escape(loginId)},
                ${db.escape(yarnType)},
                ${db.escape(yarnTypeId)},
                ${db.escape(OrderPcs)},
                ${db.escape(OrderFOBRate)},                
                ${db.escape(KnitRate)}, 
                ${db.escape(DyeRate)},
                ${db.escape(FSize)},
                ${db.escape(dyetype)},
                ${db.escape(dyeTypeId)}           
                )`;


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

        Query = `select Any_value(id) as id ,buyer, orderNo, sum(fabDia) as fabDia , sum(fabGsm) as fabGsm ,ANY_VALUE(fabType) AS fabType ,round(sum(yarnKg),2) as yarnKg, round(sum(greigeKg),2) as greigeKg, 
                    round(sum(finishKg), 2) as finishKg, sum(orderPcs) as orderPcs, 
                    round(sum(orderPcs * orderFOBRate),2) as orderValue, status
                    from workorder
                    where orgId = ${orgId} and status = 1 and delStatus = 0`

        if (id > 0) {
            Query = Query + ` and id IN (${id}) group by buyer, orderNo, status ;`
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

        Query = Query + ` group by buyer, orderNo, status ;`
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

router.get('/knitworkorderdyeworkorder-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select id , buyer, orderNo, sum(fabDia) as fabDia , sum(fabGsm) as fabGsm ,fabType ,round(sum(yarnKg),2) as yarnKg, round(sum(greigeKg),2) as greigeKg, 
                    round(sum(finishKg), 2) as finishKg, sum(orderPcs) as orderPcs, 
                    round(sum(orderPcs * orderFOBRate),2) as orderValue, status
                    from workorder
                    where orgId = ${orgId} and status = 1 and delStatus = 0`

        if (id > 0) {
            Query = Query + ` and id = ${id} group by  id , buyer, orderNo, status , fabType ;`
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
                Query = Query + ` and FSize IN ('${size}')`
            }
        }

        Query = Query + `  group by  id , buyer, orderNo, status , fabType ;`
        console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorders: [] });
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



router.get('/workorders-details-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select id, buyer, orderNo, style, color, size, fabType, fabDia, fabGsm, 
                    greigeKg, finishKg, knitSL, spinFty, knitFty, dyeinFty, yarnKg, status,
                    yarnType, orderPcs, orderFOBRate, knitRate, dyeRate, FSize, poid, polineId, 
                    sizeid, fabricTypeId, fabdiaId, fabrGSMId, spinFtyId, knitFtyId, dyeinFtyId, 
                    yarnTypeId, dyetype, dyeTypeId from workorder where orgId = ${orgId} and orderNo = ${orderNo} and delStatus = 0 and status = 1`

        if (id > 0) {
            Query = Query + ` and id IN (${id})`
        } else {
            if (orderNo != '') {
                Query = Query + `;`
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



router.put('/workorder', async (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.params.pid;
        var buyer = req.body.Buyer;
        var orderNo = req.body.OrderNo;
        var style = req.body.Style;
        var color = req.body.Color;
        var size = req.body.Size;
        var fabType = req.body.FabType;
        var fabDia = req.body.FabDia;
        var fabGsm = req.body.FabGsm;
        var yarnKg = req.body.YarnKg;
        var greigeKg = req.body.GreigeKg;
        var yarnType = req.body.YarnType;
        var finishKg = req.body.FinishKg;
        var knitSL = req.body.KnitSL;
        var spinFty = req.body.SpinFty;
        var knitFty = req.body.KnitFty;
        var dyeinFty = req.body.DyeinFty;
        var noDays = req.body.noDays;
        var orderPcs = req.body.OrderPcs;
        var orderFOBRate = req.body.OrderFOBRate;
        var knitRate = req.body.KnitRate;
        var dyeRate = req.body.DyeRate;

        var GSize = req.body.gSize;

        var status = req.body.status;

        client.executeStoredProcedure(`pput_workorder(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?  ,?,?,?,?)`, [id, buyer, orderNo, style, color, size, fabType, fabDia, fabGsm, yarnKg, greigeKg, yarnType, finishKg, knitSL, spinFty, knitFty, dyeinFty, noDays, orderPcs, orderFOBRate, knitRate, dyeRate, GSize, status, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went wrong' });
                    } else {
                        res.json({ success: true, message: 'updated successfully' });
                    }
                }
                catch (err) {
                    next(err);
                }
            });
    }
    catch (err) {
        next(err);
    }
});



router.get('/buyer_order_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer ? req.query.buyer : '';

        client.executeStoredProcedure('pget_buyer_order_BO(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0], orderNo: rows.RowDataPacket[1] })
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

router.get('/order_style_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var order = req.query.order ? req.query.order : '';
        console.log(order)

        client.executeStoredProcedure('pget_order_style_BO(?,?,?)', [order, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, style: rows.RowDataPacket[0] })
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


router.get('/style_Color_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var order = req.query.order ? req.query.order : '';
        var style = req.query.style ? req.query.style : '';
        console.log(order)

        client.executeStoredProcedure('pget_style_color_BO(?,?,?,?)', [style, order, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, color: rows.RowDataPacket[0] })
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

router.get('/Color_size_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var order = req.query.order ? req.query.order : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';


        client.executeStoredProcedure('pget_color_size_BO(?,?,?,?,?)', [color, style, order, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, size: rows.RowDataPacket[0] })
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


router.get('/Fsize_Gsize_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style?req.query.style:'';
        var fsize = req.query.fsize?req.query.fsize:'';

        console.log(style)
        console.log(fsize)

        Query = `SELECT distinct size FROM fsize_master WHERE orgId = ${orgId} and style = '${style}' and concatSize = '${fsize}';`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', Gsize: [] });
                    }
                    else {
                        res.send({ success: true, Gsize: rows.RowDataPacket[0] })
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


router.get('/gsize_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style?req.query.style:'';

        Query = `SELECT distinct concatSize , size , sizeId FROM fsize_master WHERE delStatus = 0 and orgId = ${orgId} and style = '${style}' ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', Gsize: [] });
                    }
                    else {
                        res.send({ success: true, Gsize: rows.RowDataPacket[0] })
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




router.get('/size_id_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var order = req.query.order ? req.query.order : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';


        client.executeStoredProcedure('pget_size_id_BO(?,?,?,?,?,?)', [size, color, style, order, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, sizeId: rows.RowDataPacket[0] })
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

router.get('/f-size_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var size = req.query.size ? req.query.size : '';
        var style = req.query.style ? req.query.style : '';


        client.executeStoredProcedure('pget_fsize_BO(?,?,?)', [size, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({
                            success: true, fsize: rows.RowDataPacket[0],
                            FabDia: rows.RowDataPacket[1],
                            FabGsm: rows.RowDataPacket[2],
                            finishfabConsumption: rows.RowDataPacket[3]
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


router.get('/fabric_type_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct fabricstype , id from fabric_type_masters where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, fabricstype: rows.RowDataPacket[0] })
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


router.get('/dye_Type_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct dyeType , id from dye_type_master where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeType: [] });
                    }
                    else {
                        res.send({ success: true, dyeType: rows.RowDataPacket[0] })
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


router.get('/Spin_Fty_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct SpinFtyName , id from Spin_Fty_master where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, SpinFty: rows.RowDataPacket[0] })
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


router.get('/Knit_Fty_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct knitFty , id from knitFty_master where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, knitFty: rows.RowDataPacket[0] })
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

router.get('/Dyein_Fty_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct dyeFty , id from dyefty_master where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, dyeFty: rows.RowDataPacket[0] })
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


router.get('/yarn_type_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct yarntype from yarn_type_masters where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, yarntype: rows.RowDataPacket[0] })
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


router.get('/yarn_type_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct yarntype from yarn_type_masters where orgId = ${orgId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricstype: [] });
                    }
                    else {
                        res.send({ success: true, yarntype: rows.RowDataPacket[0] })
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


router.get('/RejTypeLoss_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var colorid = req.query.color ? req.query.color : ''

        Query = `select round(sum(losses),2) as losses from rej_type_master_line rtml left join rej_type_master rtm on rtm.id = rtml.rejTypeId 
        WHERE rtml.colorId = ${colorid} and rtm.delStatus = 0 and rtm.status = 1;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', Colorlosses: [] });
                    }
                    else {
                        res.send({ success: true, Colorlosses: rows.RowDataPacket[0] })
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


router.get('/PODetailsLoss_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var order = req.query.order;
        var style = req.query.style;
        var color = req.query.color;
        var size = req.query.size;

        Query = `SELECT pml.popl AS popl FROM po_master pm JOIN po_master_line pml ON pm.id = pml.orderId
                WHERE pm.buyer = '${buyer}'
                AND pm.orderNo = '${order}'
                AND pml.style = '${style}'
                AND pml.color = '${color}'
                AND pml.size = '${size}';`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', Colorlosses: [] });
                    }
                    else {
                        res.send({ success: true, Colorlosses: rows.RowDataPacket[0] })
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



router.get('/ColorLoss_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var color = req.query.color;


        Query = `select sum(dye_process_loss)  as DyeProcessLoss from colors where id = '${color}' ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', DyeProcessLoss: [] });
                    }
                    else {
                        res.send({ success: true, DyeProcessLoss: rows.RowDataPacket[0] })
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


router.get('/DyeTypeMaster_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var StyleId = req.query.StyleId;
        var dyeTypeId = req.query.dyeTypeId;

        Query = `select sum(dtm.dyepl) as dyepl from styles s join dye_type_master dtm on s.dyeTypeId = dtm.id where s.id = ${StyleId} and dtm.id = ${dyeTypeId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', DyeTypeLoss: [] });
                    }
                    else {
                        res.send({ success: true, DyeTypeLoss: rows.RowDataPacket[0] })
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


router.get('/fabricType_BO', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var StyleId = req.query.StyleId;
        var fabTypeId = req.query.fabTypeId;

        Query = `select sum(ftm.dyepl) as fabpl from styles s join fabric_type_masters ftm on s.fabricTypeId = ftm.id where s.id = ${StyleId} and ftm.id = ${fabTypeId};`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricTypeLoss: [] });
                    }
                    else {
                        res.send({ success: true, FabricTypeLoss: rows.RowDataPacket[0] })
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

router.post('/fab-booking', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.body.buyer;
        var order = req.body.orderNo;


        client.executeStoredProcedure('pget_fabric_booking_report(?,?,?)', [buyer, order, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({ success: true, head: rows.RowDataPacket[0], data: rows.RowDataPacket[1] })
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







