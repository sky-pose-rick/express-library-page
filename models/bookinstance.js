const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const BookInstanceSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, // reference to the associated book
  imprint: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
    default: 'Maintenance',
  },
  due_back: { type: Date, default: Date.now },
});

// Virtual for bookinstance's URL
BookInstanceSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/bookinstance/${this._id}`;
});

BookInstanceSchema.virtual('due_back_formatted').get(function () {
  return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

// virtual when putting the date in a form
BookInstanceSchema.virtual('due_back_form').get(function () {
  const dueFormatted = this.due_back ? DateTime.fromJSDate(this.due_back).toFormat('yyyy-MM-dd') : '';
  return dueFormatted;
});

// Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
