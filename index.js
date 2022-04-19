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
// Rutas
app.use('/api/usuarios',require('./routes/usuarios'))
app.use('/api/login',require('./routes/login'))


app.listen(process.env.PORT, () => {
    console.log("servidor corriendo en el puerto ",process.env.PORT)
});
// hay que instalar nodemon npm install -g nodemon
// luego correr el script npm run start:dev