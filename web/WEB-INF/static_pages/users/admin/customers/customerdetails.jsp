<%-- 
    Document   : customerdetails
    Created on : Jun 22, 2020, 10:11:17 AM
    Author     : mac
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<input type="hidden"  value="<%= session.getAttribute("customeruserid")%>" id="customeruserid"/>
<div class="page">
    <div class="page-main">
        <%@include file="../../../../jspf/general/header/header.jspf" %>
        <%@include file="../../../../jspf/general/sidebars/sidebar_admin.jspf" %>
        <%@include file="../../../../jspf/general/loader/loader.jspf" %>
        <%@include file="../../../../jspf/users/admin/customers/customerdetails.jspf" %>

    </div>
    <%@include file="../../../../jspf/general/footer/footer.jspf" %>
</div>

