	const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);




// ========================================================== buyer Master ======================================================

router.get('/drop-buyer-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;

        Query = `select * from buyers where orgId = ${orgId}  and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            buyer: rows.RowDataPacket[0],
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


router.get('/drop-buyerId-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;
	var buyer = req.query.buyer

        Query = `select * from buyers where orgId = ${orgId} and buyer = ${buyer} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            buyer: rows.RowDataPacket[0],
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



router.get('/buyer-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_buyerMaster(?)', [orgId],
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

router.get('/buyer-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var buyer = req.query.buyer?req.query.buyer:'';

        client.executeStoredProcedure('pgetall_buyerMaster_filter(?,?)', [buyer,orgId],
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

router.post('/buyer-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var buyer = req.body.buyer;
        var country = req.body.country;
        var contact = req.body.contact;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_buyer_master(?,?,?,?,?,?)', [id, buyer, country, contact, loginId, orgId],
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


router.get('/buyer-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM buyers where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
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





router.delete('/buyer-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_buyer_master(?,?,?)', [id, loginId, orgId],
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


// ==============================================================================================================================


// ================================ product Master (Style) ======================================================================


router.get('/drop-style-Master', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;

        Query = `select style from styles where orgId = ${orgId}  and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', style: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            style: rows.RowDataPacket[0],
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



router.get('/drop-styleId-Master', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;
        var style = req.query.style

        Query = `select * from styles where orgId = ${orgId} and style = ${style} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', style: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            style: rows.RowDataPacket[0],
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



router.get('/style-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_style_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', style: [] });
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

router.get('/style-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var style = req.query.style ? req.query.style : '' ;

        client.executeStoredProcedure('pgetall_styles_master_filter(?,?)', [style, orgId],
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


router.post('/style-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var style = req.body.style;
        var stylecode = req.body.stylecode;
        var styletype = req.body.styletype;
        var utility = req.body.utility;
        var buyerId = req.body.buyerId;
        var buyer = req.body.buyer;
        var brand = req.body.brand;

        var yarnType = req.body.yarnType;
        var yarnTypeId = req.body.yarnTypeId;
        var fabricType = req.body.fabricType;
        var fabricTypeId = req.body.fabricTypeId;
        var dyeType = req.body.dyeType;
        var dyeTypeId = req.body.dyeTypeId;
        var packingType = req.body.packingType;
        var fabricGSM = req.body.fabricGSM;

        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_style_master(?,?,?, ?,?,?, ?,?,? ,?,?,?, ?,?,?, ?,?,? )', [
            id, 
            style, 
            stylecode, 
            styletype, 
            utility, 
            buyerId, 
            buyer, 
            brand,
            yarnType,
            yarnTypeId,
            fabricType,
            fabricTypeId,
            dyeType,
            dyeTypeId,
            packingType,
            fabricGSM,
            loginId, 
            orgId
        ],
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

router.get('/style-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM styles where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
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



router.delete('/style-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_style_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================

// ========================== Color master =====================================================================================



router.get('/drop-color-Master', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;

        Query = `select * from colors where orgId = ${orgId}  and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            color: rows.RowDataPacket[0],
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


router.get('/drop-colorId-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;
	var color = req.query.color

        Query = `select * from colors where orgId = ${orgId} and color = ${color} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            color: rows.RowDataPacket[0],
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


router.get('/color-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_color_master(?)', [orgId],
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

router.get('/color-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var color = req.query.color ? req.query.color : '' ;

        client.executeStoredProcedure('pgetall_color_master_filter(?,?)', [color, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
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

router.post('/color-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var color = req.body.color;
        var colorCode = req.body.colorcode;
        var diacorrection = req.body.diacorrection;
        var dyeprocessloss = req.body.dyeprocessloss;
        var buyerId = req.body.buyerId;
        var buyer = req.body.buyer;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_color_master(?,?,?,?,?,?,?,?,?)', [id, color, colorCode, diacorrection, dyeprocessloss, buyerId, buyer, loginId, orgId],
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


router.get('/color-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM colors where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
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




router.delete('/color-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_color_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================

// =========================== Size Master =====================================================================================


router.get('/drop-size-Master', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;

        Query = `select size from sizes where orgId = ${orgId}  and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', style: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sizes: rows.RowDataPacket[0],
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



router.get('/drop-sizeId-Master', (req, res, next) => {
    try {

        var orgId = req.decoded.orgId;
        var size = req.query.size

        Query = `select * from sizes where orgId = ${orgId} and size = ${size} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', size: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            sizes: rows.RowDataPacket[0],
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



router.get('/size-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_size_master(?)', [orgId],
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


router.get('/size-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var size = req.query.size ? req.query.size : '' ;

        client.executeStoredProcedure('pgetall_size_master_filter(?,?)', [size,orgId],
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


router.post('/size-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var size = req.body.size;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_size_master(?,?,?,?)', [id, size, loginId, orgId],
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


router.get('/size-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM sizes where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
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




router.delete('/size-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_size_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================

// ========================== Yarn Type ========================================================================================


router.get('/drop-yarnTypeId-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;
	    var yarntype = req.query.yarnType

        Query = `select * from yarn_type_masters where orgId = ${orgId} and yarntype = ${yarntype} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            yarnType: rows.RowDataPacket[0],
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






router.get('/yarn-type-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_yarnType_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', yarnType: [] });
                    }
                    else {
                        res.send({ success: true, yarnType: rows.RowDataPacket[0] })
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

router.get('/yarn-type-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var yarnType = req.query.yarnType?req.query.yarnType:'';

        client.executeStoredProcedure('pgetall_yarnType_master_filter(?,?)', [yarnType, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', yarnType: [] });
                    }
                    else {
                        res.send({ success: true, yarnType: rows.RowDataPacket[0] })
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


router.post('/yarn-type-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var yarntype = req.body.yarntype;
        var description = req.body.description;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_yarnType_master(?,?,?,?,?)', [id, yarntype, description, loginId, orgId],
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


router.get('/yarn-type/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM yarn_type_masters where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, yarnType: rows.RowDataPacket[0] })
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
})

router.delete('/yarn-type-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_yarnType_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================

// =================================== Fabric Type =============================================================================



router.get('/drop-fabricstypeId-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;
	    var FabricType = req.query.fabricType

        Query = `select * from fabric_type_masters where orgId = ${orgId} and fabricstype = ${FabricType} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            fabricstype: rows.RowDataPacket[0],
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



router.get('/fabric-type-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_fabricType_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricType: [] });
                    }
                    else {
                        res.send({ success: true, fabricType: rows.RowDataPacket[0] })
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


router.get('/fabric-type-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var fabType = req.query.fabType?req.query.fabType:'';

        client.executeStoredProcedure('pgetall_fabricType_master_filter(?,?)', [fabType, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fabricType: [] });
                    }
                    else {
                        res.send({ success: true, fabricType: rows.RowDataPacket[0] })
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


router.post('/fabric-type-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var fabtype = req.body.fabtype;
        var description = req.body.description;
        var dyeprocessloss = req.body.dyepl;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_fabricType_master(?,?,?,?,?,?)', [id, fabtype, description, dyeprocessloss, loginId, orgId],
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


router.get('/fabric-type/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM fabric_type_masters where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, fabricType: rows.RowDataPacket[0] })
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


router.delete('/fabric-type-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_fabricType_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================

// =================================== dye Type =============================================================================



router.get('/drop-dyetypeId-Master', (req, res, next) => {
    try {
        
        var orgId = req.decoded.orgId;
	    var dyeType = req.query.DyeType

        Query = `select * from dye_type_master where orgId = ${orgId} and dyeType = ${dyeType} and status = 1 and delStatus = 0`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    //console.log(rows.RowDataPacket);
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', buyer: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            dyeType: rows.RowDataPacket[0],
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







router.get('/dye-type-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dyeType_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', DyeType: [] });
                    }
                    else {
                        res.send({ success: true, DyeType: rows.RowDataPacket[0] })
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

router.get('/dye-type-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var dyeType = req.query.dyeType?req.query.dyeType:'';

        client.executeStoredProcedure('pgetall_dyeType_master_filter(?,?)', [dyeType, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', DyeType: [] });
                    }
                    else {
                        res.send({ success: true, DyeType: rows.RowDataPacket[0] })
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


router.post('/dye-type-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var dyeType = req.body.dyeType;
        var dyeingProcess = req.body.dyeingProcess;
        var description = req.body.description;
        var Dyepl = req.body.Dyepl;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('ppost_dyeType_master(?,?,?,?,?,?,?)', [id, dyeType, dyeingProcess,description,Dyepl,loginId, orgId],
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

router.get('/dye-type/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM dye_type_master where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, DyeType: rows.RowDataPacket[0] })
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


router.delete('/dye-type-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_fabricType_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================


// =================================== fsize=============================================================================

router.get('/fsize-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_fsize_master (?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', DyeType: [] });
                    }
                    else {
                        res.send({ success: true, fsize: rows.RowDataPacket[0] })
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

router.get('/fsize-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var size = req.query.size;

        client.executeStoredProcedure('pgetall_fsize_master_filter(?,?)', [size, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', fsize: [] });
                    }
                    else {
                        res.send({ success: true, fsize: rows.RowDataPacket[0] })
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

router.post('/fsize-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var styleId = req.body.styleId;
        var style = req.body.styleName;
        var sizeId = req.body.sizeId;
        var size = req.body.sizeName;
        var chestSize = req.body.chestSize;
        var length = req.body.length;
        var sleeve = req.body.sleeve;
        var allow = req.body.allow;
        var pattern = req.body.pattern;
        var gsm = req.body.GSM;
        var bodyCon = req.body.bodyCon;
        var neckType = req.body.neckTape;
        var neckRIB = req.body.neckRIB;
        var finishfabConsumption = req.body.finishFabricsConsumptionDozn;
        var machineDia = req.body.machineDia;
        var finishDia = req.body.finishDia;
        var concatSize = req.body.concatSize;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_fsize_master(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
            id,
            styleId,
            style,
            sizeId,
            size,
            chestSize,
            length,
            sleeve,
            allow,
            pattern,
            gsm,
            bodyCon,
            neckType,
            neckRIB,
            finishfabConsumption,
            machineDia,
            finishDia,
	    concatSize,
            loginId,
            orgId],
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


router.get('/fsize/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM fsize_master where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', sizes: [] });
                    }
                    else {
                        res.send({ success: true, fsize: rows.RowDataPacket[0] })
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



router.delete('/fsize-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_fsize_master(?,?,?)', [id, loginId, orgId],
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

// =============================================================================================================================



// ==================== Knit Factory ===========================================================================================

router.get('/knitFty-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_knitFty_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', knitFty: [] });
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

router.get('/knitFty-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var knitFty = req.query.knitFty?req.query.knitFty:'';

        client.executeStoredProcedure('pgetall_knitFty_master_filter(?,?)', [knitFty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', knitFty: [] });
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

router.post('/knitFty-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var knitFty = req.body.knitFty;
        var location = req.body.location;
        var contact = req.body.contact;
        var legalFtyName = req.body.legalFtyName;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_knitFty_master(?,?,?,?,?,?,?)', [id, knitFty, location, contact, legalFtyName, loginId, orgId],
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


router.get('/knitFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM knitFty_master where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
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



router.delete('/knitFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_knitFty_master(?,?,?)', [id, loginId, orgId],
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


// =============================================================================================================================
	

// ==================== Dye Factory ===========================================================================================

router.get('/dyeFty-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_dyeFty_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeFty: [] });
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

router.get('/dyeFty-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var dyeFty = req.query.dyeFty?req.query.dyeFty:'';

        client.executeStoredProcedure('pgetall_dyeFty_master_filter(?,?)', [dyeFty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeFty: [] });
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
router.post('/dyeFty-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var dyeFty = req.body.dyeFty;
        var location = req.body.location;
        var contact = req.body.contact;
        var legalFtyName = req.body.legalFtyName;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_dyeFty_master(?,?,?,?,?,?,?)', [id, dyeFty, location, contact, legalFtyName, loginId, orgId],
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


router.get('/dyeFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM dyefty_master where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', styles: [] });
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



router.delete('/dyeFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_dyeFty_master(?,?,?)', [id, loginId, orgId],
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

// ======================================================================================================================================================================

// ================================================== Spin Fty ===========================================================================

router.get('/spinFty-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_spinfty_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', dyeFty: [] });
                    }
                    else {
                        res.send({ success: true, spinFty: rows.RowDataPacket[0] })
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

router.get('/spinFty-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var spinFty = req.query.spinFty?req.query.spinFty:'';

        client.executeStoredProcedure('pgetall_spinfty_master_filter(?,?)', [spinFty, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', spinFty: [] });
                    }
                    else {
                        res.send({ success: true, spinFty: rows.RowDataPacket[0] })
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


router.post('/spinFty-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var spinFty = req.body.spinFty;
        var location = req.body.location;
        var contact = req.body.contact;
        var legalFtyName = req.body.legalFtyName;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_spinfty_master(?,?,?,?,?,?,?)', [id, spinFty, location, contact, legalFtyName, loginId, orgId],
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


router.get('/spinFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT * FROM Spin_Fty_master where id = ${id} and  orgId = ${orgId} ;`

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', SpinFty: [] });
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



router.delete('/spinFty-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_spinfty_master(?,?,?)', [id, loginId, orgId],
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



// ======================================================================================================================================================================


// ================================ Rej Type =======================================================================================================

router.get('/rejType-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_rejType_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', rejtype: [] });
                    }
                    else {
                        res.send({ success: true, rejtype: rows.RowDataPacket[0] })
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

router.get('/rejType-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var rejName = req.query.rejName?req.query.rejName:'';

        client.executeStoredProcedure('pgetall_rejType_master_filter(?,?)', [rejName, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', rejtype: [] });
                    }
                    else {
                        res.send({ success: true, rejtype: rows.RowDataPacket[0] })
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
router.post('/rejType-master', (req, res, next) => {
        try {
    
            var loginId = req.decoded.loginId;
            var orgId = req.decoded.orgId;
            var id = req.body.id ? req.body.id : 0;
            var rejType = req.body.rejType ? req.body.rejType : '';
            var rejName = req.body.rejName;
            var losses = req.body.losses ? req.body.losses : '';
    
            var data = [];
            var headerQuery = "INSERT INTO tmp_rejType_lines(line_id, rejTypeId, colorId, color, createdBy, orgId) values "
            var data = req.body.data;
            var i = 0;
            for (let datalist of data) {
    
                var line_id = datalist.lineid ? datalist.lineid : 0;
                var rejTypeId = id;
                var colorId = datalist.id ? datalist.id : 0
                var color = datalist.color ? datalist.color : 0;


                // var line_id = datalist.id ? datalist.id : 0;
                // var rejTypeId = id;
                // var colorId = datalist.colorId ? datalist.colorId : 0
                // var color = datalist.color ? datalist.color : 0;

                bulkInsert =
                  `(${db.escape(line_id)},
                    ${db.escape(rejTypeId)},
                    ${db.escape(colorId)},
                    ${db.escape(color)},
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
    
            client.executeNonQuery('ppost_rejType_master(?,?,?,?,?,?,?)', [id, rejType, rejName, losses, headerQuery, loginId, orgId],
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


router.get('/rejType-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT A.*, 
       (SELECT json_arrayagg(json_object('color', B.color, 'colorId', B.colorId, 'lineid', B.rejTypeId)) 
        FROM rej_type_master_line B 
        WHERE B.rejTypeId = A.id) as colors 
FROM rej_type_master A 
WHERE A.id = ${id} 
  AND A.delStatus = 0 
  AND A.orgId = ${orgId} ;
    `

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', rejtype: [] });
                    }
                    else {
                        res.send({ success: true, rejtype: rows.RowDataPacket[0] })
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

router.delete('/rejType-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_rejType_master(?,?,?)', [id, loginId, orgId],
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



// =================================================================================================================================================

// ================================ PO Master =======================================================================================================

router.get('/po-master', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;

        client.executeStoredProcedure('pgetall_po_master(?)', [orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', po: [] });
                    }
                    else {
                        res.send({ success: true, po: rows.RowDataPacket[0] })
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


router.get('/po-master-line/:id', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var id = req.params.id

        client.executeStoredProcedure('pgetall_po_master_line(?,?)', [id,orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', po: [], pomaster : [] });
                    }
                    else {
                        res.send({ success: true, pomaster: rows.RowDataPacket[0], po:rows.RowDataPacket[1] })
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

router.get('/po-master-filter', (req, res, next) => {
    try {
        var orgId = req.decoded.orgId;
        var orderNo = req.query.orderNo;

        client.executeStoredProcedure('pgetall_po_master_filter(?,?)', [orderNo, orgId],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', po: [] });
                    }
                    else {
                        res.send({ success: true, po: rows.RowDataPacket[0] })
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

router.post('/po-master', (req, res, next) => {
    try {
        var id = req.body.id ? req.body.id : 0;
        var buyerId = req.body.buyerId;
        var buyer = req.body.buyer;
        var orderNo = req.body.orderNo;
        var poDate = req.body.poDate;
        var shipDate = req.body.shipDate
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;

        client.executeNonQuery('ppost_po_master(?,?,?,?,?,?,?,?)', [id, buyerId, buyer, orderNo, poDate, shipDate, loginId, orgId],
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


router.post('/po-master_line', (req, res, next) => {
        try {
    
            var id = req.body.id ? req.body.id : 0;
            var loginId = req.decoded.loginId;
            var orgId = req.decoded.orgId;
    
            var data = [];
            var headerQuery = "INSERT INTO tmp_po_lines(line_id, orderId, orderNo, styleId, style, colorId, color, sizeId, size, quantity, poRate, poValue, popl,createdBy, orgId) values "
            var data = req.body.data;
            var i = 0;
            for (let datalist of data) {
    
                var line_id = datalist.id ? datalist.id : 0;
                var orderId = id;
                var orderNo = datalist.orderNo;
                var styleId = datalist.styleId;
                var style = datalist.style;
                var colorId = datalist.colorId;
                var color = datalist.color;
                var sizeId = datalist.sizeId;
                var size = datalist.size;
                var quantity = datalist.quantity;
                var poRate = datalist.poRate;
                var poValue = datalist.poValue;
                var popl = datalist.popl;

                bulkInsert =
                  `(${db.escape(line_id)},
                    ${db.escape(orderId)},
                    ${db.escape(orderNo)},
                    ${db.escape(styleId)},
                    ${db.escape(style)},
                    ${db.escape(colorId)},
                    ${db.escape(color)},
                    ${db.escape(sizeId)},
                    ${db.escape(size)},
                    ${db.escape(quantity)},
                    ${db.escape(poRate)},
                    ${db.escape(poValue)},
                    ${db.escape(popl)},
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
    
            client.executeNonQuery('ppost_po_master_line(?,?,?,?)', [id, headerQuery, loginId, orgId],
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


router.get('/po-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var orgId = req.decoded.orgId;

        Query = `SELECT id, buyerId, buyer, orderNo, DATE_FORMAT(poDate , "%Y-%m-%d") as poDate , poQuantity, poValue, DATE_FORMAT(shipDate, "%Y-%m-%d") as shipDate, orgId, status, delStatus, createdBy, createdAt, modifiedBy, modifiedAt FROM po_master A WHERE A.id = ${id} and A.delStatus = 0 AND A.orgId = ${orgId};
    `

        client.executeStoredProcedure('pquery_execution(?)', [Query],
            req, res, next, function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', rejtype: [] });
                    }
                    else {
                        res.send({ success: true, po: rows.RowDataPacket[0] })
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



router.delete('/po-master/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_po_master(?,?,?)', [id, loginId, orgId],
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

router.delete('/po-master-line/:id', (req, res, next) => {
    try {
        var id = req.params.id;
        var loginId = req.decoded.loginId;
        var orgId = req.decoded.orgId;
        client.executeNonQuery('pdelete_po_line_master(?,?,?)', [id, loginId, orgId],
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
// =======================================================================================================================================================================


module.exports = router;