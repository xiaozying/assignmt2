const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const { query } = require('express');


const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
   ssl: {
     rejectUnauthorized: false
   }  //connect the process database
  //connectionString: process.env.DATABASE_URL || "postgres://postgres:1234@localhost/cmpt276"

});

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM rectangles');
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
})

app.post('/add',async(req,res) =>{
  var name = req.body.name;
  var width = req.body.width;
  var height = req.body.height;
  var color = req.body.color;
  pool.query(`Insert into rectangles (name,color,width,height) VALUES('${name}','${color}',${width},${height})`,async(error,results)=>{res.render('pages/add', results );})
  
})

app.post('/deltid',async(req,res) =>{
  var id = req.body.id;
  pool.query(` delete from rectangles where id = '${id}'`,async(error,results)=>{res.render('pages/deltid', results );})
})

app.post('/upid/:id',async(req,res) =>{
  var id = req.params.id;
  var name = req.body.name;
  pool.query(`update rectangles set name = '${name}' where id = '${id}'`,async(error,result)=>
  {
    res.render('pages/upid', result);
  })
})


app.post('/upcolor/:id',async(req,res) =>{
  var id = req.params.id;
  var color = req.body.color;
  pool.query(`update rectangles set color = '${color}' where id = '${id}'`,async(error,result)=>
  {
    res.render('pages/upcolor', result);
  })
})

app.post('/upheight/:id',async(req,res) =>{
  var id = req.params.id;
  var height = req.body.height;
  pool.query(`update rectangles set color = '${height}' where id = '${id}'`,async(error,result)=>
  {
    res.render('pages/upcolor', result);
  })
})

app.post('/upwidth/:id',async(req,res) =>{
  var id = req.params.id;
  var width = req.body.width;
  pool.query(`update rectangles set color = '${width}' where id = '${id}'`,async(error,result)=>
  {
    res.render('pages/upcolor', result);
  })
})


app.get('/name/:id',async(req,res) =>{
  var id = req.params.id;
  pool.query(`select * from rectangles where id = '${id}'`,async(error,result)=>
  {
    var data = {results:result.rows};
    res.render('pages/detail', data);
  })
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))


  