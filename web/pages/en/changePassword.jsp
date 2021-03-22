<%@page import="java.security.NoSuchAlgorithmException"%>
<%@page import="java.io.UnsupportedEncodingException"%>
<%@page import="java.util.regex.Pattern"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.security.PasswordUtil"%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%/*****************************************************************
* Mazars http://www.mazars.com
* Project: Management
* Legal notice: (c) Mazars. All rights reserved.
*****************************************************************/%><%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.mazars.management.web.security.AccessChecker"
%><%!
List<String> validateChangePasswordForm(String oldPassword, String newPassword1, String newPassword2, String currentHashedPassword, String currentSalt) throws NoSuchAlgorithmException, UnsupportedEncodingException {
    List<String> errors = new LinkedList<String>();
    if(oldPassword.equals("")) {
        errors.add("Old Password is empty");
    } else if(!  SecurityUtils.getHashAsString(oldPassword, currentSalt).equals(currentHashedPassword)) {
        errors.add("Old Password is not valid");
    }
    if(newPassword1.equals("") || newPassword2.equals("")) {
        if(newPassword1.equals("")) {
            errors.add("New Password 1 is empty");
        }
        if(newPassword2.equals("")) {
            errors.add("New Password 2 is empty");
        }
    } else if(! newPassword1.equals(newPassword2)) {
        errors.add("New Password 1 is not equal New Password 2");
    } else if(! Pattern.matches("^[a-zA-Z0-9]{8,20}$", newPassword1)) {
        errors.add("New Password must have from 8 to 20 characters. Digits and latin letters are allowed only.");
    }
    return errors;
}
%><%
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
AccessChecker accessChecker = new AccessChecker();
AccessChecker.Status status = accessChecker.check(currentUser);
if(AccessChecker.Status.NOT_LOGGED_IN.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
    return;
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
    return;
} else {
    request.setAttribute("currentUser", currentUser);
}

Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Change password");
pageProperties.put("description", "Page is used to change password");
pageProperties.put("keywords", "Timesheet, employee, time, tasks, projects");

List<String> jsFiles = new LinkedList<String>();
jsFiles.add("main.js");
jsFiles.add("ForgotPasswordForm.js");
jsFiles.add("SecretKeyForm.js");

request.setAttribute("currentUser", currentUser);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
//request.setAttribute("initializer", "initBudgetManager");

String command = request.getParameter("command");
if(command == null) {
    command = "startChangePassword";
}

if("startChangePassword".equals(command)) {
    request.setAttribute("locale", locale);
    request.setAttribute("content", moduleBaseUrl + "elements/changePasswordForm.jsp");
    String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} else if ("doChangePassword".equals(command)) {
    Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
    try {
        String oldPassword = request.getParameter("oldPassword");
        String newPassword1 = request.getParameter("newPassword1");
        String newPassword2 = request.getParameter("newPassword2");
        if(oldPassword != null) {
            oldPassword = oldPassword.trim();
        }
        if(newPassword1 != null) {
            newPassword1 = newPassword1.trim();
        }
        if(newPassword2 != null) {
            newPassword2 = newPassword2.trim();
        }

        List<String> errors = validateChangePasswordForm(oldPassword, newPassword1, newPassword2, currentUser.getHashedPassword(), currentUser.getSalt());
        if(errors.size() > 0) {
            request.setAttribute("locale", locale);
            request.setAttribute("content", moduleBaseUrl + "elements/changePasswordForm.jsp");
            request.setAttribute("oldPassword", oldPassword);
            request.setAttribute("newPassword1", newPassword1);
            request.setAttribute("newPassword2", newPassword2);
            request.setAttribute("errors", errors);
            String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
            %><jsp:include page="<%=frametemplate %>" flush="true" /><%
       } else {
            hs.beginTransaction();
            hs.refresh(currentUser);
            String salt = PasswordUtil.generate();
            String hashedPassword = SecurityUtils.getHashAsString(newPassword1, salt);
            currentUser.setHashedPassword(hashedPassword);
            currentUser.setSalt(salt);
            currentUser.setPasswordToBeChanged(false);
            hs.update(currentUser);
            hs.getTransaction().commit();
            response.sendRedirect(ContentManager.link("/pages/en/index.jsp?status=" + status));
        }
        if(true) {
            %><%=errors.size() %><%
            return;
        }
    } catch (Exception ex) {
        hs.getTransaction().rollback();
        %><%=ex.toString() %><%
    }
}
%>
