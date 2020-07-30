/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessionid;
$(document).ready(function () {
    paymentFunctions();
});


function paymentFunctions() {
    paymentBtnEvents();
    paymentSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    paymenPageFunctions();
}


function paymentBtnEvents() {

}

function paymentSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-payments").addClass("active");
}

function paymenPageFunctions() {
    showLoader();
    GetData("Payment", "GetPayments", "LoadGetPayments", sessionid);
}

function DisplayGetPayments(data, parent) {
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var fwCount = 0;
        var sfCount = 0;
        var childclone = parent.find(".pay-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("pay-clone");
            var type = result["payment_type"];
            newchild.find(".pay-sn").text(count);
            newchild.addClass("newclone");
            newchild.find(".pay-username").text(result["UserName"]);
            newchild.find(".pay-paytype").text(result["payment_type"]);
            newchild.find(".pay-date").text(result["date"]);
            newchild.find(".pay-amount").text(PriceFormat(result["amount"]));
            newchild.find(".pay-time").text(result["time"]);
            newchild.find(".pay-tcode").text(result["reference_code"]);
            newchild.find(".btn-pay-delete").click(function () {
                DeletePayment(id);
            });
            if (type === "Fund Wallet") {
                fwCount++;
            } else if (type === "Subscription Fees") {
                sfCount++;
            }
            newchild.appendTo(parent).show();
        });
        $(".payTotalCount").text(count);
        $(".payTotalFWCount").text(fwCount);
        $(".payTotalSFCount").text(sfCount);
        childclone.hide();
    } else {
//        $("<li />", {class: "wide center clone-child", text: "No Result", colspan: "7"}).appendTo(parent);
    }

}

function DeletePayment(paymentid) {
    swal({
        title: 'Delete Payment',
        text: "Do you want to delete this payment.",
        type: 'success',
        showCancelButton: true,
        confirmButtonText: 'Delete!',
        cancelButtonText: 'Cancel!',
        showLoaderOnConfirm: true,
        closeOnConfirm: false,
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-warning',
        buttonsStyling: false
    }, function (dismiss) {
        showLoader();
        var data = [sessionid, paymentid];
        GetData("Payment", "DeletePayment", "LoadDeletePayment", data);
    });

}


function DisplayDeletePayment(data, parent) {
    hideLoader();
    var resp = data[2];
    if (resp.status === "success") {
        swal({
            title: 'Delete Payment',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayGetPayments(data, parent);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Delete Payment",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'TryAgain',
            showCancelButton: false
        });
    }
}