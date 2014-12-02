    $(document).on("click", "#Different_Address", function() {
         if ( Different_Address.checked ) {
            $("#Use_Existing_Address").hide();
            $("#Enter_New_Address").show();
         }
         else {
            $("#Enter_New_Address").hide();
            $("#Use_Existing_Address").show();
         }
     });

     $(document).on("click", "#Create_New_Address2", function() {
         $("#Create_New_Address1").attr('checked', false);
     });

     $(document).on("click", "#Create_New_Address1", function() {
         $("#Create_New_Address2").attr('checked', false);
     });

     $(document).on("click", "#change_icon", function () {
         $("#content").hide();
         $("#frm_content").show();

     });

     $(document).on("click", "#remove_edit", function () {
         $("#content").show();
         $("#frm_content").hide();
     });
     $(document).on("mousemove", "[data-toggle='popover']", function () {
         $("[data-toggle='popover']").popover();
     });

     $(this).popover({
         html: true,
         content: function() {
             return $($(this).attr('data-content')).html();
         }
     });

     var CustomerApp = angular.module('CustomerApp', ['ngRoute', 'EnterpriseSearchMod.services'])
      .run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
  }]);

     CustomerApp.controller('CustomerDetailController', ['$scope', '$location', '$anchorScroll', function ($scope, $location, $anchorScroll) {

    	 $scope.gotoProfile = function() {
    	        // set the location.hash to the id of
    	        // the element you wish to scroll to.
    	        $location.hash('SectionProfile');

    	        // call $anchorScroll()
    	        $anchorScroll();
    	      };
		 $scope.gotoOrder = function() {
		        // set the location.hash to the id of
			 	// the element you wish to scroll to.
			 	$location.hash('SectionOrder');
		
				// call $anchorScroll()
		    $anchorScroll();
		  };
		 $scope.gotoReturn = function() {
			    // set the location.hash to the id of
				// the element you wish to scroll to.
			 	$location.hash('SectionReturn');
		
				// call $anchorScroll()
		    $anchorScroll();
		  };
		 $scope.gotoAddress = function() {
			    // set the location.hash to the id of
				// the element you wish to scroll to.
			 	$location.hash('SectionAddress');
		
				// call $anchorScroll()
		    $anchorScroll();
		  };
			 $scope.gotoCreditCard = function() {
				    // set the location.hash to the id of
					// the element you wish to scroll to.
				 	$location.hash('SectionCreditCard');
			
					// call $anchorScroll()
			    $anchorScroll();
			  };
    	      
    	 $("#menu-close").click(function(e) {
             e.preventDefault();$("#menu_toggle").hide();
             $("#sidebar-wrapper").toggleClass("active");
         });
    	 $("#menu-toggle").click(function(e) {
    		 e.preventDefault();
    		 
    		 $("#sidebar-wrapper").toggleClass("active");
    	 });
    	 $scope.gotoSection = function() {
 	        // set the location.hash to the id of
 	        // the element you wish to scroll to.
 	        $location.hash('SectionProfile');
 	        // call $anchorScroll()
 	        $anchorScroll();
    	 };
    	 $scope.gotoSection = function() {
 	        // set the location.hash to the id of
 	        // the element you wish to scroll to.
 	        $location.hash('SectionOrder');
 	        // call $anchorScroll()
 	        $anchorScroll();
    	 };
    	 $scope.gotoSection = function() {
 	        // set the location.hash to the id of
 	        // the element you wish to scroll to.
 	        $location.hash('SectionReturn');
 	        // call $anchorScroll()
 	        $anchorScroll();
    	 };

    	 

         $scope.customer_profile = [{
             name: 'Aashish Vijaywargiyaa',
             phone: '1-123-4567890',
             email: 'ashish.vijay@yahoo.com',
             totalOrders: '26',
             profit: '1700.17',
             serviceLevel: '100.00%',
             otherPhones: '1-123-4567890 '
         }];

         $scope.orders = [{
             orderId: 'NNAO20655',
             date: '09-08-2014 04:26 AM',
             amount: '$109.73',
             returned: '$0.00',
             orderStatus: 'completed',
             labelClass: 'label-success'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, 
            {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'Ao20683',
             date: '09-08-2014 04:26 AM',
             amount: '$24.74',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         },
            {
             orderId: 'NNAO20653',
             date: '10-02-2014 05:26 AM',
             amount: '$124.60',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'NNAO20785',
             date: '22-08-2014 02:10 AM',
             amount: '$200.00',
             returned: '$0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }, {
             orderId: 'NNAO20653',
             date: '10-02-2014 05:26 AM',
             amount: '$124.60',
             returned: ' $0.00',
             orderStatus: 'Approved',
             labelClass: 'label-primary'
         }];

         $scope.returns = [{
             returnId: '20272',
             date: '07-26-2014 08:06 AM',
             amount: '$20.94',
             returnStatus: 'Completed'
         },  {
             returnId: '40541',
             date: '11-20-2014 07:10 PM',
             amount: '$32.10',
             returnStatus: 'Completed'
         },  {
             returnId: '61287',
             date: '07-21-2014 01:15 PM',
             amount: '$48.00',
             returnStatus: 'Completed'
         },  {
             returnId: '85796',
             date: '08-19-2014 06:05 PM',
             amount: '$77.65',
             returnStatus: 'Completed'
         },  {
             returnId: '19565',
             date: '01-12-2014 04:55 PM',
             amount: '$41.60',
             returnStatus: 'Completed'
         }];

         $scope.address = [
            { name: 'Aashish Vijaywargiyaa',
              street: '78 Scheme No 78 Part-2',
              city: 'Indore',
              country: 'India'
            },
            { name: 'Anil Patel',
              street: '100 N 300 S STE 4003',
              city: 'Salt Lake City UT 74101',
              country: 'USA'
            }
         ];

         $scope.visaCode = [
         {   code: '*1111 6/2017',
             name: 'Aashish Vijaywargiyaa',
             street: '78 Scheme No 78 Part-2',
              city: 'Indore',
             country: 'USA'
         }]
     }]);

     CustomerApp.controller('CustomerBasicInfoController', ['$scope', 'getEnterpriseSearchResults', function ($scope, getEnterpriseSearchResults) {
         var options = {keyword: 'demo', req_url: "https://localhost:8443/enterprisesearch/control/customerSearchResults"},
                         promise = getEnterpriseSearchResults.getResults(options);
                     promise.then(
                         function(response) {
                             console.log(response);
                             $scope.customer_details_list = response.data.result.customerDetailsList;
                             console.log(response.data.result.customerDetailsList);
                             $scope.list_size = response.data.result.listSize;
                             console.log(response.data.result.listSize);
                             $scope.view_index = response.data.result.viewIndex;
                             console.log(response.data.result.viewIndex);
                             $scope.view_size = response.data.result.viewSize;
                             console.log(response.data.result.viewSize);
                         },
                         function(response) {
                             console.log('Ooops.. there is an error.');
                         }
                     );
         $scope.customer_details = [{
             name: 'Aashish  Vijaywargiyaa',
             phone: '1-123-4567890',
             email: 'ashish.vijay@yahoo.com'
         }, {
             name: 'Aditya Barve',
             phone: '1-123-1231234',
             email: 'adityabarve48@gmail.com'
         }, {
             name: 'Anil Patel',
             phone: '1-413-2303505',
             email: 'anilpatel@yahoo.com'
         }];
     }]);

     CustomerApp.config(function ($routeProvider) {
         $routeProvider.when('/index', {
             controller: 'CustomerBasicInfoController',
             templateUrl: 'Customer_Search.html'
         }).when('/FindCustomerDetail', {
             controller: 'CustomerDetailController',
             templateUrl: 'Customer_Detail.html'
         }).otherwise({
             redirectTo: '/index'
         });

     });
