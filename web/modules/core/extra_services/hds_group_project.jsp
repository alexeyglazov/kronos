<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.service.StringUtils"%>
<%@page import="com.mazars.management.webservices.clients.hamilton.projects.ExpNoteImportResult"%>
<%@page import="java.util.Properties"%>
<%@page import="com.mazars.management.jobs.HamiltonProjectsExportJob"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.io.FileNotFoundException"%>
<%@page import="java.io.File"%>
<%@page import="java.io.FileInputStream"%>
<%@page
    import="java.io.PrintWriter"
    import="java.util.GregorianCalendar"
    import="java.util.Calendar"
    import="java.io.BufferedInputStream"
    import="java.io.ByteArrayOutputStream"
    import="java.io.ByteArrayInputStream"
    import="jxl.Cell"
    import="jxl.Sheet"
    import="jxl.Workbook"
    import="jxl.WorkbookSettings"
    import="java.util.Date"
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
    import="java.text.SimpleDateFormat"
    import="java.io.IOException"
    import="java.io.InputStream"
    import="com.mazars.management.load.excel.FISheet"
    import="org.apache.commons.fileupload.FileItem"
    import="org.apache.commons.fileupload.disk.DiskFileItemFactory"
    import="org.apache.commons.fileupload.FileItemFactory"
    import="org.apache.commons.fileupload.servlet.ServletFileUpload" 
%><%@page contentType="text/html" pageEncoding="UTF-8"%><%
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
%>
<%-- start of access.jsp --%>
<%
AccessChecker.Status status = null;

Module module = Module.getByName("CRM");
AccessChecker accessChecker = new AccessChecker();
status = accessChecker.check(currentUser, module);
    
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
    hs.getTransaction().commit();
    return;
}
%>
<%-- end of access.jsp --%>

<%
    SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    if(! Boolean.TRUE.equals(StringUtils.getBoolean(ConfigUtils.getProperties().getProperty("hamiltonProjectsExportAllowed")) )) {
        %>
        It is not allowed to make export of Projects to HDS Group. See config properties ("hamiltonProjectsExportAllowed").   
        <%    
    } else if("start".equals(command)) {
    Date closedAtTo = new Date();
    GregorianCalendar calStart = new GregorianCalendar();
    calStart.add(Calendar.MONTH, -2);
    Date closedAtFrom = calStart.getTime();    
    %>
    
    <form method="post">
        All opened projects and all closed within this range
        <table>
        <tr><td>from</td><td><input type="text" name="closedAtFrom" value="<%=dateFormatter.format(closedAtFrom) %>"></td></tr>
        <tr><td>to</td><td><input type="text" name="closedAtTo" value="<%=dateFormatter.format(closedAtTo) %>"></td></tr>
        </table>
        <input type="hidden" name="command" value="export">
        <input type="submit" value="Export data">
    </form>    
    <%
    } else if("export".equals(command)) {
        Date closedAtFrom = dateFormatter.parse(request.getParameter("closedAtFrom"));
        Date closedAtTo = dateFormatter.parse(request.getParameter("closedAtTo"));    

        Properties systemSettings = System.getProperties();
        //systemSettings.setProperty("javax.net.ssl.trustStore", "C:/aaa/a/publicKey.store"); 
        //systemSettings.setProperty("javax.net.ssl.trustStorePassword", "12345678");
        
        //systemSettings.setProperty("https.proxyHost", "192.168.1.14");
        //systemSettings.setProperty("https.proxyPort", "8080");
        //systemSettings.setProperty("https.nonProxyHosts", "localhost|127.0.0.1|mitassd03|mitassd03.mazars.ru");
        
        HamiltonProjectsExportJob hamiltonProjectsExportJob = new HamiltonProjectsExportJob();
        Country country = Country.getByName("Russia").get(0);
        String user = "alexey.glazov";
        String key = "dc740ec3-04fb-3393-a57d-04719939d493";
        //String user = "mazarswsuser";
        //String key = "mazarswsuser";
        ExpNoteImportResult result = hamiltonProjectsExportJob.processCountry(country, closedAtFrom, closedAtTo, user, key);
        %>Done.<br /><%
        %>Inserted: <%=result.getInsertedNumberOfRecords() %><br /><%
        %>Updated: <%=result.getUpdatedNumberOfRecords() %><br /><%
    }
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>


