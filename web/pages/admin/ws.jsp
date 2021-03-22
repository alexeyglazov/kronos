<%-- 
    Document   : helper
    Created on : 30.03.2011, 14:05:19
    Author     : glazov
--%>

<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="javax.xml.datatype.DatatypeFactory"%>
<%@page import="javax.xml.datatype.XMLGregorianCalendar"%>
<%@page import="java.net.PasswordAuthentication"%>
<%@page import="java.net.Authenticator"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.security.PasswordUtil"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>

<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
%>
<%
String moduleBaseUrl = "/system/modules/com.mazars.management/";
String cssPath = moduleBaseUrl + "resources/css/";
Locale locale = new Locale("en");
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
<%
    String command = request.getParameter("command");

    Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
   try{
    hs.beginTransaction();
        com.mazars.management.webservices.clients.financial1c.Mazars q = new com.mazars.management.webservices.clients.financial1c.Mazars();
        %>Service name is <%=q.getServiceName() %><br /><%
        
                Authenticator myAuth = new Authenticator() 
        {
            @Override
            protected PasswordAuthentication getPasswordAuthentication()
            {
                return new PasswordAuthentication("test", "test".toCharArray());
            }
        };
        Authenticator.setDefault(myAuth);
        
        com.mazars.management.webservices.clients.financial1c.MazarsPortType t = q.getMazarsSoap();
        %>PortType  <%=t %><br /><%
        GregorianCalendar gcDateFrom = new GregorianCalendar(1, 0, 1, 0, 0, 0);               
        GregorianCalendar gcDateTo = new GregorianCalendar(1, 0, 1, 0, 0, 0);
        DatatypeFactory df = DatatypeFactory.newInstance();
        XMLGregorianCalendar dateFrom = df.newXMLGregorianCalendar(gcDateFrom);
        XMLGregorianCalendar dateTo = df.newXMLGregorianCalendar(gcDateTo);
        
        
        
        List<com.mazars.management.webservices.clients.financial1c.Document> result = t.getModifiedDocuments(null, null).getResult();
        %>Number of documents is  <%=result.size() %><br /><%
        %><table border="1">
            <tr><td>Code</td><td>Sum</td><td>Currency</td><td>Id</td><td>Number</td><td>Type</td><td>OOP</td><td>Date</td><td>VatRate</td></tr>
            <%
        for(com.mazars.management.webservices.clients.financial1c.Document d : result) {
            %>
            <tr>
                <td><%=d.getCode() %></td>
                <td><%=d.getSum() %></td>
                <td><%=d.getCurrency() %></td>
                <td><%=d.getId() %></td>
                <td><%=d.getNumber() %></td>
                <td><%=d.getType() %></td>
                <td><%=d.isOOP() %></td>
                <td><%=d.getDate() %></td>
                <td><%=d.getVatRate() %></td>
            </tr>
            <%
        }
        %></table><%
    hs.getTransaction().commit();
   } catch(Exception e) {
       hs.getTransaction().rollback();
              %>Exception <pre><% e.printStackTrace(new PrintWriter(out)); %></pre><%
    }
%>
    </body>
</html>
