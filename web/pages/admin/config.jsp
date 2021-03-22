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
pageProperties.put("title", "Config properties");
pageProperties.put("description", "Page is used to configure system");
pageProperties.put("keywords", "config");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/config.jsp");
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
        displayStatus = "showProperties";
        request.setAttribute("configProperties", ConfigProperty.getAll());
    } else if("resetDatabaseProperties".equals(command)) {
        List<ConfigProperty> configProperties = new LinkedList<ConfigProperty>();
        configProperties.add(new ConfigProperty("monthCloserNotificationTimePattern", "00 03 * * * 2-6", "#month closer notification time.\n#minutes\n#hours\n#monthDays\n#months\n#years\n#weekDays (1-Sunday, 7-Saturday)"));
        configProperties.add(new ConfigProperty("hamiltonProjectsExportAllowed", "false", ""));
        configProperties.add(new ConfigProperty("hamiltonProjectsExportTimePattern", "00 03 * * * *", "#month closer notification time.\n#minutes\n#hours\n#monthDays\n#months\n#years\n#weekDays (1-Sunday, 7-Saturday)"));
        configProperties.add(new ConfigProperty("hamiltonProjectsExportCountries", "Russia", "comma separated values"));
        configProperties.add(new ConfigProperty("hamiltonProjectsExportUser", "mazarsadmin", ""));
        configProperties.add(new ConfigProperty("hamiltonProjectsExportKey", "3f0f7bfc-6e07-328f-96f3-b819b14813ae", ""));
        configProperties.add(new ConfigProperty("reports.codeDetail.requisites.used", "true", null));
        configProperties.add(new ConfigProperty("reports.codeDetail.requisites.header1", "Консультант/Consultant\nЗАО \"Мазар\"/ZAO \"MAZARS\"", null));
        configProperties.add(new ConfigProperty("reports.codeDetail.requisites.header2", "127051, г. Москва, ул. Садовая – Самотечная, д. 24/27\n24/27 Sadovaya-Samotechnaya street, 127051 Moscow\nИНН/КПП 7716057427/770701001", null));
        configProperties.add(new ConfigProperty("reports.codeDetail.requisites.footer", "Партнер/Partner\nЗАО \"МАЗАР\"/ZAO \"MAZARS\"\nФлоранс Пино/Florence Pinot", null));
        configProperties.add(new ConfigProperty("retain.user.userName", "retain", null));
        configProperties.add(new ConfigProperty("retain.user.password", "fY38vBs7", null));
        configProperties.add(new ConfigProperty("retain.country", "RU", null));
        configProperties.add(new ConfigProperty("mailer.charset", "UTF-8", null));
        configProperties.add(new ConfigProperty("mailer.hostName", "82.142.137.68", null));
        configProperties.add(new ConfigProperty("mailer.from", "no-reply@mazars.ru", null));
        configProperties.add(new ConfigProperty("mailer.port", "587", null));
        configProperties.add(new ConfigProperty("mailer.authentication.userName", "no-reply", null));
        configProperties.add(new ConfigProperty("mailer.authentication.password", "XU84lHJIiTL2lNMqR2Wp", null));
        configProperties.add(new ConfigProperty("server.url", "https://kronosmoscow.mazars.ru", null));
        configProperties.add(new ConfigProperty("files.repository", "C:\\Program Files\\Apache Software Foundation\\Tomcat 8.0\\webapps\\russia\\WEB-INF\\files", null));
        
        configProperties.add(new ConfigProperty("projectCodeCloseTimePattern", "00 02 * * * *", "#month closer notification time.\n#minutes\n#hours\n#monthDays\n#months\n#years\n#weekDays (1-Sunday, 7-Saturday)"));
        configProperties.add(new ConfigProperty("projectCodeCloseJobSubdepartmentIds", "2, 27", "subdepartments"));
        configProperties.add(new ConfigProperty("projectCodeCloseJobExpirationDays", "60", "days count when act is old and code is to be closed"));
        configProperties.add(new ConfigProperty("projectCodeCloseJobEmployee", "admin", "username"));
        
        int deleted = ConfigProperty.deleteAll();
        for(ConfigProperty configProperty : configProperties) {
            hs.save(configProperty);
        }
        displayMessage = "Deleted: " + deleted + ", created: " + configProperties.size();
        request.setAttribute("configProperties", ConfigProperty.getAll());
        displayStatus = "successOnResetDatabaseProperties";   
    } else if("updateCache".equals(command)) {
        ConfigUtils.init();
        displayStatus = "showProperties";
        request.setAttribute("configProperties", ConfigProperty.getAll());

    } else if("startEditProperty".equals(command)) {
        String propertyName = request.getParameter("propertyName");
        ConfigProperty configProperty = ConfigProperty.getByName(propertyName);
        displayStatus = "showEditPropertyForm";
        request.setAttribute("configProperties", ConfigProperty.getAll());
        request.setAttribute("configProperty", configProperty);
    } else if("saveProperty".equals(command)) {
        String propertyName = request.getParameter("propertyName");
        String propertyValue = request.getParameter("propertyValue");
        ConfigProperty configProperty = ConfigProperty.getByName(propertyName);
        configProperty.setValue(propertyValue.trim());
        hs.save(configProperty);
        displayStatus = "showProperties";
        request.setAttribute("configProperties", ConfigProperty.getAll());
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











