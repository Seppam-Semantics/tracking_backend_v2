const express = require('express');
const router = express.Router();
var dbConnection = require('../config/database');

router.use(function (req, res, next) {
    next(next);
});
module.exports = {
    executeStoredProcedure: function (ProcName, CallingParam, req, res, next, callback) {
        _ProcedureCall = "Call ";
        _StoredProcedureName = _ProcedureCall + ProcName;
        //console.log(_StoredProcedureName)
        dbConnection.query(_StoredProcedureName, CallingParam, function (err, rows, fields) {
            var resultObj = {};
            if (err) {
                req.resultObj = {
                    success: false,
                    ErrorCode: err.code,
                    ErrorNo: err.errno,
                    SqlMessage: err.SqlMessage,
                    fields: fields,
                    OkPacket: rows
                };
                return next(err);
            } else if (!rows[0] || rows[0] == "") {
                resultObj = {
                    success: true,
                    err: err,
                    fields: fields,
                    OkPacket: rows
                };
            } else {
                resultObj = {
                    success: true,
                    RowDataPacket: rows,
                    err: err,
                    fields: fields
                };
            }
            callback(resultObj);
        });
    },
    executeNonQuery: function (ProcName, CallingParam, req, res, next, callback) {
        _ProcedureCall = "Call ";
        _StoredProcedureName = _ProcedureCall + ProcName;
        //console.log(_StoredProcedureName)
        dbConnection.query(_StoredProcedureName, CallingParam, function (err, rows, fields) {
            var resultObj = {};
            //console.log('rows')
            //console.log(rows)
            if (err) {
                req.resultObj = {
                    success: false,
                    ErrorCode: err.code,
                    ErrorNo: err.errno,
                    SqlMessage: err.SqlMessage,
                    fields: fields,
                    OkPacket: rows
                };
                return next(err);
            } else {
                resultObj = {
                    success: true,
                    err: err,
                    fields: fields,
                    affectedRows: rows.affectedRows
                };
            }
            callback(resultObj);
        });
    },
    executeQuery: function (SqlQuery, req, res, next, callback) {
        // _ProcedureCall = "Call ";
        //_StoredProcedureName = _ProcedureCall  + ProcName
        dbConnection.query(SqlQuery, function (err, rows, fields) {
            // console.log(rows)
            var resultObj = {};
            if (err) {
                req.resultObj = {
                    success: false,
                    ErrorCode: err.code,
                    ErrorNo: err.errno,
                    SqlMessage: err.SqlMessage,
                    fields: fields,
                    OkPacket: rows
                };
                return next(err);
            } else if (!rows || rows == "") {
                resultObj = {
                    success: true,
                    err: err,
                    fields: fields
                };
            } else {
                resultObj = {
                    success: true,
                    RowDataPacket: rows,
                    err: err,
                    fields: fields
                };
            }
            callback(resultObj);
        });
    }
};