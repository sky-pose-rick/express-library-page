const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }
  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual('url').get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

// virtual for author's lifespan
AuthorSchema.virtual('lifespan').get(function () {
  if (!this.date_of_birth && !this.date_of_death) { return 'Uknown Lifespan'; }

  const birthFormatted = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
  const deathFormatted = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';

  return `${birthFormatted} - ${deathFormatted}`;
});

// virtual for author's birth date formatted for the form
AuthorSchema.virtual('date_of_birth_form').get(function () {
  const birthFormatted = this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toFormat('yyyy-MM-dd') : '';
  return birthFormatted;
});

// virtual for author's death date formatted for the form
AuthorSchema.virtual('date_of_death_form').get(function () {
  const deathFormatted = this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toFormat('yyyy-MM-dd') : '';
  return deathFormatted;
});

// Export model
module.exports = mongoose.model('Author', AuthorSchema);
