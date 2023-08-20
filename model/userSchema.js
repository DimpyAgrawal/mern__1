const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String
    },
    
    mess: [{
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },

        phone: {
            type: Number,
            required: true
        },
        sub: {
            type: String,
            required: true
        },
        mes: {
            type: String,
            required: true
        }

    }
    ],
    tokens: [
        {
            token: {
                type: String,
                required: true

            }
        }
    ]

})


//we are hashing the password

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});


//we are generating token

// userSchema.method.generateAuthToken = async function() {
//     try{
//                            //Payload, secret_key
//         let token =jwt.sign({_id:this._id}, process.env.SECRET_KEY);
//         this.tokens= this.tokens.concat({token:token});
//         this.save();
//         return token;
//     }catch(err){
//         console.log(err);
//     }
// };
userSchema.methods.generateAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
};

userSchema.methods.addMessage = async function (name, email, phone, sub, mes) {
    try {
        this.mess = this.mess.concat({ name, email, phone, sub, mes });
        await this.save();
        return this.mess;
    } catch (error) {
        console.log(error);
    }
};



//create model to connect with db
//connection creation
const User = mongoose.model('USER', userSchema);

module.exports = User;
