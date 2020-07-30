/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    reviewsFunctions();
});


function reviewsFunctions() {
    reviewsBtnEvents();
    reviewsSetActiveLink();
}


function reviewsBtnEvents() {

}
function reviewsSetActiveLink() {
    $("#id-notifications-svg").addClass("resp-tab-active");
    $("#id-notifications-side").addClass("resp-tab-content-active");
    $("#id-notifications-reiviews").addClass("active");
}


