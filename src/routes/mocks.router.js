const express = require('express');
const router = express.Router();

const { faker } = require('@faker-js/faker'); // 👈 necesario en este archivo
const User = require('../models/user.model');
const Pet = require('../models/pet.model');

const {
    generarUsuariosMock,
    generarPetsMock,
    PASSWORD_HASH,
    ESPECIES,
} = require('../mocking/mocking.utils');

/**
 * GET /api/mocks/mockingpets
 * Devuelve mascotas mock (NO inserta en DB).
 * Permite ?qty=numero (default 100)
 */
router.get('/mockingpets', async (req, res) => {
    try {
        const qty = parseInt(req.query.qty || '100', 10);
        const data = generarPetsMock(qty);
        return res.json({ status: 'success', payload: data, qty });
    } catch (error) {
        console.error('Error /mockingpets:', error);
        return res.status(500).json({ status: 'error', error: 'Error generando mascotas mock' });
    }
});

/**
 * GET /api/mocks/mockingusers
 * Genera usuarios mock en memoria (NO inserta en DB).
 * Por consigna: 50 usuarios (permite ?qty=numero)
 */
router.get('/mockingusers', async (req, res) => {
    try {
        const qty = parseInt(req.query.qty || '50', 10);
        const data = generarUsuariosMock(qty);
        return res.json({ status: 'success', payload: data, qty });
    } catch (error) {
        console.error('Error /mockingusers:', error);
        return res.status(500).json({ status: 'error', error: 'Error generando usuarios mock' });
    }
});

/**
 * POST /api/mocks/generateData
 * Body JSON: { "users": number, "pets": number }
 * Genera e INSERTA en la DB la cantidad indicada.
 * - Usuarios con password "coder123" encriptada y pets: []
 * - Mascotas con owner aleatorio entre los usuarios creados (si hay)
 * - Emails únicos + insertMany({ ordered:false }) para tolerar duplicados
 */
router.post('/generateData', async (req, res) => {
    try {
        const usersQty = parseInt(req.body.users || '0', 10);
        const petsQty = parseInt(req.body.pets || '0', 10);

        if (Number.isNaN(usersQty) || Number.isNaN(petsQty) || usersQty < 0 || petsQty < 0) {
            return res.status(400).json({ status: 'error', error: 'Parámetros inválidos: users y pets deben ser números >= 0' });
        }

        // ---------- 1) Usuarios ----------
        const usuariosAInsertar = [];
        const usados = new Set(); // emails del mismo batch

        for (let i = 0; i < usersQty; i++) {
            const first = faker.person.firstName().toLowerCase();
            const last = faker.person.lastName().toLowerCase();

            let email = `${first}.${last}.${faker.string.alpha(4)}${faker.number.int({ min: 1000, max: 9999 })}@mail.test`;
            while (usados.has(email)) {
                email = `${first}.${last}.${faker.string.alpha(4)}${faker.number.int({ min: 1000, max: 9999 })}@mail.test`;
            }
            usados.add(email);

            usuariosAInsertar.push({
                first_name: first.charAt(0).toUpperCase() + first.slice(1),
                last_name: last.charAt(0).toUpperCase() + last.slice(1),
                email,
                password: PASSWORD_HASH, // “coder123” hasheada
                role: Math.random() < 0.15 ? 'admin' : 'user',
                pets: [],
            });
        }

        const usuariosInsertados = usersQty > 0
            ? await User.insertMany(usuariosAInsertar, { ordered: false })
            : [];

        // ---------- 2) Mascotas ----------
        const mascotasAInsertar = [];
        for (let i = 0; i < petsQty; i++) {
            let owner = null;
            if (usuariosInsertados.length > 0 && Math.random() < 0.5) {
                owner = faker.helpers.arrayElement(usuariosInsertados)._id;
            }
            mascotasAInsertar.push({
                name: faker.animal.petName(),
                specie: faker.helpers.arrayElement(ESPECIES),
                adopted: Math.random() < 0.35,
                birthDate: faker.date.birthdate({ min: 0, max: 15, mode: 'age' }),
                image: faker.image.urlPicsumPhotos(),
                owner,
            });
        }

        const mascotasInsertadas = petsQty > 0
            ? await Pet.insertMany(mascotasAInsertar, { ordered: false })
            : [];

        // ---------- 3) Sincronizar array pets de los dueños ----------
        if (mascotasInsertadas.length > 0) {
            const ownersMap = new Map();
            for (const m of mascotasInsertadas) {
                if (!m.owner) continue;
                const k = String(m.owner);
                if (!ownersMap.has(k)) ownersMap.set(k, []);
                ownersMap.get(k).push(m._id);
            }
            await Promise.all(
                Array.from(ownersMap.entries()).map(([ownerId, petIds]) =>
                    User.findByIdAndUpdate(ownerId, { $push: { pets: { $each: petIds } } })
                )
            );
        }

        return res.json({
            status: 'success',
            inserted: {
                users: usuariosInsertados.length,
                pets: mascotasInsertadas.length,
            },
            hint: 'Verificá con GET /api/users y GET /api/pets',
        });
    } catch (error) {
        console.error('Error /generateData:', error);
        return res.status(500).json({
            status: 'error',
            error: 'Error generando e insertando datos en la DB',
            detail: error?.message || String(error), // 👈 visibilidad para depurar si algo pasa
        });
    }
});

module.exports = router;
