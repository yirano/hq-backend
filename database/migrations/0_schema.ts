import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('vendors', table => {
    table.integer('id').primary();
    table.text('name').notNullable();
  });

  await knex.schema.createTable('locations', table => {
    table.integer('id').primary();
    table.text('name').notNullable();
  });

  await knex.schema.createTable('vendors_locations', table => {
    table.integer('id').primary();
    table.integer('vendor_id').references('vendors.id');
    table.integer('location_id').references('locations.id');
  });

  await knex.schema.createTable('products', table => {
    table.integer('id').primary();
    table.text('name').notNullable();
    table.integer('price').notNullable(); // cents
    table.integer('vendor_id').references('vendors.id');
  });

  await knex.schema.createTable('orders', table => {
    table.integer('id').primary();
    table.text('customer_name').notNullable();
    table.integer('total').notNullable(); // cents
    table.integer('location_id').references('locations.id');
  });

  await knex.schema.createTable('order_items', table => {
    table.integer('id').primary();
    table.integer('product_id').references('products.id');
    table.integer('quantity').notNullable();
    table.integer('order_id').references('orders.id');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('order_items');
  await knex.schema.dropTable('orders');
  await knex.schema.dropTable('products');
  await knex.schema.dropTable('vendors_locations');
  await knex.schema.dropTable('locations');
  await knex.schema.dropTable('vendors');
}

