const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit || '50', 10);
        const page = parseInt(req.query.page || '1', 10);
        const skip = (page - 1) * limit;

        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find().skip(skip).limit(limit).lean()
        ]);

        return res.json({
            status: 'success',
            total,
            page,
            limit,
            payload: users
        });
    } catch (error) {
        console.error('GET /api/users error:', error);
        return res.status(500).json({ status: 'error', error: 'Error listando usuarios' });
    }
});

module.exports = router;
