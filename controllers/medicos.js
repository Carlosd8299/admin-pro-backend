const { response } = require('express')
const Hospital = require('../models/hospital')
const Medico = require('../models/medicos')

const getMedicos = async (req, res = response) => {
    try{
        const medicos = await Medico.find({},)
                                            .populate('usuario','nombre email')
                                            .populate('hospital','nombre');
        res.status(200).json({ ok: true, medicos ,msg: 'Lista de medicos' }) 
    }catch(error){
        res.status(200).json({ ok: false, msg: 'Error al listar medicos' })
    }
}

const crearMedicos = async (req, res = response) => {

    // siempre puedo obtener el uid de req.uid porque me lo devuelve despues de pasar el middleware de validartoken
    const uid = req.uid;
    const medico = new Medico({ usuario: uid, ...req.body });
    // cuando hago el req.body lo que estyo haciendo es mandando todos los parametros del body al modelo. Pero los filtra, es decir.
    // Que si en el body viene info no necesaria el la omite y solo se queda con los campos que le sirve
    try {
        const medicoBd = await medico.save();
        res.status(200).json({ ok: true, medico: medicoBd, msg: 'Medico creado' })
    } catch (error) {
        res.status(400).json({ ok: false, msg: 'Error al crear medico' })
    }
}

const updateMedicos = (req, res = response) => {
    res.status(200).json({ ok: true, msg: 'updateMedicos' })
}


const deleteMedicos = (req, res = response) => {
    res.status(200).json({ ok: true, msg: 'deleteMedicos' })
}


module.exports = { getMedicos, crearMedicos, updateMedicos, deleteMedicos }