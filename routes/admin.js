var express = require('express');
var router = express.Router();
var productHelpers = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    // console.log(products)
    res.render('admin/view-products',{admin:true,products});

  })
});

router.get('/add-product',function(req,res){
res.render('admin/add-product')
})

router.post('/add-product',(req,res)=>{
  
  // productHelpers.addProduct(req.body,(id)=>{
  //   let image = req.files.Image;

  productHelpers.addProduct(req.body,(insertedId) =>{

    let image = req.files.Image
    const imageName = insertedId
    
    console.log(insertedId);
    image.mv('./public/product-images/'+imageName+'.jpg',(err,done)=>{
      if(!err){
        res.render('admin/add-product')
      }
        else {
          console.log(err);
        }

      
    })
  })
})

router.get('/delete-product/:id',(req,res)=>{
 let proId = req.params.id;
// console.log(proId);
 productHelpers.deleteProduct(proId).then((response)=>{
  res.redirect('/admin/')
 })
})

router.get('/edit-product/:id',async (req,res)=>{
  let product =await productHelpers.getProductDetails(req.params.id)
  //console.log(product);
  res.render('admin/edit-product', {product, admin:true})
})

router.post('/edit-product/:id',(req,res)=>{
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
   // console.log(req.params.id);
    res.redirect('/admin')
    let imageName = req.params.id
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+imageName+'.jpg')
    }
  })
})

module.exports = router;
