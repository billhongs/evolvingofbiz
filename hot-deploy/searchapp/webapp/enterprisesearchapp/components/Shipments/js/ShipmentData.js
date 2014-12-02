    
    var ShipmentApp = angular.module('ShipmentApp', ['ngRoute']);
    ShipmentApp.controller('ShipmentDataController', function ($scope) {
        $scope.Status = ['Received', 'Packed', 'Shipped', 'Created'];
        $scope.Type = ['Purchase Shipment', 'Sales Return', 'Sales Shipment'];
        $scope.shipment_basic_information = [{
            shipment_id: '10028',
            shipment_status: 'Received',
            shipment_label_class: 'label-success',
            order_or_return_id: '10032',
            order_or_return_status: 'completed',
            order_or_return_label_class: 'label-success',
            customer_or_supplier: 'FORUM NOVELTIES CO.',
            customer_or_supplier_id: 'VEND_0003'

        }, {
            shipment_id: '20288',
            shipment_status: 'Shipped',
            shipment_label_class: 'label-success',
            order_or_return_id: 'PO20292',
            order_or_return_status: 'completed',
            order_or_return_label_class: 'label-success',
            customer_or_supplier: 'TROPICAL SUN INC.',
            customer_or_supplier_id: 'VEND_0001'
        }, {
            shipment_id: '20489',
            shipment_status: 'Created',
            shipment_label_class: 'label-default',
            order_or_return_id: 'PO20430 ',
            order_or_return_status: 'Approved',
            order_or_return_label_class: 'label-info',
            customer_or_supplier: 'FORUM NOVELTIES CO.',
            customer_or_supplier_id: 'VEND_0003'
        }, {
            shipment_id: '10144',
            shipment_status: 'Created',
            shipment_label_class: 'label-default',
            order_or_return_id: '10043',
            order_or_return_status: 'Cancelled',
            order_or_return_label_class: 'label-default',
            customer_or_supplier: 'Himanil Gupta',
            customer_or_supplier_id: '10021'
        }, {
            shipment_id: '10144',
            shipment_status: 'Packed',
            shipment_label_class: 'label-info',
            order_or_return_id: '10043',
            order_or_return_status: 'Approved',
            order_or_return_label_class: 'label-info',
            customer_or_supplier: 'Himanil Gupta',
            customer_or_supplier_id: '10021'
        }];
       

    });

    ShipmentApp.controller('ShipmentDetailController', function ($scope) {
        $scope.shipping_information = [{
            shipment: '10028',
            status: 'Received',
            PO: '10032',
            received_in: 'HWM Demo Product Store',
            warehouse_name: 'Hotwax Media, INC',
            street: '307 W 200 S, #4003 SLC, UT 84101',
            country: 'USA'
        }];

        $scope.received_items = [{
            product: 'Cashmere Sweater Brown medium',
            image: 'images/product.jpg',
            qty_received: '1',
            quantity_rejected: '0',
            rejected_reason: 'No Any',
            unit_price: '$47.25',
            ATP: '90',
            QOH: '92',
            put_away_slip: 'images/pdf.ico',
            put_away_operator: 'John Neris'

        }, {
            product: 'Sweater Brown medium',
            image: 'images/product.jpg',
            qty_received: '1',
            quantity_rejected: '0',
            rejected_reason: 'No Any',
            unit_price: '$47.25',
            ATP: '90',
            QOH: '92',
            put_away_slip: 'images/pdf.ico',
            put_away_operator: 'John Neris'
        }];

    });

    ShipmentApp.config(function ($routeProvider) {
        $routeProvider.when('/index', {
            controller: 'ShipmentDataController',
            templateUrl: 'FindShipment.html'
        }).when('/ViewShipment', {
            controller: 'ShipmentDetailController',
            templateUrl: 'Shipment.html'
        }).otherwise({
            redirectTo: '/index'
        });
    });
    


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    