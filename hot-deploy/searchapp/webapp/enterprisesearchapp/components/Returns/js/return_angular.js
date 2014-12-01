var reviewApp = angular.module('returnApp', []);

reviewApp.controller('returnSearchController', function($scope) {
   $scope.Status = ['Requested','Cancelled','Received','Completed','Rejected'];
   
   $scope.reviewDate = [{
      name: 'Last 7 Days(20)'
   }, {
      name: 'Last 30 Days(20)'
   }, {
      name: 'More than 30 Days(20)'
   }];
   $scope.searchResults = [{
      id: '20332',
      status: 'Completed',
      labelInfo: 'success',
      date: '11-07-2014 05:00 AM',
      orderId: 'NNAO20726',
      custName: 'Himanil Gupta',
      custEmailId: 'himanil.gupta@hotwaxmedia.com'
   }, {
      id: '20334',
      status: 'Cancelled',
      labelInfo: 'default',
      date: '21-04-2014 11:00 AM',
      orderId: 'NNAO20256',
      custName: 'Mike Bates',
      custEmailId: 'mike.bates@hotwaxmedia.com'

   }, {
      id: '20323',
      status: 'Requested',
      labelInfo: 'default',
      date: '11-09-2014 10:00 AM',
      orderId: 'NNAO20856',
      custName: 'Gopal Yadav ',
      custEmailId: 'gopal.yadav@hotwaxmedia.com'

   }, {
      id: '20212',
      status: 'Recieved',
      labelInfo: 'success',
      date: '18-02-2014 08:00 AM',
      orderId: 'NNAO20785',
      custName: 'Demo Demo',
      custEmailId: 'demo.demo@hotwaxmedia.com'

   }, {
      id: '20390',
      status: 'Completed',
      labelInfo: 'success',
      date: '10-06-2014 06:00 AM',
      orderId: 'NNAO20786',
      custName: 'Akash Singh',
      custEmailId: 'akash.singh@hotwaxmedia.com'

   }, {
      id: '20374',
      status: 'Rejected',
      labelInfo: 'danger',
      date: '05-05-2014 06:00 AM',
      orderId: 'NNAO20526',
      custName: 'Rama Shukla',
      custEmailId: 'rama.shukla@hotwaxmedia.com'

   }];
  
});
reviewApp.controller('returnDetailsController', function($scope) {

   $scope.customerDetails = [{
      name: 'Customer'
   }, {
      custName: 'Aditya Barve'
   }, {
      custEmail: 'adityabarve48@gmail.com'
   }, {
      date: '11-04-2014 12:11 AM'
   }];

   $scope.adjustment = [{
      name: 'Test Adjustment',
      price: '$125.00',
      type: 'Refund'
   }];

   $scope.returnProduct = [{
      name: 'Microsoft - Surface RT with 64GB Memory',
      status: 'Completed',
      price: '$450.00',
      quantity: '10',
      recieved: '-',
      type: 'Refund',
      reason: 'Did Not Want Item'
   }];

   $scope.tooltipTable = [{
      name: 'Paid',
      date: '11-04-2014 12:12 AM'
   }, {
      name: 'Ready for Posting',
      date: '11-04-2014 12:12 AM'
   }, {
      name: 'In-Process',
      date: '11-04-2014 12:12 AM'
   }];

   $scope.dropdownTable = [{
      name: 'Accepted',
      date: '11-05-2014 11:00 AM',
      user: 'System User'
   }, {
      name: 'Completed',
      date: '11-05-2014 11:00 AM',
      user: 'System User'
   }, {
      name: 'Accepted',
      date: '11-05-2014 11:00 AM',
      user: 'System User'
   }];

   $scope.replacement = [{
      name: 'NNAO20731',
      item: '136'
   }];

   $scope.invoices = [{
      name: '20282 ',
      amount: '$1254.00'
   }];

   $scope.warehouse = [{
      name: 'WareHouse',
      line1: 'HWM Demo Product Store',
      line2: 'HWM Demo Product Store',
      line3: 'SLC UT 84101',
      line4: 'USA'
   }]

   $scope.total = [{
      subtotal: '$5000.00',
      adjustment: '$2500.00',
      grandtotal: '$2500.00'
   }];

   $scope.detail = [{
      name: 'Customer',
      custName: 'Aditya Barve',
      custEmail: 'adityabarve48@gmail.com',
      custPhone: '(+91)-94257-61254',
      date: '11-04-2014 12:11 AM'
   }];
});


$(document).ready(function() {
   $(".DemoBS a").popover({
      placement: 'left'
   });
});