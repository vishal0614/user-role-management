# User and Role Management System

This project is a user and role management system built with NodeJs(NestJs), MongoDB, and ORM Mongoose.

## Modules

* **User Module**: Handles CRUD operations for users, including basic user details and a reference to the Role module.
* **Role Module**: Handles CRUD operations for roles, including roleName, access modules, createdAt, and active status and a reference to the Access Module.
* **Auth Module**: Handles Register and Login for users and used passport-jwt for authentication.

## APIs

### User APIs

* `GET /user`: Retrieves a list of users with populated roleName and access modules from the Role module.
* `POST /user`: Creates a new user.
* `GET /user/:user_id`: Retrieves a single user by ID.
* `PUT /user/:user_id`: Updates a single user.
* `DELETE /user/:user_id`: Deletes a single user.

### Role APIs

* `GET /role`: Retrieves a list of roles.
* `POST /role`: Creates a new role.
* `GET /role/:role_id`: Retrieves a single role by ID.
* `PUT /role/:role_id`: Updates a single role.
* `DELETE /role/:role_id`: Deletes a single role.

### Login and Signup APIs

* `POST /login`: Authenticates a user and returns a token.
* `POST /signup`: Creates a new user and returns a user details.

### Access Module APIs

* `PATCH /role/:role_id/access_modules`: Updates the list of access modules for a role, inserting only unique values.
* `DELETE /role/:role_id/access_modules/:module_id`: Remove the specific module from specific role and verify unique values.

### Bulk Update APIs

* `PATCH /user/update/all`: Updates multiple users with the same data.
* `PATCH /user/bulk_update/group`: Updates multiple users with different data.

### Data Seeding APIs

* `GET /seed_module`: API for seed module data in to the database. used module setup in a dynamic way so in future no trouble will araise if module data grows.
* `GET /seed_admin_role`: API for seed admin role to initial level usage.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/your-repo-name.git`
2. Install dependencies: `npm install`
4. Add environment file: 
    #JWT_SECRET_KEY=yourSuperSecretKey
    #JWT_EXPIRATION_TIME=3600s
    #DB_URL=yourMongoDBURL

3. Start the application: `npm run start:dev`
