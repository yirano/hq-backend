import { Request, Response, Router } from 'express';
import knex from 'knex';
import knexConfig from "../../database/knexfile";
import { CartItem, isVendorLocationParams } from "../utils/types";

const db = knex(knexConfig);

export default function (router: Router) {
  router.get('/products', async (_req: Request, res: Response) => {
    try {
      const products = await db('products');
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving products', error: err });
    }
  });

  router.get('/locations/:location_id/vendors', async (_req: Request, res: Response) => {
    try {
      const { location_id } = _req.params;
      const locationId = Number(location_id);
      const vendors = await db('vendors_locations')
        .where({ location_id: locationId })
        .join('vendors', 'vendors_locations.vendor_id', '=', 'vendors.id')
        .select('vendors.id', 'vendors.name');
      res.json(vendors);
    } catch (err) {
      res.status(500).json({ message: 'Error retrieving vendors', error: err });
    }
  });

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

      const products = await db('products')
        .where({ vendor_id: vendorId });

      return res.json(products);
    }
  });

  router.post('/checkout', async (_req: Request, res: Response) => {
    return res.status(201).json("I HAVE TO REFACTOR THIS");
  });
}



