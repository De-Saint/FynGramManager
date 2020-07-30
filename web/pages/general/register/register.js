/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "../../../";
var sessionid, sessiontype = "";
$(document).ready(function () {
    RegisterFunctions();
});

function RegisterFunctions() {
    registerBtnEvents();
    registerPageFunctions();
}


function registerBtnEvents() {
    //accordion-wizard
    var options = {
        mode: 'wizard',
        autoButtonsNextClass: 'btn btn-primary float-right',
        autoButtonsPrevClass: 'btn btn-info',
        stepNumberClass: 'badge badge-pill badge-primary mr-1'
    };

    $("#form").accWizard(options);
    $("form[name=sellerRegisterForm]").submit(function (e) {
        var gender = $("input[name=sell-gender]:checked").val();
        var firstname = $("#sell-firstname").val();
        var lastname = $("#sell-lastname").val();
        var email = $("#sell-email").val();
        var phone = $("#sell-phone").val();
        var password = $("#sell-password").val();
        var bizname = $("#sell-bizname").val();
        var bizemail = $("#sell-bizemail").val();
        var bizphone = $("#sell-bizphone").val();
        var bizminshippingdays = $("#sell-minbizshippingdays").val();
        var bizmaxshippingdays = $("#sell-maxbizshippingdays").val();
        var substype = $("#sell-substype").val();
        var sellertype = $("#sell-sellertype").val();
        var data = [email, phone, password, gender, firstname, lastname, sellertype, substype,
            bizname, bizemail, bizphone, bizminshippingdays, bizmaxshippingdays];
        showLoader();
        GetData("User", "RegisterSeller", "LoadRegisterSeller", data);
        e.preventDefault();
    });

}


function registerPageFunctions() {
    showLoader();
    GetData("Subscription", "GetSubscriptionTypes", "LoadGetSubscriptionTypes", "");
    GetData("Subscription", "GetSellerTypes", "LoadGetSellerSellerTypes", "");
}

function DisplayGetSubscriptionTypes(data) {
    hideLoader();
    var cs = $("#sell-substype");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select Subscription Type"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
    }
}

function DisplayGetSellerSellerTypes(data) {
    hideLoader();
    var cs = $("#sell-sellertype");
    cs.empty();
    if (data === "empty") {
    } else {
        cs.append($('<option/>').val(0).text("Select Seller Type"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
    }
}

function DisplayRegisterSeller(resp) {
    hideLoader();
    if (resp.status === "success") {
        SessionTokenManager(resp);
        sessiontype = GetSessionType();
        sessionid = verifyUser();
        swal({
            title: 'Welcome to FynGram Manager App',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location = extension + "LinksServlet?type=SellerDashboard";
        });
    } else if (resp.status === "error") {
        swal({
            title: "Login",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}