const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);
const { format } = require('date-fns');



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




module.exports = router;