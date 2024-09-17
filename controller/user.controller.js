
const User=require('../models/user');
class UserController {
    static async getProfile(req, res) {
        return res.render('user/profile', { user: req.user });
    }

    static async logout(req, res) {
        if (!req.user) {
            // User is not authenticated
            // req.redirect('/');
            return res.redirect('/auth/login');
        }
    
        try {
            req.user.status = false;
            await req.user.save();
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    // req.flash('error_msg', 'Error during logout.');
                    return res.redirect('/');
                }
                // req.flash('success_msg', 'Logged out successfully.');
                res.redirect('/');
            });
        } catch (error) {
            console.error('Logout error:', error);
            // req.flash('error_msg', 'An error occurred during logout.');
            res.redirect('/');
        }
    }
    
    static async renderProfile(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
       
        try {
            const user = await User.findByPk(req.session.userId);
            if (!user) {
                return res.redirect('/auth/login');
            }
            console.log('User image path:', user.image); // Debugging line
            res.render('profile', { user });
        } catch (err) {
            console.error('Error rendering profile:', err);
            res.redirect('/error');
        }
    }
    
    
    // Update profile details
    static async showEditProfile(req, res) {
        console.log('Session userId:', req.session.userId); // Debug statement
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }
    
        try {
            const user = await User.findByPk(req.session.userId);
           
            if (!user) {
                return res.redirect('/auth/login');
            }
            res.render('user/edit-profile', { user });
        } catch (err) {
            console.error('Error fetching profile for editing:', err);
            res.redirect('/error');
        }
    }
    

    // Update profile
    static async  updateProfile(req, res) {
        if (!req.session.userId) {
            return res.redirect('/auth/login');
        }

        const { name, email, number } = req.body;


        try {
            const user = await User.findByPk(req.session.userId);

            if (!user) {
                return res.redirect('/auth/login');
            }

            user.name = name;
            user.email = email;
            user.number = number;

            if (req.file) {
                user.image = req.file.path; // Save image path
            }

            await user.save();
            res.redirect('/user/profile');
        } catch (err) {
            console.error('Error updating profile:', err);
            res.redirect('/error');
        }
    }
}

module.exports = UserController;
