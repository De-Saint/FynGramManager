<%-- 
    Document   : recovery
    Created on : Jun 15, 2020, 7:53:11 PM
    Author     : Pinky
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>

<html dir="ltr" lang="en">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="x-ua-compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta
            content="FynGram - Manager Application"
            name="description">
        <meta content="FynGram" name="author">
        <meta name="keywords"
              content="FynGram - Manager Application">
        <!-- Favicon-->
        <link rel="icon" href="../../../../assets/images/brand/favicon.png" type="image/x-icon"> <!-- Title -->
        <title>FynGram Manager :: Recovery</title>
        <!-- Bootstrap css -->
        <link href="../../../assets/plugins/bootstrap-4.1.3/css/bootstrap.min.css" rel="stylesheet"> <!-- Style css -->
        <link href="../../../assets/css/style.css" rel="stylesheet"> <!-- Default css -->
        <link href="../../../assets/css/default.css" rel="stylesheet"> <!-- Bootstrap-daterangepicker css -->
        <link rel="stylesheet" href="../../../assets/plugins/bootstrap-daterangepicker/daterangepicker.css">
        <!-- Bootstrap-datepicker css -->
        <link rel="stylesheet" href="../../../assets/plugins/bootstrap-datepicker/bootstrap-datepicker.css"> <!-- Sidemenu css-->
        <link rel="stylesheet" href="../../../assets/plugins/sidemenu/sidemenu.css"> <!-- Sidemenu-responsive-tabs css -->
        <link href="../../../assets/plugins/sidemenu-responsive-tabs/css/sidemenu-responsive-tabs.css" rel="stylesheet">
        <!-- Owl Theme css-->
        <link href="../../../assets/plugins/owl-carousel/owl.carousel.css" rel="stylesheet"> <!-- P-scroll css -->
        <link href="../../../assets/plugins/p-scroll/p-scroll.css" rel="stylesheet" type="text/css">
        <!-- Custom scroll bar css -->
        <link href="../../../assets/plugins/scroll-bar/jquery.mCustomScrollbar.css" rel="stylesheet"> <!-- Select2 Plugin -->
        <link href="../../../assets/plugins/select2/select2.min.css" rel="stylesheet"> <!-- News ticker css -->
        <link href="../../../assets/plugins/newsticker/breaking-news-ticker.css" rel="stylesheet"> <!-- Countdown css-->
        <link href="../../../assets/plugins/jquery-countdown/countdown.css" rel="stylesheet"> <!-- Font icons css-->
        <link href="../../../assets/css/icons.css" rel="stylesheet"> <!-- Rightsidebar css -->
        <link href="../../../assets/plugins/sidebar/sidebar.css" rel="stylesheet"> <!-- Nice-select css  -->
        <link href="../../../assets/plugins/jquery-nice-select/css/nice-select.css" rel="stylesheet"> 
        <!-- Color-palette css-->
        <link rel="stylesheet" href="../../../assets/css/skins.css">

        <meta http-equiv="imagetoolbar" content="no">

    </head>

    <body class="app h-100vh">
        <!-- Loader -->
        <div id="loading" style="display: none;"> <img src="../../../assets/images/other/loader.svg" class="loader-img" alt="Loader"> 
        </div> 

        <jsp:include page="../../../WEB-INF/static_pages/general/recovery/recovery.jsp"></jsp:include>


        <script src="../../../assets/js/vendors/jquery-3.2.1.min.js"></script>
        <script src="../../../assets/plugins/moment/moment.min.js"></script>
        <script src="../../../assets/js/vendors/bootstrap.bundle.min.js"></script>
        <script src="../../../assets/js/vendors/jquery.sparkline.min.js"></script>
        <script src="../../../assets/js/vendors/circle-progress.min.js"></script>
        <script src="../../../assets/plugins/rating/jquery.rating-stars.js"></script>
        <script src="../../../assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="../../../assets/plugins/owl-carousel/owl.carousel.js"></script>
        <script src="../../../assets/plugins/owl-carousel/owl-main.js"></script>
        <script src="../../../assets/plugins/owl-carousel/owl.carousel.js"></script>
        <script src="../../../assets/plugins/sidemenu/sidemenu.js"></script>
        <script src="../../../assets/plugins/sidemenu-responsive-tabs/js/sidemenu-responsive-tabs.js"></script>
        <script src="../../../assets/js/left-menu.js"></script>
        <script src="../../../assets/plugins/p-scroll/p-scroll.js"></script>
        <script src="../../../assets/plugins/p-scroll/p-scroll-leftmenu.js"></script>
        <script src="../../../assets/plugins/bootstrap-daterangepicker/daterangepicker.js"></script>
        <script src="../../../assets/plugins/bootstrap-datepicker/bootstrap-datepicker.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
        <script src="../../../assets/plugins/jvectormap/gdp-data.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-us-aea-en.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-uk-mill-en.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-au-mill.js"></script>
        <script src="../../../assets/plugins/jvectormap/jquery-jvectormap-ca-lcc.js"></script>
        <script src="../../../assets/js/vectormap.js"></script>
        <div class="jvectormap-tip"></div>
        <script src="../../../assets/plugins/sidebar/sidebar.js"></script>
        <script src="../../../assets/plugins/chart/chart.min.js"></script>
        <script src="../../../assets/plugins/echarts/echarts.js"></script>
        <script src="../../../assets/plugins/select2/select2.full.min.js"></script>
        <script src="../../../assets/js/select2.js"></script>
        <script src="../../../assets/plugins/scroll-bar/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="../../../assets/plugins/jquery-nice-select/js/jquery.nice-select.js"></script>
        <script src="../../../assets/plugins/jquery-nice-select/js/nice-select.js"></script>
        <script src="../../../assets/plugins/echarts/echarts.js"></script>
        <script src="../../../assets/plugins/flot/jquery.flot.js"></script>
        <script src="../../../assets/plugins/flot/jquery.flot.resize.js"></script>
        <script src="../../../assets/js/apexcharts.js"></script>
        <script src="../../../assets/plugins/jquery-countdown/countdown.js"></script>
        <script src="../../../assets/plugins/jquery-countdown/jquery.plugin.min.js"></script>
        <script src="../../../assets/plugins/jquery-countdown/jquery.countdown.js"></script>
        <script src="../../../assets/js/ecommerce.js"></script>
        <script src="../../../assets/js/custom.js"></script><svg id="SvgjsSvg1001" width="2" height="0"
                                                                 xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                 xmlns:svgjs="http://svgjs.com/svgjs"
                                                                 style="overflow: hidden; top: -100%; left: -100%; position: absolute; opacity: 0;">
        <defs id="SvgjsDefs1002"></defs>
        <polyline id="SvgjsPolyline1003" points="0,0"></polyline>
        <path id="SvgjsPath1004" d="M0 0 "></path>
        </svg></body>

</html>
