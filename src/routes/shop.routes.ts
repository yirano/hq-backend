import { Request, Response, Router } from 'express';
import knex, { Knex } from 'knex';
import knexConfig from "../../database/knexfile";
import { Orders, isVendorLocationParams } from "../utils/types";

const db = knex(knexConfig);

const getProductsWithLocation = (queryBuilder: Knex.QueryBuilder) => {
  return queryBuilder
    .join("vendors_locations", "products.vendor_id", "vendors_locations.vendor_id")
    .select('products.id', 'products.name', 'products.price', 'products.vendor_id', 'vendors_locations.location_id');
};

export default function (router: Router) {
  // GET request for all products
  router.get('/products', async (_req: Request, res: Response) => {
    try {
      const products = await getProductsWithLocation(db('products'));
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving products', error: err });
    }
  });

  // GET request for products by location + vendor
  router.get('/locations/:location_id/vendors/:vendor_id', async (_req: Request, res: Response) => {

    if (isVendorLocationParams(_req.params)) {
      const { location_id, vendor_id } = _req.params;

      const locationId = Number(location_id);
      const vendorId = Number(vendor_id);

      const vendor = await db('vendors_locations')
        .where({ vendor_id: vendorId, location_id: locationId })
        .first();

      if (!vendor) {
        return res.status(400).json({ message: 'Vendor is not assigned to this location.' });
      }

      const products = await getProductsWithLocation(db('products'))
        .where("products.vendor_id", vendorId);

      return res.json(products);
    }
  });

  // GET request for vendors by location
  router.get('/locations/:location_id/vendors', async (_req: Request, res: Response) => {
    try {
      const { location_id } = _req.params;
      const locationId = Number(location_id);
      const vendors = await db('vendors_locations')
        .where({ location_id: locationId })
        .join('vendors', 'vendors.id', 'vendors_locations.vendor_id')
        .select('vendors.id', 'vendors.name');
      res.json(vendors);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving vendors', error: err });
    }
  });

  // POST request for checkout
  router.post('/checkout', async (_req: Request, res: Response) => {
    const orders = _req.body;
    const { cart, customer_name, total } = orders;
    const result: Orders[] = [];

    try {
      await db.transaction(async trx => {
        for (const item of cart) {
          const { id, vendor_id, location_id } = item;

          // Validate that product is available at vendor 
          const product = await trx('products').where({ id, vendor_id }).first();
          if (!product) {
            return res.status(400).json({ message: 'Product is not available at this vendor.' });
          }

          // Validate that vendor is assigned to location
          const vendor = await trx('vendors_locations').where({ vendor_id, location_id }).first();
          if (!vendor) {
            return res.status(400).json({ message: 'Vendor is not assigned to this location.' });
          }
        }
        // Add order to orders table
        let orderId = Math.floor(Date.now() / 1000);
        const [order] = await trx('orders')
          .insert({
            id: orderId,
            customer_name: customer_name,
            total: total,
          })
          .returning('*');

        for (const item of cart) {
          const { id, quantity } = item;
          await trx('order_items')
            .insert({
              id: orderId++,
              product_id: id,
              quantity: quantity,
              order_id: order.id,
            });
        }

        result.push(order);
      });
      return res.status(201).json({ success: true, result });

    } catch (err) {
      const error = err as Error;
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  });
}



