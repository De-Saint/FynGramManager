/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid;
$(document).ready(function () {
    stockFunctions();
});


function stockFunctions() {
    stockBtnEvents();
    stockSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
}


function stockBtnEvents() {
    showLoader();
    GetData("Stock", "GetStockMovement", "LoadStockMovement", sessionid);
}
function stockSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-stock").addClass("active");
}
function DisplayStockMovement(data) {
    hideLoader();
    var parent = $(".StockList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var totalretuned = 0;
        var totalpurchased = 0;
        var count = 0;
        var childclone = parent.find(".stock-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("stock-clone");
            newchild.addClass("newclone");
            newchild.find(".stock-sn").text(count);
           
            if (result["name"] === "Product Returned") {
                totalretuned++;
                 newchild.find(".stock-name").text(result["name"]).addClass("badge-danger");
            } else if (result["name"] === "Product Ordered") {
                totalpurchased++;
                 newchild.find(".stock-name").text(result["name"]).addClass("badge-success");
            }
            newchild.find(".stock-product-name").text(result["ProductName"]);
            newchild.find(".stock-seller-name").text(result["SellerName"]);
            newchild.find(".stock-cutomer-name").text(result["CustomerName"]);
            newchild.find(".stock-previous-qty").text(result["product_previous_quantity"]);
            newchild.find(".stock-order-qty").text(result["product_quantity"]);
            newchild.find(".stock-current-qty").text(result["product_current_quantity"]);
            newchild.find(".stock-date").text(result["date"]);
            newchild.find(".stock-time").text(result["time"]);
            newchild.appendTo(parent).show();
        });
        $(".stock-total-count").text(totalcount);
        $(".stock-total-purchased").text(totalpurchased);
        $(".stock-total-returned").text(totalretuned);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "ml-9 text-center newclone text-primary", colspan: "10", text: "No Result Found"}).appendTo(row);
    }
}