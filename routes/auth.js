/*
  Rutas de usuario /Auth
  host + /api/auth
*/
const router = require('express').Router();
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearUusario, loginUusario, revalidarToken } = require('../controllers/auth');

router.post('/new',
[
  check('name', 'el nombre es obligatorio').not().isEmpty(),
  check('email', 'el enail es obligatorio').isEmail(),
  check('password', 'el password debe ser de 6 caracteres').isLength({ min: 6}),
  validarCampos
],
crearUusario);

router.post('/',
[
  check('email', 'el enail es obligatorio').isEmail(),
  check('password', 'el password debe ser de 6 caracteres').isLength({ min: 6}),
  validarCampos
],
loginUusario);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;