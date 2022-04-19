const { Router } = require('express')
const { getUsuarios, crearUsuarios, actualizarUsuarios, borrarUsuarios, } = require('../controllers/usuario')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token');
const router = Router();

router.get('/',validarJWT, getUsuarios)
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    // el custom middleware se llama despues de todos los check
    validarCampos
], crearUsuarios)
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    // el custom middleware se llama despues de todos los check
    validarCampos
], actualizarUsuarios)

router.delete('/:id', [
    validarJWT
], borrarUsuarios)

module.exports = router;