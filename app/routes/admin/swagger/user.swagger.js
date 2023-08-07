/**
 * @swagger
 *  components:
 *      schemas:
 *          Update-Profile:
 *              type: object
 *              properties:
 *                  first_name:
 *                      type: string
 *                      description: the first_name of user
 *                      example: Erfan
 *                  last_name:
 *                      type: string
 *                      description: the last_name of user
 *                      example: Yousefi
 *                  email:
 *                      type: string
 *                      description: the email of user
 *                      example: erfanyousefi@gmail.com
 *                  username:
 *                      type: string
 *                      example: erfanyousefi
 *                      description: the username of user
 *                  image:
 *                      type: file
 *                      description: the avatar of user
 *          Create-User:
 *              type: object
 *              required:
 *                  -   mobile
 *                  -   email
 *                  -   username
 *              properties:
 *                  first_name:
 *                      type: string
 *                      description: the first_name of user
 *                      example: Erfan
 *                  last_name:
 *                      type: string
 *                      description: the last_name of user
 *                      example: Yousefi
 *                  mobile:
 *                      type: string
 *                      description: the mobile of user
 *                      example: 09385051602
 *                  email:
 *                      type: string
 *                      description: the email of user
 *                      example: erfanyousefi@gmail.com
 *                  username:
 *                      type: string
 *                      example: erfanyousefi
 *                      description: the username of user
 *                  image:
 *                      type: file
 *                      description: the avatar of user
 *                      
 */

/**
 * @swagger
 *  definitions:
 *      ListOfUsers:
 *          type: object
 *          properties:
 *              statusCode: 
 *                  type: integer
 *                  example: 200
 *              data:
 *                  type: object
 *                  properties:
 *                      users:
 *                          type: array
 *                          items:
 *                              type: object
 *                              properties:
 *                                  _id:
 *                                      type: string
 *                                      example: "62822e4ff68cdded54aa928d"
 *                                  first_name:
 *                                      type: string
 *                                      example: "user first_name"
 *                                  last_name:
 *                                      type: string
 *                                      example: "user last_name"
 *                                  username:
 *                                      type: string
 *                                      example: "username"
 *                                  email:
 *                                      type: string
 *                                      example: "the_user_email@example.com"
 *                                  mobile:
 *                                      type: string
 *                                      example: "09332255768"
 */

/**
 * @swagger
 *  /admin/users/add:
 *      post:
 *          tags: [Users(Admin-Panel)]
 *          summary: create a new user
 *          requestBody:
 *              content:
 *                  multipart/form-data:
 *                      schema: 
 *                          $ref: '#/components/schemas/Create-User'
 *          responses:
 *              201:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/publicDefinition'
 */


/**
 * @swagger
 *  /admin/users/all:
 *      get:
 *          tags: [Users(Admin-Panel)]
 *          summary: get all of users
 *          parameters:
 *              -   in: query
 *                  name: search
 *                  type: string
 *                  description: search in user first_name, last_name, username, mobile, email
 *          responses :
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema:
 *                              $ref: '#/definitions/ListOfUsers'
 */


/**
 * @swagger
 *  /admin/users/profile:
 *      get:
 *          tags: [Users(Admin-Panel)]
 *          summary: get user profile
 *          responses :
 *              200:
 *                  description: success
 */

/**
 * @swagger
 *  /admin/users/update-profile:
 *      patch:
 *          tags: [Users(Admin-Panel)]
 *          summary: update user detail and profile
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data: 
 *                      schema:
 *                          $ref: '#/components/schemas/Update-Profile'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/publicDefinition'
 */


/**
 * @swagger
 *  /admin/users/update/{id}:
 *      patch:
 *          tags: [Users(Admin-Panel)]
 *          summary: update user detail
 *          parameters:
 *              -   in: path
 *                  name: id 
 *                  type: string
 *                  required: true
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data: 
 *                      schema:
 *                          $ref: '#/components/schemas/Update-Profile'
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/publicDefinition'
 */


/**
 * @swagger
 *  /admin/users/{id}:
 *      get:
 *          tags: [Users(Admin-Panel)]
 *          summary: get user by id
 *          parameters:
 *              -   in: path
 *                  name: id 
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: success
 *                  content:
 *                      application/json:
 *                          schema: 
 *                              $ref: '#/definitions/publicDefinition'
 */


/**
 * @swagger
 *  /admin/users/remove/{id}:
 *      delete:
 *          tags: [Users(Admin-Panel)]
 *          summary: Delete User by userId
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: string
 *                  required: true
 *          responses:
 *              200:
 *                  description: GET success
 *              404:
 *                  description: Not found
 *              500:
 *                  description: INTERNAL SERVER ERROR
 */
