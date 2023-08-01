# HQ - API test

Welcome to your backend test for HQ, clone the repository and start by
following the instructions below.

# The goal

Create the necessary endpoints to integrate this backend with the frontend
version of the test.

## Provisioning your local environment

- Create a new postrges database called `hq_test`
- Copy `.env.example` into `.env`
- Initialize your local database by running `yarn migrate`

If migrate fails you may need to tweak the `.env` file to fit your local
installation of postgres.


## Endpoints needed

### Product retrieval

`GET` `/locations/:location_id/vendors/:vendor_id`

This endpoint would retrieve all the products of the vendor, 
the vendor must be assigned to that location via the `vendors_locations` 
table.


### Checkout

`POST` `/checkout`

This endpoint will take a cart array that contains products, along with
a `vendor_id` and a `location_id`, it should have validation to make sure
that the cart items belong to the vendor and that the vendor is associated
with the location.

After validation this endpoint should create the corresponding database
entries in both `orders` and `order_items` tables.


## Bonus points

This is not needed for the test but would gain you extra points if you
manage to fit it within the allocated time.

- Create integration tests for the endpoints using Jest
