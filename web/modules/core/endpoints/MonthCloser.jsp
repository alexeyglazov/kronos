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
Module module = Module.getByName("Admin");

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
    List<Integer> closedMonthIds = new LinkedList<Integer>();
    Country country = currentUser.getCountry();
    for(ClosedMonth closedMonth : ClosedMonth.getAllByCountryAndYear(country, year)) {
        closedMonthIds.add(closedMonth.getMonth());
    }
    Integer minYear = TimeSpentItem.getMinYear();
    List<ClosedMonth> unclosedMonths = ClosedMonth.checkCountry(country);
%>
    {
    "status": "OK",
    "closedMonthIds": <% gson.toJson(closedMonthIds, out); %>,
    "unclosedMonths": <% gson.toJson(ClosedMonthVO.getList(unclosedMonths), out); %>,
    "minYear": <%=minYear %>
    }
    <%
} else if("getClosedMonthIds".equals(command)) {
    Integer year = Integer.parseInt(request.getParameter("year"));
    Country country = currentUser.getCountry();
    List<Integer> closedMonthIds = new LinkedList<Integer>();
    for(ClosedMonth closedMonth : ClosedMonth.getAllByCountryAndYear(country, year)) {
        closedMonthIds.add(closedMonth.getMonth());
    }
    List<ClosedMonth> unclosedMonths = ClosedMonth.checkCountry(country);
    %>
    {
    "status": "OK",
    "closedMonthIds": <% gson.toJson(closedMonthIds, out); %>,
    "unclosedMonths": <% gson.toJson(ClosedMonthVO.getList(unclosedMonths), out); %>
    }
    <%
} else if("setClosedMonths".equals(command)) {
    MonthCloserForm monthCloserForm = MonthCloserForm.getFromJson(request.getParameter("monthCloserForm"));
    Country country = currentUser.getCountry();
    List<ClosedMonth> currentClosedMonths = ClosedMonth.getAllByCountryAndYear(country, monthCloserForm.getYear());
    for(Integer m = 0; m < 12; m++) {
        boolean isInCurrentCollection = false;
        boolean isInNewCollection = monthCloserForm.getClosedMonthIds().contains(m);
        for(ClosedMonth closedMonth : currentClosedMonths) {
            if(closedMonth.getMonth().equals(m)) {
                isInCurrentCollection = true;
                if(! isInNewCollection) {
                    hs.delete(closedMonth);
                }
                break;
            }
        }
        if(!isInCurrentCollection && isInNewCollection) {
            ClosedMonth closedMonth = new ClosedMonth();
            closedMonth.setCountry(country);
            closedMonth.setYear(monthCloserForm.getYear());
            closedMonth.setMonth(m);
            hs.save(closedMonth);
        }
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