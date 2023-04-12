const { response } = require('express')
const Hospital = require('../models/hospital')

const getHospitales = async (req, res = response) => {
    try {
        const hospitales = await Hospital.find({}, 'nombre img').populate('usuario', 'nombre email');
        res.status(200).json({ ok: true, hospitales, msg: 'GetHospitales' })
    } catch (error) {
        res.status(200).json({ ok: false, msg: 'Error al listar hospital' })
    }

}

const crearHospital = async (req, res = response) => {

    // siempre puedo obtener el uid de req.uid porque me lo devuelve despues de pasar el middleware de validartoken
    const uid = req.uid;
    const hospital = new Hospital({ usuario: uid, ...req.body });
    // cuando hago el req.body lo que estyo haciendo es mandando todos los parametros del body al modelo. Pero los filtra, es decir.
    // Que si en el body viene info no necesaria el la omite y solo se queda con los campos que le sirve
    try {
        const hospitalBd = await hospital.save();
        res.status(200).json({ ok: true, hospital: hospitalBd, msg: 'crearHospital' })
    } catch (error) {
        res.status(200).json({ ok: false, msg: 'Error al crear hospital' })
    }


}

const updateHospitales = async (req, res = response) => {

    try {
        const idHospital = req.params.id;
        const idUsuario = req.uid;

        const hospitalBd = Hospital.findById(idHospital);

        if (!hospitalBd) {
            return res.status(404).json({ ok: true, msg: 'Id no encontrado' })
        }
        const cambiosHospital = {
            ...req.body,
            usuario: idUsuario
        };
        const hospitalActualizado = await Hospital.findOneAndUpdate(idHospital, cambiosHospital, { new: true });
        res.status(200).json({ ok: true, hospitalActualizado })


    } catch (error) {
        return res.status(500).json({ ok: true, msg: 'Error inesperado' })
    }

}


const deleteHospitales = async(req, res = response) => {
    try {
        const idHospital = req.params.id;

        const hospitalBd = Hospital.findById(idHospital);

        if (!hospitalBd) {
            return res.status(404).json({ ok: true, msg: 'Id no encontrado' })
        }
        const hospitalActualizado = await Hospital.findByIdAndDelete(idHospital);
        res.status(200).json({ ok: true, msg: 'hospital Eliminado' })


    } catch (error) {
        return res.status(500).json({ ok: true, msg: 'Error inesperado' })
    }
}


module.exports = { getHospitales, crearHospital, updateHospitales, deleteHospitales }