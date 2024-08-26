const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);


// ================ Event master =============================================================================================

router.get('/eventmaster', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var eventData = req.query.eventData;
        
        Query = `SELECT * from event_master WHERE orgId = ${orgId} and Status = 1 and delStatus = 0`

        if (eventData != '') {
            Query = Query + ` and events = ('${eventData}')`
        }

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
                            data: rows.RowDataPacket[0]
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

router.get('/eventmaster/:id', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var id = req.params.id;
        
        Query = `SELECT * from event_master WHERE orgId = ${orgId} and id=${id} and Status = 1 and delStatus = 0;`

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
                            data: rows.RowDataPacket[0]
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


router.post('/eventmaster', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var eventData = req.body.eventData;
        var apiLink = req.body.apiLink;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        
        client.executeNonQuery('ppost_event_master(?,?,?,?,?)', [id, eventData, apiLink, loginId, orgId],
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

// ======================== Style event master =======================================================================================

router.post('/style-event-master', (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var style = req.body.style ? req.body.style : '';
        var styleid = req.body.styleId ? req.body.styleId : '';

        var data = [];
        var headerQuery = "INSERT INTO tmp_style_event_master (lineid, headid, styleevent, eventId, serialNo, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {
            var lineid = datalist.id ? datalist.id : 0;
            var headid = id;
            var eventData = datalist.eventname ? datalist.eventname : '';
            var eventId = datalist.eventId;
            var serialNo = datalist.serialNo ? datalist.serialNo : ''

            bulkInsert =
              `(${db.escape(lineid)},
                ${db.escape(headid)},
                ${db.escape(eventData)},
                ${db.escape(eventId)},
                ${db.escape(serialNo)},
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

        client.executeNonQuery('ppost_style_event_master(?,?,?,?,?,?)', [id, style, styleid, headerQuery, loginId, orgId],
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

router.get('/style-event-master/:id', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var id = req.params.id;
        
        Query = `SELECT a.*,(select JSON_ARRAYAGG(JSON_OBJECT('id', id, 'events', events , 'eventId', eventId)) from style_event_master_line where headId = a.id) AS events FROM style_event_master_head a WHERE a.orgId = ${orgId} and a.Status = 1 and a.delStatus = 0 and a.id=${id};`

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
                            data: rows.RowDataPacket[0]
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

router.get('/style-event-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style;
        
        Query = `SELECT a.*,(select JSON_ARRAYAGG(JSON_OBJECT('id', id, 'events', events , 'eventId', eventId)) from style_event_master_line where headId = a.id) AS events FROM style_event_master_head a WHERE a.orgId = ${orgId} and Status = 1 and delStatus = 0`

                 if (style != '') {
                    Query = Query + ` and style = ('${style}')`
                }

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
                            data: rows.RowDataPacket[0]
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

// ================================================ Budget Days ========================================================================

router.get('/styles_events', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        
        Query = `SELECT distinct a.style FROM style_event_master_head a WHERE a.orgId = ${orgId} and a.status = 1 and a.delStatus = 0`

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
                            data: rows.RowDataPacket[0]
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

router.get('/styles_from_to_events', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style;
        
        Query = `SELECT b.id, b.events FROM style_event_master_line b
                left join style_event_master_head a on a.id = b.headId WHERE b.orgId = ${orgId} and b.status = 1 and b.delStatus = 0 and a.style='${style}'`

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
                            data: rows.RowDataPacket[0]
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

router.get('/budget-days-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style;
        
        Query = `SELECT * from style_event_budget_days WHERE orgId = ${orgId} and status = 1 and delStatus = 0`

        if (style != '') {
            Query = Query + ` and style = ('${style}');`
        }

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
                            data: rows.RowDataPacket[0]
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

router.post('/budgetDaysmaster', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var style = req.body.style;
        var styleId = req.body.styleId;
        var from = req.body.fromEvent;
        var to = req.body.toEvent;
        var days = req.body.budgetDays
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        
        client.executeNonQuery('ppost_budgetDays_master(?,?,?,?,?,?,?,?)', [id, style, styleId, from, to, days, loginId, orgId],
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

router.get('/budget-days-master/:id', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var id = req.params.id;
        
        Query = `SELECT * from style_event_budget_days WHERE orgId = ${orgId} and status = 1 and delStatus = 0 and id = ${id};`

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
                            data: rows.RowDataPacket[0]
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

// ==========================================================================================================================================

router.get('/tna-listing', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        
        Query = `SELECT * from tnaevents_head a left join tnaevents_line b on a.id = b.headId WHERE a.orgId = ${orgId} and a.status = 1 and a.delStatus = 0 order by b.plans`

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
                            data: rows.RowDataPacket[0]
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

router.post('/tna-posting', (req, res, next) => {
    try {

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var id = req.body.id ? req.body.id : 0;
        var buyer = req.body.buyer ? req.body.buyer : '';
        var orderNo = req.body.orderNo ? req.body.orderNo : '';
        var style = req.body.style ? req.body.style : '';
        var color = req.body.color ? req.body.color : '';

        var data = [];
        var headerQuery = "INSERT INTO tmp_tna_events (lineid, plan, events, planDate, actualDate, remarks, createdBy, orgId) values "
        var data = req.body.data;
        var i = 0;
        for (let datalist of data) {
            var lineid = datalist.id ? datalist.id : 0;
            var plan = datalist.plan ? datalist.plan : 0;
            var eventData = datalist.events ? datalist.events : '';
            var planDate = datalist.planDate ? datalist.planDate : '';
            var actualDate = datalist.actualDate ? datalist.actualDate : '';
            var remarks = datalist.remarks ? datalist.remarks : '';

            bulkInsert =
              `(${db.escape(lineid)},
                ${db.escape(plan)},
                ${db.escape(eventData)},
                ${db.escape(planDate)},
                ${db.escape(actualDate)},
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

        client.executeNonQuery('ppost_tna_events(?,?,?,?,?,?,?,?)', [id, buyer, orderNo, style, color, headerQuery, loginId, orgId],
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

router.get('/getTNA', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style;
        
        Query = `SELECT d.headId, d.id, d.plans, b.events, date_format(d.planDate, '%Y-%m-%d') as planDate, date_format(d.actualDate, '%Y-%m-%d') as actualDate FROM style_event_master_head a 
                left join style_event_master_line b on a.id = b.headId
                left join tnaevents_head c on a.style = c.style
                left join tnaevents_line d on c.id = d.headId and d.events = b.events
                where a.style = '${style}' and case when (select max(line.plans) from tnaevents_line line inner join tnaevents_head head on line.headId = head.id where head.style = '${style}') is null then d.plans is null
                else d.plans = (select max(line.plans) from tnaevents_line line inner join tnaevents_head head on line.headId = head.id where head.style = '${style}')
                end
                and a.orgId = ${orgId} and a.status = 1 and a.delStatus = 0 order by d.id;`

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
                            data: rows.RowDataPacket[0]
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