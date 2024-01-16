// Purpose: Define the user model for the application.
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

// Define a method for the userSchema model.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered password with the hashed password stored in the database.
  // The `bcrypt.compare` method takes in the plaintext password and the hashed password,
  // and returns a boolean indicating whether they match.
  return await bcrypt.compare(enteredPassword, this.password);
};

// Define a Mongoose pre-save middleware for the userSchema.
userSchema.pre("save", async function (next) {
  // Check if the document (or specifically the password) has not been modified.
  // If it hasn't, move on to the next middleware or save operation.

  /* if (!this.isModified) { */
  if (!this.isModified("password")) {
    next();
  }

  // Generate a salt using bcrypt with 10 rounds.
  // Salts are used to ensure unique hashed outputs, even for the same input values.
  const salt = await bcrypt.genSalt(10);

  // Hash the user's plaintext password with the generated salt.
  // Overwrite the plaintext password with the hashed version
  // to ensure the original password isn't stored in the database.
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
