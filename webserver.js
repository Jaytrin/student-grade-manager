const express = require('express');
const webserver = express();
const mysql = require('mysql');
const credentials = require('./mysql_connect');
const db = mysql.createConnection(credentials);

console.log('running');

webserver.listen(3050, ()=>{
	console.log('server listening on 3050')
})