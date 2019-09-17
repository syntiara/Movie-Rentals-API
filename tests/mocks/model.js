const mongoose = require('mongoose');
const movieId = new mongoose.Types.ObjectId();
const customerId = new mongoose.Types.ObjectId();

const models = {
    genres: [
        { name: 'Genre1'},
        { name: 'Genre2'},
        { name: 'Genre3'},
        { name: 'Genre4'},
        { name: 'Genre5'}
    ],
    rental: {
        customer: { 
            _id:customerId, 
            name: 'Ammie Patrick', 
            phone: '08022234567'
        },
        movie: {
             _id: movieId,
             title: 'Jennifer diary',
             dailyRentalRate: 2,
        }
    },
    movie: {
        _id: movieId,
        title: 'Jennifer diary',
        dailyRentalRate: 2,
        genre: { name: 'comedy' },
        numberInStock: 10 
      },
    userPayload: {
        _id: new mongoose.Types.ObjectId().toHexString(), 
        isAdmin: true 
     }
}; 

module.exports.models = models;
module.exports.movieId = movieId;
module.exports.customerId = customerId; 

