/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
$(document).ready(function () {
    addressFunctions();
});


function addressFunctions() {
    addressBtnEvents();
    addressSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    addressPageFunction();
}


function  addressBtnEvents() {
    $("form[name=NewAddressTypeForm]").submit(function (e) {
        var addtypeName = $("#newAddressTypeName").val();
        var addtypeID = $("#newAddressTypeID").val();
        var data = [addtypeName, addtypeID];
        showLoader();
        $("#new-address-type").modal("hide");
        GetData("Address", "NewAddressType", "LoadAddressTypeOption", data);
        $("#newAddressTypeName").val("");
        $("#newAddressTypeID").val(0);
        e.preventDefault();
    });
}
function  addressSetActiveLink() {
    $("#id-carrier-svg").addClass("resp-tab-active");
    $("#id-carrier-side").addClass("resp-tab-content-active");
    $("#id-carrier-address").addClass("active");
}

function addressPageFunction() {
    showLoader();
    GetData("Address", "GetAddresses", "LoadAddresses", "");
    GetData("Address", "GetAddressTypes", "LoadGetAddressTypes", "");
}

function DisplayGetAddressTypes(data) {
     var parent = $(".addresstypeList");
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var childclone = parent.find(".addresstype-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("addresstype-clone");
            newchild.addClass("newclone");
            newchild.find(".addresstype-sn").text(count);
            newchild.find(".addresstype-name").text(result["name"]);


            var deletebtn = newchild.find(".address_type_delete_btn");
            var editbtn = newchild.find(".address_type_edit_btn");
            DisplayToolTip(deletebtn);
            DisplayToolTip(editbtn);
            editbtn.click(function () {
                $("#new-address-type").modal("show");
                $("#new-address-type #newAddressTypeID").val(result["id"]);
                $("#new-address-type #newAddressTypeName").val(result["name"]);
            });
            deletebtn.click(function () {
                swal({
                    title: 'Address Type',
                    text: "Are you sure you want to delete this address type?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Address", "DeleteAddressType", "LoadAddressTypeOption", result["id"]);
                    }
                });

            });

            newchild.appendTo(parent).show();
        });
        $(".Total_Address_Types").text(NumberFormat(count));
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "6", text: "No Results Found"}).appendTo(row);

    }
}

function DisplayAddresses(data) {
    hideLoader();
    var parent = $(".AddressList");
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var count = 0;
        var childclone = parent.find(".addresslist-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("addresslist-clone");
            newchild.addClass("newclone");
            newchild.find(".address-sn").text(count);
            newchild.find(".address-username").text(result["addressusername"]);
            newchild.find(".address-type").text(result["addresstypename"]);
            newchild.find(".address-address").text(result["full_address"]);
            if (result["default_address"] === "0") {
                newchild.find(".address-default").text("Yes").addClass("badge badge-success");
            } else {
                newchild.find(".address-default").text("No").addClass("badge badge-primary");
            }
            newchild.find(".address-phone").text(result["phone"]);
            newchild.find(".address-date").text(result["date"]);


            newchild.appendTo(parent).show();
        });
        $(".Totaladdress").text(NumberFormat(count));
        childclone.hide();

    } else {
        var row = $("<tr />").appendTo(parent);
        $("<td />", {class: "text-center newclone text-primary", colspan: "7", text: "No Results Found"}).appendTo(row);

    }
}

function DisplayAddressTypeOption(data) {
    var resp = data[2];
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Address Types',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: ' Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayGetAddressTypes(data);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Address Types",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}