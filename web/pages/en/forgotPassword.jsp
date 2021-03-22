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
%><%
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();
bodies.put("main", "/bodies/en/timesheet/index.jsp");

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Forgot password");
pageProperties.put("description", "Page is used to recover forgotten password");
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
//request.setAttribute("content", moduleBaseUrl + "elements/standard_content.jsp");
//request.setAttribute("initializer", "initBudgetManager");

String command = request.getParameter("command");
if(command == null) {
    command = "start";
}

if("start".equals(command)) {
    request.setAttribute("initializer", "initForgotPasswordForm");
    request.setAttribute("locale", locale);
    request.setAttribute("content", moduleBaseUrl + "elements/StandardForm.jsp");
    String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} else if("showSecretKeyForm".equals(command)) {
    request.setAttribute("initializer", "initSecretKeyForm");
    request.setAttribute("locale", locale);
    request.setAttribute("content", moduleBaseUrl + "elements/StandardForm.jsp");
    String frametemplate = moduleBaseUrl + "frametemplates/start.jsp";
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
}
%>
