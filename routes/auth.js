module.exports.requireLogin = function(req, res, next){
  if(req.session && req.session.user){
    next();
  }else{
    res.redirect('/users/login')
  }
};