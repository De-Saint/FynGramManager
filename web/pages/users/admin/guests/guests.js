/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    guestFunctions();
});


function guestFunctions() {
   guestrBtnEvents();
    guestSetActiveLink();
}


function guestrBtnEvents() {

}
function guestSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-guests").addClass("active");
}


