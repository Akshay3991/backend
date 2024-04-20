import mongoose from 'mongoose';
const { Schema } = mongoose;

// const blogSchema = new mongoose.Schema({
//   title: String, // String is shorthand for {type: String}
//   author: String,
//   body: String,
// });
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// export const Blog = mongoose.model('Blog', blogSchema);
export const User = mongoose.model('User', UserSchema);