
exports.up = function(knex) {
  return knex.schema.createTable('clucks', table => {
    table.increments('id');
    table.string('username');
    table.text('image_url');
    table.text('content');
    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('clucks')
};
