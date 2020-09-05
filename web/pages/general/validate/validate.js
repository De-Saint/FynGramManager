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
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: ' Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location = extension + "LinksServlet?type=SellerDashboard";
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


