const { Router } = require('express')
const { getMedicos, crearMedicos, updateMedicos, deleteMedicos } = require('../controllers/medicos')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token');
const router = Router();

router.get('/', getMedicos)
router.post('/', [validarJWT
        , check('nombre','El nombre del medico es necesario').not().isEmpty()
        , check('hospital','El Id del hospital debe ser valido').isMongoId()
        , check('email','El email del medico es necesario').not().isEmpty()
        , validarCampos]
    , crearMedicos)
router.put('/:id', [], updateMedicos)
router.delete('/:id', [], deleteMedicos)

module.exports = router;