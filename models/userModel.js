import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    nickName: {
      type: String,
      // required: true,
    },
    username: {
      type: String,
      // required: true,
      unique: true,
      sparse: true,
      trim: true,
      minlength: 8,
    },
    phone: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      // required: true,
      minlength: 8, // You can adjust password policy here
    },
    avatar: {
      type: String,
      default: "",
    },
    dob: {
      type: Date,
      // required:true
    },
    gender: {
      type: String,
      // required:true
    },
    otp: {
      type: Number,
    },
    newUser: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      type: String,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to posts
      },
    ],
    intersts: [String],
    zodiac: [String],
    religion: [String],
    dietaryPreferences: [String],
    launguages: [String],
    musicPrefrence: [String],
    moviePrefrence: [String],
    sportsPrefrence: [String],
    petPrefrence: [String],
    drinkingPrefrence: [String],
    smokingPrefrence: [String],
    trevelPrefrence: [String],
    statePrefrence: [String],
    agePrefrence: [String],
    socialmediaPresence: [String],
    sleepingHabits: [String],
    athlaticPrefrence: [String],
    workPrefrence: [String],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
