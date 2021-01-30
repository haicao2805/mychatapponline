const Room = require("./class/Room");
const Namespace = require("./class/Namespace");
const mongodb = require("mongodb");

//file này dùng đễ mỗi lần run mới hoàn toàn thì chạy trước để init vài cái room 
mongodb.connect("mongodb+srv://group4:group4@cluster0.xpmc8.mongodb.net/", { useUnifiedTopology: true }, async (err, result) => {
    const _db = result.db("chatappver2");
    let wikiNs = new Namespace(0, 'Wiki', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png', '/wiki');
    let mozNs = new Namespace(1, 'Mozilla', 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png', '/mozilla');
    let linuxNs = new Namespace(2, 'Linux', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png', '/linux');
    let thienhaNs = new Namespace(3, "Thien Ha", "./star-half-alt-solid.svg", "/thienha");

    const wikiRoom = await _db.collection("room").insertMany([
        new Room(0, 'New Articles', 'Wiki'),
        new Room(1, 'Editors', 'Wiki'),
        new Room(2, 'Other', 'Wiki')
    ]);
    wikiNs.rooms = Object.values(wikiRoom.insertedIds);

    const mozRoom = await _db.collection("room").insertMany([
        new Room(0, 'Firefox', 'Mozilla'),
        new Room(1, 'SeaMonkey', 'Mozilla'),
        new Room(2, 'SpiderMonkey', 'Mozilla'),
        new Room(3, 'Rust', 'Mozilla')
    ]);
    mozNs.rooms = Object.values(mozRoom.insertedIds);

    const linuxRoom = await _db.collection("room").insertMany([
        new Room(0, 'Debian', 'Linux'),
        new Room(1, 'Red Hat', 'Linux'),
        new Room(2, 'MacOs', 'Linux'),
        new Room(3, 'Kernal Development', 'Linux')
    ]);
    linuxNs.rooms = Object.values(linuxRoom.insertedIds);

    const thienhaRoom = await _db.collection("room").insertMany([
        new Room(0, "Thien Ha 1", "Thien Ha"),
        new Room(1, "Thien Ha 2", "Thien Ha"),
        new Room(2, "Thien Ha 3", "Thien Ha")
    ]);
    thienhaNs.rooms = Object.values(thienhaRoom.insertedIds);

    let namespaces = [];
    namespaces.push(wikiNs, mozNs, linuxNs, thienhaNs);
    await _db.collection("namespace").insertMany(namespaces);

    // await _db.collection("namespace").updateOne(
    //     { nsTitle: "Wiki" },
    //     {
    //         $push: {
    //             rooms: {
    //                 $each: [
    //                     new Room(0, 'New Articles', 'Wiki'),
    //                     new Room(1, 'Editors', 'Wiki'),
    //                     new Room(2, 'Other', 'Wiki')
    //                 ]
    //             }
    //         }
    //     }
    // );

    // await _db.collection("namespace").updateOne(
    //     { nsTitle: "Mozilla" },
    //     {
    //         $push: {
    //             rooms: {
    //                 $each: [
    //                     new Room(0, 'Firefox', 'Mozilla'),
    //                     new Room(1, 'SeaMonkey', 'Mozilla'),
    //                     new Room(2, 'SpiderMonkey', 'Mozilla'),
    //                     new Room(3, 'Rust', 'Mozilla')
    //                 ]
    //             }
    //         }
    //     }
    // );

    // await _db.collection("namespace").updateOne(
    //     { nsTitle: "Linux" },
    //     {
    //         $push: {
    //             rooms: {
    //                 $each: [
    //                     new Room(0, 'Debian', 'Linux'),
    //                     new Room(1, 'Red Hat', 'Linux'),
    //                     new Room(2, 'MacOs', 'Linux'),
    //                     new Room(3, 'Kernal Development', 'Linux')
    //                 ]
    //             }
    //         }
    //     }
    // );

    // UPDATE History
    // _db.collection("namespace").updateOne(
    //     { nsTitle: "Linux" },
    //     {
    //         $push: {
    //             "rooms.$[updateRoom].history": "test"
    //         }
    //     },
    //     {
    //         "arrayFilters": [
    //             { "updateRoom.roomTitle": "Debian" }
    //         ]
    //     }
    // )
})

