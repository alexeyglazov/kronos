<%-- 
    Document   : index.jsp
    Created on : 01.08.2012, 10:50:52
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
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
%><%!
String showContentItemsRows(ContentItem contentItem, int level) {
    String result = "";
    result += "<tr>";
    result += "<td style='padding-left: " + (20 * level) + "px;'>" + contentItem.getName() + "</td>";
    result += "<td>" + contentItem.getTitle() + "</td>";
    result += "<td>" + contentItem.getDescription() + "</td>";
    result += "<td>" + (contentItem.getUrl() != null ? contentItem.getUrl() : "") + "</td>";
    result += "<td>" + contentItem.getIsNonUserAccessible() + "</td>";
    result += "<td>" + contentItem.getIsUserAccessible() + "</td>";
    result += "<td>" + contentItem.getIsSuperUserAccessible() + "</td>";
    result += "<td>" + contentItem.getIsCountryAdministratorAccessible() + "</td>";
    result += "<td>" + (contentItem.getModule() != null ? contentItem.getModule().getName() : "") + "</td>";
    result += "</tr>";
    for(ContentItem childContentItem : contentItem.getChildren()) {
        result += showContentItemsRows(childContentItem, level + 1);
    }
    return result;
}
%>
<%
String moduleBaseUrl = "/modules/core/";
Map<String, String> pageProperties = (Map<String, String>)request.getAttribute("pageProperties");
String displayStatus = (String)request.getAttribute("displayStatus");
String displayMessage = (String)request.getAttribute("displayMessage");
%>
<table class="table2" style="width: 100%;">
    <tr class="header"><td><%=pageProperties.get("title") %></td></tr>
    <tr class="body">
    <td>
        <div id="formContainer">
            <table class="datagrid">
            <tr class="dgHeader"><td colspan="9">Content items in cache</td></tr>
            <tr class="dgHeader"><td>Name</td><td>Title</td><td>Description</td><td>URL</td><td>Non user</td><td>User</td><td>Super user</td><td>Country admin</td><td>Module</td></tr>
            <% if(ContentManager.getRootContentItem() != null) { %>
            <%=showContentItemsRows(ContentManager.getRootContentItem(), 0) %>
            <% } else { %>
            <tr><td colspan="9">No content items cached</td></tr>
            <% } %>
            </table>    
<%
        if("showForm".equals(displayStatus)) {

        } else if("successOnResetContentItems".equals(displayStatus)) {
            %><%=displayMessage %><%
        }  else if("successOnUpdatingCache".equals(displayStatus)) {
            %><%=displayMessage %><%
        }  else if("errorOnUpdatingCache".equals(displayStatus)) {
            %><%=displayMessage %><%
        }
        %>
        <table>
            <tr>
            <td>    
            <form action="content.jsp" method="post">
                <input type="Submit" value="Reset content items in database">
                <input type="hidden" name="command" value="resetContentItems">
            </form>
            </td>    
            <td>    
            <form action="content.jsp" method="post">
                <input type="Submit" value="Update cache">
                <input type="hidden" name="command" value="updateCache">
            </form>
            </td>  
            </tr>
        </table>    
            
        </div>
    </td>
    </tr>
</table>
