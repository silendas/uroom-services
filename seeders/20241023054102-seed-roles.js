// seeders/20241023054102-seed-roles.js
'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        name: 'Administrator',
        created_by: 'system',
        updated_by: 'system',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false,
      },
      {
        id: 2,
        name: 'User',
        created_by: 'system',
        updated_by: 'system',
        created_at: new Date(),
        updated_at: new Date(),
        deleted: false,
      },
      // Tambahkan lebih banyak role jika diperlukan
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  },
};
