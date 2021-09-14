const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const infoAssistantSchema = new Schema({
  // id: {
  //     type: Number,
  //     required: [true, "can't be blank"],
  //     unique: true
  // },
  serviceType: {
    type: Schema.Types.ObjectId,
    ref: "ServiceType",
  },
  problemObserve: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  images: [
    {
      image: {
        type: String,
      },
    },
  ],
  serviceTypes: [
    {
      type: Schema.Types.ObjectId,
      ref: "ServiceType",
    },
  ],
});
module.exports = mongoose.model("InfoAssistant", infoAssistantSchema);
