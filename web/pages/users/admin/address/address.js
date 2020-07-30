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

}
function  addressSetActiveLink() {
    $("#id-carrier-svg").addClass("resp-tab-active");
    $("#id-carrier-side").addClass("resp-tab-content-active");
    $("#id-carrier-address").addClass("active");
}

function addressPageFunction() {
//    alert("heye");
    showLoader();
    GetData("Address", "GetAddressTypes", "LoadGetAddressTypes", "");
}

function DisplayGetAddressTypes(data, parent) {
    console.log(data);
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var discountcount = 0;
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

            
            var deletebtn = newchild.find(".btn-shipping-f-delete");
            var editbtn = newchild.find(".btn-shipping-f-edit");
            DisplayToolTip(deletebtn);
            DisplayToolTip(editbtn);
            editbtn.click(function () {
                $("#new_shipping_fees").modal("show");
                $("#new_shipping_fees #newShippingID").val(result["id"]);
                $("#new_shipping_fees #newShippingAmt").val(result["delivery_fees"]);
            });
            deletebtn.click(function () {
                swal({
                    title: 'Shipping Fees',
                    text: "Are you sure you want to delete this shipping fees and the details?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Shipping", "DeleteShippingFees", "LoadShippingFeesOptions", result["id"]);
                    }
                });

            });

            newchild.appendTo(parent).show();
        });
        $(".cart_total_count").text(NumberFormat(totalcount));
        $(".cart_total_discount_count").text(NumberFormat(discountcount));
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found"}).appendTo(row);

    }
}