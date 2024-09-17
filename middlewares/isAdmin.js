function isAdmin(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    } else {
        res.render('admin/adminLogin');
    }
}
module.exports=isAdmin;