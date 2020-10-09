/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var extension = '../../../../';
var sessionid, sessiontype, categoryid, catoption;
$(document).ready(function () {
    newCategoryFunctions();
});

function GetCategoryID() {
    return categoryid = localStorage.getItem("categoryid");
}
function GetCategoryOption() {
    return catoption = localStorage.getItem("catoption");
}

function newCategoryFunctions() {
    newCategoryBtnEvents();
    newCategorySetActiveLink();
    sessionid = verifyUser();
    if (!sessionid || sessionid === 0) {
        returnToTimeOutPage(extension);
    } else {
        sessiontype = GetSessionType();
    }
    newCategoryPageFunctions();
}

//user is "finished typing," do something
function doneTyping() {
    var addprodname = $("#newcat-name").val();
    if (addprodname === "") {
        $("#newcat-tags").tagsinput('removeAll');
    } else {
        $("#newcat-tags").tagsinput('add', addprodname);
    }
}
function newCategoryBtnEvents() {

    $("#closenewcat").click(function () {
        $(".notcreated").removeClass("d-none");
        $(".created").addClass("d-none");
    });



    var typingTimer;                //timer identifier
    var doneTypingInterval = 2000;  //time in ms, 2 second for example
    var $input = $('#newcat-name');

//on keyup, start the countdown
    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

//on keydown, clear the countdown 
    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });


    $('input:radio[name="isrootcat"]').change(
            function () {
                if ($(this).is(':checked') && $(this).val() === '1') {
                    $(".cat-root-disp").addClass("d-none");
                } else {
                    $(".cat-root-disp").removeClass("d-none");
                }
            });

    $("form[name=newCategoryForm]").submit(function (e) {
        var newcatname = $("#newcat-name").val();
        var isrootcat = $("input[name=isrootcat]:checked").val();
        var selectedcatid = $("#selectedcatid").val();
        var newcatdesc = $("#newcat-desc").val();
        if (selectedcatid === "") {
            selectedcatid = 0;
        }
        var newcattags = $("#newcat-tags").val().trim();
        var tags = newcattags.split(",").join(":");

        var subpropIDs = $.map($('input[name="addprod-subprop-id"]:checked'), function (c) {
            return c.value;
        });
        var subpropertiesids = subpropIDs.toString();

        if (subpropertiesids.includes(",")) {
            subpropertiesids = subpropertiesids.replace(/,/g, ':');
        }

        catoption = GetCategoryOption();
        if (catoption === "add") {
            if (subpropertiesids === "") {
                ErrorNoty("Please, tick the related properties.");
                return false;
            }
        }
        categoryid = GetCategoryID();
        var data = [newcatname, isrootcat, selectedcatid, newcatdesc, tags, subpropertiesids, catoption, categoryid];
        showLoader();
        GetData("Category", "CreateCategory", "LoadCreateCategory", data);
        e.preventDefault();
    });
    $("form[name=newCategoryImageForm]").submit(function (e) {
        var input = document.querySelector('input[type=file]');
        var newcreatedcatid = $("#newcreatedcatid").val();
        ConvertImageToBase64(input, newcreatedcatid, "Category");
        e.preventDefault();
    });

}



function newCategorySetActiveLink() {
    $("#id-shop-svg").addClass("resp-tab-active");
    $("#id-shop-side").addClass("resp-tab-content-active");
    $("#id-shop-category").addClass("active");
}

function newCategoryPageFunctions() {
    showLoader();
    GetData("Category", "GetRootCategories", "LoadRootCategories", "");
    GetData("Category", "GetAllProperties", "LoadCategoryAllProperties", "");

    categoryid = GetCategoryID();
    if (categoryid !== "0" || categoryid !== 0) {
        showLoader();
        GetData("Category", "GetCategoryDetails", "LoadCategoryDetails", categoryid);
    }
}



function DisplayCreateCategory(resp) {
    hideLoader();
    if (resp.status === "success") {
        $(".notcreated").addClass("d-none");
        $(".created").removeClass("d-none");
        $("#newcreatedcatid").val(resp.newcreatedcatid);
        swal({
            title: 'New Category',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Continue!',
            buttonsStyling: true
        });
    } else if (resp.status === "error") {
        swal({
            title: "New Category",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}



function DisplayCreateCategoryImage(resp) {
    if (resp.status === "success") {
        swal({
            title: 'Image Upload',
            text: resp.msg,
            type: 'success',
            showCancelButton: false,
            closeOnConfirm: false,
            confirmButtonText: 'Ok!',
            buttonsStyling: true
        }, function (dismiss) {
            window.location.reload();
            $("#newCategoryForm").trigger("reset");
        });
    } else if (resp.status === "error") {
        swal({
            title: "Image Upload",
            text: resp.msg,
            type: "error",
            confirmButtonText: 'Ok',
            showCancelButton: false,
            onClose: function () {

            }
        });
    }
}

function DisplayRootCategories(data) {
    hideLoader();
    var cs = $("#cat-root-cat");
    cs.empty();
    if (data === "none") {

    } else {
        $(".cat-child-cat").addClass("d-none");
        cs.append($('<option/>').val(0).text("Select Category"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            //Added with the EDIT
            var id = option.val(); //to get content of "value" attrib
            GetData("Category", "GetParentCategories", "LoadParentCategories", id);
            var text = option.text(); //to get <option>Text</option> content
            $("#selectedcattext").val(text);
            $("#selectedcatid").val(id);
        });
    }
}

function DisplayParentCategories(data) {
    hideLoader();
    if (data === "none") {
        $(".cat-par-cat").addClass("d-none");
        $(".cat-child-cat").addClass("d-none");
    } else {
        $(".cat-par-cat").removeClass("d-none");
        $(".cat-child-cat").addClass("d-none");
        var cs = $("#cat-par-cat");
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Category"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
        cs.change('select2:select', function () {
            var option = $(this).find('option:selected');
            var id = option.val(); //to get content of "value" attrib
            GetData("Category", "GetParentCategories", "LoadChildCategories", id);
            var text = option.text(); //to get <option>Text</option> content
            $("#selectedcattext").val(text);
            $("#selectedcatid").val(id);
        });
    }
}

function DisplayChildCategories(data) {
    hideLoader();
    if (data === "none") {
        $(".cat-child-cat").addClass("d-none");
    } else {
        $(".cat-child-cat").removeClass("d-none");
        var cs = $("#cat-child-cat");
        cs.empty();
        cs.append($('<option/>').val(0).text("Select Category"));
        $.each(data, function (key, value) {
            cs.append($('<option/>').val(key).text(value["name"]));
        });
    }
}


function DisplayCategoryAllProperties(data) {
    hideLoader();
    var parent = $(".addcat-proplist");
    var CatList = data[0];
    var TopCatSubs = data[1];
    if (data === "none") {
        parent.text("No Results Found");
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



function DisplayCategoryDetails(data) {
    hideLoader();
    $("#newcat-name").val(data.name);
    $("#newcat-desc").val(data.description);
    if (data.isroot_category === "1" || data.isroot_category === 1) {
        $(".cat-root-disp").addClass("d-none");
        $("input[name=isrootcat][value='1']").prop("checked", true);
        $("input[name=isrootcat][value='0']").prop("checked", false);
    } else if (data.isroot_category === "0" || data.isroot_category === 0) {
        $(".cat-root-disp").removeClass("d-none");
        $("input[name=isrootcat][value='0']").prop("checked", true);
        $("input[name=isrootcat][value='1']").prop("checked", false);
    }

    if (!data.ImageText) {
        var imagenUrl = extension + "assets/images/no-image.png";
        previewImage(imagenUrl);
    } else if (data.ImageText) {
        $(".cat-image").attr("src", "data:image/png;base64," + data.ImageText);

    }


}




function previewImage(imagenUrl) {
    var drEvent = $('#catimage').dropify(
            {
                defaultFile: imagenUrl
            });
    drEvent = drEvent.data('dropify');
    drEvent.resetPreview();
    drEvent.clearElement();
    drEvent.settings.defaultFile = imagenUrl;
    drEvent.destroy();
    drEvent.init();
}