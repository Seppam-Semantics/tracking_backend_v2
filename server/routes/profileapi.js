const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);

router.get('/profile', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_profile(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', profiles: [] });
                    }
                    else {
                        rows.RowDataPacket[0].forEach(data => {

                            data.masters = JSON.parse(data.masters);
                            data.workOrders = JSON.parse(data.workOrders);
                            data.fabricRolls = JSON.parse(data.fabricRolls);
                            data.garmentBundles = JSON.parse(data.garmentBundles);
                            data.rollsEntry = JSON.parse(data.rollsEntry);
                            data.bundlesEntry = JSON.parse(data.bundlesEntry);
                            data.reports = JSON.parse(data.reports);
                            data.dashboards = JSON.parse(data.dashboards);
                        });
                        res.send({ success: true, profiles: rows.RowDataPacket[0] })

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

router.get('/profile/:id', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var pid = req.params.id

        client.executeStoredProcedure('pgetall_profile_id(?, ?)', [orgId, pid],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', profiles: [] });
                    }
                    else {
                        rows.RowDataPacket[0].forEach(data => {
                            data.masters = data.masters;
                            data.workOrders = data.workOrders;
                            data.fabricRolls = data.fabricRolls;
                            data.garmentBundles = data.garmentBundles;
                            data.rollsEntry = data.rollsEntry;
                            data.bundlesEntry = data.bundlesEntry;
                            data.reports = data.reports;
                            data.dashboards = data.dashboards;
                        });
                        res.send({ success: true, profiles: rows.RowDataPacket[0] })

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


router.post('/profile', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var profileName = req.body.profileName;
        var masters = JSON.stringify(req.body.masters);
        var workOrders = JSON.stringify(req.body.workOrders);
        var fabricRolls = JSON.stringify(req.body.fabricRolls);
        var garmentBundles = JSON.stringify(req.body.garmentBundles);
        var rollsEntry = JSON.stringify(req.body.rollsEntry);
        var bundlesEntry = JSON.stringify(req.body.bundlesEntry);
        var reports = JSON.stringify(req.body.reports);
        var dashboards = JSON.stringify(req.body.dashboards);
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_profile(?,?,?,?,?,?,?,?,?,?,?,?)', [id, profileName, masters, workOrders, fabricRolls, garmentBundles, rollsEntry, bundlesEntry, reports, dashboards, loginId, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
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

router.delete('/profile/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_profile(?,?,?)', [id, loginId, orgId],
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

module.exports = router;