/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = "../../../../";
$(document).ready(function () {
    RecoveryFunctions();
});

function RecoveryFunctions() {
    recoveryBtnEvents();

}

function recoveryBtnEvents() {
    $("form[name=resetForm]").submit(function (e) {
        var EmailAddress = $("#resetEmail").val();
        showLoader();
        GetData("User", "ResetPassword", "LoadResetPassword", EmailAddress);
        e.preventDefault();
    });
    $("form[name=recoveryForm]").submit(function (e) {
        var recoveryCode = $("#recoveryCode").val();
        var recoveryPassword1 = $("#recoveryPassword1").val();
        var recoveryPassword2 = $("#recoveryPassword2").val();
        if (recoveryPassword1 === recoveryPassword2) {
            var data = [recoveryCode, recoveryPassword1];
            showLoader();
            GetData("User", "PasswordRecovery", "LoadPasswordRecovery", data);
        } else {
            ErrorNoty("Password Mismatch.", 'error');
        }
        e.preventDefault();
    });


}


function DisplayResetPassword(resp) {
    hideLoader();
    if (resp.status === "success") {
        SuccessNoty(resp.msg);
        $(".resetpwd").addClass("d-none");
        $(".recoverypwd").removeClass("d-none");
    } else if (resp.status === "error") {
        ErrorNoty(resp.msg);
    }

}
function DisplayPasswordRecovery(resp) {
    hideLoader();
    if (resp.status === "success") {
        SuccessNoty(resp.msg);
        window.location = extension + "LinksServlet?type=Login";
    } else if (resp.status === "error") {
        ErrorNoty(resp.msg);
    }
}

