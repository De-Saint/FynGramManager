<%-- 
    Document   : readmessage
    Created on : Jun 22, 2020, 7:40:22 PM
    Author     : mac
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<div class="page">
<input type="hidden"  value="<%= session.getAttribute("messageid")%>" id="messageid"/>
    <div class="page-main">
        <%@include file="../../../../jspf/general/header/header.jspf" %>
        <%@include file="../../../../jspf/general/sidebars/sidebar_admin.jspf" %>
        <%@include file="../../../../jspf/general/loader/loader.jspf" %>
        <%@include file="../../../../jspf/users/admin/messages/readmessage.jspf" %>

    </div>
    <%@include file="../../../../jspf/general/footer/footer.jspf" %>
</div>
