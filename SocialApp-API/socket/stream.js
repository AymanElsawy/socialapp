module.exports = function (io, User, _) {
  const user = new User();

  io.on("connection", (socket) => {
    socket.on("refresh", (data) => {
      io.emit("refreshPage", {}); // emit to all clients
    }); // refresh page

    socket.on("online", (data) => {
      socket.join(data.room); // join room
      user.addUser(socket.id, data.userId, data.room); // add user to global array
      const onlineUsers = user.getUsers(data.room); // get all online users in room
      io.emit("onlineUsers", _.uniq(onlineUsers)); // emit to all clients
    }); // when user is online

    socket.on('disconnect', () => {  
      const removedUser = user.removeUser(socket.id); // remove user from global array
      if (removedUser) {  
        let onlineUsers = user.getUsers(removedUser.room); // get all online users in room
        onlineUsers = _.uniq(onlineUsers); // remove duplicate users
        _.remove(onlineUsers, elem=>elem === removedUser.user); // remove user from array
        io.emit("onlineUsers", onlineUsers); // emit to all clients
      }
    })
  });
};
