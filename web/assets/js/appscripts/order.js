/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
$(document).ready(function () {
    orderFunctions();
});


function orderFunctions() {
    orderBtnEvents();
    orderSetActiveLink();
}


function orderBtnEvents() {

}
function orderSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-order").addClass("active");
}


