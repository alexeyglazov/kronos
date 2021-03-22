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
    import="com.mazars.management.web.content.ContentManager"
%><%
String moduleBaseUrl = "/system/modules/com.mazars.management/";
Locale locale = (Locale)request.getAttribute("locale");

String name = (String)request.getAttribute("name");
String password = (String)request.getAttribute("password");
List<String> errors = (List<String>)request.getAttribute("errors");
%>
<form action="<%=ContentManager.link("/pages/en/localLogin.jsp") %>" method="post">
<table class="table2" style="width: 100%;">
    <tr class="header"><td>Login</td></tr>
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
    <tr><td><span class="label1">User name</span></td><td><input type="text" name="name" value="<%=(name != null) ? name : "" %>" style="width: 200px;"></td><td></td></tr>
    <tr><td><span class="label1">Password</span></td><td><input type="password" name="password" value="<%=(password != null) ? password : "" %>" style="width: 200px;"></td><td><a href="<%=ContentManager.link("/pages/en/forgotPassword.jsp") %>">Forgot password?</a></td></tr>
    <tr><td>&nbsp;</td><td><input type="submit" value="Submit"></td><td></td></tr>
    </table>

    </td></tr>
</table>
<input type="hidden" name="command" value="doLogin">
</form>