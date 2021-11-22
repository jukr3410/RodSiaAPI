const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET || "JWT_SUPER_SECRET";

const Schema = mongoose.Schema;

const garageSchema = new Schema(
  {
    // id: {
    //     type: Number,
    //     required: [true, "can't be blank"],
    // },
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "can't be blank"],
      unique: true,
      match: [/^[0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      //match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
    },
    otp: {
      type: String,
    },
    validatePhone: {
      type: Boolean,
      required: true,
    },
    address: {
      addressDesc: {
        type: String,
      },
      geoLocation: {
        lat: {
          type: String,
        },
        long: {
          type: String,
        },
      },
    },
    openStatus: {
      type: Boolean,
    },
    openingHour: {
      open: {
        type: String,
      },
      close: {
        type: String,
      },
    },
    openingDayOfWeek: {
      mo: {
        type: Boolean,
      },
      tu: {
        type: Boolean,
      },
      we: {
        type: Boolean,
      },
      th: {
        type: Boolean,
      },
      fr: {
        type: Boolean,
      },
      sa: {
        type: Boolean,
      },
      su: {
        type: Boolean,
      },
    },
    logoImage: {
      type: String,
    },
    images: [
      {
        image: {
          type: String,
        },
      },
    ],
    typeCarRepairs: [
      {
        type: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

garageSchema.path("password", {
  // เข้ารหัส password ด้วย hash ที่นี้ password จะไม่ใช่ string แล้ว
  // จะดึงก็ต้อง this.password.toObject() หรือ this.get('password')

  set: function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return hashedPassword;
  },
});

module.exports = mongoose.model("Garage", garageSchema);

module.exports.isValidPassword = async (
  inputPassword,
  hashPassword,
) => {
  var result = await bcrypt.compareSync(
    String(inputPassword),
    String(hashPassword),
  );
  console.log(result);
  return result;

};
