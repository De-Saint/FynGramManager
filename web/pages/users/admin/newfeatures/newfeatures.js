/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
$(document).ready(function () {
    newFeatureFunctions();
});


function newFeatureFunctions() {
    newFeatureBtnEvents();
    newFeatureSetActiveLink();
}


function newFeatureBtnEvents() {

}
function newFeatureSetActiveLink() {
    $("#id-users-svg").addClass("resp-tab-active");
    $("#id-user-side").addClass("resp-tab-content-active");
    $("#id-user-features").addClass("active");
}


