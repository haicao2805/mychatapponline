const mongodb = require("mongodb");

let _db;

module.exports.initDB = async function () {
    return await mongodb.connect("mongodb://127.0.0.1:27017/", { useUnifiedTopology: true }, async (err, result) => {
        if (err) {
            console.log(err);
            throw err;
        }

        _db = result.db("chatappver2");

        return _db;
    });
}

module.exports.getDB = () => {
    if (!_db) {
        console.log("Please, init database");
        return;
    }
    return _db
}