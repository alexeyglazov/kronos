<%--
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.web.content.ContentManager"%>
<%@page import="javax.activation.DataHandler"%>
<%@page import="javax.activation.FileDataSource"%>
<%@page import="javax.activation.DataSource"%>
<%@page import="javax.mail.internet.MimeBodyPart"%>
<%@page import="javax.mail.internet.MimeMultipart"%>
<%@page import="javax.mail.Multipart"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="com.mazars.management.web.vo.LeavesBalanceCalculatorResult"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="com.mazars.management.service.LeavesBalanceCalculator"%>
<%@page import="com.mazars.management.reports.InvoiceRequestReport"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.reports.jobs.ProfitabilityReportJob"%>
<%@page import="com.mazars.management.jobs.JobManager"%>
<%@page import="com.mazars.management.jobs.Job"%>
<%@page import="com.mazars.management.service.ObjectUtils"%>
<%@page import="java.io.ObjectOutputStream"%>
<%@page import="java.io.ObjectOutput"%>
<%@page import="java.io.ByteArrayOutputStream"%>
<%@page import="javax.crypto.SecretKey"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="java.net.URI"%>
<%@page import="com.mazars.management.reports.ProfitabilityReport"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="jxl.write.WritableSheet"%>
<%@page import="jxl.write.Label"%>
<%@page import="jxl.Sheet"%>
<%@page import="jxl.write.WritableWorkbook"%>
<%@page import="java.io.File"%>
<%@page import="jxl.Workbook"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.math.BigDecimal"%>
<%@page import="org.hibernate.Query"%>
<%@page contentType="text/html" pageEncoding="UTF-8"

    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.*"
%><%
request.setCharacterEncoding("UTF-8");
Gson gson = new Gson();
Employee currentUser = (Employee)session.getAttribute("currentUser");
Locale locale = new Locale("en");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();

%>    
<%-- start of access.jsp --%>
<%
AccessChecker.Status status = null;

Module module = Module.getByName("Clients");
AccessChecker accessChecker = new AccessChecker();
status = accessChecker.check(currentUser, module);
    
if(AccessChecker.Status.NOT_LOGGED_IN.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/login.jsp?status=" + status));
} else if(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED.equals(status)) {
    response.sendRedirect(ContentManager.link("/pages/" + locale + "/changePassword.jsp?status=" + status));
}
if(! AccessChecker.Status.VALID.equals(status)) {
    hs.getTransaction().commit();
    return;
}
%>
<%-- end of access.jsp --%>    
<%    
    SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    SimpleDateFormat dateFormatter2 = new SimpleDateFormat("yyyy-MM-dd");
    Date start = null;
    if(request.getParameter("start") != null) {
        start = dateFormatter2.parse(request.getParameter("start"));
    }
    %><table border="1">
    <tr>
        <td>Client</td>
        <td>Active</td>
        <td>External</td>
        <td>Created at</td>
        <td>Created by</td>
        <td>Sectors</td>
        <td>Subdepartments</td>
        <td>Code Activities</td>
        <td>Code Max EndDate</td>
        <td>Persons in charge</td>
    </tr><%
    for(Client client : Client.getAll()) {
        List<ClientHistoryItem> clientHistoryItems = ClientHistoryItem.getSortedClientHistoryItems(client, ClientHistoryItem.SortOrder.ASC);
        ClientHistoryItem firstClientHistoryItem = null;
        if(! clientHistoryItems.isEmpty()) {
            firstClientHistoryItem = clientHistoryItems.get(0);
        }
        if(start != null && firstClientHistoryItem != null && firstClientHistoryItem.getCreatedAt().before(start) ) {
            continue;
        }
        
        List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
        String asNames = "";       
        for(ActivitySector activitySector : client.getActivitySectors()) {
            asNames += activitySector.getName() + "; ";
        }
        
        List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        String sNames = "";       
        for(SubdepartmentClientLink subdepartmentClientLink : client.getSubdepartmentClientLinks()) {
            sNames += subdepartmentClientLink.getSubdepartment().getName() + "; ";
        }

        Set<Activity> activities = new HashSet<Activity>();
        String aNames = "";       
        Set<Employee> inChargePersons = new HashSet<Employee>();
        String icpNames = "";   
        Calendar maxCodeEndDate = null;
        for(ProjectCode projectCode : client.getProjectCodes()) {
            activities.add(projectCode.getActivity());
            Employee inChargePerson = projectCode.getInChargePerson();
            if(inChargePerson != null) {
                inChargePersons.add(inChargePerson);
            }
            if(projectCode.getEndDate() != null) {
                if(maxCodeEndDate == null) {
                    maxCodeEndDate = projectCode.getEndDate();
                } else if(projectCode.getEndDate().after(maxCodeEndDate)) {
                    maxCodeEndDate = projectCode.getEndDate();
                }
            }
        }
        for(Activity activity : activities) {
            aNames += activity.getName() + "; ";
        }
        for(Employee inChargePerson : inChargePersons) {
            icpNames += inChargePerson.getUserName() + "; ";
        }
    %><tr>
        <td><%=client.getName() %></td>
        <td><%=client.getIsActive() %></td>
        <td><%=client.getIsExternal() %></td>
        <td><%=firstClientHistoryItem != null ? dateFormatter.format(firstClientHistoryItem.getCreatedAt()) : "" %></td>
        <td><%=firstClientHistoryItem != null ? firstClientHistoryItem.getCreatedBy().getUserName() : "" %></td>
        <td><%=asNames %></td>
        <td><%=sNames %></td>
        <td><%=aNames %></td>
        <td><%=((maxCodeEndDate != null) ? dateFormatter2.format(maxCodeEndDate.getTime()) : "") %></td>
        <td><%=icpNames %></td>
    </tr><%
    }
    %></table><%
    hs.getTransaction().commit();
} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% ex.printStackTrace(new PrintWriter(out)); %>
    }
    <%
}
%>