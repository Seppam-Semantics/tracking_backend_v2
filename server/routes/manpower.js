const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const client = require('../utils/client');
const hash = require('password-hash');
app.set('superSecret', config.secret);


// ====================== Man Power =============================================================================================

router.get('/man-power', (req, res, next) => {
    try {
        
        client.executeStoredProcedure('pget_orders_manpower()', [],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({
                            success: true,
                            data: rows.RowDataPacket[0],
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