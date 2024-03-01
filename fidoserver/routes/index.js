
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
  const userrows = await con.query("Select *from user");
  console.table(rows);
  res.render("home", { credential : rows , user : userrows});
})

router.post('/truncate-credentials', async function(req, res) {
  try {
      const con = await db;
      await con.query("TRUNCATE TABLE credentials");
      console.log("Credentials table truncated");
      res.status(200).send("Credentials table truncated successfully");
  } catch (error) {
      console.error("Error truncating credentials table:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.post('/deleteUser', async function(req , res){
    const con = await db ; 
    const username = req.body.username  ;
    console.log(username);
    await con.query("DELETE FROM user where username = (?)" , username);
    res.redirect("home");
  }
  
);

router.post('/deleteCredentials', async function(req , res){
  const con = await db ; 
  const id = req.body.id  ;
  console.log(id);
  await con.query("DELETE FROM credentials where id = (?)" , id);
  res.redirect("home");
}
);

export default router ;

