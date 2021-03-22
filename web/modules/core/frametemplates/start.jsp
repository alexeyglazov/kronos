<%@page import="org.hibernate.Session"%>
<%@page import="com.mazars.management.db.util.HibernateUtil"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="com.mazars.management.web.vo.ContentBranch"%>
<%@page import="com.mazars.management.web.vo.ContentBranch"%>
<%/*****************************************************************
* Gridnine AB http://www.gridnine.com
* Project: New wave
* Legal notice: (c) Gridnine AB. All rights reserved.
*****************************************************************/%><%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.db.domain.*"
    import="java.net.URLEncoder"
    import="com.mazars.management.web.content.ContentManager"
%><%
String moduleBaseUrl = "/modules/core/";
String cssPath = moduleBaseUrl + "resources/css/";
String cssPics = moduleBaseUrl + "resources/pics/";
String jquery = "/modules/jquery-ui-1.10.0.custom/";
String blockUI = "/modules/blockui/";
String sticky = "/modules/sticky/";
String jqGrid = "/modules/jquery.jqGrid-4.4.4/";
String highcharts = "/modules/Highcharts-2.3.5/";
String treetable = "/modules/treetable/ludo-jquery-treetable-38d8fa6/src/";
String colorpicker = "/modules/colorpicker-master/";

Locale locale = new Locale("en");
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
if(request.getAttribute("locale") != null) {
	locale = (Locale)request.getAttribute("locale");
}
Employee currentUser = (Employee)request.getAttribute("currentUser");
Gson gson = new Gson();
%><!DOCTYPE html>
<html>
<head>
<title><%=pageProperties.get("title") %></title>
<meta name="Author" content="Mazars" />
<meta name="Description" content="<%=pageProperties.get("description") %>">
<meta name="Keywords" content="<%=pageProperties.get("keywords") %>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="Shortcut icon" href="<%=ContentManager.link(cssPics + "favicon.gif") %>" type="image/gif" />
<link rel="stylesheet" media="screen" type="text/css" href="<%= ContentManager.link(cssPath + "main.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(jquery + "css/smoothness/jquery-ui-1.10.0.custom.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(sticky + "sticky.full/sticky.full.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(jqGrid + "css/ui.jqgrid.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(treetable + "stylesheets/jquery.treeTable.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(colorpicker + "jquery.colorpicker.css") %>">
<script src="<%= ContentManager.link(jquery + "js/jquery-1.9.0.js") %>"></script>
<script src="<%= ContentManager.link(jquery + "js/jquery-ui-1.10.0.custom.min.js") %>"></script>
<script src="<%= ContentManager.link(blockUI + "jquery.blockUI.js") %>"></script>
<script src="<%= ContentManager.link(sticky + "sticky.full/sticky.full.js") %>"></script>
<script src="<%= ContentManager.link(jqGrid + "js/i18n/grid.locale-en.js") %>"></script>
<script src="<%= ContentManager.link(jqGrid + "js/jquery.jqGrid.min.js") %>"></script>
<script src="<%= ContentManager.link(highcharts + "js/highcharts.js") %>" type="text/javascript"></script>
<script src="<%= ContentManager.link(treetable + "javascripts/jquery.treeTable.js") %>"></script>
<script src="<%= ContentManager.link(colorpicker + "jquery.colorpicker.js") %>"></script>
<%
List<String> jsFiles = (List<String>)request.getAttribute("jsFiles");
if(jsFiles != null) {
    for(String jsFile : jsFiles) {
    %><script  type="text/javascript" src="<%= ContentManager.link(moduleBaseUrl + "resources/js/loader.jsp?fileName=" + URLEncoder.encode(jsFile, "UTF-8")) %>"></script><%
    }
}
%>
<script  type="text/javascript" src="<%= ContentManager.link(moduleBaseUrl + "resources/js/loader.jsp?fileName=" + URLEncoder.encode("Menu.js", "UTF-8")) %>"></script>

<script type="text/javascript">
    <% if(currentUser != null) { %>
    var currentUser = <% gson.toJson(new EmployeeWithoutPasswordVO(currentUser), out); %>;
    <% } %>
    var endpointsFolder = "<%=ContentManager.link("/modules/core/endpoints/") %>";
    var rootPath = "<%=ContentManager.link("/") %>";
    var imagePath = "<%=ContentManager.link("/modules/core/resources/pics/") %>";
    var initializer = null;
    <% if(request.getAttribute("initializer") != null) { %>
       initializer = <%=(String)request.getAttribute("initializer") %>;
    <% } %>
    var params = <% gson.toJson(request.getParameterMap(), out); %>;
    
    <% 
    Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
    hs.beginTransaction();    
    %>
    <% 
    ContentBranch content = new ContentBranch(ContentManager.getContentItem(ContentManager.link("/pages/en/")), currentUser);
    ContentManager.link(ContentManager.getContentItem(request.getRequestURI()).getPath());
    %>
        
    var contentData = <% gson.toJson(content, out); %>;
    var currentUri = "<%=ContentManager.link(ContentManager.getContentItem(request.getRequestURI()).getPath()) %>";
    <%
    hs.getTransaction().commit();
    %>
</script>
</head>
<body>
<table id="header">
<tr><td id="topMenuContainer">    
</td><td style="width: 100%; text-align: right;"><% if(currentUser != null) {
    %><div id="signinMenu"><%=(String)session.getAttribute("userCountryName") %> / <%=(String)session.getAttribute("userOfficeName") %> / <%=(String)session.getAttribute("userDepartmentName") %> / <%=(String)session.getAttribute("userSubdepartmentName") %> / <%=(String)session.getAttribute("userFullName") %> |
    <a href="<%=ContentManager.link("/pages/en/localLogin.jsp?command=doLogout") %>">Logout</a>
    <%
    }%></div></td>
</tr>
</table>
<table style="width: 100%;" id="content">
<tr>
<td style="width: 100%; vertical-align: top;">
<% String contentElement = (String)request.getAttribute("content"); %>
<jsp:include page="<%=contentElement %>" flush="true" />
</td>
</tr>
</table>
<table id="footer">
<tr>
<td><img src="<%=ContentManager.link(cssPics + "logo_3.gif") %>" title="Mazars"></td>
<td id="footerRight">&copy; 2015 - Mazars</td>
</tr>
</table>
<div id="popup_0" style="display: none;"></div>
<div id="popup_1" style="display: none;"></div>
<div id="popup_2" style="display: none;"></div>
<div id="popup_3" style="display: none;"></div>
<div id="popup_4" style="display: none;"></div>
<div id="popup_5" style="display: none;"></div>
<div id="popup_6" style="display: none;"></div>
<div id="popup_7" style="display: none;"></div>
<div id="popup_8" style="display: none;"></div>
<div id="popup_9" style="display: none;"></div>
</body>
</html>