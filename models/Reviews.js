const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: 100,
    required: [true, 'Please add a title for the review'],
  },
  text: {
    type: String,
    require: [true, 'Please add a some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 - 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

ReviewSchema.statics.getAverageRating = async function (bootcampid) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampid },
    },
    {
      $group: {
        _id: 'bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampid, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
