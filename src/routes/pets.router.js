const express = require('express');
const Pet = require('../models/pet.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit || '50', 10);
        const page = parseInt(req.query.page || '1', 10);
        const skip = (page - 1) * limit;

        const [total, pets] = await Promise.all([
            Pet.countDocuments(),
            Pet.find().skip(skip).limit(limit).lean()
        ]);

        return res.json({
            status: 'success',
            total,
            page,
            limit,
            payload: pets
        });
    } catch (error) {
        console.error('GET /api/pets error:', error);
        return res.status(500).json({ status: 'error', error: 'Error listando mascotas' });
    }
});

module.exports = router;
