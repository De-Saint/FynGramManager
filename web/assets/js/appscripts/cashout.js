/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    cashoutFunctions();
});


function cashoutFunctions() {
    cashoutBtnEvents();
    cashoutSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    cashoutPageFunctions();
}


function cashoutBtnEvents() {
    $("form[name=cashoutForm]").submit(function (e) {
        var Amount = $("#cashoutAmount").val();
        if (Amount.includes(",")) {
            Amount = Amount.replace(",", "");
        }
        var Pin = $("#cashoutPin").val();
        $("#new_cashout_request").modal("hide");
        var data = [Amount, Pin, sessionid];
        showLoader();
        GetData("CashOut", "NewCashoutRequest", "LoadNewCashoutRequest", data);
        e.preventDefault();
    });
    $("form[name=addBankForm]").submit(function (e) {
        var bankname = $("#newBankName").val();
        $("#newbank").modal("hide");
        showLoader();
        GetData("CashOut", "AddBank", "LoadBankInfo", bankname);
        e.preventDefault();
    });
}
function cashoutSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-cashout").addClass("active");
}

function cashoutPageFunctions() {
    showLoader();
    GetData("CashOut", "GetCashoutRequests", "LoadCashoutRequests", sessionid);
    GetData("CashOut", "GetBanks", "LoadBanks", "");
}


function DisplayBanks(data) {
    var parent = $(".cashBankList");
    hideLoader();
    if (data !== "none") {
        var childclone = parent.find(".bklist-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("bklist-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".bksn").text(count);
            newchild.find(".bkname").text(details["name"]);
            var deletebtn = newchild.find(".btn-delete-bank").click(function () {
                swal({
                    title: 'Bank',
                    text: "Do you want to delete " + details["name"] + "?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("CashOut", "DeleteBank", "LoadBankInfo", id);
                    }
                });

            });
            deletebtn.tooltip({
                position: {
                    my: "center bottom-40",
                    at: "center top"
                }
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}
function DisplayNewCashoutRequest(data, parent) {
    hideLoader();
    var resp = data[2];
    if (resp.status === "success") {
        swal({
            title: 'CashOut Request',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayCashoutRequests(data, parent);
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: 'CashOut Request',
            text: resp.msg,
            type: 'error',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Ok!',
            buttonsStyling: true
        });
    }
}

function DisplayCashoutRequests(data, parent) {
    hideLoader();
    if (data !== "none") {
        var childclone = parent.find(".cash-clone");
        var ids = data[0];
        var result = data[1];
        var count = 0;
        var pendcount = 0;
        var approvecount = 0;
        var rejectcount = 0;
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("cash-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".cashsn").text(count);
            newchild.find(".cashusername").text(details["cashUserName"]);
            newchild.find(".cashbankname").text(details["bankName"]);
            newchild.find(".cashacctnumber").text(details["account_number"]);
            newchild.find(".cashaccttype").text(details["account_type"]);
            newchild.find(".cashamount").text(PriceFormat(details["amount"]));
            newchild.find(".cashdate").text(details["request_date"]);
            newchild.find(".cashtime").text(details["request_time"]);

            var status = details["status"];
            if (status === "Pending") {
                pendcount++;
                newchild.find(".cashstatus").text(details["status"]).addClass("badge badge-primary badge-pill");
                newchild.find(".btn-approve-cashout").removeClass("d-none");
                newchild.find(".btn-cancel-cashout").removeClass("d-none");
            } else if (status === "Approved") {
                approvecount++;
                newchild.find(".cashstatus").text(details["status"]).addClass("badge badge-success badge-pill");
                newchild.find(".btn-delete-cashout").removeClass("d-none");
                newchild.find(".btn-approve-cashout").addClass("d-none");
                newchild.find(".btn-cancel-cashout").addClass("d-none");
            } else if (status === "Rejected") {
                rejectcount++;
                newchild.find(".cashstatus").text(details["status"]).addClass("badge badge-danger badge-pill");
                newchild.find(".btn-delete-cashout").removeClass("d-none");
                newchild.find(".btn-approve-cashout").addClass("d-none");
                newchild.find(".btn-cancel-cashout").addClass("d-none");
            }

            var approvebtn = newchild.find(".btn-approve-cashout").click(function () {
                ProcessCashOut("Approved", id, "Approve");
            });
            DisplayToolTip(approvebtn);
            var cancelbtn = newchild.find(".btn-cancel-cashout").click(function () {
                ProcessCashOut("Rejected", id), "Reject";
            });
            DisplayToolTip(cancelbtn);
            var deletebtn = newchild.find(".btn-delete-cashout").click(function () {
                ProcessCashOut("Deleted", id, "Delete");
            });
            DisplayToolTip(deletebtn);
            newchild.appendTo(parent);
        });
        childclone.hide();
        $(".TotalCashout").text(count);
        $(".PendingCashout").text(pendcount);
        $(".TotalApproved").text(approvecount);
        $(".TotalRejected").text(rejectcount);
    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "10", text: "No Results Found"}).appendTo(row);
    }
}

function ProcessCashOut(Option, cashoutID, part) {
    swal({
        title: 'CashOut Request',
        text: "Do you want to " + part + " this request?",
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: ' Ok!',
        buttonsStyling: true
    }, function (dismiss) {
        if (dismiss) {
            var data = [Option, cashoutID, sessionid];
            showLoader();
            GetData("CashOut", "ProcessCashOut", "LoadNewCashoutRequest", data);
        }
    });
}

function DisplayBankInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Bank',
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
            title: "Bank",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}