/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessiontype, sessionid;
$(document).ready(function () {
    transactionFunctions();
});


function transactionFunctions() {
    transactionBtnEvents();
    transactionSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    transactionPageFunctions();
}


function transactionBtnEvents() {

}
function transactionSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-transactions").addClass("active");
}

function transactionPageFunctions() {
    showLoader();
    GetData("Transaction", "GetRecentTransactions", "LoadRecentTransactions", sessionid);
    GetData("Transaction", "GetTransactionTypes", "LoadTransactionTypes", "");
}


function DisplayRecentTransactions(data, parent) {
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var DrCount = 0;
        var CrCount = 0;
        var childclone = parent.find(".tnxclone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("tnxclone");
            newchild.addClass("newclone");
            var type = result["OtherTransactionType"];
            newchild.find(".tnx-count").text(count);
            newchild.find(".transID").text(result["TransactionRef"]);
            newchild.find(".tnx-name").text(result["NameOfTransaction"]);
            newchild.find(".tnx-date").text(result["date"]);
            newchild.find(".tnx-time").text(result["time"]);
            newchild.find(".tnx-reference").text(result["reference"]);
            var ViewTransDetails = newchild.find("#ViewTransDetails");
            var deletebtn = newchild.find("#delete_trans_btn");
            if (type === "Debit") {
                DrCount++;
                newchild.find(".tnx-type").text(result["OtherTransactionType"]).addClass("text-danger");
                newchild.find(".tnx-amount").text(PriceFormat(result["amount"])).addClass("text-danger");
            } else if (type === "Credit") {
                CrCount++;
                newchild.find(".tnx-type").text(result["OtherTransactionType"]).addClass("text-success");
                newchild.find(".tnx-amount").text(PriceFormat(result["amount"])).addClass("text-success");
            }
            ViewTransDetails.click(function () {
                DisplayTransactionDetails(result);
            });
            DisplayToolTip(deletebtn);

            deletebtn.click(function () {
                var data = [sessionid, result["id"]];
                GetData("Transaction", "DeleteTransaction", "LoadDeleteTransaction", data);
            });
            newchild.appendTo(parent).show();
        });
        $(".transTotalCount").text(totalcount);
        $(".transTotalCrCount").text(CrCount);
        $(".transTotalDrCount").text(DrCount);
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan:"7", text: "No Result Found"}).appendTo(row);

    }
}

function DisplayTransactionDetails(data) {
    $(".SenderName").text(data["PrimaryAccountName"]);
    $(".DebitAccountNumber").text(data["DebitAccountNumber"]);
    $(".RecieverName").text(data["OtherAccountName"]);
    $(".CreditAccountNumber").text(data["CreditAccountNumber"]);
    $(".TransactionId").text(data["reference"]);
    $(".SenderBal").text(PriceFormat(data["FromUserNewBalance"]));
    $(".TransactionType").text(data["NameOfTransaction"]);
    $(".Transaction").text(data["OtherTransactionType"]);
    $(".Amount").text(PriceFormat(data["amount"]));
    $(".Comment").text(data["description"]);
    $(".Date").text(data["date"]);
    $(".Time").text(data["time"]);
}


function DisplayTransactionTypes(data) {
    hideLoader();
    var parent = $("#TTypeList");
    if (data) {
        var childclone = parent.find(".ttyclone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("ttyclone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".ttysn").text(count);
            newchild.find(".ttyname").text(details["name"]);
            newchild.find(".ttydesc").text(details["description"]);
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}


function DisplayDeleteTransaction(data, parent) {
    console.log(data);
    var resp = data[2];
    if (resp.status === "success") {
        SuccessNoty(resp.msg);
        DisplayRecentTransactions(data, parent);
    } else {
        ErrorNoty(resp.msg);
        hideLoading();
    }
}
