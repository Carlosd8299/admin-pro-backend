const { Router } = require('express')
const { getHospitales, crearHospital, updateHospitales, deleteHospitales } = require('../controllers/hospitales')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token');
const router = Router();

router.get('/', getHospitales)
router.post('/', [validarJWT, check('nombre',).not().isEmpty(), validarCampos], crearHospital)
router.put('/:id', [check('nombre', 'debe mandar el nombre del hospital')], updateHospitales)
router.delete('/:id', [validarJWT], deleteHospitales)

module.exports = router;