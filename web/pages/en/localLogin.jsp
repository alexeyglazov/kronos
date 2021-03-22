<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="java.util.LinkedList"%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="com.mazars.management.db.domain.Country"%>
<%@page import="com.mazars.management.db.domain.Office"%>
<%@page import="com.mazars.management.db.domain.Department"%>
<%@page import="com.mazars.management.db.domain.Subdepartment"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.db.domain.Employee"%>
<%@page import="org.hibernate.Session"%>
<%@page import="com.mazars.management.db.util.HibernateUtil"%>
<%@page import="java.util.List"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
        import="java.util.Map"
        import="java.util.HashMap"
        import="java.util.Locale"
%><%!
List<String> validateLoginForm(String name, String password) {
    List<String> errors = new LinkedList<String>();
    if(name.equals("")) {
        errors.add("User name is empty");
    }
    if(password.equals("")) {
        errors.add("Password is empty");
    }
    return errors;
}
%><%
request.setCharacterEncoding("UTF-8");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();
Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Login");
pageProperties.put("description", "Page is used to log in Kronos");
pageProperties.put("keywords", "Login form, authorization, authentication");
Locale locale = new Locale("en");
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);


String command = request.getParameter("command");
if(command == null) {
    command = "startLogin";
}
List<String> jsFiles = new LinkedList<String>();
request.setAttribute("jsFiles", jsFiles);
if("startLogin".equals(command)) {
    request.setAttribute("content", moduleBaseUrl + "elements/login_form.jsp");
    request.setAttribute("initializer", "initLoginForm");
    String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
    try {
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
    } catch (Exception e) {
        e.printStackTrace(new PrintWriter(out));
    }
} else if ("doLogin".equals(command)) {
    String name = request.getParameter("name");
    String password = request.getParameter("password");
    if(name != null) {
        name = name.trim();
    }
    if(password != null) {
        password = password.trim();
    }
    List<String> errors = validateLoginForm(name, password);
    if(errors.size() > 0) {
        request.setAttribute("locale", locale);
        request.setAttribute("content", moduleBaseUrl + "elements/login_form.jsp");
        request.setAttribute("name", name);
        request.setAttribute("password", password);
        request.setAttribute("errors", errors);
        String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
        %><jsp:include page="<%=frametemplate %>" flush="true" /><%
    } else {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Employee currentUser = null;
        String userSubdepartmentName = null;
        String userDepartmentName = null;
        String userOfficeName = null;
        String userCountryName = null;
        try {
            hs.beginTransaction();
            Employee user = Employee.getByUserName(name);
            if(user != null) {
                String hashedPassword = SecurityUtils.getHashAsString(password, user.getSalt());
                if(hashedPassword.equals(user.getHashedPassword())) {
                    currentUser = user;
                }
            }
            if(currentUser != null) {
                Subdepartment subdepartment = currentUser.getPosition().getSubdepartment();
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                Country country = office.getCountry();
                userSubdepartmentName = subdepartment.getName();
                userDepartmentName = department.getName();
                userOfficeName = office.getName();
                userCountryName = country.getName();
            }
            hs.getTransaction().commit();
        } catch (Exception ex) {
            hs.getTransaction().rollback();
            %><%=ex.toString() %><%
        }
        if(currentUser != null) {
            session.setAttribute("currentUser", currentUser);
            session.setAttribute("userFullName", currentUser.getFirstName() + " " + currentUser.getLastName());
            session.setAttribute("userSubdepartmentName", userSubdepartmentName);
            session.setAttribute("userDepartmentName", userDepartmentName);
            session.setAttribute("userOfficeName", userOfficeName);
            session.setAttribute("userCountryName", userCountryName);
            response.sendRedirect(ContentManager.link("/pages/en/timesheet/fill/index.jsp"));
        } else {
            Thread.sleep(3000);
            errors = new LinkedList<String>();
            errors.add("No user with such login and password");
            request.setAttribute("locale", locale);
            request.setAttribute("content", moduleBaseUrl + "elements/login_form.jsp");
            request.setAttribute("name", name);
            request.setAttribute("password", password);
            request.setAttribute("errors", errors);
            String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
            %><jsp:include page="<%=frametemplate %>" flush="true" /><%
       }
     }
} else if ("doLogout".equals(command)) {
    session.invalidate();
    response.sendRedirect(ContentManager.link("/pages/en/login.jsp"));
}
%>
