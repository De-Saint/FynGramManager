/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    dashBoardFunctions();
});


function dashBoardFunctions() {
    dashBoardBtnEvents();
    dashBoardSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    }
    dashBoardPageFunctions();
}


function dashBoardBtnEvents() {
    $("form[name=subscriptionForm]").submit(function (e) {
        alert("hey");
        var subcriptionAmount = $("#subcriptionAmount").val();
        alert(subcriptionAmount);
        var newPaymentAmount = CalculatePercentage(subcriptionAmount);
        $("#pay_subscription").modal("hide");
        var email = "admin@fyngram.com";
//        payWithPaystack(sessionid, newPaymentAmount, email, fundwalletAmount, "Fund Wallet");
//        e.preventDefault();
    });
}
function dashBoardSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-dash").addClass("active");
}

function CalculatePercentage(userAmt) {
    var addedPerc = (parseInt(userAmt) * parseFloat(0.02));
    var newAmt = parseInt(userAmt) + parseInt(addedPerc);
    if (parseInt(userAmt) >= parseInt(2500)) {
        newAmt = parseInt(userAmt) + parseInt(100);
    }
    return newAmt;
}
function dashBoardPageFunctions() {

}
