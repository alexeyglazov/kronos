<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="java.net.URLEncoder"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.db.comparators.CurrencyComparator"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.Collection"%>
<%@ page language="java" 
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.Map"
    import="com.mazars.management.db.util.*"
    import="com.mazars.management.db.domain.*"
    import="org.hibernate.Session"
    import="java.text.SimpleDateFormat"
    import="com.mazars.management.load.excel.FISheet"
    import="com.mazars.management.web.content.ContentManager"
    import="com.mazars.management.web.content.ContentItem"
    import="jxl.Sheet"
%><%
String moduleBaseUrl = "/modules/core/";
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
String displayStatus = (String)request.getAttribute("displayStatus");
String displayMessage = (String)request.getAttribute("displayMessage");
%>
<table class="table2" style="width: 100%;">
    <tr class="header"><td><%=pageProperties.get("title") %></td></tr>
    <tr class="body">
    <td>
        <div>
<%
        if("showForm".equals(displayStatus)) {
            List<String> errors = (List<String>)request.getAttribute("errors");
            String username = (String)request.getAttribute("username");
            String password = (String)request.getAttribute("password");
            %><%=(displayMessage != null) ? displayMessage : "" %> 
            <%
            if(errors != null) {
                %><div class="error"><%
                for(String error : errors) {
                    %><%=error%><br /><%
                }
                %></div><%
            }
            %>
            <form action="login.jsp" method="post">
                <table>
                    <tr><td>User name</td><td><input type="text" name="username" value="<%=username != null ? username : "" %>"></td></tr>
                    <tr><td>Password</td><td><input type="password" name="password" value="<%=password != null ? password : "" %>"></td></tr>
                    <tr><td></td><td><input type="Submit" value="Login"></td></tr>
                </table>    
                <input type="hidden" name="command" value="doLogin">
            </form> 
        <%
        }
%>            
        </div>
    </td>
    </tr>
</table>
