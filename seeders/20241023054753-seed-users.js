'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('adm@M2024*$S1', 10); // Ganti dengan password yang diinginkan
    await queryInterface.bulkInsert('Users', [
      {
        id: 1,
        npm: '123456789',
        name: 'Administrator',
        email: 'admin@example.com',
        username: 'admin',
        password: hashedPassword,
        approved: true,
        actived: true,
        role_id: 1, // role_id untuk Administrator
        created_by: 'system',
        updated_by: 'system',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
