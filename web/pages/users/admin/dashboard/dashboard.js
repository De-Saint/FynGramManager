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
     startTime();
}
function dashBoardSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-dash").addClass("active");
}
function startTime() {
    var today = new Date(),
            h = checkTime(today.getHours()),
            m = checkTime(today.getMinutes()),
            s = checkTime(today.getSeconds());
    document.getElementById('HHours').innerHTML = h;
    document.getElementById('MMinutes').innerHTML = m;
    document.getElementById('SSeconds').innerHTML = s;
    t = setTimeout(function () {
        startTime();
    }, 500);
}

function checkTime(i) {
    return (i < 10) ? "0" + i : i;
}

function dashBoardPageFunctions() {

}
