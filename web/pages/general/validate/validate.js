/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../";
var sessionid, sessiontype = "";

$(document).ready(function () {
    validateFunctions();
});

function validateFunctions() {
    validateBtnEvents();

}

function validateBtnEvents() {
    $("form[name=verificationForm]").submit(function (e) {
        var verifyCode = $("#verifyCode").val();
        showLoader();
        var data = [verifyCode, ""];
        GetData("User", "ValidateAccount", "LoadValidateAccount", data);
        e.preventDefault();
    });


    $(".addproduct").click(function () {
        var sessiontype = GetSessionType();
        if (sessiontype === "Seller") {
            localStorage.setItem("option", "addproduct");
            window.location = extension + "LinksServlet?type=SellerAddProduct";
        }

    });
}


function DisplayValidateAccount(resp) {
    hideLoader();
    if (resp.status === "success") {
        SessionTokenManager(resp);
        sessiontype = GetSessionType();
        sessionid = verifyUser();
        swal({
            title: 'Welcome to FynGram Manager App',
            text: resp.msg,
            type: 'success',
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: 'Add Product',
            cancelButtonText: 'Goto DashBoard',
            buttonsStyling: true
        }, function (dismiss) {
            if (dismiss) {
                localStorage.setItem("option", "addproduct");
                window.location = extension + "LinksServlet?type=SellerAddProduct";
            } else {
                window.location = extension + "LinksServlet?type=SellerDashboard";
            }
        });
    } else if (resp.status === "error") {
        swal({
            title: "Account Confirmation",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}


