class User {
  constructor() {
    this.globalArray = []; // array of all users
  }

  addUser(socketId, userId, room) {
    const user = { socketId, userId, room }; //short hand es6
    this.globalArray.push(user); // add user to global array
    return user; // return data of added user
  }

  getUser(socketId) {
    const user = this.globalArray.filter(
      (user) => user.socketId === socketId)[0]; // get user by socketId
    return user; // return data of user depending on his socket id
  }

  removeUser(socketId) {
    const user = this.getUser(socketId); // get user by socketId
    if (user) {
      this.globalArray = this.globalArray.filter(
        (user) => user.socketId !== socketId // remove user from global array
      );
    }
    return user; // return data of removed user
  }

  getUsers(room) {
    const usersInRoom = this.globalArray.filter((user) => user.room === room); // get all users in room
    const onlineUsersIds = usersInRoom.map((user) => user.userId); // get all user ids in room
    return onlineUsersIds; // return Array of online users identifiers
  }
}

module.exports = { User };
