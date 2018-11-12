const express = require('express');
const login = express.Router();
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const {verify_key} = require('../../config/jwt.js');
const {connection_key} = require('../../config/database.js');

const database = mysql.createPool(connection_key);

//handle log in request
login.use(function(req, res) {
    let resData = {};
    let email = req.body.email;
    let password = req.body.password;

    database.getConnection(function(err, connection){
      if (err) {
        resData['error'] = 1;
        resData['message'] = 'Internal Server Error';
        res.status(500).json(resData);
        console.log("error occured during login process: step getConnection"+err)
      } else {
        connection.query('SELECT id_user, email, password FROM verifications WHERE email = ?', [email], function(err, rows, fields) {
          if (err) {
            resData['error'] = 1;
            resData['message'] = 'Error Occured!';
            res.status(400).json(resData);
          } else {
            if (rows.length > 0) {
              let verified = rows[0];
              if (verified.password == password) {
                let tokenInfo = {user_Id: verified['id_user'], user_Role: 'public'};
                token = jwt.sign(JSON.parse(JSON.stringify(tokenInfo)), verify_key, {
                  expiresIn: '1d'
                });
                resData['token'] = token;
                resData['error'] = 0;
                resData['message'] = 'login success!';
                res.status(200).json(resData);
              } else {
                resData['error'] = 1;
                resData['message'] = 'account and Password does not match';
                res.status(401).json(resData);
              }
            } else {
              resData['error'] = 2;
              resData['message'] = 'account does not exist!';
              res.status(401).json(resData);
            }
          }
        });
        connection.release();
      }
    });
  });

  module.exports = login;
