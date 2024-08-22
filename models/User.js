import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const saltRounds = 10;
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 80
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
    
})

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    // 비밀번호 암호화 시키기
    try {
        const hashed = await bcrypt.hash(user.password, saltRounds);
        user.password = hashed;
        next();
    } catch (error) {
        
        return next(error);

    }

});

userSchema.methods.comparePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
}

userSchema.methods.generateToken =  function () {
    //create a Token using jwt
    const user = this;

    const token = jwt.sign({ id: user._id.toHexString() }, process.env.JWT_SECRET);
    user.token = token;

    return user.save().then(() => token);


}

userSchema.statics.findByToken = async function (token) {
    const user = this;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        const found = await user.findOne({ "_id": decoded.id, "token": token });
        return found;
    } catch (error) {
        throw new Error('Failed to find user by token');
   }
    


}
const User = mongoose.model('User', userSchema);

export default User;
