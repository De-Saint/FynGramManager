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
    startTime();
}
function dashBoardSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-dash").addClass("active");
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

function dashBoardPageFunctions() {
    GetData("Products", "GetDashBoardProducts", "LoadDashBoardProducts", sessionid);
    GetData("Order", "GetDashBoardOrders", "LoadDashBoardOrders", sessionid);
    GetData("Wallet", "GetWalletDetails", "LoadDashBoardWalletDetails", sessionid);
    GetData("Report", "GetStats", "LoadDashBoardReports", sessionid);
}

function DisplayDashBoardReports(data) {
    console.log(data);

    $(".total_subscriptions").text(NumberFormat(data.subscription_count));
    $(".total_customer").text(NumberFormat(data.customer_count));
    $(".total_orders").text(NumberFormat(data.order_count));
    $(".total_sellers").text(NumberFormat(data.sellers_count));
    $(".total_guest").text(NumberFormat(data.guest_count));
    $(".total_discount_code").text(data.discount_count);
    $(".total_cashout").text(NumberFormat(data.cashout_count));
    $(".total_balance").text(PriceFormat(data.wallet_balance));
    $(".total_shippings").text(NumberFormat(data.shipping_count));
    $(".total_payments").text(NumberFormat(data.payment_count));
    $(".total_products").text(NumberFormat(data.product_count));
    $(".total_category").text(NumberFormat(data.category_count));
    $(".total_transactions").text(NumberFormat(data.transaction_count));
    $(".total_properties").text(NumberFormat(data.properties_count));
    $(".total_reviews").text(NumberFormat(data.review_count));
    $(".total_messages").text(NumberFormat(data.message_count));
    $(".total_address").text(NumberFormat(data.address_count));
}

function DisplayDashBoardProducts(data) {
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


function DisplayDashBoardOrders(data) {
    hideLoader();
    var parent = $("#DashOrderList");
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
        doughnutChart(deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "9", text: "No Result Found"}).appendTo(row);

    }
}

function DisplayDashBoardWalletDetails(resp) {
    hideLoader();
    if (resp) {
        $(".dashTotalInAllWallets").text(PriceFormat(parseFloat(resp.TotalMainWallets) + parseFloat(resp.TotalPendingWallets)));
        barChart(resp.TotalMainWallets, resp.TotalPendingWallets, resp.TotalFyngramBalance, resp.TotalSellerBalance, resp.TotalCustomerBalance);

    }
}

function barChart(TotalMainWallets, TotalPendingWallets, TotalFyngramBalance, TotalSellerBalance, TotalCustomerBalance) {
    /* Chart-js (#bar-chart) */
    var myCanvas = document.getElementById("bar-chart");
    myCanvas.height = "202";
    var myCanvasContext = myCanvas.getContext("2d");
    var gradientStroke1 = myCanvasContext.createLinearGradient(0, 120, 0, 180);
    gradientStroke1.addColorStop(0, 'rgb(10, 144, 251,0.7)');
    gradientStroke1.addColorStop(1, 'rgb(10, 144, 251,0.9)');
    var myChart = new Chart(myCanvas, {
        type: 'bar',
        data: {
            labels: ["All Main Acct", "All Pending Acct", "Fyngram", "All Sellers", "All Customers"],
            datasets: [{
                    label: 'Total Balances',
                    data: [TotalMainWallets, TotalPendingWallets, TotalFyngramBalance, TotalSellerBalance, TotalCustomerBalance, 0],
                    backgroundColor: gradientStroke1,
                    hoverBackgroundColor: gradientStroke1,
                    hoverBorderWidth: 2,
                    hoverBorderColor: 'gradientStroke1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                cornerRadius: 3,
                intersect: false,
            },
            legend: {
                display: false,
                labels: {
                    usePointStyle: true,
                },
            },
            scales: {
                xAxes: [{
                        barPercentage: 0.3,
                        display: true,
                        gridLines: {
                            display: true,
                            color: 'rgb(142, 156, 173,0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            fontColor: '#8e9cad',
                            autoSkip: true,
                            maxTicksLimit: 9,
                            maxRotation: 0,
                            labelOffset: 10
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Month',
                            fontColor: 'transparent'
                        }
                    }],
                yAxes: [{
                        ticks: {
                            fontColor: "#8e9cad",
                        },
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'sales',
                            fontColor: 'transparent'
                        }
                    }]
            },
            title: {
                display: false,
                text: 'Normal Legend'
            },

            elements: {
                line: {
                    borderWidth: 2
                },
                point: {
                    radius: 0,
                    hitRadius: 10,
                    hoverRadius: 4
                }
            }
        }
    });
    /* Chart-js (#bar-chart) closed */
}

function doughnutChart(deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount) {
    /* Chart-js (#donutChart) */
    var doughnut = document.getElementById("donutChart");
    var myDoughnutChart = new Chart(doughnut, {
        type: 'doughnut',
        data: {
            labels: ["Delivered", "Awaiting Confirmation", "Cancelled", "Shipped", "Confirmed", "Settled", "Dispute"],
            datasets: [{
                    label: "My First dataset",
                    data: [deliveredcount, awaitingcount, cancelledcount, shippedcount, confirmedcount, settledcount, disputecount],
                    backgroundColor: [
                        'rgb(39, 177, 43, 0.9)',//
                        'rgb(34, 5, 191,0.8)',
                        'rgb(249,72,89, 0.9)',//
                        'rgb(9, 176, 236,0.8)',
                        'rgb(245, 151, 0,0.9)',
                        'rgb(0,100,0, 0.9)',
                        'rgb(249,72,89, 0.9)'
                        
                    ],
                    borderColor: [
                        'rgb(39, 177, 43, 0.9)',//
                        'rgb(34, 5, 191,0.2)',
                        'rgb(249,72,89, 0.9)',//
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