const USERS = "users";

exports.up = async function (knex) {
   await knex.schema.createTable(USERS, table => {
      table.increments("id");
      table.string("username", 128).notNullable().unique();
      table.string("password", 128).notNullable();
   });
};

exports.down = async function (knex) {
   await knex.schema.dropTableIfExists(USERS);
};
