const express = require("express");
const app = express();
app.use(express.static(__dirname + "/public"));
const expressServer = app.listen(process.env.PORT || 9000);
const mongodb = require("mongodb");

const socketIO = require("socket.io");
const io = socketIO(expressServer, { cors: { origin: "*" } });


//const { namespaces } = require("./data/namespace");

let namespaces;
async function bootstrap() {
    await mongodb.connect("mongodb+srv://group4:group4@cluster0.xpmc8.mongodb.net/", { useUnifiedTopology: true }, async (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }

        const _db = result.db("chatappver2");
        namespaces = await _db.collection("namespace").find().toArray();

        // main namespace "/"
        io.of("/").on("connection", async (socket) => {

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
            io.of(namespace.endpoint).on("connection", async (nsSocket) => {
                const nsRooms = await _db.collection("room").find({ _id: { $in: namespace.rooms } }).toArray();

                nsSocket.emit("nsRoomLoad", nsRooms);
                nsSocket.on("joinRoom", async (roomTitle) => {
                    let oldRoomTitle = Array.from(nsSocket.rooms)[1];
                    nsSocket.leave(oldRoomTitle);
                    updateNumberOfMembers(namespace, oldRoomTitle);

                    nsSocket.join(roomTitle);
                    updateNumberOfMembers(namespace, roomTitle);

                    // let nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
                    let nsRoom = await _db.collection("room").findOne({ roomTitle: roomTitle });
                    nsSocket.emit("historyCatchUp", nsRoom.history);
                })

                // receive msg from client, then send back to client
                nsSocket.on("newMessageToServer", async (data) => {
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
                    // let nsRoom = namespace.rooms.find(room => room.roomTitle === roomTitle);
                    // nsRoom.addMessage(fullData); // fix here
                    await _db.collection("room").updateOne(
                        { roomTitle: roomTitle },
                        { $push: { history: fullData } }
                    )

                    io.of(namespace.endpoint).to(roomTitle).emit("messageToClient", fullData);
                })
            })
        })

        return _db;
    });
}

function updateNumberOfMembers(namespace, roomTitle) {
    let numberOfMembers = (io.of(namespace.endpoint).adapter.rooms.get(roomTitle) !== undefined) ? io.of(namespace.endpoint).adapter.rooms.get(roomTitle).size : 0;
    io.of(namespace.endpoint).in(roomTitle).emit("updateNumberOfMembers", numberOfMembers);
}

bootstrap()