/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessiontype, sessionid;
$(document).ready(function () {
    subscriptionFunctions();
});


function subscriptionFunctions() {
    subscriptionBtnEvents();
    subscriptionSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    subscriptionPageFunctions();
}


function subscriptionBtnEvents() {
    $("form[name=editSubscriptionAmountForm]").submit(function (e) {
        var subNewAmount = $("#subNewAmount").val();
        var subNewID = $("#subNewID").val();
        $("#editsubscriptionamount").modal("hide");
        subNewAmount = subNewAmount.replace(",", "");
        var data = [subNewID, subNewAmount];
        showLoader();
        GetData("Subscription", "EditSubscriptionAmount", "LoadSubscriptionInfo", data);
        e.preventDefault();
    });
    $("form[name=newSubscriptionTypeForm]").submit(function (e) {
        var name = $("#newSubTypeName").val();
        var desc = $("#newSubTypeDesc").val();
        var duration = $("#newSubTypeDuration").val();
        $("#newsubscriptiontype").modal("hide");
        var data = [name, desc, duration];
        showLoader();
        GetData("Subscription", "NewSubscriptionType", "LoadSubscriptionInfo", data);
        e.preventDefault();
    });


    $("form[name=newSubscriptionAmountForm]").submit(function (e) {
        var Amount = $("#subAmtAmount").val();
        var SubTypeID = $("#SubAmtSubcriptionTypes").val();
        var SellerTypeID = $("#SubAmtSellerTypes").val();
        $("#newsubscriptionamount").modal("hide");
        Amount = Amount.replace(",", "");
        var data = [Amount, SellerTypeID, SubTypeID];
        showLoader();
        GetData("Subscription", "NewSubscriptionAmount", "LoadSubscriptionInfo", data);
        e.preventDefault();
    });
}


function subscriptionSetActiveLink() {
    $("#id-accounts-svg").addClass("resp-tab-active");
    $("#id-accounts-side").addClass("resp-tab-content-active");
    $("#id-accounts-subscription").addClass("active");
}

function subscriptionPageFunctions() {
    showLoader();
    GetData("Subscription", "GetSubscriptions", "LoadSubscriptions", sessionid);
    GetData("Subscription", "GetSubscriptionTypes", "LoadSubscriptionTypes", "");
    GetData("Subscription", "GetSubscriptionAmount", "LoadSubscriptionAmount", "");
    GetData("Subscription", "GetSellerTypes", "LoadSellerTypes", "");
}

function DisplaySubscriptionTypes(data) {
    hideLoader();
    var parent = $("#SubTypeList");
    if (data) {
        var childclone = parent.find(".subtypeclone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("subtypeclone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".subtype-count").text(details["SubcriptionTypeCount"]);
            newchild.find(".subtype-name").text(details["name"]);
            newchild.find(".subtype-desc").text(details["description"]);
            var status = details["active"];
            if (status === 1 || status === "1") {
                newchild.addClass("");
                newchild.find(".subtype-status").text("Active");
            } else if (status !== 1 || status !== "1") {
                newchild.find(".subtype-status").text("InActive").addClass("text-white badge badge-danger");
                newchild.find(".btn-enable-sub-type").removeClass("d-none");
                newchild.find(".btn-disable-sub-type").addClass("d-none");
            }
            var btnenable = newchild.find(".btn-enable-sub-type").click(function () {
                SubscriptionTypeOption("Enabled", id, "Enable");
            });
            DisplayToolTip(btnenable);
            var btndisable = newchild.find(".btn-disable-sub-type").click(function () {
                SubscriptionTypeOption("Disabled", id, "Disable");
            });
            DisplayToolTip(btndisable);
            var btndelete = newchild.find(".btn-delete-sub-type").click(function () {
                SubscriptionTypeOption("Deleted", id, "Delete");
            });
            DisplayToolTip(btndelete);
            newchild.appendTo(parent);
        });
        childclone.hide();



        var cs = $("#SubAmtSubcriptionTypes");
        cs.empty();
        if (data === "empty") {
        } else {
            cs.append($('<option/>').val(0).text("Select Subscription Type"));
            $.each(data, function (key, value) {
                cs.append($('<option/>').val(key).text(value["name"]));
            });
        }

    }
}


function DisplaySubscriptionAmount(data) {
    hideLoader();
    var parent = $("#SubAmountList");
    if (data !== "none") {
        var childclone = parent.find(".subamt-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("subamt-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".subamt-count").text(count);
            newchild.find(".subamt-subtype").text(details["SubscriptionTypeName"]);
            newchild.find(".subamt-id").text(id).addClass("d-none");
            newchild.find(".subamt-sellertype").text(details["SellerTypeName"]);
            newchild.find(".subamt-amout").text(PriceFormat(details["amount"]));
            newchild.find(".btn-edit-sub-amount").click(function () {
                $("#editsubscriptionamount #subNewID").val(id);
                $("#editsubscriptionamount #subOldAmount").val(details["amount"]);
            });
            newchild.find(".btn-delete-sub-amount").click(function () {
                swal({
                    title: 'Subscription Amount',
                    text: "Are you sure you want to deleted this record?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Subscription", "DeleteSubscriptionAmount", "LoadSubscriptionInfo", id);
                    }
                });
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}
function DisplaySubscriptions(data) {
    hideLoader();
    var parent = $("#SubscriptionList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var childclone = parent.find(".sub-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("sub-clone");
            newchild.removeClass("d-none");
            newchild.addClass("new-clone");
            newchild.find(".sub-sn").text(count);
            newchild.find(".sub-name").text(details["SellerUserName"]);
            newchild.find(".sub-sellertype").text(details["SellerTypeName"]);
            newchild.find(".sub-subtype").text(details["SubscriptionTypeName"]);
            newchild.find(".sub-amount").text(PriceFormat(details["amount"]));
            newchild.find(".sub-startdate").text(details["start_date"]);
            newchild.find(".sub-expiredate").text(details["end_date"]);
            newchild.find(".sub-time").text(details["start_time"]);
            var status = details["status"];
            if (status === "Active") {
                newchild.find(".sub-status").text(details["status"]).addClass("badge badge-success");
            } else {
                newchild.find(".sub-status").text(details["status"]).addClass("badge badge-danger");
            }
            newchild.appendTo(parent);
        });
        childclone.hide();
    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center new-clone text-primary", text: "No Result Found"}).appendTo(row);

    }
}

function DisplaySubscriptionInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Subscription',
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
            title: "Subscription",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Try Again',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}
function DisplaySellerTypes(data) {
    var cs = $("#SubAmtSellerTypes");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select Seller Type"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
    }
}

function SubscriptionTypeOption(Option, SubTypeID, part) {
    swal({
        title: 'Subscription Type',
        text: "Do you want to " + part + " this subscription type?",
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: ' Ok!',
        buttonsStyling: true
    }, function (dismiss) {
        if (dismiss) {
            var data = [SubTypeID, Option];
            showLoader();
            GetData("Subscription", "EnableOrDisableSubscriptionType", "LoadSubscriptionInfo", data);
        }
    });
}

