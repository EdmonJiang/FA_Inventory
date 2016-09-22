module.exports.requireLogin = function(req, res, next){
  if(req.session && req.session.user){
    next();
  }else{
    req.flash("info", "Please login first.");
    res.redirect('/users/login')
  }
};