/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessionid, sessiontype;
$(document).ready(function () {
    categoryFunctions();
});
function categoryFunctions() {
    categoryBtnEvents();
    categorySetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    categoryPageFunctions();
}

function categoryBtnEvents() {

    $(".addcaty").click(function () {
        localStorage.setItem("categoryid", 0);
        localStorage.setItem("catoption", "add");
        window.location = extension + "LinksServlet?type=AdminNewCategory";
    });
    $(".addpropty").click(function () {
        localStorage.setItem("propertyid", 0);
        localStorage.setItem("propoption", "add");
        window.location = extension + "LinksServlet?type=AdminNewProperty";
    });

}


function categorySetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-category").addClass("active");
}

function categoryPageFunctions() {
    showLoader();
    GetData("Category", "GetAllCategories", "LoadAllCategories", "");
    GetData("Category", "GetProperties", "LoadProperties", "");
}

function DisplayTwoLevelsCategories(data) {
//    hideLoader();
    var parent = $(".allcatdisplay");
    var CatList = data[0];
    var TopCatSubs = data[1];
    if (data === "none") {
        parent.text("No Results Found");
    } else {
        var childclone = parent.find(".allcat-clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("allcat-clone");
            newchild.removeClass("d-none");
            var topdetails = CatList["root" + id];
            var menucatbtn = newchild.find(".allcat-id").text(topdetails["id"]);
            var menucatbtn1 = newchild.find(".allcat-name").text(topdetails["name"]);
            var subParent = newchild.find(".allcatpardisplay");
            var subchildclone = subParent.find(".allcatpar-clone");
            $.each(subs, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("allcatpar-clone");
                newsubchild.removeClass("d-none");
                var subdetails = CatList["par" + subid];
                newsubchild.find(".allcatpar-id").text(subdetails["id"]);
                newsubchild.find(".allcatpar-name").text(subdetails["name"]);
                newsubchild.appendTo(subParent);
            });
            newchild.appendTo(parent);
        });
        childclone.hide();
    }
}

function DisplayCategoryInfo(resp) {
    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Category',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();

        });
    } else if (resp.status === "error") {
        swal({
            title: "Category",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}



function DisplayAllCategories(data) {
    hideLoader();
    var parent = $("#CategoryList");
    parent.find(".new-clone").remove();
    if (data !== "none") {
        var ids = data[0];
        var result = data[1];
        var childclone = parent.find(".catlist-clone").removeClass("d-none");
        var count = 0;
        var totalcat = data[2];
        var totalrootcat = data[3];
        var totalemptyroot = data[4];
        $.each(ids, function (index, id) {
            count++;
            var details = result[id];
            var newchild = childclone.clone();
            newchild.removeClass("catlist-clone");
            newchild.removeClass("new-clone");
            newchild.find(".catlist-sn").text(count);
            newchild.find(".catlist-name").text(details["name"]);
            var desc = newchild.find(".catlist-desc").text(details["description"]);
            desc.hover(function () {
                newchild.find(".catlist-desc").prop("title", details["description"]);
            });

            newchild.find(".catlst-parent").text(details["ParentName"]);
            var isroot = details["IsRoot"];//
            if (isroot === "Yes") {
                newchild.find(".catlist-root").text(details["IsRoot"]).addClass("badge-success");
            } else {
                newchild.find(".catlist-root").text(details["IsRoot"]);
            }
            if (!details.ImageText) {
                var image_url = extension + "assets/images/no-image.png";
                newchild.find(".catlist-image").attr("src", image_url);
            } else if (details["ImageText"]) {
                newchild.find(".catlist-image").attr("src", "data:image/png;base64," + details["ImageText"]);
            }
            var catid = details["id"];
            var detailsbtn = newchild.find(".btn-catlist-delete").click(function () {
                swal({
                    title: 'Delete Category',
                    text: "Are you sure you want to deleted this property? Any other category(ies) tied to this category would be deleted",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Category", "DeleteCategory", "LoadCategoryInfo", catid);
                    }
                });

            });
            DisplayToolTip(detailsbtn);
            var editbtn = newchild.find(".btn-catlist-edit").click(function () {
                localStorage.setItem("categoryid", catid);
                localStorage.setItem("catoption", "edit");
                window.location = extension + "LinksServlet?type=AdminNewCategory";
            });
            DisplayToolTip(editbtn);
            var detailbtn = newchild.find(".btn-catlist-details").click(function () {
                $("#category-details").modal("show");
                DisplayCatDetails(details);
            });
            DisplayToolTip(detailbtn);
            newchild.appendTo(parent).show();
        });
        childclone.hide();
        $(".TotalCategories").text(totalcat);
        $(".TotalRootCategories").text(totalrootcat);
        $(".TotalEmptyRootCategories").text(totalemptyroot);
    }
}

function DisplayProperties(data) {
//    hideLoader();
    var parent = $("#PropList");
    if (data !== "none") {
        var childclone = parent.find(".propclone").removeClass("d-none");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("propclone");
            newchild.find(".propsn").text(count);
            newchild.find(".propname").text(details["name"]);
            newchild.find(".propvalue").text(details["values"]);
            var btnpropdetails = newchild.find(".btn-prop-details").click(function () {
                GetData("Category", "GetParentProperties", "LoadParentProperties", id);
                $(".PropertyName").text(details["name"]);
            });
            DisplayToolTip(btnpropdetails);
            var btnpropedit = newchild.find(".btn-prop-edit").click(function () {
                localStorage.setItem("propertyid", details["id"]);
                localStorage.setItem("propoption", "edit");
                window.location = extension + "LinksServlet?type=AdminNewProperty";
            });
            DisplayToolTip(btnpropedit);
            var btnpropdelete = newchild.find(".btn-prop-delete").click(function () {
                swal({
                    title: 'Delete Property',
                    text: "Are you sure you want to deleted this property? Any other properties tied to this would also be deleted.",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Category", "DeleteProperties", "LoadPropertiesInfo", id);
                    }
                });
            });

            DisplayToolTip(btnpropdelete);
            newchild.appendTo(parent).show();
        });
        childclone.hide();



    }
}

function DisplayParentProperties(data) {
    hideLoader();
    var parent = $("#PropValuesList");
    parent.find(".newclone").remove();
    if (data) {
        var childclone = parent.find(".propvalclone");
        var count = 0;
        $.each(data, function (id, details) {
            count++;
            var newchild = childclone.clone();
            newchild.removeClass("propvalclone");
            newchild.removeClass("d-none");
            newchild.addClass("newclone");
            newchild.find(".newclone").removeClass("d-none");
            newchild.find(".propval-sn").text(count);
            newchild.find(".propval-name").text(details["name"]);
            var btnpropdelete = newchild.find(".btn-propval-delete").click(function () {
                swal({
                    title: 'Delete Property',
                    text: "Are you sure you want to deleted this property?",
                    type: 'warning',
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: ' Ok!',
                    buttonsStyling: true
                }, function (dismiss) {
                    if (dismiss) {
                        showLoader();
                        GetData("Category", "DeleteProperties", "LoadPropertiesInfo", id);
                    }
                });
            });
            DisplayToolTip(btnpropdelete);
            var btnpropedit = newchild.find(".btn-propval-edit").click(function () {
                localStorage.setItem("propertyid", details["id"]);
                localStorage.setItem("propoption", "edit");
                window.location = extension + "LinksServlet?type=AdminNewProperty";

            });
            DisplayToolTip(btnpropedit);
            newchild.appendTo(parent).show();
        });


        if (data === "none") {
            $(".prop-par-prop").addClass("d-none");
        } else {
            $(".prop-par-prop").removeClass("d-none");
            var cs = $("#prop-par-prop");
            cs.empty();
            cs.append($('<option/>').val(0).text("Select Property"));
            $.each(data, function (key, value) {
                cs.append($('<option/>').val(key).text(value["name"]));
            });
        }
        childclone.hide();
    }
}

function DisplayCatDetails(data) {
    $(".cat-list-name").text(data.name);
    $(".cat-list-description").text(data.description);

    var catpropdata = data.PropertyDetails;
    var parent = $(".cat-det-proplist");
     parent.find(".newclone").remove();
    var CatList = catpropdata.catList;
    var TopCatSubs = catpropdata.RootCatParIDs;
    if (data === "none") {
        parent.text("No Results Found");
    } else {
        var childclone = parent.find(".cat-det-proplist-clone");
        $.each(TopCatSubs, function (id, subs) {
            var newchild = childclone.clone();
            newchild.removeClass("cat-det-proplist-clone");
            newchild.removeClass("d-none");
            newchild.removeClass("newclone");
            var topdetails = CatList["root" + id];
            newchild.find(".cat-det-prop-name").text(topdetails["name"]);

            var subParent = newchild.find(".cat-det-subproplist");
             subParent.find(".newClone").remove();
            var subchildclone = subParent.find(".cat-det-subprop-clone");
            $.each(subs, function (id, subid) {
                var newsubchild = subchildclone.clone();
                newsubchild.removeClass("cat-det-subprop-clone");
                newsubchild.removeClass("d-none");
                newsubchild.removeClass("newClone");
                var subdetails = CatList["par" + subid];
                newsubchild.find(".cat-det-subprop-name").text(subdetails["name"]);
                newsubchild.appendTo(subParent).show();
            });
             subchildclone.hide();

            newchild.appendTo(parent).show();
        });
        childclone.hide();
    }
}

function DisplayPropertiesInfo(resp) {

    hideLoader();
    if (resp.status === "success") {
        swal({
            title: 'Properties',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: true,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
            $("#newPropertyForm").trigger("reset");
        });
    } else if (resp.status === "error") {
        swal({
            title: "Properties",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}