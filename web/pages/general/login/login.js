/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = "";
var sessionid, sessiontype = "";
$(document).ready(function () {
    LoginFunctions();
});

function LoginFunctions() {
    LoginBtnEvents();
}

function LoginBtnEvents() {
    $("form[name=loginForm]").submit(function (e) {
        var EmailAddress = $("#fgemail").val();
        var Password = $("#fgpass").val();
         sessionid = verifyUser();
        var data = [EmailAddress, Password, sessionid, "FGManager"];
        showLoader();
        GetData("User", "Login", "LoadLogin", data);
        e.preventDefault();
    });
}

function DisplayLogin(resp) {
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
            if (sessiontype === "Seller") {
                window.location = extension + "LinksServlet?type=SellerDashboard";
            } else if (sessiontype === "Admin") {
                window.location = extension + "LinksServlet?type=AdminDashboard";
            }
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

