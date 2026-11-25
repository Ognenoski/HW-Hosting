// Zaednicka konekcija so MongoDB Atlas
const mongoose = require("mongoose");

const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_CLUSTER,
    MONGO_DB
} = process.env;

const uri = `mongodb+srv://${MONGO_USERNAME}:${encodeURIComponent(MONGO_PASSWORD)}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`;

const connect = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    await mongoose.connect(uri);
    console.log("Mongo Database Connected");
};

module.exports = { connect };