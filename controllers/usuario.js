const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');
const getUsuarios = async (req, res) => {

    const usuario = await Usuario.find({}, 'nombre email rol');
    res.json({
        ok: true,
        usuarios: usuario,
        uid: req.uid
    }
    )
}

const crearUsuarios = async (req, res = response) => {

    const { nombre, email, password } = (req.body);

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            res.status(400).json({ ok: false, msg: 'Existe el email', });
        } else {

            const usuario = new Usuario(req.body);
            // Encriptar Contraseña
            const salt = bcrypt.genSaltSync();
            usuario.password = bcrypt.hashSync(password, salt);
            //Guardando el usuario en la bd
            const Usuariobd = await usuario.save();

            // Generar el token 
            const token = await generarJWT(Usuariobd._id);
            res.json({
                ok: true,
                usuario, 
                token
            }
            )
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, msg: 'Error inesperado', });
    }



}
const actualizarUsuarios = async (req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Error usuario no existe'
            });
        }
        // TODO: Comprobar token y si el usuario es correcto

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;
        if (usuarioDb.email !== email) {

            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {

                return res.status(404).json({
                    ok: false,
                    msg: 'Ya existe usuario con ese email'
                });

            }
        }
        campos.email = email;

        const usuarioActualizado = await Usuario.findOneAndUpdate(uid, campos, { new: true });

        res.json({
            ok: true,
            uid: usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}


const borrarUsuarios = async (req, res = response) => {
    const uid = req.params.id;
    try {

        const usuarioDb = await Usuario.findById(uid);
        if (!usuarioDb) {
            return res.status(404).json({
                ok: false,
                msg: 'Error usuario no existe'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        return res.status(200).json({ ok: true, msg: 'usuario Eliminado', data: uid });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: error });
    }

}

module.exports = { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuarios }