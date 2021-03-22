<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.db.util.ProjectCodeConflictUtil"%>
<%@page import="com.mazars.management.web.vo.ConflictCheckBlock"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.web.vo.StandardSellingRateBlockVO"%>
<%@page import="com.mazars.management.db.comparators.ActRequestComparator"%>
<%@page import="com.mazars.management.web.vo.ActRequestWithItemsVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestWithItemsVO"%>
<%@page import="com.mazars.management.db.comparators.InvoiceRequestComparator"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestWithItemsVO"%>
<%@page import="com.mazars.management.db.util.ProjectCodeListUtil"%>
<%@page import="com.mazars.management.db.comparators.PositionQuotationComparator"%>
<%@page import="com.mazars.management.web.comparators.PositionWithStandardPositionComparator"%>
<%@page import="com.mazars.management.web.vo.PositionWithStandardPositionVO"%>
<%@page import="com.mazars.management.db.comparators.OutOfPocketActComparator"%>
<%@page import="com.mazars.management.db.comparators.FeesActComparator"%>
<%@page import="java.util.Map"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Collections"
    import="java.util.Locale"
    import="java.util.HashMap"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.security.AccessChecker"
    import="com.mazars.management.db.comparators.ClientComparator"
    import="com.mazars.management.db.comparators.ProjectCodeComparator"
    import="com.mazars.management.db.comparators.StandardPositionComparator"
    import="com.mazars.management.db.comparators.CurrencyComparator"
    import="com.mazars.management.db.comparators.OutOfPocketPaymentComparator"
    import="com.mazars.management.db.comparators.OutOfPocketInvoiceComparator"
    import="com.mazars.management.db.comparators.FeesPaymentComparator"
    import="com.mazars.management.db.comparators.FeesInvoiceComparator"
    import="com.mazars.management.db.comparators.FeesAdvanceComparator" 
%>
<%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Conflict Check");

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
if("getProjectCodeList".equals(command)) {
    ProjectCodeListFilter filter = ProjectCodeListFilter.getFromJson(request.getParameter("filter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));
    Boolean searchConflictsOnly = Boolean.parseBoolean(request.getParameter("searchConflictsOnly"));
    List<Subdepartment> allowedSubdepartments = new LinkedList<Subdepartment>();    
    List<Subdepartment> conflictCheckingSubdepartments = new LinkedList<Subdepartment>();
    if(Boolean.TRUE.equals(searchConflictsOnly)) {
        allowedSubdepartments = currentUser.getCountry().getSubdepartments();    
        conflictCheckingSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    } else {
        conflictCheckingSubdepartments = null;   
        allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
    }
    Long count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments, conflictCheckingSubdepartments);
    List<ProjectCode> projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments, conflictCheckingSubdepartments);
    List<ProjectCodeVO> projectCodeVOs = ProjectCodeVO.getList(projectCodes);
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
    }<%
} else if("getProjectCodeContent".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
    ConflictCheckBlock conflictCheckBlock = new ConflictCheckBlock(projectCode);
%>
{
"status": "OK",
"conflictCheckBlock": <% gson.toJson(conflictCheckBlock, out); %>
}
<%
} else if("detectProjectCodeConflicts".equals(command)) {
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
    List<Subdepartment> currentConflictSubdepartments = new LinkedList<Subdepartment>();
    for(ProjectCodeConflict projectCodeConflict : projectCode.getProjectCodeConflicts()) {
        currentConflictSubdepartments.add(projectCodeConflict.getCheckingSubdepartment());
    }
    List<Subdepartment> checkingSubdepartments = ProjectCodeConflictUtil.detectConflicts(projectCode);
    checkingSubdepartments.removeAll(currentConflictSubdepartments);

    List<ProjectCodeConflict> projectCodeConflicts = new LinkedList<ProjectCodeConflict>();
    if(! checkingSubdepartments.isEmpty()) {
        projectCodeConflicts = ProjectCodeConflictUtil.createProjectCodeConflicts(projectCode, checkingSubdepartments, currentUser);
    }
    for(ProjectCodeConflict projectCodeConflict : projectCodeConflicts) {
        hs.save(projectCodeConflict);
        ProjectCodeConflictHistoryItem projectCodeConflictHistoryItem = ProjectCodeConflictHistoryItem.getInitialProjectCodeConflictHistoryItem(projectCodeConflict);
        projectCodeConflictHistoryItem.setComment("Conflict was detected when double-check was launched");
        hs.save(projectCodeConflictHistoryItem);
    } 
    if(! projectCodeConflicts.isEmpty()) {
        projectCode.getProjectCodeConflicts().addAll(projectCodeConflicts);
        ProjectCodeConflict.Status conflictStatus = ProjectCodeConflict.calculateConflictStatus(projectCode);
        projectCode.setConflictStatus(conflictStatus);
        hs.save(projectCode);
    }    
%>
{
"status": "OK",
"projectCodeConflictsCount": <%=projectCodeConflicts.size() %>
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
