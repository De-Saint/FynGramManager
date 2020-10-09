/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid, sessiontype, productid, option;
$(document).ready(function () {
    addProductFunctions();
});

function GetProductID() {
    return productid = localStorage.getItem("productid");
}
function GetProductOption() {
    return option = localStorage.getItem("option");
}

function addProductFunctions() {
    addProductBtnEvents();
    addProductSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }

    addProductPageFunctions();
}

//user is "finished typing," do something
function doneTyping() {
    var addprodname = $("#addprod-name").val();
    if (addprodname === "") {
        $("#addprod-tags").tagsinput('removeAll');
    } else {
        $("#addprod-tags").tagsinput('add', addprodname);
    }
}
function addProductBtnEvents() {

    var typingTimer;                //timer identifier
    var doneTypingInterval = 2000;  //time in ms, 2 second for example
    var $input = $('#addprod-name');

//on keyup, start the countdown
    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

//on keydown, clear the countdown 
    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

    $("#AddNewProduct").click(function () {
        document.getElementById("newProductImageForm").reset();
        $(".notcreated").removeClass("d-none");
        $(".created").addClass("d-none");
        $("#newProductForm").trigger("reset");
        localStorage.removeItem("option");
    });

    $('#demo').FancyFileUpload({
        params: {
            action: 'fileuploader'
        },
        'edit': false,
        maxfilesize: 1000000,
        startupload: function (SubmitUpload, e, data) {
            var newcreatedprodid = $("#newcreatedprodid").val();
            WarningNoty("Uploading Image");
            ConvertImageToBase64(data, newcreatedprodid, "Product");
        }
    });

    $("form[name=newProductForm]").submit(function (e) {
        var name = $("#addprod-name").val();
        var desc = $("#addprod-desc").val();
        var refnumber = $("#addprod-refnumber").val();
        var upcbarcode = $("#addprod-upcbarcode").val();
        var prodcondition = $("#addprod-prodcondition").val();
        var sellingprice = $("#addprod-sellingprice").val();
        if (sellingprice.includes(",")) {
            sellingprice = sellingprice.replace(",", "");
        }
        var costprice = $("#addprod-costprice").val();
        if (costprice.includes(",")) {
            costprice = costprice.replace(",", "");
        }
        var quantity = $("#addprod-quantity").val();
        var quantitymin = $("#addprod-quantitymin").val();

        var catIDs = $.map($('input[name="addprod-cat-id"]:checked'), function (c) {
            return c.value;
        });
        var categoryids = catIDs.toString();
        if (categoryids.includes(",")) {
            categoryids = categoryids.replace(/,/g, ':');
        }

        var parcatIDs = $.map($('input[name="addprod-parcat-id"]:checked'), function (c) {
            return c.value;
        });
        var parentcatids = parcatIDs.toString();
        if (parentcatids.includes(",")) {
            parentcatids = parentcatids.replace(/,/g, ':');
        }
        var subcatIDs = $.map($('input[name="addprod-subcat-id"]:checked'), function (c) {
            return c.value;
        });
        var subcatids = subcatIDs.toString();
        if (subcatids.includes(",")) {
            subcatids = subcatids.replace(/,/g, ':');
        }
        var selectedcatids = categoryids + ":" + parentcatids + ":" + subcatids;

        var propIDs = $.map($('input[name="addprod-prop-id"]:checked'), function (prop) {
            return prop.value;
        });
        var propertiesids = propIDs.toString();
        if (propertiesids.includes(",")) {
            propertiesids = propertiesids.replace(/,/g, ':');
        }


        var subpropIDs = $.map($('input[name="addprod-subprop-id"]:checked'), function (c) {
            return c.value;
        });
        var subpropertiesids = subpropIDs.toString();
        if (subpropertiesids.includes(",")) {
            subpropertiesids = subpropertiesids.replace(/,/g, ':');
        }

        var selectedproperties = propertiesids + ":" + subpropertiesids;
        var unit = $("#addprod-unit").val();
        var unitvalue = $("#addprod-unitvalue").val();

        var tags = $("#addprod-tags").val().trim();
        if (tags.includes(",")) {
            tags = tags.split(",").join(":");
        }

        var stocknotification = $("#addprod-stocknotification").val();
        var stockmin = $("#addprod-stockmin").val();

        var shippingheight = $("#addprod-shippingheight").val();
        var shippingdepth = $("#addprod-shippingdepth").val();
        var shippingwidth = $("#addprod-shippingwidth").val();

        option = GetProductOption();
        productid = GetProductID();
        var data = [option, sessionid, name, desc, refnumber, upcbarcode, prodcondition, sellingprice, costprice, quantity, quantitymin, selectedcatids, selectedproperties, unit,
            unitvalue, tags, stocknotification, stockmin, shippingheight, shippingdepth, shippingwidth, productid];
        showLoader();
        GetData("Products", "CreateProduct", "LoadCreateProduct", data);
        e.preventDefault();
    });
}

function SubmitUpload(resp, data) {
    data.ff_info.RemoveFile();
    if (resp.status === "success") {
        SuccessNoty(resp.msg);
    } else {
        ErrorNoty(resp.msg);
    }
}

function addProductSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-product").addClass("active");
}

function addProductPageFunctions() {
    showLoader();
    GetData("Products", "GetProductCondtions", "LoadProductConditions", "");
    GetData("Category", "GetProperties", "LoadProductProperties", "");
    GetData("Category", "GetAllProperties", "LoadAllProperties", "");
    GetData("Category", "GetAllLevelCategories", "LoadAllLevelCategories", "");
    GetData("Products", "GetStockNotifications", "LoadStockNotifications", "");
    GetData("Products", "GetUnits", "LoadUnits", "");

    option = GetProductOption();
    if (option === "editproduct") {
        productid = GetProductID();
        GetData("Products", "GetProductDetails", "LoadAddProductDetails", productid);
    }


}


function DisplayProductConditions(data) {
    hideLoader();
    var cs = $("#addprod-prodcondition");
    if (data === "none") {
        cs.text("No Results");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Condition"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
    }
}

function DisplayStockNotifications(data) {
    hideLoader();
    var cs = $("#addprod-stocknotification");
    if (data === "none") {
        cs.text("No Results");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Stock Notification Type"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
    }

}

function DisplayUnits(data) {
    hideLoader();
    var cs = $("#addprod-unit");
    if (data === "none") {
        cs.text("No Results");
    } else {
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Product Unit"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));
        });
    }
}


function DisplayAllProperties(data) {
    hideLoader();
    var parent = $(".addprod-proplist");
    var CatList = data[0];
    var TopCatSubs = data[1];
    if (data === "none") {
        parent.text("No Results");
    } else {
        var childclone = parent.find(".addprod-prop-clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("addprod-prop-clone");
            newchild.removeClass("d-none");
            var topdetails = CatList["root" + id];
            newchild.find(".addprod-prop-id").val(topdetails["id"]);
            newchild.find(".addprod-prop-name").text(topdetails["name"]);

            var subParent = newchild.find(".addprod-subproplist");
            var subchildclone = subParent.find(".addprod-subprop-clone");
            $.each(subs, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("addprod-subprop-clone");
                newsubchild.removeClass("d-none");
                var subdetails = CatList["par" + subid];
                newsubchild.find(".addprod-subprop-id").val(subdetails["id"]);
                newsubchild.find(".addprod-subprop-name").text(subdetails["name"]);
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}

function DisplayAllLevelCategories(data) {
    hideLoader();
    var parent = $("#addprod-categorylist");
    parent.find(".catnewclone").remove();
    var List = data[0];
    var CatIDs = data[1];
    var SubCatIDs = data[2];
    if (data === "none") {
        parent.text("No Results");
    } else {
//-------------------TOp Categery Start----------------------//
        var childclone = parent.find(".addprod-category-clone");
        $.each(List, function (topcatid, details) {
            var newchild = childclone.clone();
            newchild.removeClass("addprod-category-clone");
            newchild.removeClass("d-none");
            newchild.find(".addprod-cat-id").val(details["id"]);
            newchild.find(".addprod-cat-name").text(capitaliseFirstLetter(details["name"]));
//            //-------------------Categery Start----------------------//
            var Categories = CatIDs[topcatid];
            var catParent = newchild.find("#addprod-parcategorylist");
            var catclone = catParent.find(".addprod-parcategory-clone");
            $.each(Categories, function (cid, catdetails) {
                var catchild = catclone.clone();
                var catid = catdetails["id"];
                catchild.removeClass("addprod-parcategory-clone");
                catchild.removeClass("d-none");
                catchild.find("input[name=addprod-parcat-id]").val(catid);
                catchild.find(".addprod-parcat-name").text(capitaliseFirstLetter(catdetails["name"]));

////                //-------------------Sub Categery Start----------------------//
                var SubCategories = SubCatIDs[catid];
                var subcatParent = catchild.find("#addprod-subcategorylist");
                var subcatclone = subcatParent.find(".addprod-subcategory-clone");
                $.each(SubCategories, function (sid, subcatdetails) {
                    var subid = subcatdetails["id"];
                    var subcatchild = subcatclone.clone();
                    subcatchild.addClass("addprod-subcategory-clone");
                    subcatchild.removeClass("d-none");
                    subcatchild.find("input[name=addprod-subcat-id]").val(subid);
                    subcatchild.find(".addprod-subcat-name").text(capitaliseFirstLetter(subcatdetails["name"]));
                    subcatchild.appendTo(subcatParent);
                });
                subcatclone.hide();
////                //-------------------Sub Categery End----------------------//
                catchild.appendTo(catParent).show();
            });
            catclone.hide();
            //-------------------Categery End----------------------//
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        //-------------------Top Categery End----------------------//
    }
}


function DisplayCreateProduct(resp) {
    hideLoader();
    if (resp.status === "success") {
        $(".notcreated").addClass("d-none");
        $(".created").removeClass("d-none");
        $("#newcreatedprodid").val(resp.newcreatedprodid);
        swal({
            title: 'New Product',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Continue!',
            buttonsStyling: true
        });
    } else if (resp.status === "error") {
        swal({
            title: "New Product",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayAddProductInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Product',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Continue!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
        });
    } else if (resp.status === "error") {
        swal({
            title: "Product",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayAddProductDetails(data) {
    hideLoader();
    $("#addprod-name").val(data.InfoDetails.name);
    $("#addprod-desc").val(data.InfoDetails.description);
    $("#addprod-refnumber").val(data.InfoDetails.reference_code);
    $("#addprod-upcbarcode").val(data.InfoDetails.upc_barcode);
    $("#addprod-upcbarcode").val(data.InfoDetails.upc_barcode);
    $("#addprod-sellingprice").val(data.PriceDetails.selling_price);
    $("#addprod-costprice").val(data.PriceDetails.cost_price);
    $("#addprod-quantity").val(data.QuantityDetails.total_quantity);
    $("#addprod-quantitymin").val(data.QuantityDetails.minimum_quantity);
    $("#addprod-unitvalue").val(data.UnitDetails.value);
    $("#addprod-stockmin").val(data.StockDetails.minimum_stock_level);
    $("#addprod-shippingwidth").val(data.ShippingPackageDetails.package_width);
    $("#addprod-shippingheight").val(data.ShippingPackageDetails.package_height);
    $("#addprod-shippingdepth").val(data.ShippingPackageDetails.package_depth);
    $("#addprod-tags").tagsinput('add', data.InfoDetails.name);

}
