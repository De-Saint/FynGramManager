<%-- 
    Document   : orderdetails
    Created on : Jun 22, 2020, 6:00:33 AM
    Author     : mac
--%>

<input type="hidden"  value="<%= session.getAttribute("orderid")%>" id="orderid"/>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<div class="page">
    <div class="page-main">
        <%@include file="../../../../jspf/general/header/header.jspf" %>
        <%@include file="../../../../jspf/general/sidebars/sidebar_seller.jspf" %>
        <%@include file="../../../../jspf/general/loader/loader.jspf" %>
        <%@include file="../../../../jspf/users/sellers/order/orderdetails.jspf" %>

    </div>
    <%@include file="../../../../jspf/general/footer/footer.jspf" %>
</div>
