/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('structures', (table) => {
    // Primary key UUID
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    
    // Name field with index
    table.string('name', 255).notNullable();
    table.index('name', 'idx_structures_name');
    
    // Self-referencing foreign key
    table.uuid('fk_parent_id').nullable();
    table.foreign('fk_parent_id')
      .references('id')
      .inTable('structures')
      .onDelete('SET NULL')
      .onUpdate('CASCADE');
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('structures');
};

