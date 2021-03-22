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
    import="com.mazars.management.web.vo.*"
    import="com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator"
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

if("getInitialContent".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    List<ExtendedEmployeePositionHistoryItemVO> employeePositionHistoryItemVOs = new LinkedList<ExtendedEmployeePositionHistoryItemVO>();
    List<LeavesItemVO> leavesItemVOs = new LinkedList<LeavesItemVO>();
    if(employee != null) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getEmployeePositionHistoryItems(employee);
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
            employeePositionHistoryItemVOs.add(new ExtendedEmployeePositionHistoryItemVO(employeePositionHistoryItem));
        }
        for(LeavesItem leavesItem : LeavesItem.getSortedLeavesItems(employee) ) {
            leavesItemVOs.add(new LeavesItemVO(leavesItem));
        }
    }
    %>
    {
    "status": "OK",
    "employee": <% gson.toJson(new EmployeeWithoutPasswordVO(employee), out); %>,
    "employeePositionHistoryItems": <% gson.toJson(employeePositionHistoryItemVOs, out); %>,
    "leavesItems": <% gson.toJson(leavesItemVOs, out); %>
    }
    <%
} else if("getExtendedPosition".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
    %>
    {
    "status": "OK",
    "extendedPosition": <% gson.toJson(new ExtendedPositionVO(position), out); %>
    }
    <%
} else if("saveCarreer".equals(command)) {
    CarreerEditForm carreerEditForm = CarreerEditForm.getFromJson(request.getParameter("carreerEditForm"));
    Employee employee = (Employee)hs.get(Employee.class, carreerEditForm.getEmployeeId());
    Set<EmployeePositionHistoryItem> employeePositionHistoryItems = employee.getEmployeePositionHistoryItems();
    for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
        boolean toBeDeleted = true;
        for(CarreerEditForm.EmployeePositionHistoryItem item : carreerEditForm.getEmployeePositionHistoryItems()) {
            if(employeePositionHistoryItem.getId().equals(item.getId()) ) {
                toBeDeleted = false;
                break;
            }
        }
        if(toBeDeleted) {
            hs.delete(employeePositionHistoryItem);
        }
    }
    for(CarreerEditForm.EmployeePositionHistoryItem item : carreerEditForm.getEmployeePositionHistoryItems()) {
        if(item.getId() == null) {
            Position position = (Position)hs.get(Position.class, item.getPositionId());
            EmployeePositionHistoryItem employeePositionHistoryItem = new EmployeePositionHistoryItem();
            employeePositionHistoryItem.setEmployee(employee);
            employeePositionHistoryItem.setPosition(position);
            if(item.getStart() != null) {
                employeePositionHistoryItem.setStart(item.getStart().getCalendar());
            }
            if(item.getEnd() != null) {
                employeePositionHistoryItem.setEnd(item.getEnd().getCalendar());
            }
            employeePositionHistoryItem.setContractType(item.getContractType());
            if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(item.getContractType())) {
                employeePositionHistoryItem.setPartTimePercentage(item.getPartTimePercentage());
            } else {
                employeePositionHistoryItem.setPartTimePercentage(null);
            }
            hs.save(employeePositionHistoryItem);
        } else {
            for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
                if(employeePositionHistoryItem.getId().equals(item.getId()) ) {
                        Position position = (Position)hs.get(Position.class, item.getPositionId());
                        employeePositionHistoryItem.setPosition(position);
                        if(item.getStart() != null) {
                            employeePositionHistoryItem.setStart(item.getStart().getCalendar());
                        } else {
                            employeePositionHistoryItem.setStart(null);
                        }
                        if(item.getEnd() != null) {
                            employeePositionHistoryItem.setEnd(item.getEnd().getCalendar());
                        } else {
                            employeePositionHistoryItem.setEnd(null);
                        }
                        employeePositionHistoryItem.setContractType(item.getContractType());
                        if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(item.getContractType())) {
                            employeePositionHistoryItem.setPartTimePercentage(item.getPartTimePercentage());
                        } else {
                            employeePositionHistoryItem.setPartTimePercentage(null);
                        }
                        hs.save(employeePositionHistoryItem);
                }
            }
        }
    }
    EmployeePositionHistoryItem employeePositionHistoryItemLatest = EmployeePositionHistoryItem.getLatestEmployeePositionHistoryItem(employee);
    if(! employeePositionHistoryItemLatest.getPosition().getId().equals(employee.getPosition().getId())) {
        employee.setPosition(employeePositionHistoryItemLatest.getPosition());
        hs.save(employee);
    }
    
    Set<LeavesItem> leavesItems = employee.getLeavesItems();
    for(LeavesItem leavesItem : leavesItems) {
        boolean toBeDeleted = true;
        for(CarreerEditForm.LeavesItem item : carreerEditForm.getLeavesItems()) {
            if(leavesItem.getId().equals(item.getId()) ) {
                toBeDeleted = false;
                break;
            }
        }
        if(toBeDeleted) {
            hs.delete(leavesItem);
        }
    }
    for(CarreerEditForm.LeavesItem item : carreerEditForm.getLeavesItems()) {
        if(item.getId() == null) {
            LeavesItem leavesItem = new LeavesItem();
            leavesItem.setEmployee(employee);
            leavesItem.setType(item.getType());
            if(item.getStart() != null) {
                leavesItem.setStart(item.getStart().getCalendar());
            }
            if(item.getEnd() != null) {
                leavesItem.setEnd(item.getEnd().getCalendar());
            }
            hs.save(leavesItem);
        } else {
            for(LeavesItem leavesItem : leavesItems) {
                if(leavesItem.getId().equals(item.getId()) ) {
                        leavesItem.setType(item.getType());
                        if(item.getStart() != null) {
                            leavesItem.setStart(item.getStart().getCalendar());
                        }
                        if(item.getEnd() != null) {
                            leavesItem.setEnd(item.getEnd().getCalendar());
                        }
                        hs.save(leavesItem);
                }
            }
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