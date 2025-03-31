const db = require('../config/db');

// Get all doctors with pagination
exports.getAllDoctors = async (req, res) => {
    const { pageNum } = req.body;

    if (!pageNum || isNaN(pageNum)) {
        return res.status(400).json({
            ok: false,
            message: "Invalid page number provided",
        });
    }

    const page = Math.max(1, parseInt(pageNum));
    const offset = (page - 1) * 6;

    try {
        const countResult = await db.one("SELECT COUNT(*) as total FROM doctors");
        const total = parseInt(countResult.total) || 0;

        const query = "SELECT id, name, specialty, experience, rating, image FROM doctors ORDER BY rating DESC LIMIT 6 OFFSET $1";
        const result = await db.any(query, [offset]);

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total: total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while fetching doctors",
        });
    }
};

// Filter doctors
exports.filterDoctors = async (req, res) => {
    const { rating, experience, gender } = req.query;
    const { pageNum } = req.body;
    const page = Math.max(1, parseInt(pageNum || 1));
    const offset = (page - 1) * 6;

    try {
        let conditions = [];
        let queryParams = [];
        let paramCounter = 1;

        if (rating) {
            conditions.push(`rating <= $${paramCounter}`);
            queryParams.push(parseFloat(rating));
            paramCounter++;
        }

        if (experience) {
            conditions.push(`experience >= $${paramCounter}`);
            queryParams.push(parseInt(experience));
            paramCounter++;
        }

        if (gender) {
            conditions.push(`gender = $${paramCounter}`);
            queryParams.push(gender);
            paramCounter++;
        }

        const whereClause = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";
        // WHERE rating<=3 AND gender='female' AND experience=10
       
        const baseQuery = `SELECT id, name, specialty, experience, rating, image 
                           FROM doctors${whereClause} 
                           ORDER BY rating DESC LIMIT 6 OFFSET $${paramCounter}`;

        const countQuery = `SELECT COUNT(*) as total 
                            FROM doctors${whereClause}`;

        queryParams.push(offset);

        const countResult = await db.one(countQuery, queryParams.slice(0, -1));
        const total = parseInt(countResult.total) || 0;

        const result = await db.any(baseQuery, queryParams);

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while filtering doctors: " + error.message,
        });
    }
};

// Search doctors
exports.searchDoctors = async (req, res) => {
    const { q, page } = req.query;

    const pageNum = Math.max(1, parseInt(page || 1));
    const offset = (pageNum - 1) * 6;

    try {
        const searchPattern = `%${q}%`;

        const query = `
            SELECT id, name, specialty, experience, rating, image 
            FROM doctors 
            WHERE name ILIKE $1 OR specialty ILIKE $1
            ORDER BY rating DESC
            LIMIT 6 OFFSET $2
        `;

        const countQuery = `
            SELECT COUNT(*) as total 
            FROM doctors 
            WHERE name ILIKE $1 OR specialty ILIKE $1
        `;

        const countResult = await db.one(countQuery, [searchPattern]);
        const total = parseInt(countResult.total) || 0;

        const result = await db.any(query, [searchPattern, offset]);

        return res.status(200).json({
            ok: true,
            data: {
                rows: result,
                total,
            },
        });
    } catch (error) {
        console.error("Database error:", error.message);
        return res.status(500).json({
            ok: false,
            message: "An error occurred while searching doctors: " + error.message,
        });
    }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doctor = await db.one('SELECT * FROM doctors WHERE id = $1', [id]);
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error: error.message });
    }
};