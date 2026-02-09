const express = require("express");
const app = express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRouter = require('./routes/user')
const authRoute = require('./routes/auth')
const productRoute = require('./routes/product')
const cartRoute = require('./routes/cart')
const oderRoute = require('./routes/order')
const stripeRoute = require('./routes/stripe')

dotenv.config();

if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.PORT) {
  throw new Error("Missing required environment variables");
}


app.use(express.json())
app.use(cors())
app.use('/api/users', userRouter)
app.use('/api/auth', authRoute)
app.use('/api/products', productRoute)
app.use('/api/carts', cartRoute)
app.use('/api/orders', oderRoute)
app.use('/api/stripe' , stripeRoute)

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database is connected'))
    .catch((err) => console.log(err))
     
app.listen(process.env.PORT, () => {
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})
