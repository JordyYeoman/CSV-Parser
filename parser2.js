const fs = require("fs");
const path = require('path');
const csv = require('csv-parser');

// Take in CSV file & output a parent + child csv file to be uploaded to wordpress.

// 1) Get the CSV file to parse.
const filePath = "./stock-upload-test.csv"

// Big papa file
const bigPapa = "./big-papa-products.csv";

const rows = [];



fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    rows.push(row);
  })
  .on('end', () => {
   
    let uniqueParents = [
        { newParentProduct: 'TRAVELACTIV W5102 A/C', 
            products: [] }
    ];

    // Loop over each row in the CSV & create a UNIQUE parent product.
    //
    rows.forEach((parentProduct) => {
        // Assign current row product description
        let newParent = parentProduct.STOCK_DESCRIPTION;

            // ANy null values should be assigned with loop below
        let parentProductStructure = {
            'post_title': null,
            'post_status': 'publish',
            'sku': null,
            'tax:product_type': 'variable',
            'tax:product_cat': null,
            'attribute:Color': null,
            'attribute_data:Color': '1 | 1 | 1',
            'attribute:Size': null,
            'attribute_data:Size': '1 | 1 | 1',
            'attribute:ShoeType': null,
            'attribute_data:ShoeType': '1 | 1 | 1',
            'attribute:Brand': null,
            'attribute_data:Brand': '1 | 1 | 1',
        };
        
        let x = uniqueParents.find(x => {
            return x.newParentProduct.localeCompare(newParent) === 0;
        });
        // If its undefined, it means product does not exist
        if(x === undefined) {
            console.log('New Parent product added');

            uniqueParents.push({
                newParentProduct: newParent, 
                products: [
                    {
                        'post_title': parentProduct.STOCK_DESCRIPTION,
                        'post_status': 'publish',
                        'sku': parentProduct.STOCK_DESCRIPTION,
                        'tax:product_type': 'variable',
                        'tax:product_cat': parentProduct.CATEGORY_NAME,
                        'attribute:Color': null,
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': null,
                        'attribute_data:Size': '1 | 1 | 1',
                        'attribute:ShoeType': null,
                        'attribute_data:ShoeType': '1 | 1 | 1',
                        'attribute:Brand': null,
                        'attribute_data:Brand': '1 | 1 | 1',
                    }
                ]
            })
        }

        // If there is a product, that matches, we should add it to the uniqueProduct array - products list
        if(x !== undefined) {
            console.log('We got a new product bois');
            if(x.products.length === 0) {
                console.log('We got no products in this parent');
                x.products.push({
                        'post_title': parentProduct.STOCK_DESCRIPTION,
                        'post_status': 'publish',
                        'sku': parentProduct.STOCK_DESCRIPTION,
                        'tax:product_type': 'variable',
                        'tax:product_cat': parentProduct.CATEGORY_NAME,
                        'attribute:Color': [parentProduct.COLOUR_CODE],
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': null,
                        'attribute_data:Size': '1 | 1 | 1',
                        'attribute:ShoeType': null,
                        'attribute_data:ShoeType': '1 | 1 | 1',
                        'attribute:Brand': null,
                        'attribute_data:Brand': '1 | 1 | 1',
                })
            }
            else if(x.products.length !== 0) {
                console.log("FKN METH");
            }
            // Push the current product into the products array
            // let y = x.products.find(y => {
            //     return y['attribute:Size'].localeCompare(parentProduct.SIZE_CODE);
            // })

            // if(y === undefined) {
            //     x.products['attribute:Size'] = parentProduct.SIZE_CODE;
            // }
        }
        
    });


    console.log(uniqueParents[0].products);


 });

//  if(x.newParentProduct.localeCompare(newParent)) {
//     console.log('Need a new parent product');
//     
// } else {
//    return
// }

        // //console.log(res);
        // console.log(uniqueParents);
        // row.newParentProduct.indexOf(newParent) === -1 
        //     ?         
        //     uniqueParents.push({newParentProduct: newParent, products: []})
        //     : 
        //     //console.log(".");
        //     null

        // uniqueParents.newParentProduct.indexOf(newParent) === -1 ? 
        // // If product is unique, then assign product name to array
        // uniqueParents.push({newParentProduct: newParent })
        // : 
        // // Else assign to already existing parent product array
        // null
        // //console.log('product is not unique, assign to object');
 


  // Check array inside of array inside of object title = x;






//  // Create the Parent CSV file
//     // ANy null values should be assigned with loop below
//     let parentProduct = {
//         'post_title': null,
//         'post_status': 'publish',
//         'sku': null,
//         'tax:product_type': 'variable',
//         'tax:product_cat': null,
//         'attribute:Color': null,
//         'attribute_data:Color': '1 | 1 | 1',
//         'attribute:Size': null,
//         'attribute_data:Size': '1 | 1 | 1',
//         'attribute:ShoeType': null,
//         'attribute_data:ShoeType': '1 | 1 | 1',
//         'attribute:Brand': null,
//         'attribute_data:Brand': '1 | 1 | 1',
//     };
//     let shoeBrand = null;
//     let shoeTitle = null;
//     let shoeSku = null;
//     let productCategory = null;
//     let colorVariations = [];
//     let shoeSizes = [];

//   rows.forEach(product => {
//     let newProduct = product.STOCK_DESCRIPTION;
//     uniqueProducts.indexOf(newProduct) === -1 ? uniqueProducts.push(newProduct) : null;

//     // Get all color variations
//     let newColor = (product.COLOUR_CODE);
//     colorVariations.indexOf(newColor) === -1 ? colorVariations.push(newColor) : null;
//     // Get all size variations
//     let newSize = product.SIZE_CODE.replace(/[^0-9.]/g,'');
//     shoeSizes.indexOf(newSize) === -1 ? shoeSizes.push(newSize) : null;
//     // Get the shoe brand name
//     shoeBrand = product.LABEL_NAME;
//     shoeTitle = product.STOCK_DESCRIPTION;
//     shoeSku = product.STOCK_DESCRIPTION;
//     productCategory = product.CATEGORY_NAME;
//     shoeType = product.PRODUCT_TYPE;
// });
// //console.log(colorVariations,shoeSizes,shoeBrand);

// // Assign attributes to parent product
// parentProduct['post_title'] = shoeTitle;
// parentProduct['sku'] = shoeSku;
// parentProduct['tax:product_cat'] = productCategory;
// parentProduct['attribute:Color'] = colorVariations;
// parentProduct['attribute:Size'] = shoeSizes;
// parentProduct['attribute:ShoeType'] = shoeType;
// parentProduct['attribute:Brand'] = shoeBrand;








// const arr = [
//     {
//       name: 'string 1',
//       arrayWithvalue: '1,2',
//       other: 'that',
//     },
//     {
//       name: 'string 2',
//       arrayWithvalue: '2',
//       other: 'that',
//     },
//     {
//       name: 'string 2',
//       arrayWithvalue: '2,3',
//       other: 'that',
//     },
//     {
//       name: 'string 2',
//       arrayWithvalue: '4,5',
//       other: 'that',
//     },
//     {
//       name: 'string 2',
//       arrayWithvalue: '4',
//       other: 'that',
//     },
//   ];
  
//   const items = arr.filter(item => item.arrayWithvalue.indexOf('1,2') !== -1);
  
  //console.log(items);