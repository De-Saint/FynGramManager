/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessionid, sessiontype;
$(document).ready(function () {
    walletFunctions();
});


function walletFunctions() {
    walletBtnEvents();
    walletSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    walletPageFunctions();
}


function walletBtnEvents() {
    $("form[name=fundwalletForm]").submit(function (e) {
        var fundwalletAmount = $("#fundwalletAmount").val();
        var newPaymentAmount = CalculatePercentage(fundwalletAmount);
        $("#fundwallet").modal("hide");
        var email = "admin@fyngram.com";
        payWithPaystack(sessionid, newPaymentAmount, email, fundwalletAmount, "Fund Wallet");
        e.preventDefault();
    });

    $("#copyWalletNumber").click(function () {
        var copyText = document.getElementById("walletNumber");
        /* Select the text field */
        copyText.select();
        copyText.setSelectionRange(0, 99999); /*For mobile devices*/
        /* Copy the text inside the text field */
        document.execCommand("copy");
        swal({
            title: "Wallet Number!",
            text: "Wallet Number " + copyText.value + " has been copied",
            type: "success",
            showCancelButton: false,
            confirmButtonClass: 'btn btn-success',
            conffirmButtonText: 'Ok'
        });
    });
}

function CalculatePercentage(userAmt) {
    var addedPerc = (parseInt(userAmt) * parseFloat(0.02));
    var newAmt = parseInt(userAmt) + parseInt(addedPerc);
    if (parseInt(userAmt) >= parseInt(2500)) {
        newAmt = parseInt(userAmt) + parseInt(100);
    }
    return newAmt;
}
function walletSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-wallet").addClass("active");
}

function walletPageFunctions() {
    showLoader();
    GetData("Wallet", "GetWalletDetails", "LoadGetWalletDetails", sessionid);
}

function payWithPaystack(userID, paymentamount, email, actualamount, PaymentType) {
    var userDetail;
//    if (username) {
//        userDetail = username;
//    } else {
    userDetail = email;
//    }
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
            GetData("Payment", "ValidatePaystackPayment", "LoadValidatePaystackPayment", data);
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

function DisplayGetWalletDetails(resp) {
    hideLoader();
    if (resp) {
        $(".walletNumber").val(resp.wallet_number);
        $(".MainBalance").text(PriceFormat(resp.MainBalance));
        $(".PendingBalance").text(PriceFormat(resp.PendingBalance));
        $(".walletPin").text(resp.wallet_pin);
        $(".TotalCustomerBalance").text(PriceFormat(resp.TotalCustomerBalance));
        $(".TotalAmountInAllAccounts").text(PriceFormat(resp.TotalAmountInAllAccounts));
        $(".TotalSellerBalance").text(PriceFormat(resp.TotalSellerBalance));
    }
//    alert(JSON.stringify(resp));
}
function DisplayValidatePaystackPayment(resp) {
    hideLoader();
    if (resp.status === "success") {
        verifyUser();
        swal({
            title: 'Fund Wallet',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Fund Wallet",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Try Again',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
//    alert(JSON.stringify(resp));
}