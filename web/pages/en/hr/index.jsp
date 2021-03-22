<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page
    import="com.mazars.management.web.content.ContentManager"
    import="com.mazars.management.web.content.ContentItem"
    import="java.util.Map"
    import="java.util.HashMap"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
%><%@page contentType="text/html" pageEncoding="UTF-8"%><%
ContentItem thisContentItem = ContentManager.getContentItem(request.getRequestURI());
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");

Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
AccessChecker.Status hrStatus = null;
AccessChecker.Status hrSalaryStatus = null;
try {
    hs.beginTransaction();
    Module hrModule = Module.getByName("HR");
    Module hrSalaryModule = Module.getByName("Salary");
    AccessChecker accessChecker = new AccessChecker();
    hrStatus = accessChecker.check(currentUser, hrModule);
    hrSalaryStatus = accessChecker.check(currentUser, hrSalaryModule);
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}

if(AccessChecker.Status.NOT_LOGGED_IN.equals(hrStatus) || AccessChecker.Status.NOT_LOGGED_IN.equals(hrSalaryStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + AccessChecker.Status.NOT_LOGGED_IN));
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(hrStatus) || AccessChecker.Status.NOT_AUTHORIZED.equals(hrSalaryStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + AccessChecker.Status.NOT_AUTHORIZED));
} else if(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(hrStatus) && AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(hrSalaryStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE));
} else if(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(hrStatus) || AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(hrSalaryStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/changePassword.jsp?status=" + AccessChecker.Status.PASSWORD_MUST_BE_CHANGED));
}
if(! AccessChecker.Status.VALID.equals(hrStatus) && ! AccessChecker.Status.VALID.equals(hrSalaryStatus)) {
    return;
}
if(AccessChecker.Status.VALID.equals(hrSalaryStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/hr/employee_management/salary.jsp"));
} else if(AccessChecker.Status.VALID.equals(hrStatus)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/hr/employee_management/standard.jsp"));
}
%>