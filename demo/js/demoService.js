
'use strict';
var demoApp = angular.module('ngCheckbox.demo',
    ['ngCheckbox','ui.router']);

demoApp
    .factory('productsData', function () {

        var sampleNames = ['Banana','Orange','Mango','Strawberry','Papaya'];
        var sampleCurrencies = ['USD','EUR','SEK'];
        var sampleCat = ['Green','Ripe'];

        var createSampleProducts = function (noOfProducts,status,ramdomIntAmount,ramdomDecAmount) {
            noOfProducts = noOfProducts || 9;
            status = status || 'unconfirmed';
            var sampleProducts=[];
            _.times(noOfProducts, function(){
                sampleProducts.push({
                    id: _.uniqueId('uP_'),//all id MUST be unique for it to work !!!
                    name:_.sample(sampleNames),
                    category: _.sample(sampleCat),
                    price: ramdomIntAmount ? _.random(1,10) : ramdomDecAmount ? _.random(1,10,true).toFixed(2) : 10, // default is 10
                    quantity:_.random(1,5),
                    currency: _.sample(sampleCurrencies)
                });
            });
            return sampleProducts.slice(0);
        };

        return {
            createSampleProducts:createSampleProducts
        };
    });
