const axios = require('axios');
const Dev = require('../models/Dev');

const { findConnections, sendMessage } = require('../websocket');

//index, show, store, update, destroy

module.exports = {
    async index(request, response){
        const devs = await Dev.find();
        return response.json(devs);
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;
        let dev = await Dev.findOne({ github_username});

        if(!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            const { name, avatar_url, bio } = apiResponse.data;

            const location = {
                type: 'Point',
                coordinates: [latitude, longitude]
            };
    
            dev = await Dev.create({
                name,
                github_username,
                avatar_url,
                bio,
                techs,
                location
            });
            
            //send the dev to the connection that are currently looking 
            //for devs like the create one.
            const connectionsToSendNewDev = findConnections({ latitude, longitude}, techs);
            sendMessage(connectionsToSendNewDev, 'new-dev', dev);
        }

        return response.json(dev);
    },

    async update(request, response) {
        //update the dev information based on the json sent by the client
        const req_dev = request.body;
        const filter = { github_username : req_dev.github_username };
        const update = {};
        
        //name
        if(req_dev.name){
            update.name = req_dev.name
        }

        //avatar_url
        if(req_dev.avatar_url){
            update.avatar_url = req_dev.avatar_url;
        }

        //bio
        if(req_dev.bio){
            update.bio = req_dev.bio;
        }

        //location
        if(req_dev.location){
            update.location = req_dev.location;
        }

        //techs
        if(req_dev.techs){
            update.techs = req_dev.techs;
        }

        //update the needed infomation
        const dev = await Dev.findOneAndUpdate(filter, update, { new: true } );

        return response.json( dev );
    },

    async destroy(request, response){
        const filter = { github_username : request.body.github_username };
        const dev = await Dev.findOneAndDelete(filter);
        return response.json( dev );
    }
}