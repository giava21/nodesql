const express = require('express');
const app = new express();
app.use(require("body-parser").json())
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./data.db3')

const port = 8080;

db.serialize(() => {
	db.run("CREATE TABLE IF NOT EXISTS users (user TEXT, password TEXT)")
	const stmt = db.prepare("INSERT INTO users VALUES (?, ?)")
	for (let i = 0; i < 10; i++){
		stmt.run("Ipsum"+i, "password"+i)
	}
	stmt.finalize()
})

app.post("/login", (req, res) => {
	const us = req.body.u
	const pass = req.body.p
	db.get("SELECT * FROM users WHERE user = ? AND password = ?", [us, pass], (err, row) => {
		if (err){
			res.json({error: err.message})
		} else {
			if (row !== undefined){
				res.json({ok: true})		
			} else {
				res.status(401).send({ok: false})
			}	
		}
	})
})

app.listen(port, () => console.log(`App listening to port ${port}`));