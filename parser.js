const fs = require("fs");
const path = require('path');
const csv = require('csv-parser');
var csvWriter = require('csv-write-stream')
var writer = csvWriter()

// Take in CSV file & output a parent + child csv file to be uploaded to wordpress.

// 1) Get the CSV file to parse.
const filePath = "./stock-upload-test.csv"

// Big papa file
const bigPapa = "./big-papa-products.csv";

const rows = [];



fs.createReadStream(bigPapa)
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

        // Remove any special characters from Shoe size string
        let filteredShoeSize =  null;
        if(parentProduct.SIZE_CODE.match(/[Ω]/) ? true : false){
            filteredShoeSize = parentProduct.SIZE_CODE.replace(/[^a-zA-Z0-9-. ]/g,'.5');
        } else {
            filteredShoeSize = parentProduct.SIZE_CODE;
        }

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
            //console.log('New Parent product added');

            uniqueParents.push({
                newParentProduct: newParent, 
                products: [
                    {
                        'post_title': parentProduct.STOCK_DESCRIPTION,
                        'post_status': 'publish',
                        'sku': parentProduct.STOCK_DESCRIPTION,
                        'tax:product_type': 'variable',
                        'tax:product_cat': parentProduct.CATEGORY_NAME,
                        'attribute:Color': [parentProduct.COLOUR_DESCRIPTION],
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': [filteredShoeSize],
                        'attribute_data:Size': '1 | 1 | 1',
                        'attribute:ShoeType': [parentProduct.PRODUCT_TYPE],
                        'attribute_data:ShoeType': '1 | 1 | 1',
                        'attribute:Brand': parentProduct.LABEL_NAME,
                        'attribute_data:Brand': '1 | 1 | 1',
                    }
                ]
            })
        }

        // If there is a product, that matches, we should add it to the uniqueProduct array - products list
        if(x !== undefined) {
            //console.log('We got a new product bois');
            if(x.products.length === 0) {
                //console.log('We got no products in this parent');
                x.products.push({
                        'post_title': parentProduct.STOCK_DESCRIPTION,
                        'post_status': 'publish',
                        'sku': parentProduct.STOCK_DESCRIPTION,
                        'tax:product_type': 'variable',
                        'tax:product_cat': parentProduct.CATEGORY_NAME,
                        'attribute:Color': [parentProduct.COLOUR_DESCRIPTION],
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': [filteredShoeSize],
                        'attribute_data:Size': '1 | 1 | 1',
                        'attribute:ShoeType': [parentProduct.PRODUCT_TYPE],
                        'attribute_data:ShoeType': '1 | 1 | 1',
                        'attribute:Brand': parentProduct.LABEL_NAME,
                        'attribute_data:Brand': '1 | 1 | 1',
                })
            }
            else if(x.products.length !== 0) {
                x.products.map(i => {
                    // Color Adder
                    if(i['attribute:Color'] === null) {
                       i['attribute:Color'] = [parentProduct.COLOUR_DESCRIPTION];
                    } else if (i['attribute:Color'] !== null) {
                        let g = i['attribute:Color'].find(x => {
                            return x.localeCompare(parentProduct.COLOUR_DESCRIPTION) === 0;
                        });
                        if(g === undefined) {
                            i['attribute:Color'].push(parentProduct.COLOUR_DESCRIPTION);
                        }
                    }
                    // Size Adder
                    if(i['attribute:Size'] === null) {
                        i['attribute:Size'] = [filteredShoeSize.replace(/[^0-9.]/g,'')];
                     } else if (i['attribute:Size'] !== null) {
                         let g = i['attribute:Size'].find(x => {
                             return x.localeCompare(filteredShoeSize) === 0;
                         });
                         if(g === undefined) {
                             //if(parentProduct.SIZE_CODE)
                             //let k = parentProduct.SIZE_C.replace(/[^a-zA-Z0-9-. ]/g,'.5');
                             i['attribute:Size'].push(filteredShoeSize);
                         }
                     }

                })
            }
        }
        
    });

   

   

    var writer = csvWriter({ headers: ["post_title", "post_status", "sku", "tax:product_type", "tax:product_cat", "attribute:Color", "attribute_data:Color", "attribute:Size",  "attribute_data:Size", "attribute:ShoeType", "attribute_data:ShoeType", "attribute:Brand", "attribute_data:Brand" ]})
        writer.pipe(fs.createWriteStream('parent.csv'))
        uniqueParents.forEach(x => {
    
            let productTitle = x.products[0].post_title;
            let productCategory = x.products[0]['tax:product_cat'];
            let shoeType = x.products[0]['attribute:ShoeType'];
            let colors = x.products[0]['attribute:Color'].join(' | ');
            let sizes = x.products[0]['attribute:Size'].join(' | ');
            let brand = x.products[0]['attribute:Brand'];

            writer.write([
                        productTitle,
                        'publish',
                        productTitle,
                        'variable',
                        productCategory,
                        colors,
                        '1 | 1 | 1',
                        sizes,
                        '1 | 1 | 1',
                        shoeType,
                        '1 | 1 | 1',
                        brand,
                        '1 | 1 | 1'
            ]);
        });
    writer.end()
    console.log('Parent Job Done');


    
    const individualProducts = [];

    // Loop over rows again 
    rows.forEach(x => {
        let product = {
            parent_sku: x.STOCK_DESCRIPTION,
            sku: x.BARCODE,
            regular_price: x.RETAIL_PRICE,
            tax_class: 'parent',
            Color: x.COLOUR_DESCRIPTION,
            Size: x.SIZE_CODE.replace(/[^a-zA-Z0-9-. ]/g,'.5'),
            ShoeType: x.PRODUCT_TYPE,
            Brand: x.LABEL_NAME,
            manage_stock: 'yes',
            Stock: x.SOH
        }
        individualProducts.push(product);
    });

    var writer2 = csvWriter({ headers: ["parent_sku", "sku", "regular_price", "tax_class", "meta:attribute_color", "meta:attribute_Size", "meta:attribute_ShoeType", "meta:attribute_Brand",  "manage_stock", "Stock"]})
    writer2.pipe(fs.createWriteStream('child.csv'))
    individualProducts.forEach(x => {
        writer2.write([
            x.parent_sku,
              x.sku,
              x.regular_price,
              x.tax_class,
              x.Color,
              x.Size,
              x.ShoeType,
              x.Brand,
              x.manage_stock,
              x.Stock,     
        ]);
    });

   writer2.end();
   console.log('Child Job Done');


 });




