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
%><%@ include file="/modules/core/elements/access.jsp" %><%

String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Global management");
pageProperties.put("description", "Page is used for global management");
pageProperties.put("keywords", "Timesheet, employee, time, tasks, projects");

List<String> jsFiles = new LinkedList<String>();
jsFiles.add("main.js");
jsFiles.add("GlobalManagement.js");
jsFiles.add("DataGrid.js");
jsFiles.add("ActivityInfo.js");
jsFiles.add("ProjectCodeInfo.js");
jsFiles.add("CountryInfo.js");
jsFiles.add("ModuleInfo.js");
jsFiles.add("StandardPositionInfo.js");
jsFiles.add("ISOCountryInfo.js");
jsFiles.add("CurrencyInfo.js");
jsFiles.add("ModuleEditForm.js");
jsFiles.add("StandardPositionEditForm.js");
jsFiles.add("ISOCountryEditForm.js");
jsFiles.add("CurrencyEditForm.js");
jsFiles.add("CountryEditForm.js");
jsFiles.add("TaskTypeInfo.js");
jsFiles.add("TaskTypeEditForm.js");
jsFiles.add("TaskInfo.js");
jsFiles.add("TaskEditForm.js");
jsFiles.add("CurrencyBindForm.js");

request.setAttribute("currentUser", currentUser);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/StandardForm.jsp");
request.setAttribute("initializer", "initGlobalManagement");
String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
%>
<jsp:include page="<%=frametemplate %>" flush="true" />

