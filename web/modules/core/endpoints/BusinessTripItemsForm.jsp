<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.comparators.*"
    import="com.mazars.management.web.security.AccessChecker"
    
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Timesheets");

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

if("saveBusinessTripItemsForm".equals(command)) {
    BusinessTripItemsForm businessTripItemsForm = BusinessTripItemsForm.getFromJson(request.getParameter("businessTripItemsForm"));
    Country country = currentUser.getCountry();           
    if(ClosedMonth.isMonthClosed(country, businessTripItemsForm.getYear(), businessTripItemsForm.getMonth())) {
        throw new Exception("This month is closed");
    }        
    List<BusinessTripItem> businessTripItems = BusinessTripItem.getAllByEmployeeYearMonth(currentUser, businessTripItemsForm.getYear(), businessTripItemsForm.getMonth());
    List<BusinessTripItem> toDeleteBusinessTripItems = new LinkedList<BusinessTripItem>();
    List<BusinessTripItem> toCreateBusinessTripItems = new LinkedList<BusinessTripItem>();    
    List<BusinessTripItem> toPreserveBusinessTripItems = new LinkedList<BusinessTripItem>(); 
    Date now = new Date(); 
    for(BusinessTripItem businessTripItem : businessTripItems) {
        boolean exists = false;
        for(BusinessTripItemsForm.Item item : businessTripItemsForm.getItems()) {
            if(item.getProjectCodeId().equals(businessTripItem.getProjectCode().getId()) && item.getDayOfMonth().equals(businessTripItem.getDay().get(Calendar.DAY_OF_MONTH))) {
                toPreserveBusinessTripItems.add(businessTripItem);
                exists = true;
                break;
            }
        }
        if(! exists) {
            toDeleteBusinessTripItems.add(businessTripItem);
        }
    }
    for(BusinessTripItemsForm.Item item : businessTripItemsForm.getItems()) {
        boolean exists = false;
        for(BusinessTripItem businessTripItem : businessTripItems) {
            if(item.getProjectCodeId().equals(businessTripItem.getProjectCode().getId()) && item.getDayOfMonth().equals(businessTripItem.getDay().get(Calendar.DAY_OF_MONTH))) {
                exists = true;
                break;
            }            
        }
        if(! exists) {
            BusinessTripItem businessTripItem = new BusinessTripItem();
            Calendar day = (new YearMonthDate(businessTripItemsForm.getYear(), businessTripItemsForm.getMonth(), item.getDayOfMonth())).getCalendar();
            ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(item.getProjectCodeId()));
            businessTripItem.setEmployee(currentUser);
            businessTripItem.setDay(day);
            businessTripItem.setProjectCode(projectCode);
            businessTripItem.setModifiedAt(now);
            toCreateBusinessTripItems.add(businessTripItem);
        }
    }
    
    
    List<TimeSpentItem> timeSpentItems = TimeSpentItem.getAllByEmployeeYearMonth(currentUser, businessTripItemsForm.getYear(), businessTripItemsForm.getMonth());
    for(BusinessTripItemsForm.Item item : businessTripItemsForm.getItems()) {
        boolean exists = false;
        for(TimeSpentItem timeSpentItem : timeSpentItems) {
            if(timeSpentItem.getProjectCode() != null && timeSpentItem.getProjectCode().getId().equals(item.getProjectCodeId()) && item.getDayOfMonth().equals(timeSpentItem.getDay().get(Calendar.DAY_OF_MONTH))) {
                exists = true;
                break;
            }
        }
        if(! exists) {
            throw new Exception("No time reported for some business trip item.");
        }
    }
    
    for(BusinessTripItem businessTripItem : toDeleteBusinessTripItems) {
        hs.delete(businessTripItem);
    }
    for(BusinessTripItem businessTripItem : toCreateBusinessTripItems) {
        hs.save(businessTripItem);
    }
    %>
    {
    "status" : "OK"
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