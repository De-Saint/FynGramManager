/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    complaintFunctions();
});


function complaintFunctions() {
    complaintBtnEvents();
    complaintSetActiveLink();
}


function complaintBtnEvents() {

}
function complaintSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-complaints").addClass("active");
}

