/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessiontype, sessionid, selleruserid;
$(document).ready(function () {
    sellerFunctions();
});
function GetSellerUserID() {
    return selleruserid = localStorage.getItem("selleruserid");
}

function sellerFunctions() {

    sellerBtnEvents();
    sellerSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }

    sellerPageFunctions();
}


function sellerBtnEvents() {
    $("form[name=NewSellerTypeForm]").submit(function (e) {
        var sellertypeid = $("#sellertypeid").val();
        var newsellertypename = $("#newsellertype-name").val();
        var newsellertypeadminpercent = $("#newsellertype-admin-percent").val();
        $("#new_seller_type").modal("hide");
        if (sellertypeid === 0 || sellertypeid === "0") {
            showLoader();
            var data = [newsellertypename, newsellertypeadminpercent];
            GetData("Subscription", "CreateSellerType", "LoadSellerInfo", data);
        } else {
            showLoader();
            var data = [sellertypeid, newsellertypename, newsellertypeadminpercent];
            GetData("Subscription", "EditSellerType", "LoadSellerInfo", data);
        }
        e.preventDefault();
    });
    $(".searchsellerbtn").click(function () {
        var searchtext = $(".searchsellertext").val();
        if (searchtext.length > 3) {
            showLoader();
            GetData("User", "SearchSellers", "LoadAllSellers", searchtext);
        } else {
            ErrorNoty("Please fill input and only 3 characters allowed");
        }
    });
    $(".clearsellerbtn").click(function () {
        showLoader();
        $(".searchsellertext").val("");
        GetData("User", "GetAllSellers", "LoadAllSellers", "");
    });
}
function sellerSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-sellers").addClass("active");
}
function sellerPageFunctions() {
    showLoader();
    GetData("User", "GetAllSellers", "LoadAllSellers", "");
    GetData("Subscription", "GetSellerTypes", "LoadGetSellerTypes", "");
    selleruserid = GetSellerUserID();
    if (selleruserid === null || selleruserid === "null" || selleruserid === undefined || selleruserid === "undefined") {
    } else {
        showLoader();
        GetData("User", "GetSellerDetails", "LoadSellerDetails", selleruserid);
    }
}


function DisplayGetSellerTypes(data) {
    console.log(data);
    hideLoader();
    var parent = $("#SellerTypeList");
    if (data !== "none") {
        var childclone = parent.find(".seller-clone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("seller-clone");
            newchild.removeClass("d-none");
            newchild.addClass("clone-child");
            newchild.find(".seller-type-name").text(details["name"]);
            newchild.find(".seller-type-adminpercent").text(details["admin_transaction_percentage"]);
            newchild.find(".seller-type-seller-count").text(details["SellerTypeSellerCount"]);
            var editbtn = newchild.find(".btn-edit-percent").click(function () {
                $("#new_seller_type #sellertypeid").val(id);
                $("#new_seller_type #newsellertype-name").val(details["name"]);
                $("#new_seller_type #newsellertype-admin-percent").val(details["admin_transaction_percentage"]);
            });
            var deletebtn = newchild.find(".btn-delete-sellertype").click(function () {
                swal({
                    title: 'Seller Type',
                    text: "Are you sure you want to deleted this record?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: true,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Subscription", "DeleteSellerType", "LoadSellerInfo", id);
                    }
                });
            });
            var sellertypnumber = newchild.find(".btn-sellertyp-number");
            DisplayToolTip(sellertypnumber);
            DisplayToolTip(deletebtn);
            DisplayToolTip(editbtn);
            newchild.appendTo(parent);
            $(".TotalSellerTypes").text(count);
        });
        childclone.hide();
    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 w-100 text-center newclone font-weight-bold text-primary", text: "No Result Found"}).appendTo(row);
    }
}
function DisplaySellerInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Seller',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Seller",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayAllSellers(data) {
    hideLoader();
    var parent = $("#AllSellers");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var childclone = parent.find(".seller-clone");
        var count = 0;
        var activatedcount = 0;
        var expiredcount = 0;
        var paidcount = 0;
        var pendingcount = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("seller-clone");
            newchild.removeClass("d-none");
            newchild.addClass("newclone");
            newchild.find(".seller-name").text(details["UserName"]);
            newchild.find(".seller-type").text(details["UserType"]);
            newchild.find(".seller-email").text(details["email"]);
            newchild.find(".seller-phone").text(details["phone"]);
            newchild.find(".seller-typename").text(details["SellerTypeName"]);
            newchild.find(".seller-subtype").text(details["SubscriptionName"]);
            newchild.find(".seller-totalproduct").text(details["productcount"]);
            newchild.find(".seller-walletbalance").text(PriceFormat(details["WalletDetails"].MainBalance));
            var status = details["status"];
            newchild.find(".seller-status").text(details["status"]);
            if (status === "Pending") {
                newchild.find(".btn-seller-approve").addClass("d-none");
                pendingcount++;
            } else if (status === "Paid") {
                newchild.find(".btn-seller-approve").removeClass("d-none");
                paidcount++;
            } else if (status === "Activated") {
                newchild.find(".btn-seller-approve").addClass("d-none");
                activatedcount++;
            } else if (status === "Expired") {
                newchild.find(".btn-seller-approve").addClass("d-none");
                expiredcount++;
            }

            if (details["ImageText"] === "none") {
                newchild.find(".seller-image").css("background-image", "url('" + extension + "assets/images/no-image.png')");
            } else if (details["ImageText"] !== "none") {
                newchild.find(".seller-image").css("background-image", "url('data:image/png;base64," + details["ImageText"] + "')");
            }
            var btnsellerdetails = newchild.find(".btn-seller-details").click(function () {
                localStorage.setItem("selleruserid", id);
                window.location = extension + "LinksServlet?type=AdminSellerDetails";
            });
            DisplayToolTip(btnsellerdetails);
            var btnsellerdelete = newchild.find(".btn-seller-delete").click(function () {

            });
            DisplayToolTip(btnsellerdelete);
            var btnsellerapprove = newchild.find(".btn-seller-approve").click(function () {
                swal({
                    title: 'Approve Seller',
                    text: "Are you sure you want to approve this seller?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("User", "ActivateSellerSubscrition", "LoadSellerInfo", id);
                    }
                });
            });
            DisplayToolTip(btnsellerapprove);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".TotalSellers").text(count);
        $(".TotalActivated").text(activatedcount);
        $(".TotalExpired").text(expiredcount);
        $(".TotalPaid").text(paidcount);
        $(".TotalPending").text(pendingcount);
    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 w-100 text-center newclone font-weight-bold text-primary", text: "No Result Found Clear Search"}).appendTo(row);
    }
}

function DisplaySellerDetails(data) {
    console.log(data);
    $(".seller-uname").text(data.UserName);
    $(".seller-upendingBalance").text(PriceFormat(data.WalletDetails.PendingBalance));
    $(".seller-umainBalance").text(PriceFormat(data.WalletDetails.MainBalance));
    $(".seller-uwalletNumber").text(data.WalletDetails.wallet_number);
    $(".seller-uTitle").text(data.title);
    $(".seller-uFirstName").text(data.firstname);
    $(".seller-uLastName").text(data.lastname);
    $(".seller-uDateJoined").text(data.date);
    $(".seller-uTimeJoined").text(data.time);
    $(".seller-uEmail").text(data.email);
    $(".seller-uPhone").text(data.phone);
    $(".seller-uGender").text(data.gender);
    $(".seller-uTPin").text(data.TransactionPin);
    $(".seller-uPassword").text(data.password);
    $(".seller-ubdbkacctnum").text(data.BankDetails.account_number);
    $(".seller-ubdbkaccttype").text(data.BankDetails.account_type);
    $(".seller-ubdbkkname").text(data.BankDetails.bankName);
    $(".seller-uorders").text(data.ordercount);
    $(".seller-umessages").text(data.msgcount);
    $(".seller-uproducts").text(data.productcount);
    $(".seller-ucashout").text(data.cashoutcount);
    $(".seller-upayment").text(data.paymentcount);
    $(".seller-ureviews").text(data.reviewcount);
    $(".seller-utransactions").text(data.transactioncount);
    $(".seller-sellertype").text(data.SellerTypeName + " Seller");
    $(".seller-substype").text(data.SubscriptionName + " Subscription");
    $(".seller-uaddressdetails").text(data.AddressDetails.full_address);
    $(".seller-uaddrestype").text(data.AddressDetails.addresstypename);
    $(".seller-usubsstartdate").text(data.SubscriptionDetails.start_date);
    if(data.SubscriptionDetails.amount){
         $(".seller-usubsamount").text(PriceFormat(data.SubscriptionDetails.amount));
    }
   
    $(".seller-usubsexpirydata").text(data.SubscriptionDetails.end_date);
    if (data.status === "Pending") {
        $(".seller-ustatus").text(data.status).addClass("btn-outline-secondary");
    } else if (data.status === "Paid") {
        $(".seller-ustatus").text(data.status).addClass("btn-outline-success");
    } else if (data.status === "Expired") {
        $(".seller-ustatus").text(data.status).addClass("btn-outline-danger");
    } else if (data.status === "Activated") {
        $(".seller-ustatus").text(data.status).addClass("btn-outline-primary");
    }
    if (data.ImageText === "none") {
        var image_url = extension + "assets/images/no-image.png";
        $(".seller-uimage").attr("src", image_url);
    } else if (data.ImageText !== "none") {
        $(".seller-uimage").attr("src", "data:image/png;base64," + data.ImageText);
    }
}

