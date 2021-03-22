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
if(! Boolean.TRUE.equals(isAdminLoggedIn)) {
    response.sendRedirect("./login.jsp");
    return;
}

Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Generate key");
pageProperties.put("description", "Page is used to generate secrete key");
pageProperties.put("keywords", "secrete key");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/key.jsp");
String frametemplate = moduleBaseUrl + "frametemplates/admin.jsp";
%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    String displayStatus = null;
    String displayMessage = null;
    if("start".equals(command)) {
        displayStatus = "showForm";
        SecretKey secreteKey = SecurityUtils.getKey();
        displayMessage = "Secrete key is not configured";
        if(secreteKey != null) {
            displayMessage = "Secrete key is properly configured";
        }
    } else if("generateSecreteKey".equals(command)) {
        SecretKey secreteKey = SecurityUtils.generateKey();
        String secreteKeyStr = SecurityUtils.bytesToBase64String(ObjectUtils.getBytes(secreteKey));
        displayStatus = "successOnSecreteKeyGeneration";   
        displayMessage = "SecreteKey has been generated. But it must be applied manually";
        request.setAttribute("generatedSecreteKey", secreteKeyStr);
    }
    
    
    hs.getTransaction().commit();
    
    request.setAttribute("displayStatus", displayStatus);               
    request.setAttribute("displayMessage", displayMessage);     
            
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>











