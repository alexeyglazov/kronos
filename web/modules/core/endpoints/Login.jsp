<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    
%><%
request.setCharacterEncoding("UTF-8");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();

if("checkLoginAndPassword".equals(command)) {
    String login = request.getParameter("login");
    String password = request.getParameter("password");
    if(login != null) {
        login = login.trim();
    }
    if(password != null) {
        password = password.trim();
    }
    if((login == null || "".equals(login)) && (password == null || "".equals(password))) {
    %>
    {
        "status": "FAIL",
        "comment": "Login and password are not set"
    }
    <%
    } else  if(login == null || "".equals(login)) {
    %>
    {
        "status": "FAIL",
        "comment": "Login is not set"
    }
    <%
    } else if(password == null || "".equals(password)) {
    %>
    {
        "status": "FAIL",
        "comment": "Password is not set"
    }
    <%
    } else {
        Employee foundUser = null;
        Employee user = Employee.getByUserName(login);
        if(user != null) {
            String hashedPassword = SecurityUtils.getHashAsString(password, user.getSalt());
            if(hashedPassword.equals(user.getHashedPassword())) {
                foundUser = user;
            }
        }
        if(foundUser == null) {
            Thread.sleep(3000);
        %>
        {
            "status": "FAIL",
            "comment": "No user with such login and password"
        }
        <%
        } else {
        %>
        {
            "status": "OK",
            "comment": "User with such login and password exists"
        }
        <%
        }
    }
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <%
}
%>