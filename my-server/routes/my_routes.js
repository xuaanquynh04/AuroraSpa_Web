const express = require('express')
const router = express.Router()
const Product = require('../model/Product.js');
const Feedbackhome = require('../model/Feedbackhome.js')
const Customize = require('../model/Customize.js');
const Bookingform = require('../model/Bookingform.js');
const User=require('../model/User.js')

router.get(['/', '/home'], async (req, res) => {
    try {
        let products = await Product.find({ new: true });
        let feedback = await Feedbackhome.find();

        let response = {
            products: products,
            feedback: feedback
        };

        res.json(response);
        console.log('new');
        console.log(response);

    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get("/product/:productType", async (req, res) => {
    try {
        const type = req.params.productType
        if (type=="nail"){
            let products = await Product.find({ productType: "67caff0983c2d7f120045343"});
            console.log(Product)
            res.json(products)
            console.log(products)
        } else if (type=="wax"){
            let products = await Product.find({ productType: "67caff2d83c2d7f120045347"});
            console.log(Product)
            res.json(products)
            console.log(products)
        } else if (type=="wash"){
            let products = await Product.find({ productType: "67caff1e83c2d7f120045345"})
            console.log(Product)
            res.json(products)
            console.log(products)
        }

    } catch (err) {
        res.json({ message: err.message })
    }
})

router.get("/product/:productType/:productID", async (req, res) => {
    try {
        const type = req.params.productType
        const id = req.params.productID
        console.log(type)
        console.log(id)
        // let cus = await Customize.find({ productTypeId: "67caff0983c2d7f120045343"})
        // res.json(cus)
        if (type=="nail") {
            let customizes = await Customize.find( { productTypeId: "67caff0983c2d7f120045343" })
            let product = await Product.findOne({ _id: id })
            let response = {
                product: product,
                customizes: customizes
            }
            res.json(response)
        } else if (type=="wax") {
            let customizes = await Customize.find( {productTypeId: "67caff2d83c2d7f120045347" })
            let product = await Product.findOne({ _id: id })
            let response = {
                product: product,
                customizes: customizes
            }
            res.json(response)
        } else if (type=="wash") {
            let customizes = await Customize.find( {productTypeId: "67caff1e83c2d7f120045345" })
            let product = await Product.findOne({ _id: id })
            let response = {
                product: product,
                customizes: customizes
            }
            res.json(response)
        }

    }
    catch (err) {
        res.json({ message: err.message })
    }
})

router.post('/payment', async (req, res) => {
        const neworder = new Bookingform({
            customerID: req.body.customerID,
            customerName: req.body.customerName,
            phone: req.body.phone,
            orderTime: req.body.orderTime,
            bookingDate: req.body.bookingDate,
            paymentMethod: req.body.paymentMethod,
            total: req.body.total,
            status: req.body.status,
            bookingItems: req.body.bookingItems
        });
    try {
        const saveOrder = await neworder.save();
        console.log(saveOrder)
        res.json({ message: 'Booking saved successfully'});
    } catch (error) {
        res.json({ message: 'Error saving booking', error });
    }
});

router.post('/sign-in',async(req,res)=>{
    console.log('request body:', req.body)
    try {
        console.log("Đang kiểm tra tài khoản:", req.body.account);


        const existingUser = await User.findOne({account: req.body.account});
        console.log("Kết quả tìm kiếm:", existingUser)
        // Kiểm tra tài khoản đã tồn tại chưa
        if (!existingUser) {
            console.log("Tài khoản chưa tồn tại:", req.body.account);
            return res.status(400).json({
                status: 'error',
                message: "Tài khoản chưa được đăng ký"
            });
        }
        // Kiểm tra mật khẩu
        if (existingUser.password !== req.body.password) {
            return res.status(400).json({
                status: 'error',
                message: "Mật khẩu không chính xác"
            });
        }
        else{
            return res.json({ message: "User is authenticated", user: existingUser });
        }
    } catch (err){
        console.error("Error :", err);
        return res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
});

router.post("/sign-up",async(req,res)=>{
    console.log('Received request body:', req.body)
    // Kiểm tra tài khoản đã tồn tại chưa
    try {
        console.log("Đang kiểm tra tài khoản:", req.body.account);


        const existingUser = await User.findOne({account: req.body.account });
        console.log("Kết quả tìm kiếm:", existingUser)
       
        if (existingUser) {
            console.log("Tài khoản đã tồn tại:", req.body.account);
            return res.status(400).json({
                status: 'error',
                message: "Tài khoản đã tồn tại!"
            });
        }


        // Tài khoản chưa tồn tại
        console.log(req.body)
        const newUser= new User({
            name: req.body.name,
            account: req.body.account,
            gender:req.body.gender,
            dob:req.body.dob,
            avatar:req.body.avatar,
            password:req.body.password
        })




        const saveUser = await newUser.save();
        console.log("Lưu tài khoản thành công:", saveUser)
        return res.json({ message: "Tài khoản đã được tạo thành công", user: saveUser });
    } catch (err){
        console.error("Error saving user:", err);
        return res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
})


module.exports = router;