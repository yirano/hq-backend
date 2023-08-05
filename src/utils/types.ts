
export type VendorId = number;
export type LocationId = number;

export type Orders = {
  cart: CartItem[];
  customer_name: string;
  total: number;
};

export interface CartItem {
  id: number;
  quantity: number;
}

export interface CheckoutBody {
  vendor_id: string;
  location_id: string;
  cart: CartItem[];
  customer_name: string;
  total: string;
}

interface VendorLocationParams {
  location_id: VendorId;
  vendor_id: LocationId;
}

export const isVendorLocationParams = (params: any): params is VendorLocationParams => {
  return 'location_id' in params && 'vendor_id' in params;
};
