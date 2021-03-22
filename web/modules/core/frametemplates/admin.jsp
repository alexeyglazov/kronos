<%-- 
    Document   : admin
    Created on : 17.05.2013, 13:32:07
    Author     : glazov
--%>

<%@page import="java.net.URLEncoder"%>
<%@page import="java.util.List"%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Locale"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
String moduleBaseUrl = "/modules/core/";
String cssPath = moduleBaseUrl + "resources/css/";
String cssPics = moduleBaseUrl + "resources/pics/";
String jquery = "/modules/jquery-ui-1.10.0.custom/";
String blockUI = "/modules/blockui/";
String sticky = "/modules/sticky/";
//String bootstrap = "/modules/bootstrap/";
String jqGrid = "/modules/jquery.jqGrid-4.4.4/";
Locale locale = new Locale("en");
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
if(request.getAttribute("locale") != null) {
	locale = (Locale)request.getAttribute("locale");
}
Boolean isAdminLoggedIn = (Boolean)request.getAttribute("isAdminLoggedIn");
%>
<!DOCTYPE html>
<html>
    <head>
<title><%=pageProperties.get("title") %></title>        
<meta name="Author" content="Mazars" />
<meta name="Description" content="<%=pageProperties.get("description") %>">
<meta name="Keywords" content="<%=pageProperties.get("keywords") %>">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="Shortcut icon" href="<%=ContentManager.link(cssPics + "favicon.gif") %>" type="image/gif" />
<link rel="stylesheet" media="screen" type="text/css" href="<%= ContentManager.link(cssPath + "main.css") %>">
<%
List<String> jsFiles = (List<String>)request.getAttribute("jsFiles");
if(jsFiles != null) {
    for(String jsFile : jsFiles) {
    %><script  type="text/javascript" src="<%= ContentManager.link(moduleBaseUrl + "resources/js/loader.jsp?fileName=" + URLEncoder.encode(jsFile, "UTF-8")) %>"></script><%
    }
}
%>
</head>
    <body>
        <table id="header">
        <tr><td>
                
        <table id="topMenu" ><tr>
            <td><a href="./basic_entities.jsp">Basic Entity</a></td>
            <td><a href="./content.jsp">Content</a></td>
            <td><a href="./employee.jsp">Employee</a></td>
            <td><a href="./key.jsp">Key</a></td>
            <td><a href="./config.jsp">Config</a></td>
        </tr></table>
                
            </td><td style="width: 100%; text-align: right;"><% if(Boolean.TRUE.equals(isAdminLoggedIn)) {
    %><div id="signinMenu"><a href="./login.jsp?command=doLogout">Logout</a>
    <% } %></div></td>
</tr>
</table>                
        <% String contentElement = (String)request.getAttribute("content"); %>
        <jsp:include page="<%=contentElement %>" flush="true" />
    </body>
</html>
