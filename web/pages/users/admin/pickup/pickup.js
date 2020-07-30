/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    pickupFunctions();
});


function pickupFunctions() {
   pickupBtnEvents();
    pickupSetActiveLink();
}


function pickupBtnEvents() {

}
function pickupSetActiveLink() {
    $("#id-carrier-svg").addClass("resp-tab-active");
    $("#id-carrier-side").addClass("resp-tab-content-active");
    $("#id-carrier-pickup").addClass("active");
}


