var routeParameter = '';
var search_module = angular.module("product", ['ngRoute']);

search_module.config(function($routeProvider) {
  $routeProvider
    .when('/', {              // route for the home page
      templateUrl : 'search_view.html'
    })
    .when('/:param', {
      templateUrl : 'search_view.html'
    });
});

search_module.controller("productControllerSearch", function($scope, $routeParams) {

   $scope.products = [{
       id:'P101',
       desc:'Excellent product quality.',
      imageUrl: 'images/small.jpg',
      name: 'RAM',
      price: '$115.00',
      category: 'Accessories'
   }, {
      id:'P102',
      desc:'This is really great!!!',
      imageUrl: 'images/small.jpg',
      name: 'HD250',
      price: '$1215.00',
      category: 'Bottoms'
   }, {
      id:'P103',
      desc:'Not-so-good.', 
      imageUrl: 'images/small.jpg',
      name: 'SD1GB',
      price: '$650.00',
      category: 'Cell Phone'
   }, {
      id:'P104',
      desc:'Great stuff…',      
      imageUrl: 'images/small.jpg',
      name: 'SAN',
      price: '$700.00',
      category: 'Computer'
   }, {
      id:'P105',
      desc:'Amazing',   
      imageUrl: 'images/small.jpg',
      name: 'ROM',
      price: '$950.00',
      category: 'Hard Back'
   }, {
      id:'P106',
      desc:'Really good',
      imageUrl: 'images/small.jpg',
      name: 'MOUSE',
      price: '$850.00',
      category: 'Paper Back'
   }, {
      id:'P107',
      desc:'Great one',
      imageUrl: 'images/small.jpg',
      name: 'MOUSE',
      price: '$850.00',
      category: 'Smart Phones'
   }, {
      id:'P108',
      desc:'Not so good',
      imageUrl: 'images/small.jpg',
      name: 'MOUSE',
      price: '$850.00',
      category: 'Tablet'
   }];
  routeParameter = $routeParams.param;
});

search_module.controller("productController", function($scope) {

   $scope.category= ['Accessories', 'Bottoms', 'Cell Phone', 'Computer', 'Hard Back', 'Paper Back', 'Smart Phones', 'Tablet'];

      $scope.price= ['$ 0 - 299', '$ 600 - 899 ', '$ 900 - 1199', '$ 1200 and Above'];



   $scope.basket = [{
      number: '1',
      product: 'The Adventures of Huckleberry Finn / Cashmere Sweater-Pink-large',
      quantity: '2 / 2',
      orders: '2'
   }, {
      number: '2',
      product: 'The Adventures of Huckleberry Finn / Google - 12.85" Chromebook Pixel',
      quantity: '1 / 1',
      orders: '1'
   }, {
      number: '3',
      product: 'The Adventures of Huckleberry Finn / Black Bell Bottoms-medium',
      quantity: '1 / 2',
      orders: '1'
   }, {
      number: '4',
      product: 'The Adventures of Huckleberry Finn / Khaki Cargo Shorts-medium',
      quantity: '2 / 2',
      orders: '1'
   }, {
      number: '5',
      product: 'The Adventures of Huckleberry Finn / Acer - Aspire Ultrabook ',
      quantity: '2 / 1',
      orders: '1'
   }];

   $scope.salesChannel = [{
      channel: 'Electronic',
      invisible: 'NA',
      webpage: 'Create Page',
      publish: 'Set Date',
      startselling: 'Set Date',
      discontinue: '(-)',
      unpublish: 'Set Date'
   }, {
      channel: 'Amazon',
      invisible: 'NA',
      webpage: 'Create Page',
      publish: 'Set Date',
      startselling: 'Set Date',
      discontinue: '(-)',
      unpublish: 'Set Date'
   }, {
      channel: 'Ebay',
      invisible: 'NA',
      webpage: 'Create Page',
      publish: 'Set Date',
      startselling: 'Set Date',
      discontinue: '(-)',
      unpublish: 'Set Date'
   }, {
      channel: 'Flipkart',
      invisible: 'NA',
      webpage: 'Create Page',
      publish: 'Set Date',
      startselling: 'Set Date',
      discontinue: '(-)',
      unpublish: 'Set Date'
   }];

   $scope.brand = {
      price: '$115',
      weight: '18',
      Pcategory: 'Computer',
      mpn: ''
   };

   $scope.reviews = [{
      sno: '1.',
      name: 'by : Sanjeev Gupta',
      headline: 'A good piece of DDR1 ram',
      text: 'I just recently bought this ram from flipkart and installed in my pc.If you are thinking will this ram fit in my pc or not, dont worry just make sure your motherboard is ddr1.Thumbs up to flipkart great service.If you need this badly then only go for it.'
   }, {
      sno: '2.',
      name: 'by:Rajiv Nigam',
      headline: ' Great revival for your old PC ',
      text: ' Bought this to replace my 512MB old DDR RAM, I thought it would be really difficult to find these old stuffs at reasonable rate and along with warranty.If you are looking for a DDR RAM just get it and revive your old PC once again.'
   }];

   $scope.pricing = [{
      sno: '1.',
      name: ' Flipkart ',
      price: '$25.00'
   }, {
      sno: '2.',
      name: ' Amazon ',
      price: '$26.00'
   }, {
      sno: '3.',
      name: ' ebay ',
      price: '$25.50'
   }];

   $scope.categories = [{
      name: 'Laptop',
      dates: '20/10/2012'
   }, {
      name: 'PC',
      dates: '2/1/2012'
   }, {
      name: 'RAM',
      dates: '12/10/2012'
   }];

   $scope.crossSell = [{
      name: 'Dr.Moreau',
      imageurl: 'images/small(1).jpg'
   }, {
      name: 'Mobi Dick',
      imageurl: 'images/small(3).jpg'
   }, {
      name: 'Dr.Moreau',
      imageurl: 'images/small(1).jpg'
   }, {
      name: 'Mobi Dick',
      imageurl: 'images/small(3).jpg'
   }];
    $scope.myVar = false,
    $scope.icon = true,
    $scope.toggle = function() {
        $scope.myVar = false;
    $scope.icon = true;
    };
    $scope.change = function() {
        $scope.myVar = true;
    $scope.icon = false;
    };

});

//Custom filter 
search_module.filter('filterByCategory', function() {  
  return function(items) {
    var filtered = []; 
    for(var i=0 ; i<items.length ; i++) {
      var item = items[i];
      if(items[i].category === routeParameter) {
        filtered.push(item);
      }
      if(routeParameter==null | routeParameter=='') {
        filtered.push(items[i]);
      }
    }
    return filtered;
  }; 
});

