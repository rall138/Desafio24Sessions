
function auth(req, res, next){
    let date = Date()
    console.log(date.toString()+' '+req.session.user)
    if(req.session.user){
        return next()
    }
    res.render('login')
}

module.exports = auth