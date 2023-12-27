
import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FIDO Server' });
});
export default router ;
//module.exports = router;
