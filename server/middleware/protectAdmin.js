const protectAdmin = (req, res, next) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        next();
    } else {
        return res.status(403).json({ message: 'Unauthorized access' }); 
    }
};

module.exports = protectAdmin;
