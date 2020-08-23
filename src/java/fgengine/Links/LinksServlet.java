/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package fgengine.Links;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Pinky
 */
public class LinksServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     * @throws java.lang.ClassNotFoundException
     * @throws java.sql.SQLException
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException, SQLException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            HttpSession session = request.getSession(true);
            String type = request.getParameter("type");
            switch (type) {
                case "Login": {
                    response.sendRedirect("index.jsp");
                    break;
                }
                case "Register": {
                    response.sendRedirect("pages/general/register/register.jsp");
                    break;
                }
                case "TimeOut": {
                    response.sendRedirect("pages/general/timeout/timeout.jsp");
                    break;
                }
                case "Recovery": {
                    response.sendRedirect("pages/general/recovery/recovery.jsp");
                    break;
                }
                case "AdminDashboard": {
                    response.sendRedirect("pages/users/admin/dashboard/dashboard.jsp");
                    break;
                }
                case "SellerDashboard": {
                    response.sendRedirect("pages/users/sellers/dashboard/dashboard.jsp");
                    break;
                }
                case "AdminReport": {
                    response.sendRedirect("pages/users/admin/reports/reports.jsp");
                    break;
                }
                case "AdminProfile": {
                    response.sendRedirect("pages/users/admin/profile/profile.jsp");
                    break;
                }
                case "SellerProfile": {
                    response.sendRedirect("pages/users/sellers/profile/profile.jsp");
                    break;
                }
                case "AdminCategories": {
                    response.sendRedirect("pages/users/admin/category/category.jsp");
                    break;
                }
                case "AdminNewCategory": {
                    response.sendRedirect("pages/users/admin/category/newcategory.jsp");
                    break;
                }
                case "AdminNewProperty": {
                    response.sendRedirect("pages/users/admin/category/newproperty.jsp");
                    break;
                }
                case "AdminProducts": {
                    response.sendRedirect("pages/users/admin/products/products.jsp");
                    break;
                }
                case "SellerProducts": {
                    response.sendRedirect("pages/users/sellers/products/products.jsp");
                    break;
                }
                case "AdminAddProduct": {
                    session.setAttribute("orderid", request.getParameter("orderid"));
                    response.sendRedirect("pages/users/admin/products/addproduct.jsp");
                    break;
                }
                case "SellerAddProduct": {
                    session.setAttribute("orderid", request.getParameter("orderid"));
                    response.sendRedirect("pages/users/sellers/products/addproduct.jsp");
                    break;
                }
                case "AdminProductDetails": {
                    response.sendRedirect("pages/users/admin/products/productdetails.jsp");
                    break;
                }
                case "SellerProductDetails": {
                    response.sendRedirect("pages/users/sellers/products/productdetails.jsp");
                    break;
                }
                case "AdminOrders": {
                    response.sendRedirect("pages/users/admin/order/order.jsp");
                    break;
                }
                case "SellerOrders": {
                    response.sendRedirect("pages/users/sellers/order/order.jsp");
                    break;
                }
                case "AdminOrderDetails": {
                    session.setAttribute("orderid", request.getParameter("orderid"));
                    response.sendRedirect("pages/users/admin/order/orderdetails.jsp");
                    break;
                }
                case "SellerOrderDetails": {
                    session.setAttribute("orderid", request.getParameter("orderid"));
                    response.sendRedirect("pages/users/sellers/order/orderdetails.jsp");
                    break;
                }
                case "AdminStock": {
                    response.sendRedirect("pages/users/admin/stock/stock.jsp");
                    break;
                }
                case "SellerStock": {
                    response.sendRedirect("pages/users/sellers/stock/stock.jsp");
                    break;
                }
                case "AdminSubscription": {
                    response.sendRedirect("pages/users/admin/subscription/subscription.jsp");
                    break;
                }
                case "SellerSubscription": {
                    response.sendRedirect("pages/users/sellers/subscription/subscription.jsp");
                    break;
                }
                case "AdminCarts": {
                    response.sendRedirect("pages/users/admin/carts/carts.jsp");
                    break;
                }
                case "AdminCartDetails": {
                    session.setAttribute("cartid", request.getParameter("cartid"));
                    response.sendRedirect("pages/users/admin/carts/cartdetails.jsp");
                    break;
                }
                case "AdminWallet": {
                    response.sendRedirect("pages/users/admin/wallet/wallet.jsp");
                    break;
                }
                case "SellerWallet": {
                    response.sendRedirect("pages/users/sellers/wallet/wallet.jsp");
                    break;
                }
                case "AdminTransactions": {
                    response.sendRedirect("pages/users/admin/transaction/transaction.jsp");
                    break;
                }
                case "SellerTransactions": {
                    response.sendRedirect("pages/users/sellers/transaction/transaction.jsp");
                    break;
                }
                case "AdminPayments": {
                    response.sendRedirect("pages/users/admin/payment/payment.jsp");
                    break;
                }
                case "SellerPayments": {
                    response.sendRedirect("pages/users/sellers/payment/payment.jsp");
                    break;
                }
                case "AdminCashOut": {
                    response.sendRedirect("pages/users/admin/cashout/cashout.jsp");
                    break;
                }
                case "SellerCashOut": {
                    response.sendRedirect("pages/users/sellers/cashout/cashout.jsp");
                    break;
                }
                case "AdminDiscount": {
                    response.sendRedirect("pages/users/admin/discount/discount.jsp");
                    break;
                }
                case "AdminNewDiscount": {
                    response.sendRedirect("pages/users/admin/discount/newdiscountcode.jsp");
                    break;
                }
                case "AdminSellers": {
                    response.sendRedirect("pages/users/admin/sellers/sellers.jsp");
                    break;
                }
                case "AdminSellerDetails": {
                    response.sendRedirect("pages/users/admin/sellers/sellerdetails.jsp");
                    break;
                }
                case "AdminCustomers": {
                    response.sendRedirect("pages/users/admin/customers/customers.jsp");
                    break;
                }
                case "AdminCustomerDetails": {
                    session.setAttribute("customeruserid", request.getParameter("customeruserid"));
                    response.sendRedirect("pages/users/admin/customers/customerdetails.jsp");
                    break;
                }
                case "AdminGuests": {
                    response.sendRedirect("pages/users/admin/guests/guests.jsp");
                    break;
                }
                case "AdminComplaints": {
                    response.sendRedirect("pages/users/admin/complaints/complaints.jsp");
                    break;
                }
                case "AdminShipping": {
                    response.sendRedirect("pages/users/admin/shipping/shipping.jsp");
                    break;
                }
                case "AdminNewShipping": {
                    response.sendRedirect("pages/users/admin/shipping/newshipping.jsp");
                    break;
                }
                case "AdminPickup": {
                    response.sendRedirect("pages/users/admin/pickup/pickup.jsp");
                    break;
                }
                case "AdminNewPickup": {
                    response.sendRedirect("pages/users/admin/pickup/newpickup.jsp");
                    break;
                }
                case "AdminMessages": {
                    response.sendRedirect("pages/users/admin/messages/messages.jsp");
                    break;
                }
                case "SellerMessages": {
                    response.sendRedirect("pages/users/sellers/messages/messages.jsp");
                    break;
                }
                case "AdminNewMessage": {
                    response.sendRedirect("pages/users/admin/messages/newmessage.jsp");
                    break;
                }
                case "AdminReadMessage": {
                    session.setAttribute("messageid", request.getParameter("messageid"));
                    response.sendRedirect("pages/users/admin/messages/readmessage.jsp");
                    break;
                }
                case "SellerReadMessage": {
                    session.setAttribute("messageid", request.getParameter("messageid"));
                    response.sendRedirect("pages/users/sellers/messages/readmessage.jsp");
                    break;
                }
                case "AdminReviews": {
                    response.sendRedirect("pages/users/admin/reviews/reviews.jsp");
                    break;
                }
                case "SellerReviews": {
                    response.sendRedirect("pages/users/sellers/reviews/reviews.jsp");
                    break;
                }
                case "AdminNewFeatures": {
                    response.sendRedirect("pages/users/admin/newfeatures/newfeatures.jsp");
                    break;
                }
                case "AdminAddress": {
                    response.sendRedirect("pages/users/admin/address/address.jsp");
                    break;
                }
                case "LogOut": {
                    response.sendRedirect("index.jsp");
                    break;
                }
                default: {
                    response.sendRedirect(request.getHeader("referer"));
                }
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(LinksServlet.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
