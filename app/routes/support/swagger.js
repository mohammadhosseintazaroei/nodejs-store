/**
 * @swagger
 *  components:
 *      schemas:
 *          Namespace:
 *              type: object
 *              required:
 *                  -   title
 *                  -   endpoint
 *              properties:
 *                  title:
 *                      type: string
 *                      example: the title of namespace
 *                  endpoint:
 *                      type: string
 *                      example: the endpoint of namespace
 *          Room:
 *              type: object
 *              required:
 *                  -   name
 *                  -   description
 *                  -   namespace
 *              properties:
 *                  name:
 *                      type: string
 *                      example: the name of room
 *                  description:
 *                      type: string
 *                      example: the description of room
 *                  image:
 *                      type: file
 *                      description: the image of the room
 *                  namespace:
 *                      type: string
 *                      description: namespace of conversation
 */

/**
 * @swagger
 *  /support/namespace/add:
 *      post:
 *          tags: [Support]
 *          summary: add namespaces for chatroom
 *          requestBody:
 *              required: true
 *              content:
 *                  application/x-www-form-urlencoded:
 *                      schema:
 *                          $ref: '#components/schemas/Namespace'
 *          responses:
 *              201:
 *                  description: SUCCESS
 *                  content:
 *                      application/json:
 *                              schema:
 *                                  $ref: '#/definitions/publicDefinition'
 */

/**
 * @swagger
 *  /support/room/add:
 *      post:
 *          tags: [Support]
 *          summary: add romm in namespace for chatrooom
 *          requestBody:
 *              required: true
 *              content:
 *                  multipart/form-data:
 *                      schema:
 *                          $ref: '#components/schemas/Room'
 *          responses:
 *              201:
 *                  description: SUCCESS
 *                  content:
 *                      application/json:
 *                              schema:
 *                                  $ref: '#/definitions/publicDefinition'
 */
