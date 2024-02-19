require('dotenv').config();
// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
// google
const passport = require("passport");
const session = require("express-session");
require('./passport');

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");
const userRoutes = require("./routes/user")
const productRoutes = require("./routes/product")
const cartRoutes = require("./routes/cart");

// [SECTION] Enviroment Setup
const port = 4005;

// [SECTION] Server Setup
// Creates an "app" variable that stores the results of the "express" function that initializes our express application and allows us access to different methods that will make backend creation easy
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// Google login
// Creates Session with the given data
app.use(session({
    secret: process.env.clientSecret,
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

// [SECTION] Database Connection
// Connect to our MongoDB database
mongoose.connect(`mongodb+srv://admin:admin1234@gamatdb.aobzzsj.mongodb.net/Capstone2_API?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    
});

// Prompts a message in the terminal once the connection is "open" and we are able to successfully connect our database
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'))

// [SECTION]
// http:/localhost:4000/users
app.use("/b5/users", userRoutes);
app.use("/b5/products", productRoutes);
app.use("/b5/carts", cartRoutes); 

// [SECTION] Server Gateway Response
// if(require.main) would allow us to listen to the app directly if it is not imported to another module, it will run the app directly
// else, if it is needed to be imported, it will not run the app and instead export it to be used in another file
if(require.main === module){
    //"process.env.PORT || port" will use the environment variable if it is available OR will use port 4000 if none is defined
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on the port ${process.env.PORT || port}`)
    });
}

// In creating APIs, exporting modules in the "index.js" file is ommited
module.exports = app;