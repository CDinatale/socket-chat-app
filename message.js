const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;

let msgSchema = new Schema ({
  from_user : { type: String },
  room : { type: String },
  message: { type: String },
  date_sent: { type: String }
},{ typeKey: '$type' });

let Message = mongoose.model("Message", msgSchema);

let saveChat = ( sender, room, msg) => {
  const message = new Message({
    from_user: sender,
    room: room,
    message: msg,
    date: user.formatDate()
  });
  message.save()
  .then(message => {
    console.log("message saved to database");
  })
  .catch(err => {
    console.log("unable to save to database");
  });
};

module.exports = {
  Message,
  saveChat
}