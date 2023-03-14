const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { ActualizarImg } = require('../helpers/actualizar-img');
const path = require('path');
const fs = require('fs');
const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    let sampleFile;
    let uploadPath;

    //validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    //procesar la imagen
    const file = req.files.imagen;
    const nombreCortado = file.name.split('.'); //wolverine.1.2.3.jpg
    const nombreExtArchivo = nombreCortado[nombreCortado.length - 1];

    // validar extension
    const extValidas = ['gif', 'jpeg', 'jpg', 'png']

    // validar tipos
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (!tiposValidos.includes(tipo) && !extValidas.includes(nombreExtArchivo)) {
        return res.status(500).json({
            ok: true,
            msg: 'Tipo seleccionado no es valido'
        });
    }
    // generar nombre dle archivo 
    const nombreArchivo = `${uuidv4()}.${nombreExtArchivo}`;

    //crear el path para guardar la imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // mover la imagen
    file.mv(path, (err) => {
        if (err) {
            return res.status(500).json({ ok: false, msg: 'Error subiendo' });
        }
        // actualizar la bd
        ActualizarImg(tipo,id,nombreArchivo);
        res.status(200).json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });

}


const RetornaImagen = ( req, res = response ) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }` );

    // imagen por defecto
    if ( fs.existsSync( pathImg ) ) {
        res.sendFile( pathImg );
    } else {
        const pathImg = path.join( __dirname, `../uploads/no-img.jpg` );
        res.sendFile( pathImg );
    }

}


  
module.exports = { fileUpload ,RetornaImagen};