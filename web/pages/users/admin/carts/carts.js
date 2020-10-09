/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
$(document).ready(function () {
    cartFunctions();
});


function cartFunctions() {
    cartBtnEvents();
    cartSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    cartPageFunctions();
}


function cartBtnEvents() {

}
function cartSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-cart").addClass("active");
}

function cartPageFunctions() {
    showLoader();
    GetData("Cart", "GetAllShopCarts", "LoadAllShopCarts", "");
}


function DisplayAllShopCarts(data, parent) {
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var discountcount = 0;
        var count = 0;
        var childclone = parent.find(".cartclone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("cartclone");
            newchild.addClass("newclone");
            newchild.find(".cart-sn").text(count);
            newchild.find(".cart-name").text(result["cartUsername"]);
            newchild.find(".cart-amount").text(PriceFormat(parseFloat(result["amount"])));
            var discountcode = result["discount_code_id"];
            if (discountcode === "0") {
                newchild.find(".cart-discount").text("No");
                newchild.find(".cart-discount-value").text(PriceFormat(0));
            } else {
                discountcount++;
                newchild.find(".cart-discount").text("Yes");
                newchild.find(".cart-discount-value").text(PriceFormat(parseFloat(result["discount_amount"])));
            }

            newchild.find(".cart-total-amount").text(PriceFormat(parseFloat(result["total_amount"])));
            newchild.find(".cart-date-time").text(result["date"]);
            newchild.find(".cart-ship-type").text(result["shippingTypeName"]);
            newchild.find(".cart-product-count").text(result["product_count"] + " Product(s)");
            newchild.find(".cart-product-count").text(result["product_count"] + " Product(s)");

            var shipping_type_id = result["shipping_type_id"];
            if (shipping_type_id === "0") {
                newchild.find(".cart-ship-fees").text(PriceFormat(0));
            } else {
                newchild.find(".cart-ship-fees").text(PriceFormat(parseFloat(result["fees"])));
            }
            var status = result["status"];
            if (status === "Pending") {
                newchild.find(".cart-status").text(result["status"]).addClass("badge-primary");
            } else {
                newchild.find(".cart-status").text(result["status"]).addClass("badge-success");
            }


            var deletebtn = newchild.find(".btn-cart-delete");
            var detailsbtn = newchild.find(".btn-cart-details");

            detailsbtn.click(function () {//
                localStorage.setItem("cartid", result["id"]);
                var cartdata = result["date"] + "-" + result["status"] + "-" + result["cartUsername"] + "-" + result["total_amount"]  + "-" + result["cartPhone"] ;
                localStorage.setItem("cart", cartdata);
                window.location = extension + "LinksServlet?type=AdminCartDetails";
            });
            DisplayToolTip(detailsbtn);
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                swal({
                    title: 'Cart',
                    text: "Are you sure you want to delete this cart and the details?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Cart", "DeleteCart", "LoadDeletCart", result["id"]);
                    }
                });

            });
            newchild.appendTo(parent).show();
        });
        $(".cart_total_count").text(NumberFormat(totalcount));
        $(".cart_total_discount_count").text(NumberFormat(discountcount));
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "12", text: "No Results Found"}).appendTo(row);

    }
}

function DisplayDeletCart(data, parent) {
    hideLoader();
    var resp = data[3];
    if (resp.status === "success") {
        swal({
            title: 'Cart',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayAllShopCarts(data, parent);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Cart",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }

}