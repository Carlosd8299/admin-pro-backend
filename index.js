const express = require('express');

require('dotenv').config();
var cors = require('cors')

const { dbConnection } = require('./database/config')

//crear el serrvidor express
const app = express();
// Configurando cors
app.use(cors())
// lectur y parseo del json
app.use(express.json());
// llamando a la bd
dbConnection();
//directorio publico
app.use(express.static('public'))
// Rutas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/login',require('./routes/login'))
app.use('/api/hospitales',require('./routes/hospital'))
app.use('/api/medicos',require('./routes/medicos'))
app.use('/api/busquedas',require('./routes/busquedas'))
app.use('/api/uploads',require('./routes/uploads'))


app.listen(process.env.PORT, () => {
    console.log("servidor corriendo en el puerto ",process.env.PORT)
});
// hay que instalar nodemon npm install -g nodemon
// luego correr el script npm run start:dev