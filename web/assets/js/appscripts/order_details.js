/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var orderid = 0;
$(document).ready(function () {
    orderDetailsFunctions();
});

function GetOrderID() {
    return orderid = localStorage.getItem("orderid");
}
function orderDetailsFunctions() {
    orderDetailsBtnEvents();
    orderDetailsSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    orderDetailsPageFunctions();
}


function orderDetailsBtnEvents() {
    $('#orderstatuses').select2({
        containerCssClass: 'select2-full-color select2-indigo',
        dropdownCssClass: 'select2-drop-color select2-drop-indigo'
    });
    $('#ordershipmethod').select2({
        containerCssClass: 'select2-full-color select2-indigo',
        dropdownCssClass: 'select2-drop-color select2-drop-indigo'
    });

    $("#AssignOrderShippingMethod").click(function () {
        var shippingmethodid = $("#ordershipmethod").val();
        orderid = GetOrderID();
        showLoader();
        var data = [orderid, shippingmethodid];
        GetData("Order", "AssignShippingMethod", "LoadUpdateOrderStatus", data);
    });
    $(".UpdateOrderStatusBtn").click(function () {
        orderid = GetOrderID();
        var statusid = $("#orderstatuses").val();
        swal({
            title: 'Order',
            text: "You are about to change the status of this order. Do you wish to continue?",
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            if (dismiss) {
                showLoader();
                var data = [orderid, statusid, sessionid];
                GetData("Order", "UpdateOrderStatus", "LoadUpdateOrderStatus", data);
            }
        });

    });
    
}
function orderDetailsSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-order").addClass("active");
}


function orderDetailsPageFunctions() {
    orderid = GetOrderID();
    showLoader();
    GetData("Order", "GetOrderDetails", "LoadOrderDetails", orderid);

    GetData("Order", "GetOrderStatus", "LoadOrderStatus", "");
    GetData("Shipping", "GetShippings", "LoadOrderShippingMethods", "");

}


function DisplayOrderDetails(data) {
    hideLoader();
    $(".order_seller_amount").text(PriceFormat(data.OrderDetails.seller_amount));
    $(".order_booked_date").text(data.OrderDetails.booking_date);
    $(".order_reference").text(data.OrderDetails.reference);
    $(".order_shipping_fees").text(PriceFormat(data.OrderDetails.delivery_fees));
    $(".order_status").text(data.OrderDetails.StatusDetails.name).addClass("badge-" + data.OrderDetails.StatusDetails.color);
    $(".order-ship-type").text(data.OrderDetails.ShippingTypeName);
    $(".order-ship-address").text(data.OrderDetails.ShippingAddressDetails.full_address);
    $(".order_note").text(data.OrderDetails.message);

    if (data.OrderDetails.DiscountCode === "none") {
        $(".order_discount_code").text("N/A");
        $(".order_discount-deduction-type").text("N/A");
        $(".order-discount-deduction-amount").text("N/A");
    } else {
//        alert($.isEmptyObject(data.OrderDetails.DiscountCode)+"no test");

        $(".order_discount_code").text(data.OrderDetails.DiscountCode);
        $(".order_discount-deduction-type").text(data.OrderDetails.DiscountDeductionType);
        $(".order-discount-deduction-amount").text(PriceFormat(data.OrderDetails.discount_amount));
    }


    var historydata = data.OrderDetails.HistoryDetails;
    DisplayOrderHistoryProducts(historydata);

    var invoicedata = data.OrderDetails.InvoiceDetails;
    DisplayInvoiceDetails(invoicedata);

    var paymentdata = data.OrderDetails.PaymentDetails;
    DisplayPaymentDetails(paymentdata);

    var sellerdata = data.OrderDetails.SellerDetails;
    DisplaySellerDetails(sellerdata);

    var customerdata = data.OrderDetails.CustomerDetails;
    DisplayCustomerDetails(customerdata);





    var stataushistorydata = data.OrderDetails.StatusHistoryDetails;
    DisplayStatusHistoryDetails(stataushistorydata);


    var orderstatus = data.OrderDetails.StatusDetails.name;
    if (orderstatus === "Awaiting Confirmation") {
        $("#AssignOrderShippingMethod").addClass("d-none");
        $(".shippingNote1").removeClass("d-none");
        $(".shippingNote2").addClass("d-none");
    } else if (orderstatus === "Confirmed") {
        $("#AssignOrderShippingMethod").removeClass("d-none");
        $(".UpdateOrderStatusBtn").addClass("d-none");
        $(".shippingNote1").addClass("d-none");
        $(".shippingNote2").removeClass("d-none");
    }
    if (orderstatus === "Delivered" || orderstatus === "Cancelled") {
        $(".OrderDeleteBtn").removeClass("d-none");
    }
    var shippingmethoddata = data.OrderDetails.ShippingMethodDetails;
    DisplayShippingMethodDetails(shippingmethoddata);

}
function DisplayStatusHistoryDetails(data) {
    var parent = $(".order-status-history");
    parent.find(".new-clone").remove();
    if (data === "none") {
        parent.text("No Results");
    } else {
        var childclone = parent.find(".order-status-history-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("order-status-history-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".status-hist-sn").text("#" + count);
            newchild.find(".status-hist-name").text(details.name).addClass("badge-" + details.color);
            newchild.find(".status-hist-date").text(details.date);
            newchild.find(".status-hist-time").text(details.time);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}


function DisplayOrderHistoryProducts(data) {
    var parent = $(".hstory_productlist");
    parent.find(".new-clone").remove();
    if (data === "none") {
        parent.text("No Results");
    } else {
        var childclone = parent.find(".historyproductclone");
        var count = 0;
        var order_product_count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("historyproductclone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".order-p-sn").text("#" + count);
            newchild.find(".order-p-name").text(details.ProductDetails.InfoDetails.name);
            var descbtn = newchild.find(".order-p-desc").text(details.ProductDetails.InfoDetails.description);
            newchild.find(".order-p-price").text(PriceFormat(details.ProductDetails.PriceDetails.selling_price));
            newchild.find(".order-p-order-quantity").text(details.quantity);
            var amount = parseInt(details.quantity) * parseFloat(details.ProductDetails.PriceDetails.selling_price);
            newchild.find(".order-p-order-price").text(PriceFormat(amount));
            newchild.find(".order-p-order-seller").text(details.ProductDetails.SellerDetails.SellerUserName);
            order_product_count++;
            if (details.ProductDetails.FirstImage === "0" || details.ProductDetails.FirstImage === 0) {
                var image_url = extension + "assets/images/no-image.png";
                newchild.find(".order-p-image").attr("src", image_url);
            } else if (details.ProductDetails.FirstImage !== "0" || details.ProductDetails.FirstImage !== 0) {
                newchild.find(".order-p-image").attr("src", "data:image/png;base64," + details.ProductDetails.FirstImage);
            }
//             descbtn.hover(function () {
//                descbtn.addClass("text-primary");
//            }, function () {
//                descbtn.removeClass("text-primary");
//            });

            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".order_p_count").text(NumberFormat(order_product_count));
    }
}


function DisplaySellerDetails(data) {
    $(".seller-d-name").text(data.business_name);
    $(".seller-d-email").text(data.business_email);
    $(".seller-d-phone").text(data.business_phone);
    $(".seller-d-packinfo-from").text(data.shipStartDate);
    $(".seller-d-packinfo-to").text(data.shipStartDate);
    $(".viewSeller").click(function () {
        localStorage.setItem("selleruserid", data.seller_userid);
        window.location = extension + "LinksServlet?type=AdminSellerDetails";
    });
}

function DisplayCustomerDetails(data) {
    $(".customer-d-name").text(data.CustName);
    $(".customer-d-email").text(data.CustEmail);
    $(".customer-d-phone").text(data.CustPhone);
    $(".customer-date-reg").text(data.CustDateReg);
    $(".viewCustomer").click(function () {
        window.location = extension + "LinksServlet?type=AdminCustomerDetails&customeruserid=" + data.userid;
    });
}

function DisplayPaymentDetails(data) {
    $(".payment-type").text(data.payment_method);
    $(".payment-ref-code").text(data.reference_code);
    $(".payment-amount").text(PriceFormat(data.amount));
}

function DisplayInvoiceDetails(data) {
    $(".invoice-number").text(data.number);
    $(".invoice-date").text(data.InvoiceDate);
    $(".invoice-time").text(data.InvoiceTime);
    $(".invoice-amount").text(PriceFormat(data.amount));
}

function DisplayShippingMethodDetails(data) {
    if (!$.isEmptyObject(data)) {
        $(".assign-ship-meth-name").text(data.name);
        $(".assign-ship-meth-email").text(data.email);
        $(".assign-ship-meth-phone").text(data.phone);
        $(".shippingNote2").addClass("d-none");
        $(".UpdateOrderStatusBtn").removeClass("d-none");
    }
}

function DisplayOrderStatus(data) {
    var cs = $("#orderstatuses");
    if (data === "none") {
        cs.text("No Results");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Status"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
    }
}
function DisplayOrderShippingMethods(data) {
    var cs = $("#ordershipmethod");
    if (data === "none") {
        cs.text("No Results");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Shipping Method"));
        $.each(ids, function (index, id) {
            var details = result[id];
            var res = details["name"] + " - " + details["email"] + " - " + details["phone"];
            cs.append($('<option/>').val(details["id"]).text(res));

        });
    }
}

function DisplayUpdateOrderStatus(data) {
    var resp = data.result;
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Order',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            var orderdetail = data;
            DisplayOrderDetails(orderdetail);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Order",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }

}