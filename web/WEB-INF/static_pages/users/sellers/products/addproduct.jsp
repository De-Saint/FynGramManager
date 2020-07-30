<%-- 
    Document   : addproduct
    Created on : Jun 22, 2020, 5:30:42 AM
    Author     : mac
--%>
<input type="hidden"  value="<%= session.getAttribute("productid")%>" id="productid"/>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<div class="page">
    <div class="page-main">
        <%@include file="../../../../jspf/general/header/header.jspf" %>
        <%@include file="../../../../jspf/general/sidebars/sidebar_seller.jspf" %>
        <%@include file="../../../../jspf/general/loader/loader.jspf" %>
        <%@include file="../../../../jspf/users/sellers/products/addproduct.jspf" %>

    </div>
    <%@include file="../../../../jspf/general/footer/footer.jspf" %>
</div>
