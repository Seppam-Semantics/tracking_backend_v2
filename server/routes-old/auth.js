const express = require('express');
const router = express.Router();
const app = express();
const config = require('../config/config');
const db = require('../config/database');
const hash = require('password-hash');
const client = require('../utils/client');
app.set('superSecret', config.secret);
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateS3ViewLink } = require('../utils/service');


router.post('/authentication', function (req, res, next) {
    // console.log(req.body);
    var userName = req.body.userName;
    var password = req.body.password;
    var hashedPassword = hash.generate(password);
    console.log(hashedPassword);
    client.executeStoredProcedure('pauthenticateUser(?)', [userName], req, res, next, async function (result) {
        if (!result.RowDataPacket) {
            res.json({ success: false, error: 'username not exsists', data: [] });
        } else if (result.RowDataPacket[0][0].status === 0) {
            res.json({ success: false, error: 'your account is temporarily blocked', data: [] });
        } else {
            if (hash.verify(password, result.RowDataPacket[0][0].password)) {
                pRowObj = result.RowDataPacket[0][0]
                var customRole = {
                    customRole: pRowObj.customRole,
                    employeeId: pRowObj.employeeId,
                }
                var payload = {
                    name: pRowObj.name,
                    userName: pRowObj.userName,
                    roleTypeId: pRowObj.roleTypeId,
                    roleId: pRowObj.roleId,
                    loginId: pRowObj.id,
                    employeeId: pRowObj.employeeId,
                    orgId: pRowObj.orgId,
                    // customRole: pRowObj.customRole,
                }
                var token = jwt.sign(payload, app.get('superSecret'), {
                    expiresIn: 86400 // expires in 24 hours
                });
                var roleToken = jwt.sign(customRole, app.get('superSecret'), {
                    expiresIn: 86400 // expires in 24 hours
                });
                res.json({
                    success: true,
                    message: 'welcome to production app!',
                    token: token,
                    roleToken: roleToken,
                    userContext: {
                        name: pRowObj.name,
                        userName: pRowObj.userName,
                        loginId: pRowObj.id,
                        roleId: pRowObj.roleId,
                        roleTypeId: pRowObj.roleTypeId,
                        employeeId: pRowObj.employeeId,
                        orgId: pRowObj.orgId,
                        customRole: pRowObj.customRole,
                        ServerDate: new Date()
                    }
                });
            }
            else {
                res.json({ success: false, error: 'password incorrect', data: [] });
            }
        }
    });
});

router.get('/authenticationStatus', (req, res, next) => {
    try {
        var orgId = req.params.data;
        client.executeStoredProcedure('pgetall_active_status(?)', [orgId],
            req, res, next, function (result) {
                rows = result;

                try {
                    rows = result;
                    if (!rows.RowDataPacket) {

                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        //  console.log(rows.RowDataPacket);
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


router.post('/authenticationStatus', (req, res, next) => {
    try {
        var employeeId = req.body.employeeId;
        var activeStatus = req.body.activeStatus;
        var orgId = req.body.orgId;

        client.executeNonQuery('ppost_active_status(?,?,?)', [employeeId, activeStatus, orgId],
            req, res, next, function (result) {
                try {
                    if (result.success == false | result.affectedRows == 0) {
                        res.json({ success: false, message: 'exsists' });
                    } else {
                        res.json({ success: true, message: 'activeStatus updated' });
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


router.post('/reset_password', function (req, res, next) {
    // console.log(req.body);
    var userName = req.body.userName;
    var confrimPassword = req.body.confrimPassword;
    // var newPassword = req.body.newPassword;
    var hashedPassword = hash.generate(confrimPassword);
    console.log(hashedPassword);
    client.executeNonQuery('ppost_reset_password(?,?)', [userName, hashedPassword],
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
});




router.get('/org-profile', (req, res, next) => {
    try {
        var orgId = 1000;
        client.executeStoredProcedure('pget_org_profile(?)', [orgId],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        const pRowObj = result.RowDataPacket[0][0];
                        const orgProfile = pRowObj;
                        res.send({ success: true, data: orgProfile });
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

router.get('/organization', (req, res, next) => {
    try {
        
        client.executeStoredProcedure('pget_organization()', [],
            req, res, next, async function (result) {
                try {
                    rows = result;
                    if (!rows.RowDataPacket) {
                        res.json({ success: false, message: 'no records found!', data: [] });
                    }
                    else {
                        res.send({ success: true, org: rows.RowDataPacket[0] });
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