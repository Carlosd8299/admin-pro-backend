const { response } = require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    // Leer el token de los headers
    const token = req.header('x-token');
    // console.log(token);
    //
    if (!token) {
        return res.status(401).json({ ok: false, msg: 'No hay token en la peticion' })
    }

    try {
        const {uid} = jwt.verify(token, process.env.JWT_SECTRET);
        req.uid= uid;
        // console.log(uid);
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, msg: 'Token no valido' })
    }
    // Si nop hay error me manda a next 
 

}

module.exports = { validarJWT }