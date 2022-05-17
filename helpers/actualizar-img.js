
const fs = require('fs');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const usuario = require('../models/usuario');

const borrarImagen = (path) => {
    if (fs.existsSync(path)) {
        //borrar la imagen
        fs.unlinkSync(path);
    }
}

const ActualizarImg = async (tipo, id, nombreArchivo) => {

    switch (tipo) {

        case 'medicos': {

            const medico = await Medico.findById(id);

            if (!medico) {
                return false;
            }

            const oldpath = `../uploads/medicos/${medico.img}`;
            borrarImagen(oldpath);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        }


        case 'usuarios': {
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return false;
            }
            const oldpath = `../uploads/usuarios/${usuario.img}`;
            borrarImagen(oldpath);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

            break;
        }
        case 'hospitales': {
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                return false;
            }
            const oldpath = `../uploads/hospitales/${hospital.img}`;
            borrarImagen(oldpath);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

            break;
        }
        default:
            return res.status(500).json({ ok: false, msg: 'error getTodo' });
    }

}



module.exports = {
    ActualizarImg
};