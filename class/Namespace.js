class Namespace {
    constructor(nsId, nsTitle, img, endpoint) {
        this.nsId = nsId;
        this.img = img;
        this.nsTitle = nsTitle;
        this.endpoint = endpoint;
        this.rooms = [];
    }

    addRoom(roomObj) {
        this.rooms.push(roomObj);
    }

}

module.exports = Namespace;