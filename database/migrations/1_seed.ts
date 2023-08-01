import { Knex } from 'knex'


const vendors = `
  INSERT INTO vendors (id, name) 
  VALUES 
  (1, 'Aquatic Adventures'),
  (2, 'Mr Bike'),
  (3, 'Ski Co')
`

const products = `
  INSERT INTO products (id, name, price, vendor_id)
  VALUES
  (1, 'Floaties', 5000, 1),
  (2, 'Sunscreen', 1000, 1),
  (3, 'Mountain Bike', 75000, 2),
  (4, 'Training wheels', 2000, 2),
  (5, 'Hamburger', 6500, 3),
  (6, 'Year Pass', 150000, 3)
`

const locations = `
  INSERT INTO locations (id, name)
  VALUES
  (1, 'Pinewview Reservoir'),
  (2, 'Park City')
`

const assignments = `
  INSERT INTO vendors_locations (id, vendor_id, location_id)
  VALUES
  (1, 1, 1),
  (2, 2, 1),
  (3, 3, 2)
`

export async function up(knex: Knex) {
  return Promise.all([
    knex.raw(vendors),
    knex.raw(products),
    knex.raw(locations),
    knex.raw(assignments),
  ])
}


export async function down() {
  throw new Error('Deprovisioning not supported, reset your database')
}

