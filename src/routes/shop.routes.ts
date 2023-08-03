import { Request, Response, Router } from 'express';
import knex from 'knex';
import knexConfig from "../../database/knexfile";
import { CartItem, CheckoutBody, isVendorLocationParams } from "../utils/types";

const db = knex(knexConfig);

export default function (router: Router) {
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
    const { vendor_id, location_id, cart, customer_name, total } = _req.body as CheckoutBody;

    const vendorId = Number(vendor_id);
    const locationId = Number(location_id);
    const totalCost = Number(total);

    const vendor = await db('vendors_locations')
      .where({ vendor_id: vendorId, location_id: locationId })
      .first();

    if (!vendor) {
      return res.status(400).json({ message: 'Vendor is not assigned to this location.' });
    }

    const products = await db('products')
      .whereIn('id', cart.map(item => item.id))
      .andWhere('vendor_id', vendorId);

    if (products.length !== cart.length) {
      return res.status(400).json({ message: 'Some products in the cart do not belong to the vendor.' });
    }

    let orderId = Math.floor(Date.now() / 1000);

    const totalCostInCents = Math.round(totalCost * 100);
    const [order] = await db('orders')
      .insert({
        id: orderId,
        customer_name: customer_name,
        total: totalCostInCents,
        location_id: locationId
      })
      .returning('*');

    const orderItems = cart.map((item: CartItem) => ({
      id: orderId++,
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity
    }));

    await db('order_items').insert(orderItems);

    return res.status(201).json({ order, orderItems });
  });
}



