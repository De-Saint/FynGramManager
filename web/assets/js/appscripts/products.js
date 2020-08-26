/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid, sessiontype, productid;
$(document).ready(function () {
    productFunctions();
});

function GetProductID() {
    return productid = localStorage.getItem("productid");
}
function productFunctions() {
    productBtnEvents();
    productSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }

    productPageFunctions();
}


function productBtnEvents() {
    $(".btn-sp").click(function () {
        productSearchOptions();
    });

    $(".btn-add-product").click(function () {
        var sessiontype = GetSessionType();
        if (sessiontype === "Admin") {
            localStorage.setItem("option", "addproduct");
            window.location = extension + "LinksServlet?type=AdminAddProduct";
        } else if (sessiontype === "Seller") {
            localStorage.setItem("option", "addproduct");
            window.location = extension + "LinksServlet?type=SellerAddProduct";
        }
    });


    $(".btn-cp").click(function () {
        $("#s-pstatus").val("2");
        $("#s-pprmax").val("");
        $("#s-pprmin").val("");
        $("#s-pqtymax").val("");
        $("#s-pqtymin").val("");
        $("#s-pcat").val("0");
        $("#s-seller").val("");
        $("#s-pname").val("");
        $("#s-pidmax").val("");
        $("#s-pidmin").val("");
        $("#s-pactive").prop('selectedIndex', 0);
        showLoader();
        GetData("Products", "GetProducts", "LoadProducts", sessionid);

    });
    $(".btn-prod-bulk-action").click(function () {
        var prods = $.map($('input[name="prod-id"]:checked'), function (c) {
            return c.value;
        });
        var prodids = prods.toString();
        if (prodids.includes(",")) {
            prodids = prodids.replace(/,/g, ':');
        }
        var Status = $("#productoption").val();
        if (Status === "Select Action" || prodids === "") {
            ErrorNoty("Please select an action to perform OR tick the products");
            return false;
        }
        var otherText = "";
        var Note = "";
        var StatusText = "";
        if (Status === "Deleted") {
            otherText = "Are you sure you want to Delete the selected products? Only Activated Products will NOT  be Deleted";
            StatusText = "Delete";
        } else if (Status === "Deactivated") {
            otherText = "Are you sure you want to Deactivate the selected products? Only Activated Products would be Deactivated and the selected products will no longer be shown on the Front Store";
            Note = "Product has been deactivated. Please contact the Admin";
            StatusText = "Deactivate";
        } else if (Status === "Rejected") {
            otherText = "Are you sure you want to Reject the selected products? Only Pending Products will be Rejected";
            Note = "Product has been rejected. Please contact the Admin";
            StatusText = "Reject";
        } else if (Status === "Activated") {
            otherText = "Are you sure you want to Activate the selected products?";
            Note = "Product has been activated. Please contact the Admin";
            StatusText = "Approve";
        }

        ProcessProductStatus("0", Status, Note, StatusText, otherText, "Bulk", prodids);
    });

    $("form[name=newConditionForm]").submit(function (e) {
        var newConditionName = $("#newConditionName").val();
        var newConditionID = $("#newConditionID").val();
        $("#newproductcondition").modal("hide");
        var data = [];
        if (newConditionID === "0" || newConditionID === 0) {
            data = [0, "Created", newConditionName];
        } else if (newConditionID !== "0" || newConditionID !== 0) {
            data = [newConditionID, "Edited", newConditionName];
        }
        showLoader();
        GetData("Products", "ProcessProductCondition", "LoadProductInfo", data);
        e.preventDefault();
    });
    $("form[name=showPriceForm]").submit(function (e) {
        var showOption = $("#showOption").val();
        showLoader();
        $("#show_actual_price").modal("hide");
        GetData("Products", "ProcessProductActualPrice", "LoadProductInfo", showOption);
        e.preventDefault();
    });

    $("form[name=newUnitForm]").submit(function (e) {
        var newUnitName = $("#newUnitName").val();
        var newUnitDesc = $("#newUnitDesc").val();
        var newUnitID = $("#newUnitID").val();
        var data = [];
        if (newUnitID === "0" || newUnitID === 0) {
            //new
            data = [0, "Created", newUnitName, newUnitDesc];
        } else if (newUnitID !== "0" || newUnitID !== 0) {
            //edit
            data = [newUnitID, "Edited", newUnitName, newUnitDesc];
        }
        showLoader();
        $("#newproductunit").modal("hide");
        GetData("Products", "ProcessProductUnit", "LoadProductInfo", data);
        e.preventDefault();
    });
    $("form[name=reStockForm]").submit(function (e) {
        var newQuantity = $("#newQuantity").val();
        showLoader();
        $("#restock").modal("hide");
        productid = GetProductID();
        var data = [productid, newQuantity, sessionid];
        GetData("Products", "ProductRestock", "LoadProductRestock", data);
        e.preventDefault();
    });
}


function productSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-product").addClass("active");
}

function productPageFunctions() {
    showLoader();
    GetData("Products", "GetProducts", "LoadProducts", sessionid);
    GetData("Products", "GetProductCondtions", "LoadProductConditions", "");
    GetData("Products", "GetUnits", "LoadUnits", "");
    GetData("Category", "GetAllProductCategories", "LoadAllProductCategories", "");


}
function productSearchOptions() {
    var dataids = "";
    var dataname = "";
    var dataactive = "";
    var dataprice = "";
    var dataqty = "";
    var datacat = "";
    var dataseller = "";
    var datastatus = "";

    var status = $("#s-pstatus").val();
    if (status !== "0") {
        datastatus = [status, sessionid];
    } else if (status === "0") {
        datastatus = "";
    }

    var active = $("#s-pactive").val();
    if (active !== "2") {
        dataactive = [active, sessionid];
    }
    var pricemax = $("#s-pprmax").val();
    var pricemin = $("#s-pprmin").val();
    if (pricemin !== "" && pricemax !== "") {
        dataprice = [pricemin, pricemax, sessionid];
    } else {
        if ((pricemax !== "" && pricemin === "") || (pricemax === "" && pricemin !== "")) {
            ErrorNoty("Please, provide both the minimum and maximum prices, to search by Price");
        }
    }

    var qtymax = $("#s-pqtymax").val();
    var qtymin = $("#s-pqtymin").val();
    if (qtymax !== "" & qtymin !== "") {
        dataqty = [qtymin, qtymax, sessionid];
    } else {
        if ((qtymax !== "" && qtymin === "") || (qtymax === "" && qtymin !== "")) {
            ErrorNoty("Please, provide both the minimum and maximum quantity, to search by Quantity");
        }
    }

    var category = $("#s-pcat").val();
    if (category !== "0") {
        datacat = [category, sessionid];
    } else if (category === "0") {
        datacat = "";
    }

    var seller = $("#s-seller").val();
    if (seller !== "") {
        dataseller = [seller, sessionid];
    }
    var name = $("#s-pname").val();
    if (name !== "") {
        dataname = [name, sessionid];
    }

    var idmax = $("#s-pidmax").val();
    var idmin = $("#s-pidmin").val();
    if (idmax !== "" & idmin !== "") {
        dataids = [idmin, idmax, sessionid];
    } else {
        if ((idmax !== "" && idmin === "") || (idmax === "" && idmin !== "")) {
            ErrorNoty("Please, provide both the minimum and maximum id, to search by ProductID");
        }
    }

    if (dataids !== "") {
        showLoader();
        GetData("Products", "GetProductsByIDs", "LoadProducts", dataids);
    } else if (dataname !== "") {
        showLoader();
        GetData("Products", "GetProductsByName", "LoadProducts", dataname);
    } else if (dataactive !== "") {
        showLoader();
        GetData("Products", "GetProductsByActive", "LoadProducts", dataactive);
    } else if (dataprice !== "") {
        showLoader();
        GetData("Products", "GetProductsByPrices", "LoadProducts", dataprice);
    } else if (dataqty !== "") {
        showLoader();
        GetData("Products", "GetProductsByQuantity", "LoadProducts", dataqty);
    } else if (datacat !== "") {
        showLoader();
        GetData("Products", "GetProductsByCategoryID", "LoadProducts", datacat);
    } else if (dataseller !== "") {
        showLoader();
        GetData("Products", "GetProductsBySeller", "LoadProducts", dataseller);
    } else if (datastatus !== "") {
        showLoader();
        GetData("Products", "GetProductsByStatus", "LoadProducts", datastatus);
    } else {
        ErrorNoty("Please, fill any of the search fields");
    }
}



function DisplayProducts(data) {
    hideLoader();
    var parent = $("#ProductList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var childclone = parent.find(".prodlist-clone").removeClass("d-none");
        var count = 0;
        var totalapproved = 0;
        var totalunapproved = 0;
        var ids = data[0];
        var result = data[1];
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("prodlist-clone");
            newchild.addClass("new-clone");
            newchild.find(".prod-sn").text(count);
            var ProductID = details["ProductID"];
            newchild.find(".prod-id").val(ProductID);
            newchild.find(".prod-name").text(details["InfoDetails"].name);
            newchild.find(".prod-desc").text(details["InfoDetails"].description);
            let active = details["active"];
            if (active === "0" || active === 0) {
                newchild.find(".prod-active").text("No").addClass("badge-danger");
                totalunapproved++;
            } else if (active === "1" || active === 1) {
                newchild.find(".prod-active").text("Yes").addClass("badge-success");
                totalapproved++;
            }

            var status = details["SellerDetails"].status;
            if (status === "Pending") {
                newchild.find(".btn-prod-activate").removeClass("d-none");
                newchild.find(".btn-prod-reject").removeClass("d-none");
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-primary");
            } else if (status === "Activated") {
                newchild.find(".btn-prod-deactivate").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-success");
            } else if (status === "Deactivated") {
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".btn-prod-activate").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-danger");
            } else if (status === "Rejected") {
                newchild.find(".btn-prod-delete").removeClass("d-none");
                newchild.find(".prod-status").text(status).addClass("badge-danger");
            }

            newchild.find(".prod-rootcategory").text(details["RootCatName"]);
            newchild.find(".prod-sellername").text(details["SellerDetails"].SellerUserName);
            newchild.find(".prod-quantity").text(details["QuantityDetails"].total_quantity);
            newchild.find(".prod-price").text(PriceFormat(details["PriceDetails"].selling_price));

            if (details["FirstImage"] === "0" || details["FirstImage"] === 0) {
                var image_url = extension + "assets/images/brand/logo.png";
                newchild.find(".prod-firstimage").attr("src", image_url);
            } else if (details["FirstImage"] !== "0" || details["FirstImage"] !== 0) {
                newchild.find(".prod-firstimage").attr("src", "data:image/png;base64," + details["FirstImage"]);
            }

            newchild.find(".btn-prod-details").click(function () {
                var sessiontype = GetSessionType();
                if (sessiontype === "Admin") {
                    localStorage.setItem("productid", ProductID);
                    window.location = extension + "LinksServlet?type=AdminProductDetails";
                } else if (sessiontype === "Seller") {
                    localStorage.setItem("productid", ProductID);
                    window.location = extension + "LinksServlet?type=SellerProductDetails";
                }
            });
            var restockbtn = newchild.find(".restockbtn").click(function () {
                localStorage.setItem("productid", ProductID);
                $("#restock #newQuantity").val(details["QuantityDetails"].total_quantity);
                $("#restock").modal("show");
            });
            DisplayToolTip(restockbtn);

            newchild.find(".btn-prod-deactivate").click(function () {
                ProcessProductStatus(ProductID, "Deactivated", "Product has been deactivated. Please contact the Admin", "Deactivate", "Are you sure you want to Deactivate this product? This product would no longer be shown on the Front Store", "Single", "");
            });

            newchild.find(".btn-prod-activate").click(function () {
                ProcessProductStatus(ProductID, "Activated", "Product has been approved and activated.", "Activate", "Are you sure you want to Activate this product?", "Single", "");
            });

            newchild.find(".btn-prod-reject").click(function () {
                ProcessProductStatus(ProductID, "Rejected", "Product has been rejected. Please contact the Admin", "Reject", "Are you sure you want to Reject this product?", "Single", "");
            });
            newchild.find(".btn-prod-delete").click(function () {
                ProcessProductStatus(ProductID, "Deleted", "Product has been rejected. Please contact the Admin", "Delete", "Are you sure you want to Delete this product?", "Single", "");
            });
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".TotalProducts").text(count);
        $(".TotalApproved").text(totalapproved);
        $(".TotalUnapproved").text(totalunapproved);
    } else {

    }
}

function ProcessProductStatus(ProductID, Status, Note, StatusText, infoText, Option, ProductIDs) {
    var data = [ProductID, Status, Note, Option, ProductIDs];
    swal({
        title: StatusText + ' Product',
        text: infoText,
        type: 'warning',
        showCancelButton: true,
        closeOnConfirm: false,
        confirmButtonText: ' Yes!',
        buttonsStyling: true
    }, function (dismiss) {
        if (dismiss) {
            showLoader();
            GetData("Products", "ProcessProductStatus", "LoadProductInfo", data);
        }
    });
}



function DisplayUnits(data) {
//    hideLoader();
    var parent = $("#ProductUnitList");
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".produnitclone");
        var ids = data[0];
        var result = data[1];
        var count = 0;
        $.each(ids, function (index, id) {
            var details = result[id];
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("prodconditionclone");
            newchild.removeClass("d-none");
            newchild.find(".produnit-sn").text(count);
            newchild.find(".produnit-id").text(id);
            newchild.find(".produnit-name").text(details["name"]);
            newchild.find(".produnit-desc").text(details["description"]);
            var btnedit = newchild.find(".btn-prounit-edit").click(function () {
                $("#newproductunit").modal("show");
                $("#newproductunit #newUnitID").val(id);
                $("#newproductunit #newUnitDesc").val(details["description"]);
                $("#newproductunit #newUnitName").val(details["name"]);
            });
            DisplayToolTip(btnedit);
            var btndelete = newchild.find(".btn-prounit-delete").click(function () {
                swal({
                    title: 'Product',
                    text: "Are you sure you want to delete this product unit?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        var data = [id, "Deleted", "", ""];
                        showLoader();
                        GetData("Products", "ProcessProductUnit", "LoadProductInfo", data);
                    }
                });
            });
            DisplayToolTip(btndelete);

            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}

function  DisplayProductConditions(data) {
//    hideLoader();
    var parent = $("#ProdConditionList");
    if (data === "none") {
        parent.text("No Result");
    } else {
        var childclone = parent.find(".prodconditionclone");
        var ids = data[0];
        var result = data[1];
        var count = 0;
        $.each(ids, function (index, id) {
            var details = result[id];
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("prodconditionclone");
            newchild.removeClass("d-none");
            newchild.find(".prodcond-sn").text(count);
            newchild.find(".prodcond-id").text(details["id"]);
            newchild.find(".prodcond-name").text(details["name"]);
            var btnedit = newchild.find(".btn-prodcond-edit").click(function () {
                $("#newproductcondition").modal("show");
                $("#newproductcondition #newConditionID").val(id);
                $("#newproductcondition #newConditionName").val(details["name"]);
            });
            DisplayToolTip(btnedit);

            var btndelete = newchild.find(".btn-prodcond-delete").click(function () {
                swal({
                    title: 'Product',
                    text: "Are you sure you want to delete this product condition?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Yes!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        var data = [id, "Deleted", "", ""];
                        showLoader();
                        GetData("Products", "ProcessProductCondition", "LoadProductInfo", data);
                    }
                });
            });
            DisplayToolTip(btndelete);
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}



function DisplayProductInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Product',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
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

function DisplayAllProductCategories(data) {
    var cs = $("#s-pcat");
    if (data === "none") {
        cs.text("No Result");
        $("#s-pcat").prop("disabled", true);
    } else {
        $("#s-pcat").prop("disabled", false);
        var ids = data[0];
        var result = data[1];
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Cateogory"));
        $.each(ids, function (index, id) {
            var details = result[id];
            cs.append($('<option/>').val(details["id"]).text(details["name"]));

        });
    }
}

function DisplayProductRestock(data) {
    hideLoader();
    var resp = data[2];
    if (resp.status === "success") {
        swal({
            title: 'Product',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            DisplayProducts(data);
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