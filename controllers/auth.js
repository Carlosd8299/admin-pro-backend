const bcrypt = require('bcryptjs');
const { response } = require('express');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { verify } = require('../helpers/google-verify');


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
        });
    } catch (error) {
        res.status(200).json({
            ok: false,
            msg: 'Google Sign In fail'
        });
    }
}

const renewToken = async(req, res = response) => {

    try{
        const uid = req.uid;

        // Generar el token 
        const token = await generarJWT(uid);
    
        res.json({
            ok: true,
    
        })
    }catch(error){
        const uid = req.uid;

        // Generar el token 
        const token = await generarJWT(uid);
    
        res.status(500).json({
            ok: false,
        })
    }
    // tomando el uid que vine en el req. Porque pasa por el middleware del token
   
}

module.exports = { login, loginGoogle,renewToken };