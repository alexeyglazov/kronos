<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.web.security.AccessChecker"
    
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("HR");

AccessChecker accessChecker = new AccessChecker();
AccessChecker.Status status = accessChecker.check(currentUser, module);
if(! AccessChecker.Status.VALID.equals(status)) {
    Map<AccessChecker.Status, String> statusComments = new HashMap<AccessChecker.Status, String>();
    statusComments.put(AccessChecker.Status.NOT_LOGGED_IN, "User is not logged in");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED, "User is not authorized");
    statusComments.put(AccessChecker.Status.NOT_AUTHORIZED_TO_MODULE, "User is not authorized to this module");
    statusComments.put(AccessChecker.Status.PASSWORD_MUST_BE_CHANGED, "User must change the password");
    %>{"status": "<%=status %>", "comment": "<%=statusComments.get(status) %>"}<%
    hs.getTransaction().commit();
    return;
}

hs.refresh(currentUser);
if("getInitialContent".equals(command)) {
    Integer year = Integer.parseInt(request.getParameter("year"));
    List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();
    Country country = currentUser.getCountry();
    for(Holiday holiday : Holiday.getAllByCountryAndYear(country, year)) {
        holidays.add(new YearMonthDate(holiday.getDate()));
    }
    Calendar leavesItemMinStart = LeavesItem.getMinStart();
    Calendar employeePositionHistoryItemMinStart = EmployeePositionHistoryItem.getMinStart();
    Integer minYear = TimeSpentItem.getMinYear();
    if(leavesItemMinStart != null && leavesItemMinStart.get(Calendar.YEAR) < minYear) {
        minYear = leavesItemMinStart.get(Calendar.YEAR);
    }
    if(employeePositionHistoryItemMinStart != null && employeePositionHistoryItemMinStart.get(Calendar.YEAR) < minYear) {
        minYear = employeePositionHistoryItemMinStart.get(Calendar.YEAR);
    }
%>
    {
    "status": "OK",
    "holidays": <% gson.toJson(holidays, out); %>,
    "minYear": <%=minYear %>
    }
    <%
} else if("getContentForYear".equals(command)) {
    Integer year = Integer.parseInt(request.getParameter("year"));
    List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();
    Country country = currentUser.getCountry();
    for(Holiday holiday : Holiday.getAllByCountryAndYear(country, year)) {
        holidays.add(new YearMonthDate(holiday.getDate()));
    }
%>
    {
    "status": "OK",
    "holidays": <% gson.toJson(holidays, out); %>
    }
    <%
} else if("setHolidays".equals(command)) {
    HolidaysManagerForm holidaysManagerForm = HolidaysManagerForm.getFromJson(request.getParameter("holidaysManagerForm"));
    Country country = currentUser.getCountry();
    List<Holiday> holidays = Holiday.getAllByCountryAndYear(country, holidaysManagerForm.getYear());
    for(Holiday holiday : holidays) {
        hs.delete(holiday);
    }
    for(YearMonthDate date : holidaysManagerForm.getHolidays()) {
        Holiday holiday = new Holiday();
        holiday.setCountry(country);
        holiday.setDate(date.getCalendar());
        hs.save(holiday);
    }
    %>
    {
    "status": "OK"
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <%
}
%>