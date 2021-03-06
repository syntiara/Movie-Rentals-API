import Joi from 'joi';
import mongoose from 'mongoose';
import { clientSchema } from './client';

const rentalSchema = new mongoose.Schema({
  client: {
    type: clientSchema,
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
      }
    }),
    required: true
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now()
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

rentalSchema.statics.lookUpRental = function (clientId, movieId) {
     return  this.findOne({
        'client._id': clientId, 
        'movie._id': movieId
      });
}

rentalSchema.methods.calcRentalFee = function() {
    this.dateReturned = new Date();
    
    this.dateOut = new Date().setDate(new Date().getDate()-10);
    this.rentalFee =  this.dateOut.getDate() * this.movie.dailyRentalRate;

}
//to create a class model/ table from the schema
export const Rental = mongoose.model("Rental", rentalSchema);

export const validate = rental => {
  const schema = {
    //to validate the obejct ids
    clientId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };
  return Joi.validate(rental, schema);
}