/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
var sessiontype, sessionid, customeruserid;
$(document).ready(function () {
    customerFunctions();
});


function customerFunctions() {
    customeruserid = $("#customeruserid").val();
    customerBtnEvents();
    customerSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    customerPageFunctions();
}


function customerBtnEvents() {
    $("form[name=NewCustomerForm]").submit(function (e) {
        var Gender = $("input[name=newcustomergender]:checked").val();
        var Frstname = $("#newcustomerfname").val();
        var Lastname = $("#newcustomerlname").val();
        var EmailAddress = $("#newcustomeremail").val();
        var PhoneNumber = $("#newcustomerphone").val();
        var Password = $("#newcustomerpassword").val();
        var Newsletter = 0;
        if (!Newsletter) {
            Newsletter = 0;
        }
        var data = [Gender, Frstname, Lastname, EmailAddress, PhoneNumber, Password, Newsletter];
        showLoader();
        GetData("User", "RegisterCustomer", "LoadRegisterCustomer", data);

        e.preventDefault();
    });

    $(".searchcustomerbtn").click(function () {
        var searchtext = $(".searchcustomertext").val();
        if (searchtext.length > 3) {
            showLoader();
            GetData("User", "SearchCustomers", "LoadAllCustomers", searchtext);
        } else {
            ErrorNoty("Please fill input and only 3 characters allowed");
        }
    });
    $(".clearcustomerbtn").click(function () {
        showLoader();
        $(".searchcustomertext").val("");
        GetData("User", "GetAllCustomers", "LoadAllCustomers", "");
    });

}
function customerSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-customers").addClass("active");
}

function customerPageFunctions() {
    showLoader();
    GetData("User", "GetAllCustomers", "LoadAllCustomers", "");
    if (customeruserid === null || customeruserid === "null" || customeruserid === undefined || customeruserid === "undefined") {
    } else {
        showLoader();
        GetData("User", "GetCustomerDetails", "LoadCustomerDetails", customeruserid);
    }
}


function DisplayAllCustomers(data) {
    console.log(data);
    hideLoader();
    var parent = $("#AllCustomers");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var childclone = parent.find(".cust-clone");
        var count = 0;
        var onlinecount = 0;
        var offlinecount = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("cust-clone");
            newchild.removeClass("d-none");
            newchild.addClass("newclone");
            newchild.find(".cust-uname").text(details["UserName"]);
            newchild.find(".cust-utype").text(details["UserType"]);
            newchild.find(".cust-uemail").text(details["email"]);
            newchild.find(".cust-uphone").text(details["phone"]);
            newchild.find(".cust-ugender").text(details["gender"]);
            var online = details["active"];
            if (online === "1" || online === 1) {
                onlinecount++;
            } else if (online === "0" || online === 0) {
                offlinecount++;
            }
            if (details["ImageText"] === "none") {
                $(".cust-uimage").css("background-image", "url('" + extension + "/assets/images/no-image.png')");
                $(".cust-uimage").css("background-repeat", "repeat");
                $(".cust-uimage").css("background-position", "center center");
            } else if (details["ImageText"] !== "none") {
                $(".cust-uimage").css("background-image", "url('data:image/png;base64," + details["ImageText"] + "')");
                $(".cust-uimage").css("background-repeat", "repeat");
                $(".cust-uimage").css("background-position", "center center");
            }


            var btncustdetails = newchild.find(".btn-cust-details").click(function () {
                window.location = extension + "LinksServlet?type=AdminCustomerDetails&customeruserid=" + id;
            });
            DisplayToolTip(btncustdetails);
            var btncustdelete = newchild.find(".btn-cust-delete").click(function () {
                swal({
                    title: 'Delete Customer',
                    text: "Are you sure you want to delete " + details["UserName"] + "? This action is irreversible. Other customers and sellers activity tied to " + details["UserName"] + " will also be deleted.",
                    type: 'error',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("User", "DeleteCustomer", "LoadRegisterCustomer", id);
                    }
                });
            });
            DisplayToolTip(btncustdelete);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".TotalCustomers").text(count);
        $(".TotalActiveCustomers").text(onlinecount);
        $(".TotalInactiveCustomers").text(offlinecount);
    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 w-100 text-center newclone font-weight-bold text-primary", text: "No Result Found Clear Search"}).appendTo(row);
    }

}

function DisplayCustomerDetails(data) {
    console.log(data);
    $(".customer-uname").text(data.UserName);
    $(".customer-upendingBalance").text(PriceFormat(data.WalletDetails.PendingBalance));
    $(".customer-umainBalance").text(PriceFormat(data.WalletDetails.MainBalance));
    $(".customer-uwalletNumber").text(data.WalletDetails.wallet_number);
    $(".customer-uFirstName").text(data.firstname);
    $(".customer-uTitle").text(data.title);
    $(".customer-uLastName").text(data.lastname);
    $(".customer-uDateJoined").text(data.date);
    $(".customer-uTimeJoined").text(data.time);
    if (data.newsletters === "0" || data.newsletters === 0) {
        $(".customer-uNewsletter").text("Did not subscribe").addClass("badge badge-primary");
        ;
    } else if (data.newsletters === "1" || data.newsletters === 1) {
        $(".customer-uNewsletter").text("Subscribed").addClass("badge badge-success");
    }
    $(".customer-uEmail").text(data.email);
    $(".customer-uPhone").text(data.phone);
    $(".customer-uGender").text(data.gender);
    $(".customer-uTPin").text(data.TransactionPin);
    $(".customer-ubdbkacctnum").text(data.BankDetails.account_number);
    $(".customer-ubdbkaccttype").text(data.BankDetails.account_type);
    $(".customer-ubdbkkname").text(data.BankDetails.bankName);
    $(".customer-uorders").text(data.ordercount);
    $(".customer-umessages").text(data.msgcount);
    $(".customer-uaddress").text(data.addresscount);
    $(".customer-ucashout").text(data.cashoutcount);
    $(".customer-upayment").text(data.paymentcount);
    $(".customer-ureviews").text(data.reviewcount);
    $(".customer-utransactions").text(data.transactioncount);
    $(".customer-udiscountcodes").text(data.discountcodecount);
    if (data.ImageText === "none") {
        var image_url = extension + "assets/images/no-image.png";
        $(".customer-uimage").attr("src", image_url);
    } else if (data.ImageText !== "none") {
        $(".customer-uimage").attr("src", "data:image/png;base64," + data.ImageText);
    }
}

function DisplayRegisterCustomer(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Customer',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Customer",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

