const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
app.set('superSecret', config.secret);
const { format } = require('date-fns');




router.get('/fabric-entrys', (req, res, next) => {
    try {
        var id = req.query.id;
        var entry = req.query.entry;
        var orgId = req.decoded.orgId;
        client.executeStoredProcedure('pget_fabric_entrys(?,?,?)', [id, entry, orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', workorder: [] });
                    }
                    else {
                        console.log(rows.RowDataPacket);
                        const workorder = rows.RowDataPacket[0][0];
                        const fabricRolls = rows.RowDataPacket[1];
                        res.send({
                            success: true,
                            workorder: workorder,
                            fabricRolls: fabricRolls

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




router.post('/fabric-entrys', async (req, res, next) => {
    try {
        console.log(req.body)
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        var data = [];
        var headerQuery = "INSERT INTO tmp_fabric_roll(id,workorderId,rollNo,fabBarcode,entry_1,entry_2,entry_3,entry_4,entry_5,entry_6,entry_7,createdBy,orgId) values "
        var workorderId = req.body.workorderId;
        var entry = req.body.entry;
        var data = req.body.entrys;
        var i = 0;

        for (let datalist of data) {

            var id = datalist.id ? datalist.id : 0;
            var rollNo = datalist.rollNo;
            var fabBarcode = datalist.fabBarcode;
            var entry_1 = datalist.entry_1 ? datalist.entry_1 : 0;
            var entry_2 = datalist.entry_2 ? datalist.entry_2 : 0;
            var entry_3 = datalist.entry_3 ? datalist.entry_3 : 0;
            var entry_4 = datalist.entry_4 ? datalist.entry_4 : 0;
            var entry_5 = datalist.entry_5 ? datalist.entry_5 : 0;
            var entry_6 = datalist.entry_6 ? datalist.entry_6 : 0;
            var entry_7 = datalist.entry_7 ? datalist.entry_7 : 0;

            bulkInsert =

                `(${db.escape(id)},${db.escape(workorderId)},${db.escape(rollNo)},${db.escape(fabBarcode)},${db.escape(entry_1)},${db.escape(entry_2)},${db.escape(entry_3)},${db.escape(entry_4)},${db.escape(entry_5)},${db.escape(entry_6)},${db.escape(entry_7)},${db.escape(loginId)},${db.escape(orgId)})`;

            if (i == (data.length - 1)) {
                headerQuery = headerQuery + bulkInsert + ';'
            } else {
                headerQuery = headerQuery + bulkInsert + ','

            }

            i = i + 1;
        }

        console.log(headerQuery)

        client.executeNonQuery('ppost_fabric_entrys(?,?,?,?,?,?)', [id, workorderId, entry, headerQuery, loginId, orgId],
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

module.exports = router;