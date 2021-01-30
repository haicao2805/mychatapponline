const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(process.env.PORT || 9000);

const socketIO = require("socket.io");
const io = socketIO(expressServer, { cors: { origin: "*" } });

const namespaces = require("./data/namespace");

// main namespace "/"
io.of("/").on("connection", (socket) => {
    // the array contain the img and endpoint of each namespace
    let nsData = namespaces.map((ns) => {
        return {
            img: ns.img,
            endpoint: ns.endpoint
        }
    })

    // send nsData to client. We use socket instead of io
    socket.emit("nsList", nsData);
})

// loop all namespace on database
namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on("connection", (nsSocket) => {
        nsSocket.emit("nsRoomLoad", namespace.rooms);

        nsSocket.on("joinRoom", (roomTitle) => {
            let oldRoomTitle = Array.from(nsSocket.rooms)[1];
            nsSocket.leave(oldRoomTitle);
            updateNumberOfMembers(namespace, oldRoomTitle);

            nsSocket.join(roomTitle);
            updateNumberOfMembers(namespace, roomTitle);

            let nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);

            nsSocket.emit("historyCatchUp", nsRoom.history);
        })

        // receive msg from client, then send back to client
        nsSocket.on("newMessageToServer", (data) => {
            const fullData = {
                msg: data.msg,
                time: Date.now(),
                username: nsSocket.handshake.query.username,
                avatar: "https://via.placeholder.com/30"
            }
            // lấy roomTitle từ nsSocket.rooms
            // nsSocket.rooms là một Set, ta chuyển qua Array
            // Lấy phần tử thứ 2 từ Array là roomTitle
            let roomTitle = Array.from(nsSocket.rooms)[1];

            // lay room hien tai de them msg vao history
            let nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
            nsRoom.addMessage(fullData);

            io.of(namespace.endpoint).to(roomTitle).emit("messageToClient", fullData);
        })
    })
})

function updateNumberOfMembers(namespace, roomTitle) {
    let numberOfMembers = (io.of(namespace.endpoint).adapter.rooms.get(roomTitle) !== undefined) ? io.of(namespace.endpoint).adapter.rooms.get(roomTitle).size : 0;
    io.of(namespace.endpoint).in(roomTitle).emit("updateNumberOfMembers", numberOfMembers);
}
