/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var extension = '../../../../';
var sessionid, sessiontype, productid;
$(document).ready(function () {
    productDetailsFunctions();
});

function GetProductID() {
    return productid = localStorage.getItem("productid");
}
function productDetailsFunctions() {
    productDetailsBtnEvents();
    productDetailsSetActiveLink();

    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }


    productDetailsPageFunctions();
}


function productDetailsBtnEvents() {
    $("#EditProduct").click(function () {
        var sessiontype = GetSessionType();
        if (sessiontype === "Admin") {
            productid = GetProductID();
            localStorage.setItem("productid", productid);
            localStorage.setItem("option", "editproduct");
            window.location = extension + "LinksServlet?type=AdminAddProduct";
        } else if (sessiontype === "Seller") {
            productid = GetProductID();
            localStorage.setItem("productid", productid);
            localStorage.setItem("option", "editproduct");
            window.location = extension + "LinksServlet?type=SellerAddProduct";
        }

    });

}


function productDetailsSetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-product").addClass("active");
}

function productDetailsPageFunctions() {
    showLoader();
    productid = GetProductID();
    GetData("Products", "GetProductDetails", "LoadProductDetails", productid);

}

function DisplayProductDetails(data) {
    hideLoader();
    $(".product-name").text(data["InfoDetails"].name);
    $(".product-desc").text(data["InfoDetails"].description);
    $(".product-ref").text(data["InfoDetails"].reference_code);
    $(".product-upc").text(data["InfoDetails"].upc_barcode);
    $(".product-quantity").text(NumberFormat(data["QuantityDetails"].total_quantity));
    $(".product-mquantity").text(NumberFormat(data["QuantityDetails"].minimum_quantity));
    $(".product-price").text(PriceFormat(data["PriceDetails"].selling_price));
    $(".product-cprice").text(PriceFormat(data["PriceDetails"].cost_price));
    $(".product-unit-name").text(data["UnitDetails"].UnitName);
    $(".product-unit-value").text(data["UnitDetails"].value);
    $(".product-seller-name").text(data["SellerDetails"].SellerUserName);
    $(".product-rootcat").text(data["RootCatName"]);
    $(".product-date-added").text(data["date"]);
    $(".product-time-added").text(data["time"]);
    $(".product-condition").text(data["CondionDetails"].name).addClass("text-primary h4");
    $(".product-note").text(data["SellerDetails"].note);
    $(".product-stocknotytype").text(data["StockDetails"].StockNotificationName);
    $(".product-pack-depth").text(data["ShippingPackageDetails"].package_depth);
    $(".product-pack-height").text(data["ShippingPackageDetails"].package_height);
    $(".product-pack-width").text(data["ShippingPackageDetails"].package_width);
    if (data["active"] === "1") {
        $(".product-active").text("Yes").addClass("badge badge-success");
    } else if (data["active"] === "0") {
        $(".product-active").text("No").addClass("badge badge-danger");
    }
    var status = data["SellerDetails"].status;
    if (status === "Pending") {
        $(".product-status").text(status).addClass("badge-primary");
        $(".product-note").text(data["SellerDetails"].note).addClass("text-primary");
    } else if (status === "Activated") {
        $(".product-status").text(status).addClass("badge-success");
        $(".product-note").text(data["SellerDetails"].note).addClass("text-success");
    } else if (status === "Deactivated") {
        $(".product-status").text(status).addClass("badge-danger");
        $(".product-note").text(data["SellerDetails"].note).addClass("text-danger");
    } else if (status === "Rejected") {
        $(".product-status").text(status).addClass("badge-danger");
        $(".product-note").text(data["SellerDetails"].note).addClass("text-danger");
    }

    var PropertyDetails = data["PropertyDetails"];
    DisplayProdDetProps(PropertyDetails);

    var CategoryDetails = data["CategoryDetails"];
    DisplayProdDetCats(CategoryDetails);

    var TagDetails = data["TagDetails"];
    DisplayProdDetTags(TagDetails);

    var ImageDetails = data["ImageDetails"];
    DisplayProdDetImages(ImageDetails);
    $(".product-image").attr("src", "data:image/png;base64," + data["FirstImage"]);

}

function DisplayProdDetTags(data) {
    var TagDetails = $("#product-tags-list");
    if (data === "none") {
        TagDetails.text("No Result");
    } else {
        var childclone = TagDetails.find(".product-tags-list-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("product-tags-list-clone");
            newchild.removeClass("d-none");
            newchild.find(".product-tags-name").text(details["name"]);
            newchild.appendTo(TagDetails).show();
        });
        childclone.hide();
    }
}

function DisplayProdDetCats(data) {
    var CategoryDetails = $("#product-categories-list");
    if (data === "none") {
        CategoryDetails.text("No Result");
    } else {
        var childclone = CategoryDetails.find(".product-categories-list-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("product-categories-list-clone");
            newchild.removeClass("d-none");
            newchild.find(".product-categories-name").text(details["CategoryName"]);
            newchild.appendTo(CategoryDetails).show();
        });
        childclone.hide();
    }
}

function DisplayProdDetProps(data) {
    var PropertyParent = $("#product-properties-list");
    if (data === "none") {
        PropertyParent.text("No Result");
    } else {
        var childclone = PropertyParent.find(".product-properties-list-clone");
        var count = 0;
        $.each(data, function (index, details) {
            var newchild = childclone.clone();
            count++;
            newchild.removeClass("product-properties-list-clone");
            newchild.removeClass("d-none");
            if (details["RootPropName"] !== details["name"]) {
                newchild.find(".product-properties-name").text(details["RootPropName"]);
                newchild.find(".product-properties-value").text(details["name"]);
            }
            newchild.appendTo(PropertyParent);
        });
        childclone.hide();
    }
}

function DisplayProdDetImages(data) {
    if (data["ImageText1"]) {
        if (data["ImageText1"] === "0" || data["ImageText1"] === "none") {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".product-image1").attr("src", image_url);
        } else if (data["ImageText1"] !== "0" || data["ImageText1"] !== "none") {
            $(".product-image1").attr("src", "data:image/png;base64," + data["ImageText1"]);
        }
    } else {
        $("#carousel2 .pimg1").removeClass("carousel-item").addClass("d-none");
        $("#thumbcarousel1 .pimg1").removeClass("thumb").addClass("d-none");
    }

    if (data["ImageText2"]) {
        if (data["ImageText2"] === "0" || data["ImageText2"] === "none") {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".product-image2").attr("src", image_url);
        } else if (data["ImageText2"] !== "0" || data["ImageText2"] !== "none") {
            $(".product-image2").attr("src", "data:image/png;base64," + data["ImageText2"]);
        }
    } else {
        $("#carousel2 .pimg2").removeClass("carousel-item").addClass("d-none");
        $("#thumbcarousel1 .pimg2").removeClass("thumb").addClass("d-none");
    }
    if (data["ImageText3"]) {
        if (data["ImageText3"] === "0" || data["ImageText3"] === "none") {
            var image_url = extension + "assets/images/brand/logo.png";
            $(".product-image3").attr("src", image_url);
        } else if (data["ImageText2"] !== "0" || data["ImageText2"] !== "none") {
            $(".product-image3").attr("src", "data:image/png;base64," + data["ImageText3"]);
        }
    } else {
        $("#carousel2 .pimg3").removeClass("carousel-item").addClass("d-none");
        $("#thumbcarousel1 .pimg3").removeClass("thumb").addClass("d-none");
    }

}
