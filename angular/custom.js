var app = angular.module("myapp", ['ngRoute']);

app.run(function($rootScope){
    $rootScope.carts = [];  
});

app.config(function ($routeProvider) { 
    $routeProvider
    .when("/", {
        templateUrl: "../views/index.html",
        controller: "ctrlIndex"
    })
    .when("/danhmucsanpham", {
        templateUrl: "../views/danhmucsanpham.html",
        controller: "ctrlDanhmucsanpham",
    })
    .when("/tintuc", {
        templateUrl: "../views/tintuc.html"
    })
    .when("/chitietsanpham/:id", {
        templateUrl: "../views/chitietsanpham.html"
    })
    .when("/vechungtoi", {
        templateUrl: "../views/vechungtoi.html"
    })
    .when("/dangnhap-dangky-quenmatkhau", {
        templateUrl: "../views/dangnhap-dangky-quenmatkhau.html"
    })
    .when("/cart", {
        templateUrl: "../views/cart.html"
    })
    .otherwise({
        templateUrl: "../views/index.html"
    })
});
app.controller("ctrlIndex", function($scope){
    $scope.page = "Trang Chủ";
});

app.controller("ctrlDanhmucsanpham", function($scope, $http, $rootScope){
    // check page
    $scope.page = "Danh Mục Sản Phẩm";
    
    // list products
    $scope.products = [];
    
     // Start  pagination
    // each page = 5
    var itemsPage = 10;
    // total page
    $scope.totalPage = 0;
    
    // Page current
    $scope.currentPage = 1;

    // display products each pagination
    $scope.displayedProducts = [];


    //Start Code  get data from file json
    $http({
        method: "GET",
        url: "../database/data.json"
    }).then( function mySuccess(response) {
        $scope.products = response.data.products;
        
        // total page = length of products / itemsPage 
        $scope.totalPage = Math.ceil($scope.products.length / itemsPage);
        // console.log($scope.totalPage);

        // Display products by page
        $scope.displayedProducts = $scope.products.slice(0, itemsPage);
        // console.log($scope.displayedProducts);

    }, function myError(response){
        $scope.status = response.statusText;
    });
    //End Code  get data from file json

  
    //Start code go to the previous page
    $scope.prevPage = () => {
        if($scope.currentPage > 1){
            $scope.currentPage--;
            updateDisplayProducts();
        }
    }
    //End code go to the previous page
    // Start code go to the next page
    $scope.nextPage = () => {
        if($scope.currentPage < $scope.totalPage){
            $scope.currentPage++;
            updateDisplayProducts();
        }
    }
    // End code go to the next page

    // update list products display
    function updateDisplayProducts(){
        var start = (itemsPage * ($scope.currentPage -1));  
        var end = start + itemsPage;
        $scope.displayedProducts = $scope.products.slice(start, end);        
    }


    // search product by input 
    $scope.searchProduct = "";

    // show 
    $scope.allProducts = ()=>{
        $scope.displayedProducts = $scope.products.slice(0, $scope.products.length);
     }

    $scope.seachClick = (value)=>{
       return $scope.searchProduct = value;
    }

     // Start function from high to short
     $scope.priceMax = (sortType) => {
        $scope.sortType = 'price'; // Mặc định sắp xếp theo giá
        $scope.sortReverse = false; // Mặc định sắp giam

         if ($scope.sortType === sortType) {
            // Nếu đã đang sắp xếp theo thuộc tính này, đảo ngược hướng sắp xếp
            $scope.sortReverse =! $scope.sortReverse;
         } else {
            // Nếu sắp xếp theo một thuộc tính mới, đặt hướng sắp xếp là tăng dần
            $scope.sortReverse = false;
         }

         // Cập nhật thuộc tính sắp xếp
         $scope.sortType = sortType;
     };
     // End function from high to short
    // Start function from short to high
    $scope.priceMin = (sortType)=>{
        $scope.sortType = 'price'; // Mặc định sắp xếp theo giá
        $scope.sortReverse = true; // Mặc định sắp xếp tang

         if ($scope.sortType === sortType) {
            // Nếu đã đang sắp xếp theo thuộc tính này, đảo ngược hướng sắp xếp
            $scope.sortReverse =! $scope.sortReverse;
         } else {
            // Nếu sắp xếp theo một thuộc tính mới, đặt hướng sắp xếp là giảm dần
            $scope.sortReverse = true;
         }

         // Cập nhật thuộc tính sắp xếp
         $scope.sortType = sortType;
    }
    // Start function from short to high


    $scope.addToCart = (item)=>{
        if($rootScope.carts.length == 0){
            $rootScope.carts.push(item);
            console.log("buoc 1");
        }else{
           let checker = false;

            for(let i = 0 ; i < $rootScope.carts.length; i++){
                    if($rootScope.carts[i].id == item.id){
                        console.log("buoc 2");
                        $rootScope.carts[i].quantity = $rootScope.carts[i].quantity + 1;
                        checker = true;
                    }else{

                    }
            }

            if(!checker){
                console.log("buoc 2");
                $rootScope.carts.push(item);
            }

        }

        console.log($rootScope.carts);
        // console.log(item);
    }
    
   

    

});

app.controller("ctrlDetail", function($scope, $http, $routeParams){
    $scope.id = $routeParams.id;
    $scope.products = [];
    $scope.product = {};

    // get data from file json by id
    $http({
        method: "GET",
        url: "../database/data.json"
    }).then(function mySuccess(response) {
        $scope.products = response.data.products;

        for (let i = 0; i < $scope.products.length; i++) {
            if ($scope.products[i].id == $scope.id) {
                $scope.product = $scope.products[i];
                break; // Tìm thấy sản phẩm, thoát khỏi vòng lặp
            }
        }
    }, function myError(response) {
        $scope.status = response.statusText;
    });
});

app.controller("ctrlCart", function($scope, $rootScope) {
    // check page
    $scope.page = "Trang giỏ hàng";
    console.log($scope.page);

    // total Price of cart 
    $scope.totalPrice = 0;
    for(let i = 0 ; i < $rootScope.carts.length; i++){
        $scope.totalPrice += $rootScope.carts[i].price * $rootScope.carts[i].quantity; 
    }
    console.log($scope.totalPrice);


    $scope.removeFromCart = (item) => {
        const index = $rootScope.carts.findIndex(cartItem => cartItem.id === item.id);
        console.log(index);
    
        if (index !== -1) {
            $rootScope.carts.splice(index, 1);
        }
    
        console.log($rootScope.carts);
    }

    $scope.tang = (item) => {
        $rootScope.carts.filter(function(data){
            data.id == item.id && data.quantity < 10 ? data.quantity++ : "";
        });
    
        console.log($rootScope.carts);
    }

    $scope.giam = (item) => {
        $rootScope.carts.filter(function(data){
            data.id == item.id && data.quantity > 1 ? data.quantity-- : "";
        });
    
        console.log($rootScope.carts);
    }

    console.log($rootScope.carts);
});