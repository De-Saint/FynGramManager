<%-- 
    Document   : cartdetails
    Created on : Jun 22, 2020, 6:38:33 AM
    Author     : mac
--%>

<input type="hidden"  value="<%= session.getAttribute("cartid")%>" id="cartid"/>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html><div class="page">
    <div class="page-main">
        <%@include file="../../../../jspf/general/header/header.jspf" %>
        <%@include file="../../../../jspf/general/sidebars/sidebar_admin.jspf" %>

        <%@include file="../../../../jspf/general/loader/loader.jspf" %>
        <%@include file="../../../../jspf/users/admin/carts/cartdetails.jspf" %>

    </div>
    <%@include file="../../../../jspf/general/footer/footer.jspf" %>
</div>
