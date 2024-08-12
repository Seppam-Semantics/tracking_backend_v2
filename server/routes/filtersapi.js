const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);
// const { format } = require('date-fns');



router.get('/buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/workorders', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_workorders_code(?)', [orgId],
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

router.get('/buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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

router.get('/colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[1], gsize : rows.RowDataPacket[0] })
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

router.get('/buyers_data', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_buyers_data(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/buyers-orders_data', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_buyers_orders_data(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/orders-styles_data', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_orders_styles_data(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/styles-colors_data', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_styles_colors_data(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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

router.get('/colors-sizes_data', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_colors_sizes_data(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/machineDia', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style?req.query.style:'';
        var size = req.query.size?req.query.size:'';

        Query = `select sum(machineDia) as machineDia from fsize_master 
                where orgId = ${orgId} and delStatus = 0 `

                if(style != '' && size != ''){
                     Query = Query + ` and style = '${style}' and concatSize = '${size}' ;`
                }
                
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', machineDia: [] });
                    }
                    else {
                        res.send({ success: true, machineDia: rows.RowDataPacket[0] })
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


router.get('/wofty', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knitwo_fty(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, knitfty: rows.RowDataPacket[0] })
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



router.get('/wobuyer', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knitwo_buyer(?,?)', [knitfty , orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/woorderNo', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knitwo_orderNo(?,?,?)', [ knitfty, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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


router.get('/wostyle', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knitwo_style(?,?,?,?)', [knitfty,buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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


router.get('/wocolor', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knitwo_color(?,?,?,?,?)', [knitfty ,buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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

router.get('/wosize', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knitwo_size(?,?,?,?,?,?)', [knitfty, buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/dyewofty', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_dyewo_fty(?)', [orgId],
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

router.get('/dyewobuyer', (req, res, next) => {
    try {
        var dyefty = req.query.dyefty;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_dyewo_buyer(?,?)', [dyefty , orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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

router.get('/dyewoorderNo', (req, res, next) => {
    try {
        var dyefty = req.query.dyefty;
        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_dyewo_orderNo(?,?,?)', [ dyefty, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/dyewostyle', (req, res, next) => {
    try {
        var dyefty = req.query.dyefty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_dyewo_style(?,?,?,?)', [dyefty,buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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


router.get('/dyewocolor', (req, res, next) => {
    try {
        var dyefty = req.query.dyefty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_dyewo_color(?,?,?,?,?)', [dyefty ,buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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

router.get('/dyewosize', (req, res, next) => {
    try {
        var dyefty = req.query.dyefty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_dyewo_size(?,?,?,?,?,?)', [dyefty, buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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



router.get('/knitentry_wofty', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knit_entry_wo_fty(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, knitfty: rows.RowDataPacket[0] })
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



router.get('/knitentry_wobuyer', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knit_entry_wo_buyer(?,?)', [knitfty , orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/knitentry_woorderNo', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_knit_entry_wo_orderNo(?,?,?)', [ knitfty, buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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


router.get('/knitentry_wostyle', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knit_entry_wo_style(?,?,?,?)', [knitfty,buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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


router.get('/knitentry_wocolor', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knit_entry_wo_color(?,?,?,?,?)', [knitfty ,buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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

router.get('/knitentry_wosize', (req, res, next) => {
    try {
        var knitfty = req.query.knitfty;
        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_knit_entry_wo_size(?,?,?,?,?,?)', [knitfty, buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


//--------------------------------------cutting [Start]-------------------------------------------

router.get('/cut_buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_cut_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/cut_buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_cut_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/cut_orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_cut_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/cut_styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_cut_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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


router.get('/cut_colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_cut_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/cutting-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select * from cutting
                    where orgId = ${orgId} and status = 1 and delStatus = 0`


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
        

        // Query = Query + ` group by buyer, orderNo, status;`
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
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
                            cutting: rows.RowDataPacket[0],
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

//--------------------------------------cutting [End]-------------------------------------------
//--------------------------------------sewinput [Start]-------------------------------------------

router.get('/sewinput_buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_sewinput_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/sewinput_buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_sewinput_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/sewinput_orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_sewinput_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/sewinput_styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_sewinput_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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


router.get('/sewinput_colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_sewinput_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/sewinput-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select * from sewing_input
                    where orgId = ${orgId} and status = 1 and delStatus = 0`


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
        

        // Query = Query + ` group by buyer, orderNo, status;`
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewinginput: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewinginput: rows.RowDataPacket[0],
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

//--------------------------------------sewinput [End]-------------------------------------------

//--------------------------------------sewOutput [Start]-------------------------------------------

router.get('/sewoutput_buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_output_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/sewoutput_buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_output_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/sewoutput_orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_output_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/sewoutput_styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_output_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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


router.get('/sewoutput_colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_output_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/sewoutput-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select * from sewing_output
                    where orgId = ${orgId} and status = 1 and delStatus = 0`


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
        

        // Query = Query + ` group by buyer, orderNo, status;`
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewingoutput: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewingoutput: rows.RowDataPacket[0],
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

//--------------------------------------sewOutput [End]-------------------------------------------
//--------------------------------------Sewing Packing  [Start]-------------------------------------------

router.get('/packing_buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_packing_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/packing_buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_packing_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/packing_orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_packing_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/packing_styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_packing_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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


router.get('/packing_colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_packing_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/packing-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select * from sewing_packing
                    where orgId = ${orgId} and status = 1 and delStatus = 0`


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
        

        // Query = Query + ` group by buyer, orderNo, status;`
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sewingpacking: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sewingpacking: rows.RowDataPacket[0],
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

//--------------------------------------Sewing Packing [End]-------------------------------------------

//--------------------------------------Shipment  [start]-------------------------------------------

router.get('/shipping_buyers', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_shipping_buyers(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyers: [] });
                    }
                    else {
                        res.send({ success: true, buyers: rows.RowDataPacket[0] })
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


router.get('/shipping_buyers-orders', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pget_shipping_buyers_orders(?,?)', [buyer, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', orders: [] });
                    }
                    else {
                        res.send({ success: true, orders: rows.RowDataPacket[0] })
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

router.get('/shipping_orders-styles', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_shipping_orders_styles(?,?,?)', [buyer, orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
                    }
                    else {
                        res.send({ success: true, styles: rows.RowDataPacket[0] })
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

router.get('/shipping_styles-colors', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_shipping_styles_colors(?,?,?,?)', [buyer, orderNo, style, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', colors: [] });
                    }
                    else {
                        res.send({ success: true, colors: rows.RowDataPacket[0] })
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


router.get('/shipping_colors-sizes', (req, res, next) => {
    try {

        var buyer = req.query.buyer;
        var orderNo = req.query.orderNo;
        var style = req.query.style;
        var color = req.query.color;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_shipping_colors_sizes(?,?,?,?,?)', [buyer, orderNo, style, color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, sizes: rows.RowDataPacket[0] })
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


router.get('/shipping-filter', (req, res, next) => {
    try {
        var id = req.query.id ? req.query.id : 0;
        var buyer = req.query.buyer ? req.query.buyer : '';
        var orderNo = req.query.orderNo ? req.query.orderNo : '';
        var style = req.query.style ? req.query.style : '';
        var color = req.query.color ? req.query.color : '';
        var size = req.query.size ? req.query.size : '';
        var orgId = req.decoded.orgId;

        Query = `select ih.id, ih.buyer, ih.orderNo, ih.shipDate, ih.notes, ih.totalOrderPcs, ih.totalshipPcs, ih.totalPending, ih.totalcarton, 
                ih.orgId, ih.status, ih.delStatus , il.id, il.headId, il.fabtype, il.fabGSM, il.style, il.color, il.size, il.woId, il.cutId, il.inputId, il.outputId, 
                il.packId, il.orderPcs, il.shipPcs, il.pending, il.carton, il.remarks
                from sewing_shipping_head ih join sewing_shipping_line il on ih.id = headId
                where ih.orgId = ${orgId} and ih.status = 1 and ih.delStatus = 0`


            if (buyer != '') {
                Query = Query + ` and ih.buyer IN ('${buyer}')`
            }
            if (orderNo != '') {
                Query = Query + ` and ih.orderNo IN ('${orderNo}')`
            }
            if (style != '') {
                Query = Query + ` and il.style IN ('${style}')`
            }
            if (color != '') {
                Query = Query + ` and il.color IN ('${color}')`
            }
            if (size != '') {
                Query = Query + ` and il.size IN ('${size}')`
            }
        

        // Query = Query + ` group by buyer, orderNo, status;`
        // console.log(Query);
        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', shipping: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            shipping: rows.RowDataPacket[0],
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

//--------------------------------------Shipment  [End]-------------------------------------------


router.get('/allmachineDia', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        Query = `SELECT distinct machineDia from fsize_master where orgId = ${orgId} and delStatus = 0 and Status = 1;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
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

module.exports = router;