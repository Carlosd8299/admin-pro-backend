const mongoose = require('mongoose');

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.BD_CONNECT);
    } catch (error) {
        console.error(error);
        throw new Error('Error con la bd');
    }
    console.log('bd online');
}

module.exports = {
    dbConnection
}