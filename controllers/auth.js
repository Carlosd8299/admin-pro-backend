const bcrypt = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { verify } = require('../helpers/google-verify');
const { getMenuFront } = require('../helpers/menu-front');


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
            ok: true, 
            token,
            menu: getMenuFront(usuariobd.rol),
            //usuariobd
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false, msg: 'Error'
        });
    }

}

const loginGoogle = async (req, res = response) => {

    try {
        const googletoken = req.body.token;
        const { name, email, picture } = await verify(googletoken);

        const usuariobd = await Usuario.findOne({ email });
        let usuario;
        // vañlidando si el usuario no existe en a bd 
        if (!usuariobd) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true

            });
        }
        // usuario ya existe en la app
        else {
            usuario = usuariobd;
            usuario.google = true;
            // si le cambio la contraseña la persona pierde la auth normal
            //usuario.password = '@@@';

        }
        // guardar en la bd
        usuario.save();
        // Generar el token 
        const token = await generarJWT(usuario._id);

        res.status(200).json({
            ok: true,
            msg: 'Google Sign In'
            , token
            , menu: getMenuFront(usuario.rol),
            //usuariobd
        });
    } catch (error) {
        res.status(200).json({
            ok: false,
            msg: 'Google Sign In fail'
        });
    }
}

const renewToken = async (req, res = response) => {

    try {
        const uid = req.uid;

        // Generar el token 
        const token = await generarJWT(uid);
        // Obtener el usuario por UID
        const usuario = await Usuario.findById(uid);
        res.json({
            ok: true,
            token,
            usuario,
            menu: getMenuFront(usuario.rol),
        })
    } catch (error) {
        const uid = req.uid;

        // Generar el token 
        const token = await generarJWT(uid);

        res.status(500).json({
            ok: false,
        })
    }


}




module.exports = { login, loginGoogle, renewToken };