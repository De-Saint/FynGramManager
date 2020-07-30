/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var cartid = 0, cart;
$(document).ready(function () {
    cartDetailsFunctions();
});

function GetCartID() {
    return cart = localStorage.getItem("cartid");
}
function GetCartData() {
    return cartid = localStorage.getItem("cart");
}

function cartDetailsFunctions() {
    cartDetailsBtnEvents();
    cartDetailsSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    cartDetailsPageFunctions();
}


function cartDetailsBtnEvents() {

}
function cartDetailsSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-cart").addClass("active");
}

function cartDetailsPageFunctions() {
    var cartid = GetCartID();
    showLoader();
    GetData("Cart", "GetCartProductDetails", "LoadCartProductDetails", cartid);
}

function DisplayCartProductDetails(data) {
    hideLoader();
    var proddata = data.CartProductDetails;
    var parent = $(".cart_productlist");
    parent.find(".new-clone").remove();
    if (proddata === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".cartproductclone");
        var count = 0;
        $.each(proddata, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("cartproductclone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".cart-p-sn").text("#" + count);
            newchild.find(".cart-p-name").text(details.ProductDetails.InfoDetails.name);
            newchild.find(".cart-p-desc").text(details.ProductDetails.InfoDetails.description);
            newchild.find(".cart-p-price").text(PriceFormat(details.ProductDetails.PriceDetails.selling_price));
            newchild.find(".cart-p-cart-quantity").text(details.product_quantity);
            newchild.find(".cart-p-cart-price").text(PriceFormat(details.product_price));
            newchild.find(".cart-p-cart-seller").text(details.ProductDetails.SellerDetails.SellerUserName);
//
            if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                var image_url = extension + "assets/images/no-image.png";
                newchild.find(".cart-p-image").attr("src", image_url);
            } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                newchild.find(".cart-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
            }
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
//20ᵗʰ July 2020-Pending-Epleele Deekor-12000.0"
    var cart = GetCartData();
    $(".cart-d-date").text(cart.split("-")[0]);
    $(".cart-d-status").text(cart.split("-")[1]);
    $(".cart-d-uname").text(cart.split("-")[2]);
    $(".cart-d-amount").text(PriceFormat(parseFloat(cart.split("-")[3])));

}