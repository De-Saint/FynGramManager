/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var shippingid, shippingoption, shippingdet;
$(document).ready(function () {
    newShippingFunctions();
});

function GetShippingID() {
    return shippingid = localStorage.getItem("shippingid");
}
function GetShippingOption() {
    return shippingoption = localStorage.getItem("shipoption");
}
function GetShippingDetails() {
    return shippingdet = localStorage.getItem("shippingdet");
}

function newShippingFunctions() {
    newShippingBtnEvents();
    newShippingSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    newShippingPageFunctions();

}


function newShippingBtnEvents() {
    $("#add_ship_admin_percent").keyup(function () {
        var adminp = $(this).val();
        var shipmethp = 100 - parseInt(adminp);
        $("#add_ship_method_percent").val(shipmethp);
    });

    $("form[name=addShippingAddressForm]").submit(function (e) {
        var add_ship_method_percent = $("#add_ship_method_percent").val();
        var add_ship_admin_percent = $("#add_ship_admin_percent").val();
        var add_ship_interval = $("#add_ship_interval").val();
        var add_ship_name = $("#add_ship_name").val();
        var add_ship_phone = $("#add_ship_phone").val();
        var add_ship_email = $("#add_ship_email").val();
        shippingoption = GetShippingOption();
        shippingid = GetShippingID();
        var data = [add_ship_name, add_ship_interval, add_ship_admin_percent, add_ship_method_percent, shippingoption, add_ship_phone, add_ship_email, shippingid];
        showLoader();
        GetData("Shipping", "NewShippingAddress", "LoadNewShippingAddress", data);
        e.preventDefault();
    });
}
function newShippingSetActiveLink() {
    $("#id-carrier-svg").addClass("resp-tab-active");
    $("#id-carrier-side").addClass("resp-tab-content-active");
    $("#id-carrier-shipping").addClass("active");
}

function newShippingPageFunctions() {
    shippingoption = GetShippingOption();
    if (shippingoption === "edit") {
        var details = GetShippingDetails();
        $("#add_ship_method_percent").val(details.split("#")[1]);
        $("#add_ship_admin_percent").val(details.split("#")[5]);
        $("#add_ship_interval").val(details.split("#")[2]);
        $("#add_ship_name").val(details.split("#")[0]);
        $("#add_ship_phone").val(details.split("#")[4]);
        $("#add_ship_email").val(details.split("#")[3]);
    }


}

function DisplayNewShippingAddress(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Shipping Address',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {

        });
    } else if (resp.status === "error") {
        swal({
            title: "Shipping Address",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}