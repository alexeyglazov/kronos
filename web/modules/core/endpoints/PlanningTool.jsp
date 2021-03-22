<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintStream"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.Collections"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.mazars.management.web.vo.PlanningToolInfo"%>
<%@page import="com.mazars.management.service.PlanningLockSubdepartmentManager"%>
<%@page import="com.mazars.management.web.vo.ShortEmployee"%>
<%@page import="com.mazars.management.web.vo.OfficeDepartmentSubdepartment"%>
<%@page import="com.mazars.management.db.util.PlanningItemUtil"%>
<%@page import="com.mazars.management.web.vo.DescribedCarreersInfo"%>
<%@page import="com.mazars.management.db.util.EmployeePositionHistoryItemUtils"%>
<%@page import="java.io.OutputStream"%><%@page contentType="text/html" pageEncoding="UTF-8"
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
Module module = Module.getByName("Planning Read");

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
    Country country = currentUser.getCountry();
    Set<Subdepartment> subdepartments = new HashSet<Subdepartment>();
    Set<Subdepartment> writableSubdepartments = new HashSet<Subdepartment>();
    
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments.addAll(country.getSubdepartments());
        writableSubdepartments = subdepartments;
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments.addAll(RightsItem.getSubdepartments(currentUser, Module.getByName("Planning Read"), country));
        writableSubdepartments.addAll(RightsItem.getSubdepartments(currentUser, Module.getByName("Planning Write"), country));
        subdepartments.addAll(writableSubdepartments);
    }

    List<OfficeDepartmentSubdepartment> describedSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : subdepartments) {
        describedSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());

    List<OfficeDepartmentSubdepartment> describedWritableSubdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
    for(Subdepartment subdepartment : writableSubdepartments) {
        describedWritableSubdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
    }
    Collections.sort(describedWritableSubdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
    
    Subdepartment selectedSubdepartment = currentUser.getSubdepartment();
    if(! subdepartments.contains(selectedSubdepartment)) {
        selectedSubdepartment = (Subdepartment)hs.get(Subdepartment.class, describedSubdepartments.get(0).getSubdepartmentId());
    }

    Boolean isWritable = false;
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        isWritable = true;
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        isWritable = RightsItem.isAvailable(selectedSubdepartment, currentUser, Module.getByName("Planning Write"));
    }
 
    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    PlanningLockSubdepartmentManager.Item item = planningLockSubdepartmentManager.findItem(selectedSubdepartment);
    ShortEmployee lockedBy = null;
    YearMonthDateTime lockedAt = null;
    if(item != null) {
        lockedBy = new ShortEmployee(item.getEmployee());
        lockedAt = new YearMonthDateTime(item.getLockedAt());
    }
    
    Calendar start = gson.fromJson(request.getParameter("start"), YearMonthDate.class).getCalendar();
    Calendar end = gson.fromJson(request.getParameter("end"), YearMonthDate.class).getCalendar();
    
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItems(selectedSubdepartment, start, end);   
    List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> describedCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItems(selectedSubdepartment, start, end);
    PlanningToolInfo planningToolInfo = new PlanningToolInfo(describedCarreerItems, describedPlanningItems, start, end);
    
    List<YearMonthDate> freedays = new LinkedList<YearMonthDate>();
    for(Freeday freeday : Freeday.getAllByCountryAndRange(country, start, end)) {
        freedays.add(new YearMonthDate(freeday.getDate()));
    }    
%>
    {
    "status": "OK",
    "subdepartments": <% gson.toJson(describedSubdepartments, out); %>,
    "writableSubdepartments": <% gson.toJson(describedWritableSubdepartments, out); %>,
    "isWritable": <% gson.toJson(isWritable, out); %>,
    <% if(item != null) { %>
    "lockedBy": <% gson.toJson(lockedBy, out); %>,
    "lockedAt": <% gson.toJson(lockedAt, out); %>,
    <% } %>
    "selectedSubdepartmentId": <%=selectedSubdepartment.getId() %>,
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>,
    "freedays": <% gson.toJson(freedays, out); %>
    }
    <%
} else if("getContent".equals(command)) {
    Country country = currentUser.getCountry();
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    Calendar start = gson.fromJson(request.getParameter("start"), YearMonthDate.class).getCalendar();
    Calendar end = gson.fromJson(request.getParameter("end"), YearMonthDate.class).getCalendar();

    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItems(subdepartment, start, end);   
    List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> describedCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItems(subdepartment, start, end);
    PlanningToolInfo planningToolInfo = new PlanningToolInfo(describedCarreerItems, describedPlanningItems, start, end);


    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    PlanningLockSubdepartmentManager.Item item = planningLockSubdepartmentManager.findItem(subdepartment);
    ShortEmployee lockedBy = null;
    YearMonthDateTime lockedAt = null;
    if(item != null) {
        lockedBy = new ShortEmployee(item.getEmployee());
        lockedAt = new YearMonthDateTime(item.getLockedAt());
    }
    Boolean isWritable = false;
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        isWritable = true;
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        isWritable = RightsItem.isAvailable(subdepartment, currentUser, Module.getByName("Planning Write"));
    }
    
    List<YearMonthDate> freedays = new LinkedList<YearMonthDate>();
    for(Freeday freeday : Freeday.getAllByCountryAndRange(country, start, end)) {
        freedays.add(new YearMonthDate(freeday.getDate()));
    }    
%>
    {
    "status": "OK",
    "isWritable": <% gson.toJson(isWritable, out); %>,
    <% if(item != null) { %>
    "lockedBy": <% gson.toJson(lockedBy, out); %>,
    "lockedAt": <% gson.toJson(lockedAt, out); %>,
    <% } %>    
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>,
    "freedays": <% gson.toJson(freedays, out); %>
    }
    <%
} else if("getEmployeeCarreerInfo".equals(command)) {
    List<Long> employeeIds = ListOfLong.getFromJson(request.getParameter("employeeIds")).getList();
    Calendar start = YearMonthDateForm.getFromJson(request.getParameter("start")).getYearMonthDate().getCalendar();
    Calendar end = YearMonthDateForm.getFromJson(request.getParameter("end")).getYearMonthDate().getCalendar();
    List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> describedCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItems(employeeIds, start, end);
    List<Long> notFoundIds = new LinkedList<Long>();
    for(Long employeeId : employeeIds) {
        boolean found = false;
        for(EmployeePositionHistoryItemUtils.DescribedCarreerItem item : describedCarreerItems) {
            if(employeeId.equals(item.getEmployee().getId())) {
                found = true;
                break;
            }
        }
        if(! found) {
            notFoundIds.add(employeeId);
        }
    }    
    for(Long employeeId : notFoundIds) {
        Employee employee = (Employee)hs.get(Employee.class, employeeId);
        describedCarreerItems.add(EmployeePositionHistoryItemUtils.DescribedCarreerItem.getDescribedCarreerItemWithoutCarreer(employee));
    }
    DescribedCarreersInfo describedCarreersInfo = new DescribedCarreersInfo();
    describedCarreersInfo.addDescribedCarreersItems(describedCarreerItems);
%>
    {
    "status": "OK", 
    "describedCarreersInfo": <% gson.toJson(describedCarreersInfo, out); %>
    }
    <%
} else if("setLock".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    Boolean lockStatus = Boolean.parseBoolean(request.getParameter("lockStatus"));
    Boolean currentLockStatus = Boolean.parseBoolean(request.getParameter("currentLockStatus"));
    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    PlanningLockSubdepartmentManager.Item item = planningLockSubdepartmentManager.findItem(subdepartment);
    Date now = new Date();
    if(item == null) {    
        if(Boolean.TRUE.equals(lockStatus)) {
            item = new PlanningLockSubdepartmentManager.Item();
            item.setEmployee(currentUser);
            item.setLockedAt(now);
            planningLockSubdepartmentManager.getItems().put(subdepartment, item);
        }        
    } else {       
        if(! Boolean.TRUE.equals(lockStatus)) {
            if(item.getEmployee().getId().equals(currentUser.getId())) {
                planningLockSubdepartmentManager.removeItem(subdepartment);
                item = null;
            } else if(Boolean.TRUE.equals(currentLockStatus)) {
                throw(new Exception("Currently locked by " + item.getEmployee().getFullName()));
            }
        } else {
            if(! item.getEmployee().getId().equals(currentUser.getId())) {
                if(Boolean.TRUE.equals(currentLockStatus)) {
                    item.setEmployee(currentUser);
                    item.setLockedAt(now);
                } else {
                    throw(new Exception("Currently locked by " + item.getEmployee().getFullName()));
                }
            }
        }
    }
    ShortEmployee lockedBy = null;
    YearMonthDateTime lockedAt = null;
    if(item != null) {
        lockedBy = new ShortEmployee(item.getEmployee());
        lockedAt = new YearMonthDateTime(item.getLockedAt());
    }
%>
    {
    "status": "OK",
    "lockedBy": <% gson.toJson(lockedBy, out); %>,
    "lockedAt": <% gson.toJson(lockedAt, out); %>
    }
    <%
} else if("savePlanningItems".equals(command)) {
    PlanningToolForm planningToolForm = PlanningToolForm.getFromJson(request.getParameter("planningToolForm"));
    Map<Long, Employee> employees = new HashMap<Long, Employee>();
    Map<Long, Subdepartment> subdepartments = new HashMap<Long, Subdepartment>();

    PlanningLockSubdepartmentManager planningLockSubdepartmentManager = PlanningLockSubdepartmentManager.getInstance();
    for(PlanningToolForm.PlanningItem planningToolItem : planningToolForm.getPlanningItems()) {
        PlanningItem planningItem = null;
        if(planningToolItem.getId() == null) {
            planningItem = new PlanningItem();
        } else {
            planningItem = (PlanningItem)hs.get(PlanningItem.class, planningToolItem.getId());
            if(PlanningToolForm.Status.DELETED.equals(planningToolItem.getStatus())) {
                hs.delete(planningItem);
                continue;
            }
        }
        
        planningItem.setDescription(planningToolItem.getDescription());
        planningItem.setLocation(planningToolItem.getLocation());
        planningItem.setStartDate(planningToolItem.getStartDate().getCalendar());
        planningItem.setEndDate(planningToolItem.getEndDate().getCalendar());
        
        
        Subdepartment targetSubdepartment = subdepartments.get(planningToolItem.getTargetSubdepartmentId());
        if(targetSubdepartment == null) {
            targetSubdepartment = (Subdepartment)hs.get(Subdepartment.class, planningToolItem.getTargetSubdepartmentId());
            subdepartments.put(planningToolItem.getTargetSubdepartmentId(), targetSubdepartment);
        }
        planningItem.setTargetSubdepartment(targetSubdepartment);
        
        PlanningLockSubdepartmentManager.Item item = planningLockSubdepartmentManager.findItem(targetSubdepartment);
        if(item == null || ! item.getEmployee().getId().equals(currentUser.getId())) {
            throw (new Exception("Subdepartment " + targetSubdepartment.getName() + " is not locked"));
        }
        
        Subdepartment sourceSubdepartment = subdepartments.get(planningToolItem.getSourceSubdepartmentId());
        if(sourceSubdepartment == null) {
            sourceSubdepartment = (Subdepartment)hs.get(Subdepartment.class, planningToolItem.getSourceSubdepartmentId());
            subdepartments.put(planningToolItem.getSourceSubdepartmentId(), sourceSubdepartment);
        }
        planningItem.setSourceSubdepartment(sourceSubdepartment);

        Employee employee = employees.get(planningToolItem.getEmployeeId());
        if(employee == null) {
            employee = (Employee)hs.get(Employee.class, planningToolItem.getEmployeeId());
            employees.put(planningToolItem.getEmployeeId(), employee);
        }
        planningItem.setEmployee(employee);
       
        hs.save(planningItem);
    }
%>
    {
    "status": "OK"
    }
<%    
} else if("getPlanningGroupInfo".equals(command)) {
    PlanningGroup planningGroup = (PlanningGroup)hs.get(PlanningGroup.class, new Long(request.getParameter("planningGroupId")));
    List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItemsByPlanningGroup(planningGroup);   
    PlanningToolInfo planningToolInfo = new PlanningToolInfo();
    planningToolInfo.addDescribedPlanningItems(describedPlanningItems);
%>
    {
    "status": "OK",
    "planningToolInfo": <% gson.toJson(planningToolInfo, out); %>
    }
<%     
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    %>
    { <% ex.printStackTrace(new PrintWriter(out)); %>
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
<%
}
%>