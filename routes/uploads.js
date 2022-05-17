/* 
ruta: api/uploads/:busqueda
*/

const { Router } = require('express')
const expressFileUpload = require('express-fileupload');


const { validarJWT } = require('../middlewares/validar-token');
const { fileUpload,RetornaImagen} = require('../controllers/uploadsController')
const router = Router();

// default options
router.use(expressFileUpload());
router.put('/:tipo/:id', [validarJWT], fileUpload);
router.get('/:tipo/:foto', RetornaImagen);


module.exports = router;