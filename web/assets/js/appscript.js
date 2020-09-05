/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var sessionid;
var extension = "";
function performActions() {
    var path = getCurrentPath();
    sessionid = verifyUser();
    GenralBtnEvents();
    GeneralAppFunctions();
    var loader_img = "assets/images/other/loader.svg";
    if (path.includes("pages/general")) {
        extension = "../../../";
        $(".loader-img").attr("src", extension + loader_img);
    } else if (path.includes("pages/users")) {
        extension = "../../../../";
        $(".loader-img").attr("src", extension + loader_img);
    } else if (path.includes("pages/users/admin")) {
        extension = "../../../../../";
        $(".loader-img").attr("src", extension + loader_img);
    } else {
        $(".loader-img").attr("src", loader_img);
    }
}

function GeneralAppFunctions() {
    if (sessionid || sessionid !== 0) {
        GetData("User", "GetUserDetails", "LoadUserDetails", sessionid);
    }

    UpdateOrderStatus();
}

function UpdateOrderStatus() {
    GetData("Order", "UpdateSellerPayment", "LoadUpdateSellerPayment");
    setTimeout(UpdateOrderStatus, 7200000);//2 hours 
}
function GenralBtnEvents() {

    $(".CallLogOut").click(function () {
        localStorage.clear();
        swal({
            title: "Are you sure you want to log out?",
            text: "Press No if you want to continue working. Press Yes to logout.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes ',
            cancelButtonText: 'No',
            confirmButtonClass: 'btn btn-info',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }, function (dismiss) {
            if (dismiss) {
                window.location = extension + "LinksServlet?type=LogOut";
            } else {
                swal({
                    title: 'Safe',
                    text: "Your work is safe!",
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok!',
                    confirmButtonClass: 'btn btn-success',
                    buttonsStyling: false
                });
            }
        });

    });
}

function DisplayUserDetails(resp) {
    if (resp.UserType === "Seller") {
        if (resp.status === "Pending") {
            $(".ForPendingSeller").removeClass("d-none");
            $(".forPaidSellers").addClass("d-none");
            $(".forActivatedSellers").addClass("d-none");
        } else if (resp.status === "Paid") {
            $(".ForPendingSeller").addClass("d-none");
            $(".forPaidSellers").removeClass("d-none");
            $(".forActivatedSellers").addClass("d-none");
        } else if (resp.status === "Activated") {
            $(".ForPendingSeller").addClass("d-none");
            $(".forPaidSellers").addClass("d-none");
            $(".forActivatedSellers").removeClass("d-none");
        }
        $(".addressdetails").text(resp.AddressDetails.full_address);
    }
    $(".UserType").text(resp.UserType);
    $(".UserName").text(resp.UserName);
    localStorage.setItem("UserName", resp.UserName);
    $(".uFirstName").text(resp.firstname);
    $(".uLastName").text(resp.lastname);
    $(".uDateJoined").text(resp.date);
    if (resp.newsletter === 1 || resp.newsletter === "1") {
        $(".uNewsletter").text("Has Subcribed").addClass("badge badge-success");
    } else {
        $(".uNewsletter").text("Has not subscribed").addClass("badge badge-primary");
    }
    $(".uEmail").text(resp.email);
    localStorage.setItem("uEmail", resp.email);
    $(".uPhone").text(resp.phone);
    $(".uGender").text(resp.gender);
    $(".uTPin").text(resp.TransactionPin);
    $("#pay_subscription .SubscriptionFeesAmount").text(PriceFormat(resp.SubscriptionFeesAmount));
    $("#pay_subscription #subcriptionAmount").val(resp.SubscriptionFeesAmount);
    $("#pay_subscription .SubscriptionName").text(resp.SubscriptionName);
    $("#pay_subscription .SellerTypeName").text(resp.SellerTypeName);


    if (resp.ImageText === "none") {
        var image_url = extension + "assets/images/no-image.png";
        $(".UserImage").attr("src", image_url);
    } else {
        $(".UserImage").attr("src", "data:image/png;base64," + resp.ImageText);
    }

}

function linkToFunction(action, params) {
    switch (action) {
        case "LoadLogin":
        {
            DisplayLogin(params);
            break;
        }
        case "LoadGetWalletDetails":
        {
            DisplayGetWalletDetails(params);
            break;
        }
        case "LoadValidatePaystackPayment":
        {
            DisplayValidatePaystackPayment(params);
            break;
        }
        case "LoadUserDetails":
        {
            DisplayUserDetails(params);
            break;
        }
        case "LoadRecentTransactions":
        {
            var parent = $("#TransactionList");
            DisplayRecentTransactions(params, parent);
            break;
        }
        case "DeleteTransaction":
        {
            var parent = $("#TransactionList");
            DisplayDeleteTransaction(params, parent);
            break;
        }
        case "LoadTransactionTypes":
        {
            DisplayTransactionTypes(params);
            break;
        }
        case "LoadGetPayments":
        {
            var parent = $("#PaymentList");
            DisplayGetPayments(params, parent);
            break;
        }
        case "LoadDeletePayment":
        {
            var parent = $("#PaymentList");
            DisplayDeletePayment(params, parent);
            break;
        }
        case "LoadSubscriptions":
        {
            DisplaySubscriptions(params);
            break;
        }
        case "LoadSubscriptionTypes":
        {
            DisplaySubscriptionTypes(params);
            break;
        }
        case "LoadGetSubscriptionTypes":
        {
            DisplayGetSubscriptionTypes(params);
            break;
        }
        case "LoadSubscriptionAmount":
        {
            DisplaySubscriptionAmount(params);
            break;
        }
        case "LoadSubscriptionInfo":
        {
            DisplaySubscriptionInfo(params);
            break;
        }
        case "LoadSellerTypes":
        {
            DisplaySellerTypes(params);
            break;
        }
        case "LoadGetSellerSellerTypes":
        {
            DisplayGetSellerSellerTypes(params);
            break;
        }
        case "LoadGetSellerTypes":
        {
            DisplayGetSellerTypes(params);
            break;
        }
        case "LoadNewCashoutRequest":
        {
            var parent = $("#cashoutList");
            DisplayNewCashoutRequest(params, parent);
            break;
        }
        case "LoadBanks":
        {
            DisplayBanks(params);
            break;
        }
        case "LoadBankDetailsInfo":
        {
            DisplayBankDetailsInfo(params);
            break;
        }
        case "LoadBankDetails":
        {
            DisplayBankDetails(params);
            break;
        }
        case "LoadBankDetailsInfo":
        {
            DisplayBankDetailsInfo(params);
            break;
        }
        case "LoadCashoutRequests":
        {
            var parent = $("#cashoutList");
            DisplayCashoutRequests(params, parent);
            break;
        }
        case "LoadBankInfo":
        {
            DisplayBankInfo(params);
            break;
        }
        case "LoadDiscountTypes":
        {
            DisplayDiscountTypes(params);
            break;
        }
        case "LoadDeductionTypes":
        {
            DisplayDeductionTypes(params);
            break;
        }
        case "LoadDiscountObject":
        {
            DisplayDiscountObject(params);
            break;
        }
        case "LoadSearchUserDetails":
        {
            DisplaySearchUserDetails(params);
            break;
        }
        case "LoadDiscountCodeInfo":
        {
            DisplayDiscountCodeInfo(params);
            break;
        }
        case "LoadDiscountCodes":
        {
            DisplayDiscountCodes(params);
            break;
        }
        case "LoadMessages":
        {
            var parent = $("#MessageList");
            DisplayMessages(params, parent);
            break;
        }
        case "LoadMessageDetails":
        {
            DisplayMessageDetails(params);
            break;
        }
        case "LoadDeleteMessage":
        {
            DisplayDeleteMessage(params);
            break;
        }
        case "LoadSearchResultDetails":
        {
            DisplaySearchResultDetails(params);
            break;
        }
        case "LoadRootCategories":
        {
            DisplayRootCategories(params);
            break;
        }
        case "LoadAllCategories":
        {
            DisplayAllCategories(params);
            break;
        }
        case "LoadAllLevelCategories":
        {
            DisplayAllLevelCategories(params);
            break;
        }
        case "LoadTwoLevelsCategories":
        {
            DisplayTwoLevelsCategories(params);
            break;
        }
        case "LoadParentCategories":
        {
            DisplayParentCategories(params);
            break;
        }
        case "LoadChildCategories":
        {
            DisplayChildCategories(params);
            break;
        }
        case "LoadCreateCategory":
        {
            DisplayCreateCategory(params);
            break;
        }
        case "LoadProperties":
        {
            DisplayProperties(params);
            break;
        }
        case "LoadPropProperties":
        {
            DisplayPropProperties(params);
            break;
        }
        case "LoadParentProperties":
        {
            DisplayParentProperties(params);
            break;
        }
        case "LoadPropertiesInfo":
        {
            DisplayPropertiesInfo(params);
            break;
        }
        case "LoadNewPropertiesInfo":
        {
            DisplayNewPropertiesInfo(params);
            break;
        }
        case "LoadCategoryInfo":
        {
            DisplayCategoryInfo(params);
            break;
        }
        case "LoadAllCustomers":
        {
            DisplayAllCustomers(params);
            break;
        }
        case "LoadCustomerDetails":
        {
            DisplayCustomerDetails(params);
            break;
        }
        case "LoadRegisterCustomer":
        {
            DisplayRegisterCustomer(params);
            break;
        }
        case "LoadSellerInfo":
        {
            DisplaySellerInfo(params);
            break;
        }
        case "LoadAllSellers":
        {
            DisplayAllSellers(params);
            break;
        }
        case "LoadSellerDetails":
        {
            DisplaySellerDetails(params);
            break;
        }
        case "LoadRegisterSeller":
        {
            DisplayRegisterSeller(params);
            break;
        }
        case "LoadProductConditions":
        {
            DisplayProductConditions(params);
            break;
        }
        case "LoadAllProperties":
        {
            DisplayAllProperties(params);
            break;
        }
        case "LoadCategoryAllProperties":
        {
            DisplayCategoryAllProperties(params);
            break;
        }
        case "LoadStockNotifications":
        {
            DisplayStockNotifications(params);
            break;
        }
        case "LoadUnits":
        {
            DisplayUnits(params);
            break;
        }
        case "LoadCreateProduct":
        {
            DisplayCreateProduct(params);
            break;
        }
        case "LoadProducts":
        {
            DisplayProducts(params);
            break;
        }
        case "LoadProductDetails":
        {
            DisplayProductDetails(params);
            break;
        }
        case "LoadAddProductDetails":
        {
            DisplayAddProductDetails(params);
            break;
        }
        case "LoadProductInfo":
        {
            DisplayProductInfo(params);
            break;
        }
        case "LoadAllProductCategories":
        {
            DisplayAllProductCategories(params);
            break;
        }
        case "LoadCategoryDetails":
        {
            DisplayCategoryDetails(params);
            break;
        }
        case "LoadPropertyDetails":
        {
            DisplayPropertyDetails(params);
            break;
        }
        case "LoadSubscriptionFeesPayment":
        {
            DisplaySubscriptionFeesPayment(params);
            break;
        }
        case "LoadAddressTypes":
        {
            DisplayAddressTypes(params);
            break;
        }
        case "LoadGetAddressTypes":
        {
            DisplayGetAddressTypes(params);
            break;
        }
        case "LoadAddresses":
        {
            DisplayAddresses(params);
            break;
        }
        case "LoadStates":
        {
            DisplayStates(params);
            break;
        }
        case "LoadLGAs":
        {
            DisplayLGAs(params);
            break;
        }
        case "LoadTowns":
        {
            DisplayTowns(params);
            break;
        }
        case "LoadBusStops":
        {
            DisplayBusStops(params);
            break;
        }
        case "LoadStreets":
        {
            DisplayStreets(params);
            break;
        }
        case "LoadAllShopCarts":
        {
            var parent = $(".CartList");
            DisplayAllShopCarts(params, parent);
            break;
        }
        case "LoadDeletCart":
        {
            var parent = $(".CartList");
            DisplayDeletCart(params, parent);
            break;
        }
        case "LoadCartProductDetails":
        {
            DisplayCartProductDetails(params);
            break;
        }
        case "LoadNewShippingAddress":
        {
            DisplayNewShippingAddress(params);
            break;
        }
        case "LoadShippings":
        {
            var parent = $(".shippingsList");
            DisplayShippings(params, parent);
            break;
        }
        case "LoadDeleteShipping":
        {
            var parent = $(".shippingsList");
            DisplayDeleteShipping(params, parent);
            break;
        }
        case "LoadShippingFees":
        {
            var parent = $(".ShippingFeesList");
            DisplayShippingFees(params, parent);
            break;
        }
        case "LoadShippingFeesOptions":
        {
            var parent = $(".ShippingFeesList");
            DisplayShippingFeesOptions(params, parent);
            break;
        }
        case "LoadOrders":
        {
            var parent = $(".OrderList");
            DisplayOrders(params, parent);
            break;
        }
        case "LoadOrderDetails":
        {
            DisplayOrderDetails(params);
            break;
        }
        case "LoadOrderStatus":
        {
            DisplayOrderStatus(params);
            break;
        }
        case "LoadOrderShippingMethods":
        {
            DisplayOrderShippingMethods(params);
            break;
        }
        case "LoadUpdateOrderStatus":
        {
            DisplayUpdateOrderStatus(params);
            break;
        }
        case "LoadUpdateSellerPayment":
        {
//            DisplayUpdateOrderStatus(params);
            break;
        }
        case "LoadStockMovement":
        {
            DisplayStockMovement(params);
            break;
        }
        case "LoadProductRestock":
        {
            DisplayProductRestock(params);
            break;
        }
        case "LoadAddressTypeOption":
        {
            DisplayAddressTypeOption(params);
            break;
        }
        case "LoadCompaints":
        {
            DisplayComplaints(params);
            break;
        }
        case "LoadComplaintOption":
        {
            DisplayComplaintOption(params);
            break;
        }
        case "LoadNewFeatureRequest":
        {
            DisplayNewFeatureRequest(params);
            break;
        }
        case "LoadNewFeatureOption":
        {
            DisplayNewFeatureOption(params);
            break;
        }
        case "LoadNewMessage":
        {
            DisplayNewMessage(params);
            break;
        }
        case "LoadOrderCancelRule":
        {
            DisplayOrderCancelRule(params);
            break;
        }
        case "LoadUpdateEnforceCancelFees":
        {
            DisplayUpdateEnforceCancelFees(params);
            break;
        }
        case "LoadUserReviews":
        {
            DisplayUserReviews(params);
            break;
        }
        case "LoadDeleteReview":
        {
            DisplayDeleteReview(params);
            break;
        }
        case "LoadAllGuests":
        {
            DisplayAllGuests(params);
            break;
        }
        case "LoadResetPassword":
        {
            DisplayResetPassword(params);
            break;
        }
        case "LoadPasswordRecovery":
        {
            DisplayPasswordRecovery(params);
            break;
        }
        case "LoadValidateAccount":
        {
            DisplayValidateAccount(params);
            break;
        }


    }
}
