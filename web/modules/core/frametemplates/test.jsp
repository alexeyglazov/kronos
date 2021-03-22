<%/*****************************************************************
* Gridnine AB http://www.gridnine.com
* Project: New wave
* Legal notice: (c) Gridnine AB. All rights reserved.
*****************************************************************/%><%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.net.URLEncoder"
    import="com.mazars.management.web.content.ContentManager"
%><%
String moduleBaseUrl = "/modules/core/";
String cssPath = moduleBaseUrl + "resources/css/";
String cssPics = moduleBaseUrl + "resources/pics/";
String jquery = "/modules/jquery/";
String blockUI = "/modules/blockui/";
String sticky = "/modules/sticky/";
String jqGrid = "/modules/jquery.jqGrid-4.3.2/";
String highcharts = "/modules/Highcharts-2.2.3/";
String treetable = "/modules/treetable/ludo-jquery-treetable-38d8fa6/src/";
String excanvas = "/modules/excanvas_r3/";
String bootstrap = "/modules/bootstrap/";
Locale locale = (Locale)request.getAttribute("locale");
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
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
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="Shortcut icon" href="<%=ContentManager.link(cssPics + "favicon.gif") %>" type="image/gif" />
<link rel="stylesheet" media="screen" type="text/css" href="<%= ContentManager.link(cssPath + "main.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(jquery + "css/smoothness/jquery-ui-1.8.11.custom.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(sticky + "sticky.full/sticky.full.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(jqGrid + "css/ui.jqgrid.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(treetable + "stylesheets/jquery.treeTable.css") %>">
<link rel="stylesheet" href="<%= ContentManager.link(bootstrap + "css/bootstrap.css") %>">
<link href="<%= ContentManager.link(bootstrap + "css/bootstrap-responsive.css") %>" rel="stylesheet">
<script src="<%= ContentManager.link(jquery + "js/jquery-1.5.1.min.js") %>"></script>
<script src="<%= ContentManager.link(jquery + "js/jquery-ui-1.8.11.custom.min.js") %>"></script>
<script src="<%= ContentManager.link(blockUI + "jquery.blockUI.js") %>"></script>
<script src="<%= ContentManager.link(sticky + "sticky.full/sticky.full.js") %>"></script>
<script src="<%= ContentManager.link(jqGrid + "js/i18n/grid.locale-en.js") %>"></script>
<script src="<%= ContentManager.link(jqGrid + "js/jquery.jqGrid.min.js") %>"></script>
<script src="<%= ContentManager.link(highcharts + "js/highcharts.js") %>" type="text/javascript"></script>
<script src="<%= ContentManager.link(treetable + "javascripts/jquery.treeTable.js") %>"></script>
<script src="<%= ContentManager.link(bootstrap + "js/bootstrap.js") %>"></script>

<%
List<String> jsFiles = (List<String>)request.getAttribute("jsFiles");
if(jsFiles != null) {
    for(String jsFile : jsFiles) {
    %><script  type="text/javascript" src="<%= ContentManager.link(moduleBaseUrl + "resources/js/loader.jsp?fileName=" + URLEncoder.encode(jsFile, "UTF-8")) %>"></script><%
    }
}
%>
<script type="text/javascript">
    var currentUser = <% gson.toJson(new EmployeeWithoutPasswordVO(currentUser), out); %>;
    var endpointsFolder = "<%=ContentManager.link("/modules/core/endpoints/") %>";
    var rootPath = "<%=ContentManager.link("/") %>";
    var imagePath = "<%=ContentManager.link("/modules/core/resources/pics/") %>";
    var initializer = null;
    <% if(request.getAttribute("initializer") != null) { %>
       initializer = <%=(String)request.getAttribute("initializer") %>;
    <% } %>
    var params = <% gson.toJson(request.getParameterMap(), out); %>;  
</script>
</head>
<body>   
<div class="row">
  <div class="span4">Left</div>
  <div class="span8">Right</div>
</div>
<div class="row-fluid">
  <div class="span2">Left</div>
  <div class="span4">Center</div>
  <div class="span6">Right</div>
</div>
    <input type="button" value="V" class="visible-desktop">
    <input type="button" value="H" class="hidden-phone">
    <h1>QWEQWEQWE</h1>
    <h2>QWEQWEQWE</h2>
    <h3>QWEQWEQWE</h3>
    <h4>QWEQWEQWE</h4>
    <h5>QWEQWEQWE</h5>
    <h6>QWEQWEQWE</h6>
</body>
</html>