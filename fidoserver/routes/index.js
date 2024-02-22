
import express from 'express';
var router = express.Router();
import db from '../db/db.js' ; 

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {
    title : 'FIDO Server' , 
    game: 'Final Fantasy VII',
    category: '<p><b>Characters:</b></p>',
    characters: ['Cloud', 'Aerith', 'Tifa', 'Barret']
  });
});

router.post('/login' , function(req,res){
  const username = req.body.username ; 
  const password = req.body.password ; 
  console.log(password);
  res.redirect("home");
  if(username == "admin" && password == "admin")
    res.redirect("fido/home");
  else 
    res.redirect("/");
  
});

router.get('/home', async function(req , res){
  const con = await db ; 
  const rows = await con.query("Select *from credentials");
  console.table(rows);
  res.render("home", { credential : rows });
})

export default router ;
//module.exports = router;
