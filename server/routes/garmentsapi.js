const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);



router.get('/Cutting-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from cutting where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/Cutting-OrderNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct orderNo from cutting where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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


router.get('/cutting', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select id, date_format(cutDate, '%d-%m-%Y') as cutDate, buyer, orderNo, style, color, size, batch, woId, rolls, cutPcs 
                from cutting where orgId = ${orgId} and status = 1 and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and orderNo = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and cutDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', cutting: [] });
                    }
                    else {
                        res.send({ success: true, cutting: rows.RowDataPacket[0] })
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

router.get('/cutting/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_cutting(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', cutting: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            cuttinga: rows.RowDataPacket[0]
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


router.put('/cutting/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var woId = req.body.woId;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        var cutDate = req.body.cutDate;
        var batch = req.body.batch;
        var rolls = req.body.rolls;
        var cutPcs = req.body.cutPcs;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('pput_cutting(?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, woId, buyer, orderNo, style, color, size, cutDate, batch, rolls, cutPcs, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Updated successfully' });
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

router.post('/cutting', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
	var cutDate = req.body.cutDate;
        var data = [];
        var headerQuery = "INSERT INTO tmp_cutting(line_id, buyer, orderNo, style, color, size, woId, batch, cutDate, rolls, cutPcs, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var woId = datalist.woId;
            var buyer = datalist.buyer
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var batch = datalist.batch;
            var cutDate = cutDate;
            var rolls = datalist.rolls;
            var cutPcs = datalist.cutPcs;

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(batch)},
                ${db.escape(cutDate)},
                ${db.escape(rolls)},
                ${db.escape(cutPcs)},
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

        client.executeNonQuery('ppost_cutting(?,?,?)', [headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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


// ==============================================================================================================================================================
// ===================== Sewing Input =================================================================================================================================

router.get('/sewinginput-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from sewing_input where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/sewinginput-OrderNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct orderNo from sewing_input where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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


router.get('/sewing-input', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select id, date_format(inputDate, '%d-%m-%Y') as inputDate, buyer, orderNo, style, color, size, lineNo, woId, inputPcs, bundleNo, cutId, orgId,status,delStatus
                from sewing_input where orgId = ${orgId} and status = 1 and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and orderNo = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and inputDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewInput: [] });
                    }
                    else {
                        res.send({ success: true, sewInput: rows.RowDataPacket[0] })
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


router.get('/sewing-input/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_sewing_input(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewInput: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewInput: rows.RowDataPacket[0]
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


router.put('/sewing-input/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var woId = req.body.woId;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        var cutId = req.body.cutId;
        var inputDate = req.body.inputDate;
        var lineNo = req.body.lineNo;
        var inputPcs = req.body.inputPcs;
        var bundleNo = req.body.bundleNo;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('pput_sewing_input(?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, woId, buyer, orderNo, style, color, size, cutId, inputDate, lineNo, inputPcs, bundleNo, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Updated successfully' });
                        }else {
                            res.json({ success: true, message: 'Updated successfully' });
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

router.post('/sewing-input', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var inputDate = req.body.inputDate;
        var data = [];
        var headerQuery = "INSERT INTO tmp_sewing_input(line_id, buyer, orderNo, style, color, size, woId, cutId, lineNo, inputDate, bundleNo, inputPcs, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var woId = datalist.woId;
            var buyer = datalist.buyer
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var cutId = datalist.cutId;
            var lineNo = datalist.lineNo;
            var inputDate = inputDate;
            var bundleNo = datalist.bundleNo;
            var inputPcs = datalist.inputPcs;

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(cutId)},
                ${db.escape(lineNo)},
                ${db.escape(inputDate)},
                ${db.escape(bundleNo)},
                ${db.escape(inputPcs)},
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

        client.executeNonQuery('ppost_sewing_input(?,?,?)', [headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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

// ==============================================================================================================================================================
// ===================== Sewing Output =================================================================================================================================


router.get('/sewingoutput-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from sewing_output where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/sewingoutput-OrderNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct orderNo from sewing_output where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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



router.get('/sewing-output', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select id, date_format(outputDate, '%d-%m-%Y') as outputDate, buyer, orderNo, style, color, size, lineNo, woId, cutId, inputId, 
                 mcUsed, mpUsed, mcHrs, outputPcs, timeperiod, bundleNo
                 from sewing_output where orgId = ${orgId} and status = 1 and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and orderNo = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and outputDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewOutput: [] });
                    }
                    else {
                        res.send({ success: true, sewOutput: rows.RowDataPacket[0] })
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

router.get('/sewing-output/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_sewing_output(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewOutput: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewOutput: rows.RowDataPacket[0]
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


router.put('/sewing-output/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var woId = req.body.woId;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        var cutId = req.body.cutId;
        var inputId = req.body.inputId
        var outputDate = req.body.outputDate;
        var lineNo = req.body.lineNo;
        var mcUsed = req.body.mcUsed;
        var mpUsed = req.body.mpUsed;
        var mcHrs = req.body.mcHrs;
        var outputPcs = req.body.outputPcs;
        var bundleNo = req.body.cutPcs;
        var timeperiod = req.body.timeperiod;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('pput_sewing_output(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, woId, buyer, orderNo, style, color, size, cutId, inputId, outputDate, mcUsed, mpUsed, mcHrs, lineNo, outputPcs, bundleNo, timeperiod, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Updated successfully' });
                        }else {
                            res.json({ success: true, message: 'Updated successfully' });
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

router.post('/sewing-output', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var outputDate = req.body.outputDate;
        var data = [];
        var headerQuery = "INSERT INTO tmp_sewing_output(line_id, buyer, orderNo, style, color, size, woId, cutId, inputId, outputDate, mcUsed, mpUsed, mcHrs, lineNo, outputPcs, timeperiod, bundleNo, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var buyer = datalist.buyer
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var woId = datalist.woId;
            var cutId = datalist.cutId;
            var inputId = datalist.inputId;
            var lineNo = datalist.lineNo;
            var bundleNo = datalist.bundleNo;
            var outputPcs = datalist.outputPcs;
            var mcUsed = datalist.mcUsed;
            var mpUsed = datalist.mpUsed;
            var mcHrs = datalist.mcHrs;
            var timeperiod = datalist.timeperiod;
            

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(cutId)},
                ${db.escape(inputId)},
                ${db.escape(outputDate)},
                ${db.escape(mcUsed)},
                ${db.escape(mpUsed)},
                ${db.escape(mcHrs)},
                ${db.escape(lineNo)},
                ${db.escape(outputPcs)},
                ${db.escape(timeperiod)},
                ${db.escape(bundleNo)},
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

        client.executeNonQuery('ppost_sewing_output(?,?,?)', [headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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

// ==============================================================================================================================================================
// ===================== Sewing Packing =================================================================================================================================


router.get('/sewingpacking-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from sewing_packing where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/sewingpacking-OrderNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct orderNo from sewing_packing where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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




router.get('/sewing-packing', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select id, date_format(packDate, '%d-%m-%Y') as packDate, buyer, orderNo, style, color, size, lineNo, woId, cutId, inputId, outputId,
                 lineNo, mpUsed, mcHrs, packPcs, cartonbox, timeperiod, bundleNo
                 from sewing_packing where orgId = ${orgId} and status = 1 and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and orderNo = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and packDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewingPack: [] });
                    }
                    else {
                        res.send({ success: true, sewingPack: rows.RowDataPacket[0] })
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

router.get('/sewing-packing/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_sewing_packing(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewingPack: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewingPack: rows.RowDataPacket[0]
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


router.put('/sewing-packing/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var woId = req.body.woId;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var style = req.body.style;
        var color = req.body.color;
        var size = req.body.size;
        var cutId = req.body.cutId;
        var inputId = req.body.inputId;
        var outputId = req.body.outputId;
        var packDate = req.body.packDate;
        var lineNo = req.body.lineNo;
        var mpUsed = req.body.mpUsed;
        var mcHrs = req.body.mcHrs;
        var packPcs = req.body.packPcs;
        var bundleNo = req.body.bundleNo;
        var cartonbox = req.body.cartonbox
        var timeperiod = req.body.timeperiod;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('pput_sewing_packing(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [id, woId, buyer, orderNo, style, color, size, cutId, inputId, outputId, packDate, lineNo, mpUsed, mcHrs, packPcs, cartonbox, bundleNo, timeperiod, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (id == 0) {
                            res.json({ success: true, message: 'Updated successfully' });
                        }else {
                            res.json({ success: true, message: 'Updated successfully' });
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

router.post('/sewing-packing', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var packDate = req.body.packDate;
        var data = [];
        var headerQuery = "INSERT INTO tmp_sewing_packing(line_id, buyer, orderNo, style, color, size, woId, cutId, inputId, outputId, packDate, lineNo, mpUsed, mcHrs, packPcs, cartonbox, timeperiod, bundleNo, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var buyer = datalist.buyer
            var orderNo = datalist.orderNo;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var woId = datalist.woId;
            var cutId = datalist.cutId;
            var inputId = datalist.inputId;
            var outputId = datalist.outputId;
            var bundleNo = datalist.bundleNo;
            var packPcs = datalist.packPcs;
            var lineNo = datalist.lineNo;
            var mpUsed = datalist.mpUsed;
            var mcHrs = datalist.mcHrs;
            var timeperiod = datalist.timeperiod;
            var cartonbox = datalist.cartonbox;
	    var pack_date = packDate;
            

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(buyer)},
                ${db.escape(orderNo)},

                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},

                ${db.escape(woId)},
                ${db.escape(cutId)},
                ${db.escape(inputId)},

                ${db.escape(outputId)},
                ${db.escape(pack_date)},
                ${db.escape(lineNo)},

                ${db.escape(mpUsed)},
                ${db.escape(mcHrs)},
                ${db.escape(lineNo)},

                ${db.escape(cartonbox)},
                ${db.escape(timeperiod)},
                ${db.escape(bundleNo)},

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

        client.executeNonQuery('ppost_sewing_packing(?,?,?)', [headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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

// ==============================================================================================================================================================
// ===================== Sewing Shipping =================================================================================================================================



router.get('/shipping-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from sewing_shipping_head where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/shipping-OrderNo', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct orderNo from sewing_shipping_head where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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

router.get('/sewing-shipping', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select id, date_format(shipDate, '%Y-%m-%d') as shipDate, buyer, orderNo, totalOrderPcs, totalshipPcs, totalPending, totalcarton, status
                 from sewing_shipping_head where orgId = ${orgId} and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and orderNo = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and shipDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', shipping: [] });
                    }
                    else {
                        res.send({ success: true, shipping: rows.RowDataPacket[0] })
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

router.get('/sewing-shipping/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_sewing_shipping(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', shipping: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            shipping_head : rows.RowDataPacket[0],
                            shipping_line : rows.RowDataPacket[1]
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


router.post('/sewing-shipping', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var id = req.body.id;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var orgId = req.decoded.orgId;
        var shipDate = req.body.shipDate;
        var notes = req.body.notes;
        var data = [];
        var headerQuery = "INSERT INTO tmp_sewing_shipping(line_id, headId, fabtype, fabGSM, style, color, size, woId, cutId, inputId, outputId, packId, orderPcs, shipPcs, pendingPcs, carton, remarks, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var headId = datalist.headId
            var fabtype = datalist.fabtype;
            var fabGSM = datalist.fabGSM;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var woId = datalist.woId;
            var cutId = datalist.cutId;
            var inputId = datalist.inputId;
            var outputId = datalist.outputId;
            var packId = datalist.packId;
            var orderPcs = datalist.orderPcs;
            var shipPcs = datalist.shipPcs;
            var pendingPcs = datalist.pendingPcs;
            var carton = datalist.carton;
	    var remarks = datalist.remarks;

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(headId)},
                ${db.escape(fabtype)},
                ${db.escape(fabGSM)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(cutId)},
                ${db.escape(inputId)},
                ${db.escape(outputId)},
                ${db.escape(packId)},
                ${db.escape(orderPcs)},
                ${db.escape(shipPcs)},
                ${db.escape(pendingPcs)},
                ${db.escape(carton)},
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

        client.executeNonQuery('ppost_sewing_shipping(?,?,?,?,?,?,?,?)', [id, buyer, orderNo, shipDate, notes, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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

// ==============================================================================================================================================================
// ===================== Sewing Invoice =================================================================================================================================


router.get('/Invoice-Buyer', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct buyer from sewing_invoice_head where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({ success: true, buyer: rows.RowDataPacket[0] })
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


router.get('/Invoice-invoiceno', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `select distinct invoice from sewing_invoice_head where orgId = ${orgId} and status = 1 and delStatus = 0`


        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orderNo: [] });
                    }
                    else {
                        res.send({ success: true, orderNo: rows.RowDataPacket[0] })
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





router.get('/sewing-invoice', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var fromDate = req.query.fromDate;
        var toDate = req.query.toDate;

        Query = `select * , date_format(invoiceDate, '%d-%m-%Y') as invoiceDate from sewing_invoice_head where orgId = ${orgId} and delStatus = 0`

                if(buyer != ''){
                     Query = Query + ` and buyer = ('${buyer}')`
                }
                
                if(orderNo != ''){
                    Query = Query + ` and invoice = ('${orderNo}')`
               }
               
               if(fromDate != '' & toDate != ''){
                Query = Query + ` and invoiceDate between '${fromDate}' AND '${toDate}'`
           }

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', invoice: [] });
                    }
                    else {
                        res.send({ success: true, invoice: rows.RowDataPacket[0] })
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

router.get('/sewing-invoice/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_single_sewing_invoice(?,?)', [id, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', invoice: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            invoice_head : rows.RowDataPacket[0],
                            invoice_line : rows.RowDataPacket[1]
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


router.post('/sewing-invoice', (req, res, next) => {
    try {
        var loginId = req.decoded.loginId;
        var id = req.body.id;
        var buyer = req.body.buyer;
        var invoice = req.body.invoice;
        var orgId = req.decoded.orgId;
        var invoiceDate = req.body.invoiceDate;
        var notes = req.body.notes;
        var data = [];
        var headerQuery = "INSERT INTO tmp_sewing_invoice(line_id, headId, fabtype, fabGSM, orderNo, style, color, size, woId, cutId, inputId, outputId, packId, shipId, shipPcs, fobRate, valueUSD,remarks,createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {

            var line_id = datalist.id ? datalist.id : 0;
            var headId = datalist.headId ? datalist.headId : 0;
            var orderNo = datalist.orderNo;
            var fabtype = datalist.fabtype;
            var fabGSM = datalist.fabGSM;
            var style = datalist.style;
            var color = datalist.color;
            var size = datalist.size;
            var woId = datalist.woId;
            var cutId = datalist.cutId;
            var inputId = datalist.inputId;
            var outputId = datalist.outputId;
            var packId = datalist.packId;
            var shipId = datalist.shipId;
            var shipPcs = datalist.shipPcs;
            var fobRate = datalist.fobRate;
            var valueUSD = datalist.valueUSD;
	    var remarks = datalist.remarks;
            

            bulkInsert =
              `(${db.escape(line_id)},
                ${db.escape(headId)},
                ${db.escape(fabtype)},
                ${db.escape(fabGSM)},
                ${db.escape(orderNo)},
                ${db.escape(style)},
                ${db.escape(color)},
                ${db.escape(size)},
                ${db.escape(woId)},
                ${db.escape(cutId)},
                ${db.escape(inputId)},
                ${db.escape(outputId)},
                ${db.escape(packId)},
                ${db.escape(shipId)},
                ${db.escape(shipPcs)},
                ${db.escape(fobRate)},
                ${db.escape(valueUSD)},
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

        client.executeNonQuery('ppost_sewing_invoice(?,?,?,?,?,?,?,?)', [id, buyer, invoice, invoiceDate, notes, headerQuery, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.success == false) {
                        res.json({ success: false, message: 'something went worng' });
                    } else {
                        if (line_id == 0) {
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

module.exports = router;