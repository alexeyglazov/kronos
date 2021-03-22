<%-- start of access.jsp --%>
<%
response.setHeader("Cache-Control","max-age=0 must-revalidate");
response.setHeader("Pragma","no-cache"); //HTTP 1.0
response.setDateHeader ("Expires", 0); //prevents caching at the proxy server
    
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
AccessChecker.Status status = null;
try {
    hs.beginTransaction();
    Module module = thisContentItem.getModule();
    AccessChecker accessChecker = new AccessChecker();
    status = accessChecker.check(currentUser, module);
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
if(AccessChecker.Status.NOT_LOGGED_IN.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/changePassword.jsp?status=" + status));
}
if(! AccessChecker.Status.VALID.equals(status)) {
    return;
}
%>
<%-- end of access.jsp --%>