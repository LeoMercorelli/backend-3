const mongoose = require('mongoose');

async function conectarDB(uri) {
    await mongoose.connect(uri, {
        dbName: 'coder_backend3',
    });
    console.log('✅ Conectado a MongoDB (db: coder_backend3)');
}

module.exports = { conectarDB };
