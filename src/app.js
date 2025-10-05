const express = require('express');
const morgan = require('morgan');
const { conectarDB } = require('./db');

const mocksRouter = require('./routes/mocks.router');
const usersRouter = require('./routes/users.router');
const petsRouter = require('./routes/pets.router');

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas base
app.use('/api/mocks', mocksRouter); // requerido por la consigna
app.use('/api/users', usersRouter); // para verificar inserciones
app.use('/api/pets', petsRouter);  // para verificar inserciones

// Arranque + DB
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

(async () => {
    try {
        await conectarDB(MONGODB_URI); // dbName interno: coder_backend3
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Error inicializando app:', err);
        process.exit(1);
    }
})();

module.exports = app;
