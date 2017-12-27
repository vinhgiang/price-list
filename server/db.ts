import { connect } from 'mongoose';
import mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const getDbUri = () => {
    if (process.env.isTesting === 'true') return 'mongodb://localhost/db_test'
    if (process.env.PORT) return 'mongodb://price-list-user:ynhtUbwPT4s0@localhost:10572/price-list';
    return 'mongodb://localhost/price-list';
}

connect(getDbUri(), { useMongoClient: true });