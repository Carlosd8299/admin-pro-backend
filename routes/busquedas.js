/* 
ruta: api/todo/:busqueda
*/

const { Router } = require('express')
const { getTodo, getDocumentosColeccion} = require('../controllers/busquedas')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token');
const router = Router();

router.get('/:busqueda', [validarJWT], getTodo);
router.get('/coleccion/:tabla/:busqueda', [validarJWT], getDocumentosColeccion);

module.exports = router;