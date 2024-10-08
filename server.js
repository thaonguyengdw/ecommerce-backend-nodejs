const app = require("./src/app");
const {app:{port}}= require('./src/configs/config.mongodb')

const sever = app.listen(port,()=>{
    console.log(`Ecommer start with PORT : ${port}`)
})
