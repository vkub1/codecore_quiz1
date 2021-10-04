const faker = require("faker")
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('clucks').del()
    .then(function () {
      const clucks = [];
      for (let i=0; i<10; i++){
        clucks.push(
          {
            username: faker.name.firstName(),
            content: faker.company.catchPhrase(),
            image_url: faker.image.imageUrl(),
          }
        )
      }
      return knex('clucks').insert(clucks)
    });
};
