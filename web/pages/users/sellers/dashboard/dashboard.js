/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    dashBoardFunctions();
});


function dashBoardFunctions() {
    dashBoardBtnEvents();
    dashBoardSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    dashBoardPageFunctions();
}


function dashBoardBtnEvents() {
    $("form[name=subscriptionForm]").submit(function (e) {
        var subcriptionAmount = $("#subcriptionAmount").val();
        if (subcriptionAmount.includes(",")) {
            subcriptionAmount = subcriptionAmount.replace(/,/g, "");
        }
        var newPaymentAmount = CalculatePercentage(subcriptionAmount);
        $("#pay_subscription").modal("hide");
        var email = localStorage.getItem("uEmail");
        dashboardPayWithPaystack(newPaymentAmount, email, subcriptionAmount, "Subscription Fees");
        e.preventDefault();
    });
    startTime();

    /* Chartjs (#doChart) closed */
}

function startTime() {
    var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
    document.getElementById('HHours').innerHTML = h;
    document.getElementById('MMinutes').innerHTML = m;
    document.getElementById('SSeconds').innerHTML = s;
    t = setTimeout(function () {
        startTime();
    }, 500);
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}
function dashBoardSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-dash").addClass("active");
}

function CalculatePercentage(userAmt) {
    var addedPerc = (parseInt(userAmt) * parseFloat(0.02));
    var newAmt = parseInt(userAmt) + parseInt(addedPerc);
    if (parseInt(userAmt) >= parseInt(2500)) {
        newAmt = parseInt(userAmt) + parseInt(100);
    }
    return newAmt;
}
function dashBoardPageFunctions() {
    showLoader();
    GetData("Products", "GetDashBoardProducts", "LoadDashBoardProducts1", sessionid);
    GetData("Order", "GetDashBoardOrders", "LoadDashBoardOrders1", sessionid);
    GetData("Wallet", "GetWalletDetails", "LoadDashBoardWalletDetails1", sessionid);
    GetData("Report", "GetStats", "LoadDashBoardStats", sessionid);

}

function DisplayDashBoardStats(data) {

    $(".total_subscriptions").text(NumberFormat(data.subscription_count));
    $(".total_orders").text(NumberFormat(data.order_count));
    $(".total_cashout").text(NumberFormat(data.cashout_count));
    $(".total_balance").text(PriceFormat(data.wallet_balance));
    $(".total_payments").text(NumberFormat(data.payment_count));
    $(".total_category").text(NumberFormat(data.category_count));
    $(".total_transactions").text(NumberFormat(data.transaction_count));
    $(".total_messages").text(NumberFormat(data.message_count));

}

function dashboardPayWithPaystack(paymentamount, email, actualamount, PaymentType) {
    var userDetail = localStorage.getItem("UserName");
    var handler = PaystackPop.setup({
        key: 'pk_live_7bc21edb14ba7fe0400a3b71a126c2305171d37a',
//        key: 'pk_test_c819ab617f5085772d511e6e5cafc3785367cb78',
        email: email,
        amount: paymentamount + "00",
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        metadata: {
            custom_fields: [
                {
                    display_name: "Customer Name",
                    variable_name: "Customer Name",
                    value: userDetail
                },
                {
                    display_name: "Payment Type",
                    variable_name: "Payment Type",
                    value: PaymentType
                }
            ]
        },
        callback: function (response) {
            var data = [sessionid, actualamount, response.reference, response.trans, PaymentType];
            showLoader();
            GetData("Payment", "ValidatePaystackPayment", "LoadSubscriptionFeesPayment", data);
        },
        onClose: function () {
            swal({
                title: "PayStack CheckOut!",
                text: "CheckOut closed, transaction terminated",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: 'btn btn-danger',
                conffirmButtonText: 'Retry'
            });
        }
    });
    handler.openIframe();
}


function DisplaySubscriptionFeesPayment(data) {
    var resp = data.result;
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Suscription Fees',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            var userdata = data.userdata;
            DisplayUserDetails(userdata);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Suscription Fees",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Try Again',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }

}


function DisplayDashBoardProducts1(data) {
    hideLoader();
    var parent = $("#DashProductList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var childclone = parent.find(".prodlist-clone").removeClass("d-none");
        var count = 0;
        var ids = data[0];
        var result = data[1];
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("prodlist-clone");
            newchild.addClass("new-clone");
            newchild.find(".prod-sn").text(count);
            var ProductID = details["ProductID"];
            newchild.find(".prod-id").val(ProductID);
            newchild.find(".prod-name").text(details["InfoDetails"].name).click(function () {
                var sessiontype = GetSessionType();
                if (sessiontype === "Admin") {
                    localStorage.setItem("productid", ProductID);
                    window.location = extension + "LinksServlet?type=AdminProductDetails";
                } else if (sessiontype === "Seller") {
                    localStorage.setItem("productid", ProductID);
                    window.location = extension + "LinksServlet?type=SellerProductDetails";
                }
            });

            var status = details["SellerDetails"].status;
            if (status === "Pending") {
                newchild.find(".btn-prod-activate").removeClass("d-none");
                newchild.find(".btn-prod-reject").removeClass("d-none");
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-primary");
            } else if (status === "Activated") {
                newchild.find(".btn-prod-deactivate").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-success");
            } else if (status === "Deactivated") {
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".btn-prod-activate").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-danger");
            } else if (status === "Rejected") {
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-danger");
            }

            newchild.find(".prod-rootcategory").text(details["RootCatName"]);
            newchild.find(".prod-sellername").text(details["SellerDetails"].SellerUserName);
            newchild.find(".prod-quantity").text(details["QuantityDetails"].total_quantity);
            newchild.find(".prod-price").text(PriceFormat(details["PriceDetails"].selling_price));

            if (details["FirstImage"] === "0" || details["FirstImage"] === 0) {
                var image_url = extension + "assets/images/brand/logo.png";
                newchild.find(".prod-firstimage").attr("src", image_url);
            } else if (details["FirstImage"] !== "0" || details["FirstImage"] !== 0) {
                newchild.find(".prod-firstimage").attr("src", "data:image/png;base64," + details["FirstImage"]);
            }

            newchild.appendTo(parent).show();
        });
        childclone.hide();
    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "9", text: "No Result Found"}).appendTo(row);

    }
}


function DisplayDashBoardOrders1(data) {
    var parent = $(".dashOrderList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var awaitingcount = 0;
        var confirmedcount = 0;
        var shippedcount = 0;
        var cancelledcount = 0;
        var deliveredcount = 0;
        var disputecount = 0;
        var settledcount = 0;
        var childclone = parent.find(".order-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("order-clone");
            newchild.addClass("newclone");
            newchild.find(".order-sn").text(count);
            newchild.find(".order-reference").text(result["reference"]);
            newchild.find(".order-customer").text(result["CustomerName"]);
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
            } else if (result["StatusDetails"].name === "Settled") {
                settledcount++;
            } else if (result["StatusDetails"].name === "Dispute") {
                disputecount++;
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
        $(".order_awaiting_count").text(NumberFormat(awaitingcount));
        $(".order_confirmed_count").text(NumberFormat(confirmedcount));
        $(".order_shipped_count").text(NumberFormat(shippedcount));
        $(".order_cancelled_count").text(NumberFormat(cancelledcount));
        $(".order_delivered_count").text(NumberFormat(deliveredcount));
        $(".order_settled_count").text(NumberFormat(settledcount));
        $(".order_dispute_count").text(NumberFormat(disputecount));
        doughnutChart1(deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "9", text: "No Result Found"}).appendTo(row);

    }
}
function doughnutChart1(deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount) {
    /* Chart-js (#donutChart) */
    var doughnut = document.getElementById("donutChart1");
    var myDoughnutChart = new Chart(doughnut, {
        type: 'doughnut',
        data: {
            labels: ["Delivered", "Awaiting Confirmation", "Cancelled", "Shipped", "Confirmed", "Settled", "Dispute"],
            datasets: [{
                    label: "My First dataset",
                    data: [deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount],
                    backgroundColor: [
                        'rgb(39, 177, 43, 0.9)', //
                        'rgb(34, 5, 191,0.8)',
                        'rgb(249,72,89, 0.9)', //
                        'rgb(9, 176, 236,0.8)',
                        'rgb(245, 151, 0,0.9)',
                        'rgb(0,100,0, 0.9)',
                        'rgb(249,72,89, 0.9)'

                    ],
                    borderColor: [
                        'rgb(39, 177, 43, 0.9)', //
                        'rgb(34, 5, 191,0.2)',
                        'rgb(249,72,89, 0.9)', //
                        'rgb(9, 176, 236,0.8)',
                        'rgb(245, 151, 0,0.9)',
                        'rgb(0,100,0, 0.9)',
                        'rgb(249,72,89, 0.9)'
                    ],
                }]
        },
        options: {
            maintainAspectRatio: false,
            cutoutPercentage: 60,
            legend: {
                display: false
            },
        },
        elements: {
            line: {
                borderWidth: 1
            },
            point: {
                radius: 4,
                hitRadius: 10,
                hoverRadius: 4
            }
        }
    });
    /* Chart-js (#donutChart) closed */

}


function DisplayDashBoardWalletDetails1(resp) {
    if (resp) {
        $(".dashTotalBal").text(PriceFormat(parseFloat(resp.MainBalance) + parseFloat(resp.PendingBalance)));
        $(".dashMainBal").text(PriceFormat(parseFloat(resp.MainBalance)));
        var total = parseFloat(resp.MainBalance) + parseFloat(resp.PendingBalance);
        SellerChart(total, resp.MainBalance, resp.PendingBalance);
        $(".dashPendingBal").text(PriceFormat(parseFloat(resp.PendingBalance)));
    }
}

function SellerChart(total, TotalMainWallets, TotalPendingWallets) {
    /* Chartjs (#doChart) */
    var doughnut = document.getElementById("doChart");
    var myDoughnutChart = new Chart(doughnut, {
        type: 'doughnut',
        data: {
            labels: ["Total Account", "Main Account", "Pending Account"],
            datasets: [{
                    label: "Total Balances",
                    data: [total, TotalMainWallets, TotalPendingWallets],
                    backgroundColor: ['#2205bf', '#f57b4e', '#08bfe0'],
                    borderColor: ['#2205bf', '#f57b4e', '#08bfe0']
                }]
        },
        options: {
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            legend: {
                display: true
            },
        }
    });
}

