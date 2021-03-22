<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="com.mazars.management.reports.vo.CodeDetailReportVO"%>
<%@page import="com.mazars.management.reports.CodeDetailReport"%>
<%@page import="com.mazars.management.web.vo.ConciseEmployee"%>
<%@page import="com.mazars.management.db.comparators.YearMonthComparator"%>
<%@page import="java.util.Date"%>
<%@page import="com.mazars.management.web.vo.ProjectCodeApprovementBlock"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketWithDataVO"%>
<%@page import="com.mazars.management.web.vo.InvoiceRequestPacketWithDataVO"%>
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
Module module = Module.getByName("Code Report");

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
    ProjectCodeApprovementFilter projectCodeApprovementFilter = ProjectCodeApprovementFilter.getFromJson(request.getParameter("projectCodeApprovementFilter"));
    InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
    ProjectCodeListSorter sorter = ProjectCodeListSorter.getFromJson(request.getParameter("sorter"));
    ProjectCodeListLimiter limiter = ProjectCodeListLimiter.getFromJson(request.getParameter("limiter"));

    List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);

    Long count = new Long(0);
    List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    if(! projectCodeApprovementFilter.isUsed()) {
        count = ProjectCodeListUtil.getCountOfProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    } else {
        ProjectCodeListLimiter totalLimiter = new ProjectCodeListLimiter();
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, totalLimiter, allowedSubdepartments);
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodes, projectCodeApprovementFilter);
        count = new Long(projectCodes.size());
        int fromIndex = limiter.getItemsPerPage() * limiter.getPage();
        int toIndex = fromIndex + limiter.getItemsPerPage();
        if(toIndex > projectCodes.size()) {
            toIndex = projectCodes.size();
        }
        projectCodes = projectCodes.subList(fromIndex, toIndex);
    }
    List<ProjectCodeVODetailed> projectCodeVOs = new LinkedList<ProjectCodeVODetailed>();
    for(ProjectCode projectCode : projectCodes) {
        projectCodeVOs.add(new ProjectCodeVODetailed(projectCode));
    }
    %>{
    "status": "OK",
    "count": <%=count %>,
    "projectCodes": <% gson.toJson(projectCodeVOs, out); %>
    }<%
} else if("getProjectCodeContent".equals(command)) {
        StandardPosition standardPosition = currentUser.getPosition().getStandardPosition();
        StandardPositionVO standardPositionVO = new StandardPositionVO(standardPosition);
        ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(request.getParameter("projectCodeId")));
        Country country = projectCode.getSubdepartment().getDepartment().getOffice().getCountry();
        List<YearMonth> months = TimeSpentItem.getReportedMonths(projectCode);
        Collections.sort(months, new YearMonthComparator());
        ProjectCodeApprovementBlock projectCodeApprovementBlock = new ProjectCodeApprovementBlock();
        projectCodeApprovementBlock.setProjectCode(new ProjectCodeVO(projectCode));
        if(projectCode.getCreatedBy() != null) {
            projectCodeApprovementBlock.setCreatedBy(new ConciseEmployee(projectCode.getCreatedBy()));
        }
        if(projectCode.getInChargePerson()!= null) {
            projectCodeApprovementBlock.setInChargePerson(new ConciseEmployee(projectCode.getInChargePerson()));
        }
        if(projectCode.getInChargePartner()!= null) {
            projectCodeApprovementBlock.setInChargePartner(new ConciseEmployee(projectCode.getInChargePartner()));
        }
        if(projectCode.getClosedBy() != null) {
            projectCodeApprovementBlock.setClosedBy(new ConciseEmployee(projectCode.getClosedBy()));
        }
        for(YearMonth month : months) {
             ProjectCodeApprovementBlock.Item item = new ProjectCodeApprovementBlock.Item();
             item.setMonth(month);
             Boolean isClosed = ClosedMonth.isMonthClosed(country, month.getYear(), month.getMonth());
             item.setIsClosed(isClosed);
             Date lastModifiedAt = TimeSpentItem.getLastModifiedAt(projectCode, month);
             if(lastModifiedAt != null) {
                 item.setLastModifiedAt(new YearMonthDateTime(lastModifiedAt));
             }
             Long timeSpent = TimeSpentItem.getTimeSpent(projectCode, month);
             if(timeSpent != null) {
                 item.setTimeSpent(timeSpent);
             }
             projectCodeApprovementBlock.getItems().add(item);
        }
        
        for(ProjectCodeApprovement projectCodeApprovement : projectCode.getProjectCodeApprovements()) {
            YearMonth month = new YearMonth(projectCodeApprovement.getYear(), projectCodeApprovement.getMonth());
            ProjectCodeApprovementBlock.Item item = null;
            for(ProjectCodeApprovementBlock.Item tmpItem : projectCodeApprovementBlock.getItems()) {
                if(tmpItem.getMonth().equals(month)) {
                    item = tmpItem;
                    break;
                }
            }
            if(item == null) {
                item = new ProjectCodeApprovementBlock.Item();
                projectCodeApprovementBlock.getItems().add(item);
                item.setMonth(month);
                Boolean isClosed = ClosedMonth.isMonthClosed(country, month.getYear(), month.getMonth());
                item.setIsClosed(isClosed);
            }
            if(projectCodeApprovement.getPrimaryApprovedBy() != null) {
                item.setPrimaryApprovedBy(new ConciseEmployee(projectCodeApprovement.getPrimaryApprovedBy()));
            }
            if(projectCodeApprovement.getPrimaryApprovedAt() != null) {
                item.setPrimaryApprovedAt(new YearMonthDateTime(projectCodeApprovement.getPrimaryApprovedAt()));
            }
            if(projectCodeApprovement.getSecondaryApprovedBy() != null) {
                item.setSecondaryApprovedBy(new ConciseEmployee(projectCodeApprovement.getSecondaryApprovedBy()));
            }
            if(projectCodeApprovement.getSecondaryApprovedAt() != null) {
                item.setSecondaryApprovedAt(new YearMonthDateTime(projectCodeApprovement.getSecondaryApprovedAt()));
            }
        }
%>
{
"status": "OK",
"standardPosition": <% gson.toJson(standardPositionVO, out); %>,
"projectCodeApprovementBlock": <% gson.toJson(projectCodeApprovementBlock, out); %>
}
<%
} else if("getTimesheet".equals(command)) {
    CodeDetailReportForm codeDetailReportForm = CodeDetailReportForm.getFromJson(request.getParameter("codeDetailReportForm"));
    CodeDetailReport codeDetailReport = new CodeDetailReport(codeDetailReportForm, module, currentUser);
    codeDetailReport.build();
    CodeDetailReportVO codeDetailReportVO = new CodeDetailReportVO(codeDetailReport);    
%>
{
"status": "OK",
"codeDetailReport": <% gson.toJson(codeDetailReportVO, out); %>
}
<%    
} else if("applyApprovementAction".equals(command)) {
    ProjectCodeApprovementForm projectCodeApprovementForm = ProjectCodeApprovementForm.getFromJson(request.getParameter("projectCodeApprovementForm"));
    ProjectCode projectCode = (ProjectCode)hs.get(ProjectCode.class, projectCodeApprovementForm.getProjectCodeId());
    if(projectCode.getIsClosed()) {
        throw new Exception(projectCode.getCode() + " is closed");
    }
    List<ProjectCodeApprovement> foundProjectCodeApprovements = new LinkedList<ProjectCodeApprovement>();
    List<YearMonth> notFoundMonths = new LinkedList<YearMonth>();
    for(YearMonth month : projectCodeApprovementForm.getMonths()) {
        boolean isFound = false;
        for(ProjectCodeApprovement projectCodeApprovement : projectCode.getProjectCodeApprovements()) {
            if(month.getYear().equals(projectCodeApprovement.getYear()) && month.getMonth().equals(projectCodeApprovement.getMonth())) {
                foundProjectCodeApprovements.add(projectCodeApprovement);
                isFound = true;
                break;
            }
        }
        if(! isFound) {
            notFoundMonths.add(month);
        }
    }
    Date now = new Date();
    
    if(ProjectCodeApprovementForm.ApprovementAction.SET_PRIMARY_APPROVEMENT.equals(projectCodeApprovementForm.getApprovementAction())) {
        List<ProjectCodeApprovement> projectCodeApprovements = new LinkedList<ProjectCodeApprovement>(foundProjectCodeApprovements);
        for(YearMonth month : notFoundMonths) {
            ProjectCodeApprovement projectCodeApprovement = new ProjectCodeApprovement();
            projectCodeApprovement.setProjectCode(projectCode);
            projectCodeApprovement.setYear(month.getYear());
            projectCodeApprovement.setMonth(month.getMonth());
            
            projectCodeApprovement.setIsSecondaryApproved(false);
            projectCodeApprovement.setSecondaryApprovedAt(null);
            projectCodeApprovement.setSecondaryApprovedBy(null);
            
            projectCodeApprovements.add(projectCodeApprovement);
        }
        for(ProjectCodeApprovement projectCodeApprovement : projectCodeApprovements) {
            projectCodeApprovement.setIsPrimaryApproved(true);
            projectCodeApprovement.setPrimaryApprovedAt(now);
            projectCodeApprovement.setPrimaryApprovedBy(currentUser);
            hs.save(projectCodeApprovement);
        }    
    } else if(ProjectCodeApprovementForm.ApprovementAction.UNSET_PRIMARY_APPROVEMENT.equals(projectCodeApprovementForm.getApprovementAction())) {
        for(ProjectCodeApprovement projectCodeApprovement : foundProjectCodeApprovements) {
            hs.delete(projectCodeApprovement);
        }    
    } else if(ProjectCodeApprovementForm.ApprovementAction.SET_SECONDARY_APPROVEMENT.equals(projectCodeApprovementForm.getApprovementAction())) {
        List<ProjectCodeApprovement> projectCodeApprovements = new LinkedList<ProjectCodeApprovement>(foundProjectCodeApprovements);
        for(YearMonth month : notFoundMonths) {
            ProjectCodeApprovement projectCodeApprovement = new ProjectCodeApprovement();
            projectCodeApprovement.setProjectCode(projectCode);
            projectCodeApprovement.setYear(month.getYear());
            projectCodeApprovement.setMonth(month.getMonth());
            
            projectCodeApprovement.setIsPrimaryApproved(true);
            projectCodeApprovement.setPrimaryApprovedAt(now);
            projectCodeApprovement.setPrimaryApprovedBy(currentUser);
            
            projectCodeApprovements.add(projectCodeApprovement);
        }
        for(ProjectCodeApprovement projectCodeApprovement : projectCodeApprovements) {
            projectCodeApprovement.setIsSecondaryApproved(true);
            projectCodeApprovement.setSecondaryApprovedAt(now);
            projectCodeApprovement.setSecondaryApprovedBy(currentUser);
            hs.save(projectCodeApprovement);
        }    
    
    } else if(ProjectCodeApprovementForm.ApprovementAction.UNSET_SECONDARY_APPROVEMENT.equals(projectCodeApprovementForm.getApprovementAction())) {
        for(ProjectCodeApprovement projectCodeApprovement : foundProjectCodeApprovements) {
            projectCodeApprovement.setIsSecondaryApproved(false);
            projectCodeApprovement.setSecondaryApprovedAt(null);
            projectCodeApprovement.setSecondaryApprovedBy(null);
            hs.save(projectCodeApprovement);
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
