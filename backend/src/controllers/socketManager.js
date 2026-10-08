import { Server } from "socket.io"



let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected with id:", socket.id);

    // Join a call in a room
    socket.on("join-call", (path) => {
      console.log(`User with id: ${socket.id} joined call at path: ${path}`);

      // Initialize the connections and messages for the path if they don't exist
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);

      timeOnline[socket.id] = new Date();

      // Notify all users in the room about the new user
      connections[path].forEach((elem) => {
        io.to(elem).emit("user-joined", socket.id, connections[path]);
      });

      // send previous message if they exist
      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socket-id-sender"],
          );
        });
      }
      //handle signaling
      socket.on("signal", (toId, message) => {
        io.to(toId).emit("signal", socket.id, message);
      });

      // Handle chat messages
      socket.on("chat-message", (data, sender) => {
        const [matchingRoom, found] = Object.entries(connections).reduce(
          ([room, isFound], [roomKey, roomValue]) => {
            if (!isFound && roomValue.includes(socket.id)) {
              return [roomKey, true];
            }
            return [room, isFound];
          },
          ["", false],
        );
        if (found) {
          messages[matchingRoom] = messages[matchingRoom] || [];
          messages[matchingRoom].push({
            sender: sender,
            data: data,
            "socket-id-sender": socket.id,
          });
          console.log("message", matchingRoom, ":", sender, data);
          // E: send the message to every socket id recorded for that room
          connections[matchingRoom].forEach((elem) => {
            io.to(elem).emit("chat-message", data, sender, socket.id);
          });
        }
      });
      

      // Handle disconnection
    socket.on("disconnect", () => {
    const disconnectTime = new Date();
    const timeSpentMs = Math.abs(timeOnline[socket.id] - disconnectTime);

    let userRoom = null;

    // Loop through all rooms in `connections` 
    for (const [roomName, socketList] of Object.entries(connections)) {
        // Check if this socket belongs to the current room
        for (let i = 0; i < socketList.length; i++) {
            if (socketList[i] === socket.id) {
                userRoom = roomName;

                // Notify all other sockets in the room that this user left
                for (let j = 0; j < connections[userRoom].length; j++) {
                    io.to(connections[userRoom][j]).emit("user-left", socket.id);
                }

                // Remove the user from the room’s socket list
                const socketIndex = connections[userRoom].indexOf(socket.id);
                if (socketIndex !== -1) {
                    connections[userRoom].splice(socketIndex, 1);
                }

                // If no one is left in the room, delete it
                if (connections[userRoom].length === 0) {
                    delete connections[userRoom];
                }

                break; // Stop checking once we’ve found the room
            }
        }
    }

    console.log(
        `User with id: ${socket.id} left room: ${userRoom ?? "unknown"}. Time spent: ${timeSpentMs} ms`
    );
});

    });
  });
  return io;
};


