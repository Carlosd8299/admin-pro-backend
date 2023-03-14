const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const res = require('express/lib/response');
const { generarJWT } = require('../helpers/jwt');


const getUsuarios = async (req, res) => {

    // trayendo el query param http://localhost:3000/api/usuarios?desde=5 
    // este parametro es opcional, si no se envia entonces uso el cero con la condiccion || 0
    const desde = Number(req.query.desde) || 0;
    // const usuario = await Usuario.find({}, 'nombre email rol')
    //                                 .skip(desde)
    //                                 .limit(5);
    // const total = await usuario.count();

    // Lo que se hace aqui es ejecutar las dos promesas una despues de la otra,
    // para en caso de uqe existan muchos registros no se genere delay
    // se almacenan los resultados en el mismmo orden del array
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email rol img')
            .skip(desde)
        // .limit(5)
        ,
        Usuario.countDocuments()
    ])

    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
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
// const actualizarUsuarios = async (req, res = response) => {
//     const uid = req.params.id;

//     try {

//         const usuarioDb = await Usuario.findById(uid);
//         if (!usuarioDb) {
//             return res.status(404).json({
//                 ok: false,
//                 msg: 'Error usuario no existe'
//             });
//         }
//         // TODO: Comprobar token y si el usuario es correcto

//         // Actualizaciones
//         const { password, google, email, ...campos } = req.body;

//         if (usuarioDb.email !== email) {
//             const existeEmail = await Usuario.findOne({ email });
//             if (existeEmail) {
//                 res.status(404).json({
//                     ok: false,
//                     msg: 'Ya existe usuario con ese email'
//                 });
//             } else {
//                 // actualizo el email que viene del body
//                 campos.email = email;
//             }
//         }

//         const usuarioActualizado = await Usuario.findOneAndUpdate(uid, campos, { new: true });
//         const token = await generarJWT(uid);
//         res.json({
//             ok: true,
//             uid: usuarioActualizado,
//             token
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: error
//         });
//     }
// }

const actualizarUsuarios = async (req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;


    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        
        if ( !usuarioDB.google ){
            campos.email = email;
        } else if ( usuarioDB.email !== email ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario de google no pueden cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
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