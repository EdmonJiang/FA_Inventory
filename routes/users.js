var express = require('express'),
    router = express.Router(),
    ldap = require('ldapjs'),
    crypto = require('crypto'),
    NodeRSA = require('node-rsa');

var key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
'MIIBOwIBAAJBAMEmot3jW9iY/3JWOdwwiD1dU7P1Bz93vbZLIkZmbxp7Kr0IIX9Q\n'+
'2x3MAvv3TnGgfwOC4TZJ8EQGt+h6RzkxpMMCAwEAAQJAS3dTDyr0Cc7Nj9jMxpFX\n'+
'ydIbECbebBfW0dDNVYBUTJ3BC26lcBOPFuB8fd9fFAjEms62SMgJhNXzwP5/Fhp2\n'+
'MQIhAOgAkAjLsXVpMbDM8+0waaT2bInOcU37hhWoXwSMaDe/AiEA1SFJ4O1waqjz\n'+
'JYKx6NQzi9BO7+9Z661iVcJGAnbIs/0CIHX7U0Ql0ikTReHTWHjWleL+LlQmWBiA\n'+
'QL/iz+9QN++hAiEAjb9VBl6EbLuu8tyofIRdP/ir91HGCUPIaecKbusXcvUCIQC+\n'+
'kM72Eok05Bsp0VNE6vCiOJqAepu7/cm4UIPe/XxcWA==\n'+
'-----END RSA PRIVATE KEY-----');
key.setOptions({encryptionScheme: 'pkcs1'});
const url = "ldap://10.186.0.233";
const adClient = ldap.createClient({ url: url });

/* GET users listing. */
router.get('/login', function(req, res, next) {
  // console.log(req.session)
  res.render('login');
});

router.post('/login', function(req, res, next) {
// console.log(req.body)
  if(req.body.email && req.body.password){
// console.log('encrypt passwd: '+ req.body.password);
      var aduser = {
          email: req.body.email,
          password: key.decrypt(req.body.password, 'utf8')
        }
      
      if(!valemail(aduser.email)){
        console.log('wrong email')
        req.flash("info", "Wrong email address.");
        res.redirect('/users/login');
        return;
      }else if(!valpwd(aduser.password)){
        console.log('wrong pwd')
        req.flash("info", "Wrong password.");
        res.redirect('/users/login');
        return;
      }

      // Bind as the user
    adClient.bind(aduser.email, aduser.password, function(err) {

      if (err != null) {
        if (err.name === "InvalidCredentialsError"){
          req.flash("info", "Wrong email or password.");
          res.redirect('/users/login');
          return;
        }
        else{
          //res.send("Unknown error: " + JSON.stringify(err));
          req.flash("info", "Login failed.");
          res.redirect('/users/login');
          return;
        }
      } else{

// console.log('user.name: '+aduser.email+' pwd: '+ aduser.password)
        aduser.password = encrypt(aduser.password,'safe_pass_secret');
        req.session.user = aduser;
        req.app.locals.user = aduser;
// console.log('login successful')
        res.redirect('/');
      }
    });
// console.log('decrypt passwd: '+ aduser.password);

  }else{
    res.redirect('/users/login');
  }

});

router.get('/logout', function(req, res, next){
  req.session.destroy();
  res.redirect('/users/login');
})

function encrypt(str,secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str,'utf8','hex');
    enc += cipher.final('hex');
    return enc;
}

function valpwd(pwd){
    return /((?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9])|(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])|(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])).{8,30}/.test(pwd);
}
function valemail(email){
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
}

module.exports = router;
