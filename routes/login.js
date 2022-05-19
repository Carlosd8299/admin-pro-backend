/*Path: api/login*/
const { Router } = require('express');
const { check } = require('express-validator');
const {login,loginGoogle,renewToken} = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token');

const router = Router();


router.post('/', [
    check('email', 'el correo es obligatorio').isEmail(),
    check('password', 'el correo es obligatorio').not().isEmpty(),
    validarCampos
],login)


router.post('/google',[check('token', 'el token es obligatorio')],loginGoogle)
router.get('/renew',[validarJWT],renewToken)


module.exports = router;