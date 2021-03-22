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
pageProperties.put("title", "Employee salary management");
pageProperties.put("description", "Page is used for Employee salary management");
pageProperties.put("keywords", "Employee management, employee, time, tasks, projects");

List<String> jsFiles = new LinkedList<String>();
jsFiles.add("main.js");
jsFiles.add("EmployeeSalaryManager.js");
jsFiles.add("DataGrid.js");
jsFiles.add("EmployeeEditForm.js");
jsFiles.add("PositionPicker.js");
jsFiles.add("EmployeePicker.js");
jsFiles.add("EmployeePositionHistoryItemEditForm.js");
jsFiles.add("LeavesItemEditForm.js");
jsFiles.add("SalaryEditForm.js");
jsFiles.add("CarreerEditForm.js");
jsFiles.add("CarreerViewer.js");
jsFiles.add("LeavesBalanceCalculator.js");

request.setAttribute("currentUser", currentUser);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/StandardForm.jsp");
request.setAttribute("initializer", "initEmployeeSalaryManager");
String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
%>
<jsp:include page="<%=frametemplate %>" flush="true" />
