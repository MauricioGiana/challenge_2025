const { v4: uuidv4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Clear existing data
  await knex('structures').del();

  // Generate UUIDs for each structure
  const ids = {
    electronica: uuidv4(),
    computadoras: uuidv4(),
    celulares: uuidv4(),
    accesorios: uuidv4(),
    laptops: uuidv4(),
    desktops: uuidv4()
  };

  // Insert data in hierarchical order
  await knex('structures').insert([
    // Level 1: Root category
    {
      id: ids.electronica,
      name: 'Electrónica',
      fk_parent_id: null
    },
    // Level 2: Subcategories of Electrónica
    {
      id: ids.computadoras,
      name: 'Computadoras',
      fk_parent_id: ids.electronica
    },
    {
      id: ids.celulares,
      name: 'Celulares',
      fk_parent_id: ids.electronica
    },
    {
      id: ids.accesorios,
      name: 'Accesorios',
      fk_parent_id: ids.electronica
    },
    // Level 3: Subcategories of Computadoras
    {
      id: ids.laptops,
      name: 'Laptops',
      fk_parent_id: ids.computadoras
    },
    {
      id: ids.desktops,
      name: 'Desktops',
      fk_parent_id: ids.computadoras
    }
  ]);

  console.log('✅ Structures seeded successfully');
};

