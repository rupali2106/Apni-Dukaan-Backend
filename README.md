# Apni Dukaan Backend

This is a E-commerce website MERN stack project is a full-fledged online shopping platform built using the MERN (MongoDB, Express.js, React, and Node.js) stack. The purpose of this project is to create an efficient and user-friendly web application that enables customers to browse, search, and purchase products from a wide range of categories. It also provides sellers with the ability to list their products, manage inventory, and process orders.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [API List](#api-list)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

**Key Features:**

1. **User Authentication:** Users can create accounts, log in, and maintain personalized profiles. This allows them to track their order history, save favorite products, and receive personalized recommendations.

2. **Product Catalog:** The website presents a comprehensive catalog of products, organized into categories and subcategories. Users can easily browse through various items, filter based on their preferences, and view detailed product descriptions.

3. **Shopping Cart:** Customers can add products to their shopping cart, view the cart contents, and adjust quantities before proceeding to checkout.

4. **Secure Payment Processing:** The project incorporates secure payment gateways to facilitate seamless and safe online transactions. Users can choose from various payment methods, such as credit/debit cards, digital wallets, or cash-on-delivery.

5. **Search Functionality:** An advanced search feature allows users to find specific products quickly. The search engine uses relevant filters to display accurate results based on keywords, category, price range, etc.

6. **Admin Dashboard:** An admin panel provides the site administrator with the tools to manage products, inventory, user accounts, and order processing. It also offers insights through analytics and sales reports.

7. **Order Tracking:** Customers can track the status of their orders, view shipping information, and receive notifications for important updates.

8. **Responsive Design:** The website is designed to be responsive and accessible on various devices, including desktops, tablets, and smartphones.


## Prerequisites

List all the required dependencies and tools that need to be installed on the system. For example:

- Node.js 
- npm or yarn 
- MongoDB 

## Getting Started

Instructions for setting up the project on a local machine.

### Installation

Step-by-step instructions on how to install the project locally.

1. Clone the repository:
   ```bash
   git clone https://github.com/Rjjha/Apni-Dukaan-Backend
   cd your-repo
2. Install dependencies:
   ```bash
   npm install

### Configuration

Step-by-step instructions on how to congifure the project locally.

1. Make an .env file and config with your own variables and key:
   ```bash
   PORT = 8000
   MONGO_URL = ************
   JWT_SECRET = ************
   CLOUD_NAME = ************
   API_KEY = ************
   API_SECRET = ************
   MERCHANT_ID = ************
   PUBLIC_KEY = ************
   PRIVATE_KEY = ************
2. Start the server:
   ```bash
   nodemon index.js

## Api Documentation

## API Endpoints

### Auth

- **POST /auth/login** - Takes username and password as parameters and returns JWT.
- **POST /auth/register** - Providing name, username, password, email, phone no and adddress would add a new user into the database.
- **POST /auth/forgot-password** - Takes a fav book, email as input and change password.
- **GET /auth/user-auth** - Takes authorization header and authorize the user.
- **GET /auth/admin-auth** - Takes authorization header with role and authorize the admin.
- **PUT/auth/profile** - Updates the User profile
- **GET /auth/orders** - Show orders of specific User
- **GET /auth/all-orders** - Show all the orders to the admin
- **PUT/auth/order-status/:orderId** - Admin Updates the orders status

### Category 

- **POST/category/create-category** - Admin can create a new category by taking category name as input.
- **PUT/category/update-category/:id** - Admin can change the category name by taking category id as req.params
- **GET/category/get-category** - For fetching all the categories of products.
- **GET/category/single-category/:slug** - Fetching single category by taking slug as params.
- **DELETE/category/delete-category/:id** - Deleting single category by taking id as params.

### Product
- **POST/product/create-product** - Admin can create a new product by taking category name, photo,price,quantity, description as input.
- **PUT/product/update-product/:id** - Admin can change the category_name ,price,photo etc by taking category id as req.params
- **GET/product/get-category** - For fetching all the products in the databse.
- **GET/product/single-product/:slug** - Fetching single product by taking slug as params.
- **DELETE/product/delete-product/:id** - Deleting single product by taking id as params.
- **GET/product/photo-product/:id** - For getting a single product photo by taking id as a params.
- **POST/product/filter-product** - Takes filter parameters as input and give all the filtered items/products.
- **GET/product/count-product** - Returns the total count of all products.
- **GET/product/list-product/:page** - This api is used for pagination, returns products upto a certain amount.
- **GET/product/search-product/:keyword** - Returns list of products which it gets from the keywords as a params.
- **GET/product/related-product/:pid/:cid** - Returns a list of products similar to the category belongs to the product.
- **GET/product/category-product/:slug** - Returns a list of products related to the same category.
- **GET/product/braintree/token** - Gives the braintree client token for the payment.
- **POST/product//braintree/payment** - This post request gets order from user after the payment.


## Technologies

**Major Technologies Used**

1. **Node.js**
2. **Express.js**
3. **MongoDB**
4. **Cloudinary**
5. **Braintree**

## Contributing 

You can contribute in this project by adding Ratings and reviews section.

## Licence 

This project is licensed under the **MIT License.**

## Contact
You can contact me with my Linkedin Id : [Rupali Das](https://www.linkedin.com/in/rupali-das-13483b291/).


 
