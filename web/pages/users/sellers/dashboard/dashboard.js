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
        var newPaymentAmount = CalculatePercentage(subcriptionAmount);
        $("#pay_subscription").modal("hide");
        var email = localStorage.getItem("uEmail");
        dashboardPayWithPaystack(newPaymentAmount, email, subcriptionAmount, "Subscription Fees");
        e.preventDefault();
    });
    startTime();
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

}


function dashboardPayWithPaystack(paymentamount, email, actualamount, PaymentType) {
    var userDetail = localStorage.getItem("UserName");
    var handler = PaystackPop.setup({
        key: 'pk_test_b3685f824518679567d6356e2636fc184878e833',
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
