const bcrypt = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {

        const usuariobd = await Usuario.findOne({ email });
        if (!usuariobd) {
            return res.status(404).json({
                ok: false, msg: 'Email no valido'
            });
        }
        // verificar contraseña 
        const validPassword = bcrypt.compareSync(password, usuariobd.password);

        if (!validPassword) {
            res.status(404).json({
                ok: false, msg: 'Contraseña no valida'
            });
        }

        // Generar el token 
        const token = await generarJWT(usuariobd._id);
        res.status(200).json({
            ok: true, token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, msg: 'Error'
        });
    }

}

module.exports = { login };