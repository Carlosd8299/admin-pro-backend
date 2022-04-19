const {response} = require('express');
const {validationResult} = require('express-validator');

const validarCampos = (req, res = response, next) => {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ ok: false, msg: 'Erorres multiples', errors: errores.mapped() });
    }
    // Si nop hay error me manda a next 
    next();

}

module.exports= {validarCampos}