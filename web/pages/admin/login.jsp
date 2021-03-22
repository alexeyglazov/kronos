<%-- 
    Document   : helper
    Created on : 30.03.2011, 14:05:19
    Author     : glazov
--%>

<%@page import="com.mazars.management.service.ObjectUtils"%>
<%@page import="javax.crypto.SecretKey"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.security.PasswordUtil"%>
<%@page import="java.util.Locale"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.util.Map"
    import="java.util.HashMap"
%><%
request.setCharacterEncoding("UTF-8");
   
Boolean isAdminLoggedIn = (Boolean)session.getAttribute("isAdminLoggedIn");

Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Login");
pageProperties.put("description", "Page is used to Login/Logout");
pageProperties.put("keywords", "Login, Logout");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/login.jsp");
String frametemplate = moduleBaseUrl + "frametemplates/admin.jsp";
%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    String displayStatus = null;
    String displayMessage = null;
    String adminUsername = System.getenv("KRONOS_ADMIN_USERNAME");
    String adminPassword = System.getenv("KRONOS_ADMIN_PASSWORD");
    if(adminUsername == null || adminPassword == null) {
        displayMessage = "KRONOS_ADMIN_USERNAME and KRONOS_ADMIN_PASSWORD system variables must be set";
    }
    if("start".equals(command)) {
        if(Boolean.TRUE.equals(isAdminLoggedIn)) {
           response.sendRedirect("./basic_entities.jsp");
           return;
        }
        displayStatus = "showForm";
    } else if("doLogin".equals(command)) {
        List<String> errors = new LinkedList<String>();
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        if(username == null || username.trim().equals("")) {
            errors.add("Username is not set");
        }
        if(password == null || password.trim().equals("")) {
            errors.add("Password is not set");
        }
        if(adminUsername == null || adminPassword == null) {
            errors.add("KRONOS_ADMIN_USERNAME or KRONOS_ADMIN_PASSWORD system variables is not set");
        }
        if(errors.isEmpty()) {
            if(adminUsername.equals(username) && adminPassword.equals(password)) {
                session.setAttribute("isAdminLoggedIn", Boolean.TRUE);
                response.sendRedirect("./basic_entities.jsp");
            } else {
                errors.add("Login or password is incorrect");
            }
        }
        displayStatus = "showForm";
        request.setAttribute("errors", errors);
        request.setAttribute("username", username);
        request.setAttribute("password", password);
    } else if("doLogout".equals(command)) {
        session.setAttribute("isAdminLoggedIn", null);
        response.sendRedirect("./login.jsp");
        return;
    }
    
    request.setAttribute("displayStatus", displayStatus);               
    request.setAttribute("displayMessage", displayMessage);     
            
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%

%>











