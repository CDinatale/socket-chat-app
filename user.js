  
const moment = require('moment');
const userList = [];

function userJoin(id, username, room) {
  const user = { id, username, room };
  userList.push(user);
  return user;
}

function getCurrentUser(id) {
  return userList.find(user => user.id === id);
}

function userLeave(id) {
  const index = userList.findIndex(user => user.id === id);

  if (index !== -1) {
    return userList.splice(index, 1)[0];
  }
}

function getRoomUsers(room) {
  return userList.filter(user => user.room === room);
}

function formatDate(){
  return moment().format('L h:mm a')
}

function formatMessage(username, text) {
  return {
    username,
    text,
    time: formatDate()
  };
}


module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatDate,
  formatMessage
};