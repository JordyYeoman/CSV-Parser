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
                        'attribute:Color': [parentProduct.COLOUR_CODE],
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': [parentProduct.SIZE_CODE],
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
                        'attribute:Color': [parentProduct.COLOUR_CODE],
                        'attribute_data:Color': '1 | 1 | 1',
                        'attribute:Size': [parentProduct.SIZE_CODE],
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
                       i['attribute:Color'] = [parentProduct.COLOUR_CODE];
                    } else if (i['attribute:Color'] !== null) {
                        let g = i['attribute:Color'].find(x => {
                            return x.localeCompare(parentProduct.COLOUR_CODE) === 0;
                        });
                        if(g === undefined) {
                            i['attribute:Color'].push(parentProduct.COLOUR_CODE);
                        }
                    }
                    // Size Adder
                    if(i['attribute:Size'] === null) {
                        i['attribute:Size'] = [parentProduct.SIZE_CODE.replace(/[^0-9.]/g,'')];
                     } else if (i['attribute:Size'] !== null) {
                         let g = i['attribute:Size'].find(x => {
                             return x.localeCompare(parentProduct.SIZE_CODE) === 0;
                         });
                         if(g === undefined) {
                             i['attribute:Size'].push(parentProduct.SIZE_CODE.replace(/[^0-9.]/g,''));
                         }
                     }

                })
            }
        }
        
    });

   

    var writer = csvWriter({ headers: ["post_title", "post_status", "sku", "tax:product_type", "tax:product_cat", "attribute:Color", "attribute_data:Color", "attribute:Size",  "attribute_data:Size", "attribute:ShoeType", "attribute_data:ShoeType", "attribute:Brand", "attribute_data:Brand" ]})
        writer.pipe(fs.createWriteStream('out.csv'))
        uniqueParents.forEach(x => {
            
            console.log(x.products[0]['attribute:Color'].join(' | '));

            let productTitle = x.products[0].post_title;
            let productCategory = x.products[0]['tax:product_cat'];
            let colors = x.products[0]['attribute:Color'].join(' | ');
            writer.write([
                        productTitle,
                        'publish',
                        productTitle,
                        'variable',
                        productCategory,
                        colors,
                        
                        // 'attribute:Color': [parentProduct.COLOUR_CODE],
                        // 'attribute_data:Color': '1 | 1 | 1',
                        // 'attribute:Size': [parentProduct.SIZE_CODE],
                        // 'attribute_data:Size': '1 | 1 | 1',
                        // 'attribute:ShoeType': [parentProduct.PRODUCT_TYPE],
                        // 'attribute_data:ShoeType': '1 | 1 | 1',
                        // 'attribute:Brand': parentProduct.LABEL_NAME,
                        // 'attribute_data:Brand': '1 | 1 | 1',
            ]);
        });
    writer.end()
    console.log('Job Done');
 });

