const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

//HTTP methods: GET, POST, PUT, DELETE

//Parameter types:
//Query Params: request.query (filters, order, page, ...)
//Route Param : request.params (identificate a resource into the PUT or DELETE)
//Body: request.body ( Data to insert or update )

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/devs/search', SearchController.index);
routes.put('/devs', DevController.update);
routes.delete('/devs', DevController.destroy);

module.exports = routes;
