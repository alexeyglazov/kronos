<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.CurrencyComparator"%>
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
<%
        if("showForm".equals(displayStatus)) {
        %><%=displayMessage %>
        <form action="key.jsp" method="post">
            <input type="Submit" value="Generate">
            <input type="hidden" name="command" value="generateSecreteKey">
        </form>    
        <%
        } else if("successOnSecreteKeyGeneration".equals(displayStatus)) {
            String generatedSecreteKey = (String)request.getAttribute("generatedSecreteKey");
            %><%=displayMessage %>           
        <pre><%=generatedSecreteKey %></pre>
        <%
        }
%>            
        </div>
    </td>
    </tr>
</table>
