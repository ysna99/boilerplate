import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import User from './models/User.js'
import cookieParser from 'cookie-parser';
import { auth } from './middleware/auth.js';
import postRoutes from './routes/post.js'
import userRoutes from './routes/user.js'

const uri = process.env.MONGODB_URI;
console.log(uri);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://boilerplate-one-hazel.vercel.app',
    credentials: true

}
));
app.use(cookieParser());

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
})
    .then(() => console.log('connected'))
    .catch((error) => console.log(error));


app.use(express.json());

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요~!');
})
app.get('/', (req, res, next) => {
    res.send('Hello World');
})

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
