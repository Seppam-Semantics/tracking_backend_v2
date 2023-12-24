const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);
const { format } = require('date-fns');


async function generateDate(data) {
    return new Promise((resolve, reject) => {
        if (data) {
            const now = new Date(data);
            const formattedDate = format(now, 'yyyy-MM-dd');
            resolve(formattedDate);
        } else {
            resolve();
        }
    });
}
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
        var headerQuery = "INSERT INTO tmp_workorder(id,buyer,orderno,style,color,size,fabType,fabDia,fabGsm,yarnType,yarnCount,knitSL,spinFty,knitFty,dyeinFty,yarnLot,noRolls,createdBy,orgId) values "

        var data = req.body;
        var i = 0;
        data
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
            var yarnType = datalist.yarnType;
            var yarnCount = datalist.yarnCount;
            var knitSL = datalist.knitSL;
            var spinFty = datalist.spinFty;
            var knitFty = datalist.knitFty;
            var dyeinFty = datalist.dyeinFty;
            var yarnLot = datalist.yarnLot;
            var noRolls = datalist.noRolls;


            bulkInsert =

                `(${db.escape(id)},${db.escape(buyer)},${db.escape(orderNo)},${db.escape(style)},${db.escape(color)},${db.escape(size)},${db.escape(fabType)},${db.escape(fabDia)},${db.escape(fabGsm)},${db.escape(yarnType)},${db.escape(yarnCount)},${db.escape(knitSL)},${db.escape(spinFty)},${db.escape(knitFty)},${db.escape(dyeinFty)},${db.escape(yarnLot)},${db.escape(noRolls)},${db.escape(loginId)},${db.escape(orgId)})`;

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
module.exports = router;