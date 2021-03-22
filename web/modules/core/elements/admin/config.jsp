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
<%
        List<ConfigProperty> configProperties = (List<ConfigProperty>)request.getAttribute("configProperties");
            %><table class="datagrid">
                <tr class="dgHeader"><td>Name</td><td>DB Value</td><td>Cache Value</td><td>Description</td><td>Edit</td></tr>
            <%
            for(ConfigProperty configProperty : configProperties) {
        %>
        <tr>
            <td><%=configProperty.getName() %></td>
            <td><pre><%=configProperty.getValue() %></pre></td>
            <td><pre><%=ConfigUtils.getProperties().getProperty(configProperty.getName()) %></pre></td>
            <td><pre><%=configProperty.getDescription() %></pre></td>
            <td><a href="./config.jsp?command=startEditProperty&propertyName=<%=URLEncoder.encode(configProperty.getName(), "UTF-8") %>">Edit</a></td>
        </tr>
        <%
            }
        %></table><%
        if("showProperties".equals(displayStatus)) {
        %>    
        <table>
            <tr>
            <td>    
            <form action="config.jsp" method="post">
                <input type="Submit" value="Reset properties in database">
                <input type="hidden" name="command" value="resetDatabaseProperties">
            </form>
            </td>    
            <td>    
            <form action="config.jsp" method="post">
                <input type="Submit" value="Update cache">
                <input type="hidden" name="command" value="updateCache">
            </form>
            </td>  
            </tr>
        </table>    
        <%
        } else if("successOnResetDatabaseProperties".equals(displayStatus)) {
            %><%=displayMessage %>
        <table>
            <tr>
            <td>    
            <form action="config.jsp" method="post">
                <input type="Submit" value="Reset properties in database">
                <input type="hidden" name="command" value="resetDatabaseProperties">
            </form>
            </td>    
            <td>    
            <form action="config.jsp" method="post">
                <input type="Submit" value="Update cache">
                <input type="hidden" name="command" value="updateCache">
            </form>
            </td>  
            </tr>
        </table>  
        <%
        } else if("showEditPropertyForm".equals(displayStatus)) {
            ConfigProperty configProperty = (ConfigProperty)request.getAttribute("configProperty");
        %>
            <form action="config.jsp" method="post">
                <table>
                    <tr><td>Name</td><td><%=configProperty.getName() %></td></tr>
                    <tr><td>Value</td><td><textarea name="propertyValue" style="width: 400px; height: 200px;"><%=configProperty.getValue() %></textarea></td></tr>
                    <tr><td>Description</td><td><pre><%=configProperty.getDescription() %></pre></td></tr>
                </table>
                <input type="Submit" value="Save">
                <input type="hidden" name="command" value="saveProperty">
                <input type="hidden" name="propertyName" value="<%=configProperty.getName() %>">
            </form>
        <%
        }
%>            
        </div>
    </td>
    </tr>
</table>
