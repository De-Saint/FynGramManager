/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var extension = '../../../../';
$(document).ready(function () {
    reportFunctions();
});


function reportFunctions() {
   reportBtnEvents();
    reportSetActiveLink();
}


function reportBtnEvents() {

}
function reportSetActiveLink() {
    $("#id-dashboard-svg").addClass("resp-tab-active");
    $("#id-dashboard-side").addClass("resp-tab-content-active");
    $("#id-dashboard-report").addClass("active");
}


