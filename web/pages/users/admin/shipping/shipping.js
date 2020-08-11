/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid;
$(document).ready(function () {
    shippingFunctions();
});


function shippingFunctions() {
    shippingBtnEvents();
    shippingSetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    shippingPageFunctions();
}


function shippingBtnEvents() {
    $("#AddNewShipping").click(function () {
        localStorage.setItem("shipoption", "add");
        localStorage.setItem("shippingid", 0);
        window.location = extension + "LinksServlet?type=AdminNewShipping";
    });
    $(".add_shipping-fees").click(function () {
        $("#new_shipping_fees .maxcartamount").removeClass("d-none");
        $("#new_shipping_fees .minamt").removeClass("d-none");
        $("#new_shipping_fees .maxamt").removeClass("d-none");
    });
    $('input:radio[name="max-cart-amount"]').change(
            function () {
                if ($(this).is(':checked') && $(this).val() === '1') {
                    $(".maxcartamount").removeClass("d-none");
                } else {
                    $(".maxcartamount").addClass("d-none");
                }
            });



    $("form[name=addShippingFeesForm]").submit(function (e) {
        var newShippingAmt = $("#newShippingAmt").val();
        if (newShippingAmt.includes(",")) {
            newShippingAmt = newShippingAmt.replace(",", "");
        }
        var newShippingMaxCartAmt = $("#newShippingMaxCartAmt").val();
        if (newShippingMaxCartAmt.includes(",")) {
            newShippingMaxCartAmt = newShippingMaxCartAmt.replace(",", "");
        }
        var addShippingMinCartAmt = $("#addShippingMinCartAmt").val();
        if (addShippingMinCartAmt.includes(",")) {
            addShippingMinCartAmt = addShippingMinCartAmt.replace(",", "");
        }
        var action = $("input[name=max-cart-amount]:checked").val();
        if (parseInt(action) === 0) {
            newShippingMaxCartAmt = 0;
        }
        var option = "";
        var newShippingID = $("#newShippingID").val();
        if (parseInt(newShippingID) === 0) {
            option = "add";
        } else {
            option = "edit";
            newShippingMaxCartAmt = 0;
            addShippingMinCartAmt = 0;
        }
        var data = [newShippingAmt, newShippingMaxCartAmt, addShippingMinCartAmt, option, newShippingID, action];
        showLoader();
        $("#new_shipping_fees").modal("hide");
        GetData("Shipping", "NewShippingFees", "LoadShippingFeesOptions", data);
        e.preventDefault();
    });
}
function shippingSetActiveLink() {
    $("#id-carrier-svg").addClass("resp-tab-active");
    $("#id-carrier-side").addClass("resp-tab-content-active");
    $("#id-carrier-shipping").addClass("active");
}

function shippingPageFunctions() {
    showLoader();
    GetData("Shipping", "GetShippings", "LoadShippings", "");
    GetData("Shipping", "GetShippingFees", "LoadShippingFees", "");
}


function DisplayShippings(data, parent) {
    console.log(data);
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var count = 0;
        var childclone = parent.find(".shipping-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("shipping-clone");
            newchild.addClass("newclone");
            newchild.find(".shipping-sn").text(count);
            newchild.find(".shipping-name").text(result["name"]);
            newchild.find(".shipping-deli-interval").text(result["delivery_interval"]);
            newchild.find(".shipping-total-earns").text(PriceFormat(parseFloat(result["total_earnings"])));
            newchild.find(".shipping-numb-of-deliveries").text(result["number_of_delivery"]);
            newchild.find(".shipping-ship-meth-percent").text(result["shipping_method_percentage"]);
            newchild.find(".shipping-admin-percent").text(result["admin_shipping_percentage"]);
            newchild.find(".shipping-date-added").text(result["date_added"]);
            newchild.find(".shipping-email").text(result["email"]);
            newchild.find(".shipping-phone").text(result["phone"]);

            var deletebtn = newchild.find(".btn-shipping-delete");
            var editbtn = newchild.find(".btn-shipping-edit");

            editbtn.click(function () {
                localStorage.setItem("shipoption", "edit");
                localStorage.setItem("shippingid", result["id"]);
                var details = result["name"] + "#" + result["shipping_method_percentage"] + "#" + result["delivery_interval"] + "#" + result["email"] + "#" + result["phone"] + "#" + result["admin_shipping_percentage"];
                localStorage.setItem("shippingdet", details);
                window.location = extension + "LinksServlet?type=AdminNewShipping";
            });
            deletebtn.click(function () {
                swal({
                    title: 'Shipping',
                    text: "Are you sure you want to delete this shipping/carrier method and the details?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Shipping", "DeleteShipping", "LoadDeleteShipping", result["id"]);
                    }
                });

            });
            newchild.appendTo(parent).show();
        });
        $(".TotalShippingAdded").text(totalcount);
        childclone.hide();

    } else {
        var row = $("<div />").appendTo(parent);
        $("<div />", {class: "ml-9 text-center newclone text-primary", text: "No Result Found"}).appendTo(row);

    }
}

function DisplayDeleteShipping(data, parent) {
    hideLoader();
    var resp = data[2];
    if (resp.status === "success") {
        swal({
            title: 'Shipping',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayShippings(data, parent);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Shipping",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}


function DisplayShippingFees(data, parent) {
    console.log(data);
    hideLoader();
    parent.find(".newclone").remove();
    if (data !== "none") {
        var ids = data[0];
        var details = data[1];
        var totalcount = data[2];
        var discountcount = 0;
        var count = 0;
        var childclone = parent.find(".shippingfees-clone").removeClass("d-none");
        $.each(ids, function (index, id) {
            count++;
            var result = details[id];
            var newchild = childclone.clone();
            newchild.addClass("shippingfees-clone");
            newchild.addClass("newclone");
            newchild.find(".shipping-f-sn").text(count);

            newchild.find(".shipping-f-min-cart").text(PriceFormat(parseFloat(result["min_cart_amount"])));
            var max_amount = result["max_cart_amount"];
            if (parseFloat(max_amount) === 0) {
                newchild.find(".shipping-f-max-cart").text("Greater than " + PriceFormat(parseFloat(result["min_cart_amount"])));
            } else {
                newchild.find(".shipping-f-max-cart").text(PriceFormat(parseFloat(result["max_cart_amount"])));
            }

            newchild.find(".shipping-f-ship-fees").text(PriceFormat(parseFloat(result["delivery_fees"])));

            var deletebtn = newchild.find(".btn-shipping-f-delete");
            var editbtn = newchild.find(".btn-shipping-f-edit");
            DisplayToolTip(deletebtn);
            DisplayToolTip(editbtn);
            editbtn.click(function () {
                $("#new_shipping_fees").modal("show");
                $("#new_shipping_fees #newShippingID").val(result["id"]);
                $("#new_shipping_fees #newShippingAmt").val(result["delivery_fees"]);
                $("#new_shipping_fees .maxcartamount").addClass("d-none");
                $("#new_shipping_fees .minamt").addClass("d-none");
                $("#new_shipping_fees .maxamt").addClass("d-none");
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

function DisplayShippingFeesOptions(data, parent) {
    hideLoader();
    var resp = data[2];
    if (resp.status === "success") {
        swal({
            title: 'Shipping Fees',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayShippingFees(data, parent);
        });
    } else if (resp.status === "error") {
        swal({
            title: "Shipping Fees",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}