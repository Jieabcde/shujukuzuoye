//import express
const exp = require('express');
const bodyParser = require('body-parser');
//create app
const app = exp();

const mysql = require('mysql');
const jparser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password:'root',
	database: 'student'
});


function getAllOrders() {

	pool.getConnection(function(err, connection) {
		connection.query('SELECT * from  student', function(error, results, fields) {
			if (error) throw error;
			connection.release();
			return results;
		})
	});
}
//create routers
app.get('/', (req, res) => {
	res.send('ok');

});
app.all('/user', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	pool.getConnection(function(err, connection) {
		let sql =
			'SELECT *  from student';
			
		connection.query(sql, function(error, rs, fields) {
			if (error) throw error;
			connection.release();
			console.log(rs.length)

			res.json(rs);
		})
	});

});
app.post('/addemp', urlencodedParser, (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	req.headers['content-type'] = "application/json";
	let params = req.body;
	console.log(params);
	pool.getConnection(function(err, connection) {
		let sql='insert into employees values (?,?,?,?,?,?,?,?)'
		connection.query(sql, [params.code,params.lname,params.fname,params.ext,params.email,params.office,params.repto,params.job],function(error, rs) {
			if (error) throw error;
			connection.release();
			let r=rs.affectedRows;
console.log(rs)
			res.json(rs);
		})
	});

});

app.all('/', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
});
app.all('/json', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
	const data = {
		name: 'lin',
		age: 39
	};
	let str = JSON.stringify(data);
	res.send(str);
});

app.all('/jsonp', (req, res) => {
	//res.setHeader('Access-Control-Allow-Origin','*');
	//res.setHeader('Access-Control-Allow-Headers','*');
	const data = {
		name: 'lin',
		age: 29
	};
	let str = JSON.stringify(data);
	let cb = req.query.callback;
	res.end(`${cb}(${str})`); //abc(str)
});
app.all('/student', (req, res) => {
	//res.setHeader('Access-Control-Allow-Origin','*');
	//res.setHeader('Access-Control-Allow-Headers','*');
	const data = {
		data: [{
			name: "lin1",
			age: 29
		}, {
			name: "zheng",
			age: 20
		}]
	};
	let str = JSON.stringify(data);
	let cb = req.query.callback;
	res.end(`${cb}(${str})`); //abc(str)
});

app.all('/list', (req, res) => {

	res.setHeader('Access-Control-Allow-Origin', '*');
	const rs = {
		"total": 3,
		"rows": [{
				"productid": "SW-01",
				"unitcost": 10.00,
				"status": "P",
				"listprice": 16.50,
				"attr1": "Large",
				"itemid": "EST-1"
			},
			{
				"productid": "K9-DL-01",
				"unitcost": 12.00,
				"status": "P",
				"listprice": 18.50,
				"attr1": "Spotted Adult Female",
				"itemid": "EST-10"
			},
			{
				"productid": "AV-CB-01",
				"unitcost": 92.00,
				"status": "P",
				"listprice": 193.50,
				"attr1": "Adult Male",
				"itemid": "EST-18"
			}
		]
	};
	let str = JSON.stringify(rs);
	res.send(str);
})
//listen 8000
app.listen(8000, () => {
	console.log("server is starting on port 8000......");
});
