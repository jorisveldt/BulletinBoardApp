const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const {Client} = require('pg');


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}))

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: 'bulletinboard',
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
})

const input = process.argv[2]
console.log(input)

client.connect();

app.get('/', function(req, res) {
  res.render('index')
})

app.post('/add-message', function(req, res) {
  let title = req.body.title;
  let body = req.body.body;

  client.query('insert into messages (title, body) values ($1, $2)', [title, body], (err, res) => {
    console.log(err ? err.stack : 'inserted into database')
    // client.end()
  })
    res.redirect('/messages')
});


app.get('/messages', function(req, res) {
  client.query(`select * from messages`, (err, result) => {
  posts = result.rows;
  // client.end();
  res.render('messages', {data: posts})
  })
})


// app.post('/', (req, res) => {
//   var post = {
//     title: req.body.title,
//     body: req.body.body
//   };

//   client.connect(url, function(err,))
// })

// app.post('/', (req,res) => {
//   readFile('./messages.json').then(content => {
//     let message = JSON.parse(content);
//     topic = req.body;
//     message.push(topic);

//     writeFile('./messages.json', JSON.stringify(message))
//     .then(() => {
//     res.redirect('/messages')
//   })
//   .catch(err => {
//     console.error(`looks like there's an error: ${err}`)
//   })
// })
// });

// app.get("/messages", function(req, res) {
// 	readFile('./messages.json').then(content => {
//     let message = JSON.parse(content);
//     res.render('messages', {message: message});
//   })
//   .catch(err => {
//     console.error(`looks like there's an error: ${err}`)
//   })
// });




app.get('*', function(req, res) {
	res.render('404')
})

//Port is listening on
app.listen(3004, () => {
	console.log('App is running on port 3004')
});