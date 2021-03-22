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
        <div id="formContainer">
        Possible command:<br />
        <a href="?command=createStandardPositions">Create Standard Positions</a><br />
        <a href="?command=createModules">Create Modules</a><br />
        <a href="?command=createISOCountries">Create ISO Countries</a><br />
        <a href="?command=createLanguages">Create Languages</a><br />
        <a href="?command=createCurrencies">Create Currencies</a><br />
        <a href="?command=createActivitySectors">Create Activity Sectors</a><br />
        <hr />
<%
        if("showForm".equals(displayStatus)) {
            %>Press links to create basic entities in database<%
        } else if("errorOnStandardPositions".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnStandardPositions".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("errorOnModules".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnModules".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("errorOnISOCountries".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnISOCountries".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("errorOnLanguages".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnLanguages".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("errorOnCurrencies".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnCurrencies".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("errorOnActivitySectors".equals(displayStatus)) {
            %><%=displayMessage %><%
        } else if("successOnActivitySectors".equals(displayStatus)) {
            %><%=displayMessage %><%
        }
%>            
        </div>
    </td>
    </tr>
</table>
