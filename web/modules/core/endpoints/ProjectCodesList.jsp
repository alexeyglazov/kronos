<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="java.io.PrintWriter"%>
<%@page import="java.io.PrintStream"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.LinkedList"%>
<%@page import="java.util.List"%>
<%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
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
Module module = Module.getByName("Code");

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
if("getProjectCodesList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = InvoiceRequestsFilter.getFromJson(request.getParameter("invoiceRequestsFilter"));
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    if(invoiceRequestsFilter.isUsed()) {
        List<Subdepartment> financialAllowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, Module.getByName("Financial Information") );
        //get intersection
        List<Subdepartment> tmpSubdepartments = new LinkedList<Subdepartment>();
        for(Subdepartment allowedSubdepartment : allowedSubdepartments) {
            for(Subdepartment financialAllowedSubdepartment : financialAllowedSubdepartments) {
                if(allowedSubdepartment.getId().equals(financialAllowedSubdepartment.getId())) {
                    tmpSubdepartments.add(allowedSubdepartment);
                    break;
                }
            }
        }
        allowedSubdepartments = tmpSubdepartments;
    }
    
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);


    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
    }<%
} else if("getSummary".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    ProjectCodeVO projectCodeVO = new ProjectCodeVO(projectCode);
    ClientVO clientVO = new ClientVO(projectCode.getClient());
    EmployeeWithoutPasswordVO inChargePersonVO = null;
    if(projectCode.getInChargePerson() != null) {
        inChargePersonVO = new EmployeeWithoutPasswordVO(projectCode.getInChargePerson());
    }
    EmployeeWithoutPasswordVO inChargePartnerVO = null;
    if(projectCode.getInChargePartner() != null) {
        inChargePartnerVO = new EmployeeWithoutPasswordVO(projectCode.getInChargePartner());
    }
    CurrencyVO currencyVO = null;
    List<FeesAdvanceVO> feesAdvanceVOs = new LinkedList<FeesAdvanceVO>();
    FeesItem feesItem = projectCode.getFeesItem() ;
    if(feesItem != null) {
        currencyVO = new CurrencyVO(feesItem.getFeesAdvanceCurrency());
        feesAdvanceVOs = FeesAdvanceVO.getList(new LinkedList<FeesAdvance>(feesItem.getFeesAdvances()));
    }
    %>{
    "status": "OK",
    "projectCode": <% gson.toJson(projectCodeVO, out); %>,
    "client": <% gson.toJson(clientVO, out); %>,
    <% if(currencyVO != null) { %>
        "currency": <% gson.toJson(currencyVO, out); %>,
    <% } else { %>
        "currency": null,
    <% } %>
    <% if(inChargePersonVO != null) { %>
        "inChargePerson": <% gson.toJson(inChargePersonVO, out); %>,
    <% } else { %>
        "inChargePerson": null,
    <% } %>
    <% if(inChargePartnerVO != null) { %>
        "inChargePartner": <% gson.toJson(inChargePartnerVO, out); %>,
    <% } else { %>
        "inChargePartner": null,
    <% } %>
    "feesAdvances": <% gson.toJson(feesAdvanceVOs, out); %>
    }<%    
} else if("doBatchUpdate".equals(command)) {
    Date now = new Date();
    ProjectCodeListBatchUpdate projectCodeListBatchUpdate = ProjectCodeListBatchUpdate.getFromJson(request.getParameter("batch"));
    for(Long projectCodeId : projectCodeListBatchUpdate.getProjectCodeIds()) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, projectCodeId);
        if(ProjectCodeListBatchUpdate.Action.SET_CLOSED.equals(projectCodeListBatchUpdate.getAction()) && ! projectCode.getIsClosed()) {
            if(! Boolean.TRUE.equals(projectCode.getIsClosed())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setClosedBy(currentUser);
            projectCode.setClosedAt(now);
            projectCode.setIsClosed(true);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_NON_CLOSED.equals(projectCodeListBatchUpdate.getAction()) && projectCode.getIsClosed()) {
            if(! Boolean.FALSE.equals(projectCode.getIsClosed())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setClosedBy(null);
            projectCode.setClosedAt(null);
            projectCode.setIsClosed(false);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_FUTURE.equals(projectCodeListBatchUpdate.getAction()) && ! projectCode.getIsFuture()) {
            projectCode.setIsFuture(true);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_NON_FUTURE.equals(projectCodeListBatchUpdate.getAction()) && projectCode.getIsFuture()) {
            projectCode.setIsFuture(false);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_DEAD.equals(projectCodeListBatchUpdate.getAction()) && ! projectCode.getIsDead()) {
            if(! Boolean.TRUE.equals(projectCode.getIsDead())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setIsDead(true);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_NON_DEAD.equals(projectCodeListBatchUpdate.getAction()) && projectCode.getIsDead()) {
            if(! Boolean.FALSE.equals(projectCode.getIsClosed())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setIsDead(false);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_HIDDEN.equals(projectCodeListBatchUpdate.getAction()) && ! projectCode.getIsHidden()) {
            if(! Boolean.TRUE.equals(projectCode.getIsHidden())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setIsHidden(true);
            hs.save(projectCode);
        } else if(ProjectCodeListBatchUpdate.Action.SET_NON_HIDDEN.equals(projectCodeListBatchUpdate.getAction()) && projectCode.getIsHidden()) {
            if(! Boolean.FALSE.equals(projectCode.getIsHidden())) {
                projectCode.setModifiedAt(new Date());
            }
            projectCode.setIsHidden(false);
            hs.save(projectCode);
        }
    }
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkProjectCodeDependencies".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    %>{
    "status": "OK",
    "timeSpentItems": <%=projectCode.getTimeSpentItems().size() %>,
    "feesItem": <%=projectCode.getFeesItem() != null %>,
    "outOfPocketItem": <%=projectCode.getOutOfPocketItem() != null %>,
    "agreement": <%=projectCode.getAgreement() != null %>,
    "invoiceRequestPackets": <%=projectCode.getInvoiceRequestPackets().size() %>
    }<%
} else if("deleteProjectCode".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    for(ProjectCodeConflict projectCodeConflict : projectCode.getProjectCodeConflicts()) {
        for(ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem : projectCodeConflict.getProjectCodeConflictHistoryItems()) {
            hs.delete(projectCodeConflictHistoryItem);
        }
        hs.delete(projectCodeConflict);
    }
    hs.delete(projectCode);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkSetDeadBatchUpdate".equals(command)) {
    List<Long> projectCodeIds = ListOfLong.getFromJson(request.getParameter("projectCodeIds")).getList();
    List<ProjectCodeVO> timeSheetedProjectCodes = new LinkedList<ProjectCodeVO>();
    for(Long projectCodeId : projectCodeIds) {
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, projectCodeId);
        if(! projectCode.getTimeSpentItems().isEmpty()) {
            timeSheetedProjectCodes.add(new ProjectCodeVO(projectCode));
        }
    }
    %>{
    "status": "OK",
    "timeSheetedProjectCodes": <% gson.toJson(timeSheetedProjectCodes, out); %>
    }<%
} else if("getProjectCode".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("id")));
    Employee inChargePerson = projectCode.getInChargePerson();
    %>
    {
    "status": "OK",
    <% if(inChargePerson != null) { %>
    "inChargePerson": <% gson.toJson(new EmployeeWithoutPasswordVO(inChargePerson), out); %>,
    <% } %>
    "projectCode": <% gson.toJson(new ProjectCodeVO(projectCode), out); %>
    }
    <%
}
hs.getTransaction().commit();

} catch (Exception ex) {
    hs.getTransaction().rollback();
    ex.printStackTrace(new PrintWriter(out));
    %>
    {
        "status": "FAIL",
        "comment": <% gson.toJson(ex.toString(), out); %>
    }
    <%
}
%>