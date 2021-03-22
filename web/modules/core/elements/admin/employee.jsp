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
            List<StandardPosition> standardPositions = (List<StandardPosition>)request.getAttribute("standardPositions");
        %>
    <form method="post" action="employee.jsp">
    <div style="color: #ff0000;">All fields are mandatory</div>
    <table>
        <tr><td>Country Name</td><td><input name="countryName" value="Russia"></td></tr>
        <tr><td>Office Name</td><td><input name="officeName" value="Moscow"></td></tr>
        <tr><td>Office Code Name</td><td><input name="officeCodeName" value="MSC"></td></tr>
        <tr><td>Department Name</td><td><input name="departmentName" value=""></td></tr>
        <tr><td>Department Code Name</td><td><input name="departmentCodeName" value=""></td></tr>
        <tr><td>Subdepartment Name</td><td><input name="subdepartmentName" value=""></td></tr>
        <tr><td>Subdepartment Code Name</td><td><input name="subdepartmentCodeName" value=""></td></tr>
        <tr><td>Standard Position</td><td><select name="standardPositionId">
                    <% for(StandardPosition standardPosition : standardPositions) { %>
                    <option value="<%=standardPosition.getId() %>"><%=standardPosition.getName() %></option>
                    <% } %>
                </select></td></tr>
        <tr><td>Position</td><td><input name="positionName" value=""></td></tr>
        <tr><td>User Name (Login)</td><td><input name="employeeUserName" value="Admin"></td></tr>
        <tr><td>Password</td><td><input type="password" name="employeePassword" value=""></td></tr>
        <tr><td>First Name</td><td><input name="employeeFirstName" value=""></td></tr>
        <tr><td>Last Name</td><td><input name="employeeLastName" value=""></td></tr>
        <tr><td>E-mail</td><td><input name="employeeEmail" value=""></td></tr>
        <tr><td></td><td><input type="submit" value="Submit"></td></tr>
    </table>
        <input type="hidden" name="command" value="createEmployee">
    </form>
        <%
        } else if("errorOnEmployeeCreation".equals(displayStatus)) {
            List<StandardPosition> standardPositions = (List<StandardPosition>)request.getAttribute("standardPositions");
            %>
        <%=displayMessage %>           
    <form method="post" action="employee.jsp">
    <div style="color: #ff0000;">All fields are mandatory</div>
    <table>
        <tr><td>Country Name</td><td><input name="countryName" value="Russia"></td></tr>
        <tr><td>Office Name</td><td><input name="officeName" value="Moscow"></td></tr>
        <tr><td>Office Code Name</td><td><input name="officeCodeName" value="MSC"></td></tr>
        <tr><td>Department Name</td><td><input name="departmentName" value=""></td></tr>
        <tr><td>Department Code Name</td><td><input name="departmentCodeName" value=""></td></tr>
        <tr><td>Subdepartment Name</td><td><input name="subdepartmentName" value=""></td></tr>
        <tr><td>Subdepartment Code Name</td><td><input name="subdepartmentCodeName" value=""></td></tr>
        <tr><td>Standard Position</td><td><select name="standardPositionId">
                    <% for(StandardPosition standardPosition : standardPositions) { %>
                    <option value="<%=standardPosition.getId() %>"><%=standardPosition.getName() %></option>
                    <% } %>
                </select></td></tr>
        <tr><td>Position</td><td><input name="positionName" value=""></td></tr>
        <tr><td>User Name (Login)</td><td><input name="employeeUserName" value="Admin"></td></tr>
        <tr><td>Password</td><td><input type="password" name="employeePassword" value=""></td></tr>
        <tr><td>First Name</td><td><input name="employeeFirstName" value=""></td></tr>
        <tr><td>Last Name</td><td><input name="employeeLastName" value=""></td></tr>
        <tr><td>E-mail</td><td><input name="employeeEmail" value=""></td></tr>
        <tr><td></td><td><input type="submit" value="Submit"></td></tr>
    </table>
        <input type="hidden" name="command" value="createEmployee">
    </form>
        <%
        } else if("successOnEmployeeCreation".equals(displayStatus)) {
            %><%=displayMessage %><%
        }
%>            
        </div>
    </td>
    </tr>
</table>
