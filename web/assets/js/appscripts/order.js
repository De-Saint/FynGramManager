/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
$(document).ready(function () {
    orderFunctions();
});


function orderFunctions() {
    orderBtnEvents();
    orderSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    orderPageFunctions();
}


function orderBtnEvents() {

}
function orderSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-order").addClass("active");
}


function orderPageFunctions() {
    showLoader();
    GetData("Order", "GetOrders", "LoadOrders", sessionid);
}

function DisplayOrders(data, parent) {
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var awaitingcount = 0;
        var confirmedcount = 0;
        var shippedcount = 0;
        var cancelledcount = 0;
        var deliveredcount = 0;
        var count = 0;
        var childclone = parent.find(".orderclone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("orderclone");
            newchild.addClass("newclone");
            newchild.find(".order-sn").text(count);
            newchild.find(".order-reference").text(result["reference"]);
            newchild.find(".order-customer").text(result["CustomerName"]);
            newchild.find(".order-amount").text(PriceFormat(parseFloat(result["seller_amount"])));
            newchild.find(".order-seller").text(result["SellerDetails"].business_name);
            newchild.find(".order-payment").text(result["PaymentDetails"].payment_method);
            newchild.find(".order-status").text(result["StatusDetails"].name).addClass("badge-" + result["StatusDetails"].color);
            newchild.find(".order-bookeddate-time").text(result["booking_date"] + " " + result["booking_time"]);
           
            if (result["StatusDetails"].name === "Awaiting Confirmation") {
                awaitingcount++;
            } else if (result["StatusDetails"].name === "Confirmed") {
                confirmedcount++;
            } else if (result["StatusDetails"].name === "Cancelled") {
                cancelledcount++;
            } else if (result["StatusDetails"].name === "Shipped") {
                shippedcount++;
            } else if (result["StatusDetails"].name === "Delivered") {
                deliveredcount++;
            }
            var detailsbtn = newchild.find(".btn-order-details");
            detailsbtn.click(function () {
                 var sessiontype = GetSessionType();
                 
                if (sessiontype === "Admin") {
                     localStorage.setItem("orderid", result["OrderID"]);
                    window.location = extension + "LinksServlet?type=AdminOrderDetails";
                } else if (sessiontype === "Seller") {
                     localStorage.setItem("orderid", result["OrderID"]);
                    window.location = extension + "LinksServlet?type=SellerOrderDetails";
                }
            });
            newchild.appendTo(parent).show();
        });
        $(".order_total_count").text(NumberFormat(totalcount));
        $(".order_awaiting_count").text(NumberFormat(awaitingcount));
        $(".order_confirmed_count").text(NumberFormat(confirmedcount));
        $(".order_shipped_count").text(NumberFormat(shippedcount));
        $(".order_cancelled_count").text(NumberFormat(cancelledcount));
        $(".order_delivered_count").text(NumberFormat(deliveredcount));
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan:"9", text: "No Result Found"}).appendTo(row);

    }
}
