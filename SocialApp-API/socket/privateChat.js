module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("refresh-chat", params => {
      socket.join(params.sender);
      socket.join(params.receiver);
    });
      socket.on("typing", params => {
          io.to(params.receiver).emit("is-typing", params);
      }); 
     socket.on("stop-typing", (params) => {
       io.to(params.receiver).emit("stoped-typing", params);
     });
  });
};
