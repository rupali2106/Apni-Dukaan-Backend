const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

dotenv.config();
connectDB();

const app = express();

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(morgan('dev'));

//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoutes);
app.use("/api/v1/product",productRoutes);

//rest api
app.get("/",(req,res)=>{
    res.send("hi");
})
const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`app is listening at port ${PORT}`.bgCyan.white);
})