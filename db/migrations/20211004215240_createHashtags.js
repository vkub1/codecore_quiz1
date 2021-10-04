
exports.up = function(knex) {
  return knex.schema.createTable('hashtags', table => {
      table.increments('id');
      table.string('tag');
      table.integer('count');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('hashtags');
};
