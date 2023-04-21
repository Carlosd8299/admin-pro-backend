const { response } = require('express');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario')


const validarJWT = (req, res = response, next) => {
    // Leer el token de los headers
    const token = req.header('x-token');
    // console.log(token);
    //
    if (!token) {
        return res.status(401).json({ ok: false, msg: 'No hay token en la peticion' })
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECTRET);
        req.uid = uid;
        // console.log(uid);
        next();
    } catch (error) {
        return res.status(401).json({ ok: false, msg: 'Token no valido' })
    }
    // Si nop hay error me manda a next 


}

const ValidarAdminRole = async (req, res = response, next) => {
    const uid = req.uid;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.rol != 'ADMIN_ROLE') {
            res.status(403).json({
                ok: false,
                msg: 'Sin privilegios para hacer esta accion'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const ValidarAdminRoleMismoUsuario = async (req, res = response, next) => {
    const uid = req.uid;
    const id= req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if (usuarioDB.rol == 'ADMIN_ROLE' || uid === id) {
            next();
        } else {
            res.status(403).json({
                ok: false,
                msg: 'Sin privilegios para hacer esta accion'
            });
        }


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = { validarJWT, ValidarAdminRole, ValidarAdminRoleMismoUsuario }