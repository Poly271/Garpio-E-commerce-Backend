const Product = require("../models/Product");

/* Create a Product (Admin only) (S51)*/
module.exports.addProduct = (req, res) => { 
    try{
        if(req.body.name == "" || req.body.description == "" || req.body.price == ""){
            return res.status(409).send({error: "Please complete the input field."});
        }
        let newProduct = new Product({
            name : req.body.name, 
            description : req.body.description,
            price : req.body.price
        })

        Product.findOne({name: req.body.name})
        .then(existingProduct => {
            if(existingProduct){ 
                return res.status(409).send({error: "Product ALREADY exists."});
            }

            return newProduct.save()
            .then((savedProduct) => res.status(201).send({
                message: "Product saved succesfully!",
                data: savedProduct
            }))
            .catch(err => res.status(500).send({error: "Failed to save product."}))
        })
    }catch(err){
        res.status(500).send("Error in Variables");
    }  
}  


/* Retrieve all Products (S51)*/
module.exports.getAllProducts = (req, res) => {
    return Product.find({})
    .then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(200).send({ message: 'No Products found.' });
        }
    })
    .catch(err => res.status(500).send({error: "Error finding Product."}))
}   

/* Retrieve all Active Product (S51)*/
module.exports.getAllAvailable = (req, res) => {
    Product.find({isAvailable: true})
    .then(activeProducts => {
        if(activeProducts.length > 0){
            return res.status(200).send(activeProducts);
        }else{
            return res.status(200).send("No Available Product");
        }
    })
    .catch(err => res.status(500).send({error: "Error finding active products."}))
}

/* Get Single Product (S51)*/
module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(!product){
            return res.status(404).send({error: "Product not found"})
        }
        
        return res.status(200).send({product})
    })
    .catch(err => res.status(500).send({error: "The Product ID is not valid"}))
}

/* Update Product Information (Admin Only) (S51)*/
module.exports.updateProduct = (req, res) => {

    let updateProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updateProduct)
    .then(product => {
        if(product){
            res.status(201).send({message:"You have succesfully updated a product!", data: product});
        }else{
            res.status(304).send("Sadly, you weren't able to update a Product.");
        }
    })
    .catch(err => res.status(500).send({error: "Error in updating a Product."}));
}

/* Archive a Product (Admin Only) (S51) */
module.exports.archiveProduct = (req, res) => {

    if (req.user.isAdmin == true){
        return Product.findById(req.params.productId)
        .then(product =>{
            if(product.isAvailable == true){

                let updatedAvailableField = {
                    isAvailable: false
                }
                return Product.findByIdAndUpdate(req.params.productId, updatedAvailableField)
                .then(product => {
                if (product) {
                res.status(200).send({message: "Product archived succesfully!", data: product});
                } else {
                res.status(400).send({error: "There is a problem archiving the product."});
                }
            })
            .catch(err => res.status(500).send({error: "Archiving Failed."}));
            } else{
                res.status(400).send({error: "No need to achive, This product is already unavailable."});
            }
        })
    }
    else{
        return res.status(403).send({error: "You are not authorized to do this action."});
    }
}


/*  Activate a Product (Admin Only) (S51) */
module.exports.activateProduct = (req, res) => {
    let updatedAvailableField = {
        isAvailable: true
    }

    if (req.user.isAdmin == true){
        return Product.findById(req.params.productId)
        .then(product=>{
            if(product.isAvailable == true){
                res.status(400).send({error: "No need to active this product is already available."});
            } else{
                return Product.findByIdAndUpdate(req.params.productId, updatedAvailableField)
                .then(product => {
                    if (product) {
                        res.status(200).send({message: "Product is now available!", data: product});
                    } else {
                        res.status(400).send({error: "There is a problem activating"});
                    }
                })
                .catch(err => res.status(500).send({error: "Activating Failed."}));
            }
        })
    }
    else{
        return res.status(403).send({error: "You are not authorized to do this action."});
    }
}


// Search Product by name
module.exports.searchProductByName = async (req, res) => {
    try{
        const {productName} = req.body;

        // case insensitive
        const products = await Product.find({
            name: {$regex: productName, $options: 'i'}
        });

        res.json(products);
    }catch(error){
        res.status(500).json({error: "Internal Server Error"});
    }
}

// Search Product by price
module.exports.searchByPrice = async (req, res) => {
    try{
        const {minPrice, maxPrice} = req.body;

        if(!minPrice || !maxPrice){
            return res.status(400).send({error: "Please input both minimun and maximum price."})
        }else{
            const filteredProducts = await Product.find({
                price: {$gte: minPrice, $lte: maxPrice}

            });

            res.send(filteredProducts);
        }

    }catch(error){
        res.status(500).send({error: "Server Error"});
    }
} 