const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const PASSWORD_PLANA = 'coder123';
const PASSWORD_HASH = bcrypt.hashSync(PASSWORD_PLANA, 10);

const ESPECIES = ['dog', 'cat', 'hamster', 'parrot', 'turtle', 'rabbit', 'fish'];

function generarUsuarioMock() {
    const role = Math.random() < 0.15 ? 'admin' : 'user';
    return {
        _id: faker.database.mongodbObjectId(), // para “parecer Mongo” en mocks
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email().toLowerCase(),
        password: PASSWORD_HASH,
        role,
        pets: [],
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    };
}

function generarUsuariosMock(n = 50) {
    return Array.from({ length: n }, generarUsuarioMock);
}

function generarPetMock() {
    const specie = faker.helpers.arrayElement(ESPECIES);
    return {
        _id: faker.database.mongodbObjectId(),
        name: faker.animal.petName(),
        specie,
        adopted: faker.datatype.boolean({ probability: 0.35 }),
        birthDate: faker.date.birthdate({ min: 0, max: 15, mode: 'age' }),
        image: faker.image.urlPicsumPhotos(),
        owner: null,
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    };
}

function generarPetsMock(n = 100) {
    return Array.from({ length: n }, generarPetMock);
}

module.exports = {
    generarUsuarioMock,
    generarUsuariosMock,
    generarPetMock,
    generarPetsMock,
    PASSWORD_HASH,
    ESPECIES,
};
