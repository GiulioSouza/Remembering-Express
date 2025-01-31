/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("users", (table) => {
        table.boolean("active")
      }).then(() => {
        return knex("users").update({ active: true})
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("users", (table) => {
        table.dropColumn("active")
      })
};
