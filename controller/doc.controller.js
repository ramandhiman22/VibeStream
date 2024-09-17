class DocController {
    static async showAbout(req,res){
        return res.render('doc/AboutUs');
    }
    static async showContectUs(req,res){
        return res.render('doc/ContectUs');
    }
    static async showTerm(req,res){
        return res.render('doc/Term&Conditions');
    }
    static async showPolicy(req,res){
        return res.render('doc/Privacy&policy');
    }


}
module.exports = DocController;