const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password : '',
  database : 'tarea'
});

//Conectarnos a la base de datos
connection.connect();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Kareli Valverde");
});

app.get('/frutas', (req, res) => {
  //Consultar las frutas
  connection.query('SELECT * FROM frutas', function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
    }
    //Regresar un objeto json con el listado de las frutas.
    res.status(200).json(results);
  });
});


app.get('/frutas/:id', (req, res) => {
  const id = Number(req.params.id);
  if(isNaN(id)) {
    res.status(400).json({ error: 'parametros no validos.'});
    return;
  }
  //Consultar las frutas
  connection.query(`SELECT * FROM frutas WHERE id=?`, [id] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    if(results.length === 0) {
      res.status(404).json({ error: 'fruta no existente.'});
      return;
    }
    //Regresar un objeto json con el listado de las frutas.
    res.status(200).json(results);
  });
});

app.post('/frutas', (req, res) => {
  console.log("req", req.body);
  const nombre = req.body.nombre;
  const rol = req.body.rol;
  const descripcion = req.body.descripcion;
  connection.query(`INSERT INTO frutas  (nombre, rol, descripcion) VALUES (?,?,?)`, [nombre,rol,descripcion] ,function (error, results, fields) {
    if(error) {
      res.status(400).json({ error: 'consulta no valida.'});
      return;
    }
    res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});