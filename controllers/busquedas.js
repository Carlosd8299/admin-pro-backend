//getTodo
const { response } = require('express')


const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {
    try {
        // obteniendo el parametro que biene = http://localhost:3000/api/busquedas/carlos
        const busqueda = (req.params.busqueda);
        //haciendo una expresion regular para que el parametro coincida con todo como un like en sql, la i significa insensible
        const regex = new RegExp(busqueda, 'i');
        // en vez mandar el parametro buscado  mando la expresion regular
        // const usuarios = await Usuario.find({ nombre: regex })
        // const medicos = await Medico.find({ nombre: regex })
        // const hospitales = await Hospital.find({ nombre: regex })

        const [usuarios, medicos, hospitales] = await Promise.all([
            Usuario.find({ nombre: regex }),

            Medico.find({ nombre: regex }),

            Hospital.find({ nombre: regex })
        ]);

        res.status(200).json({ ok: true, busqueda, medicos, hospitales, usuarios })
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'error getTodo' })
    }

}

const getDocumentosColeccion = async (req, res = response) => {
    try {
        // obteniendo el parametro que biene = http://localhost:3000/api/busquedas/carlos
        const busqueda = (req.params.busqueda);
        const coleccion = (req.params.tabla);
        //haciendo una expresion regular para que el parametro coincida con todo como un like en sql, la i significa insensible
        const regex = new RegExp(busqueda, 'i');
        let resultado = [];
        switch (coleccion) {

            case 'medicos':
                resultado = await Medico.find({ nombre: regex })

                break;
            case 'usuarios':
                resultado = await Usuario.find({ nombre: regex })

                break;
            case 'hospitales':
                resultado = await Hospital.find({ nombre: regex })

                break;
            default:
                return res.status(500).json({ ok: false, msg: 'error getTodo' });
        }
        res.status(200).json({ ok: true, resultado })
    } catch (error) {
        res.status(500).json({ ok: false, msg: 'error getTodo' })
    }

}

module.exports = { getTodo, getDocumentosColeccion }