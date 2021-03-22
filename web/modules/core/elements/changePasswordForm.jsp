<%@page import="com.mazars.management.web.content.ContentManager"%>
<%/*****************************************************************
* Gridnine AB http://www.gridnine.com
* Project: New wave
* Legal notice: (c) Gridnine AB. All rights reserved.
*****************************************************************/%><%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.util.*"
    import="com.mazars.management.db.domain.*"
    import="org.hibernate.Session"
    
%><%
String moduleBaseUrl = "/system/modules/com.mazars.management/";
String cssPath = moduleBaseUrl + "resources/css/";
String cssPics = moduleBaseUrl + "resources/pics/";
String labels = moduleBaseUrl + "labels/labels.xml";
Locale locale = (Locale)request.getAttribute("locale");

String oldPassword = (String)request.getAttribute("oldPassword");
String newPassword1 = (String)request.getAttribute("newPassword1");
String newPassword2 = (String)request.getAttribute("newPassword2");
List<String> errors = (List<String>)request.getAttribute("errors");
%>
<form action="<%=ContentManager.link("/pages/en/changePassword.jsp") %>" method="post">
<table class="table2" style="width: 100%;">
    <tr class="header"><td>Change Password</td></tr>
    <tr class="body"><td>

    <table>
    <%
    if(errors != null && errors.size() > 0) {
    %>
    <tr><td colspan="2">
    <%
    for(String error : errors) {
        %><span class="error"><%=error %></span><br /><%
    }
    %>
    </td></tr>
    <%
    }
    %>
    <tr><td><span class="label1">Current password</span></td><td><input type="password" name="oldPassword" value="<%=(oldPassword != null) ? oldPassword : "" %>"></td></tr>
    <tr><td><span class="label1">Invent new password</span></td><td><input type="password" name="newPassword1" value="<%=(newPassword1 != null) ? newPassword1 : "" %>"></td></tr>
    <tr><td><span class="label1">Repeat new password</span></td><td><input type="password" name="newPassword2" value="<%=(newPassword2 != null) ? newPassword2 : "" %>"></td></tr>
    <tr><td>&nbsp;</td><td><input type="submit" value="Submit"></td></tr>
    </table>

    </td></tr>
</table>
<input type="hidden" name="command" value="doChangePassword">
</form>