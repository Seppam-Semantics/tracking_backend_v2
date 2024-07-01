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


module.exports = router;