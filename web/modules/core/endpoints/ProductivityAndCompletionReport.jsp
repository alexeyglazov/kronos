<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%>
<%@page import="java.io.PrintWriter"%>
<%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.reports.*"
    import="com.mazars.management.reports.vo.*"
    import="com.mazars.management.reports.excel.*"
    import="java.text.SimpleDateFormat"
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
Module module = Module.getByName("Timesheets Report");

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
       List<Office> offices = new LinkedList<Office>();
       if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            offices = RightsItem.getOffices(currentUser, module);
       } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            offices = new LinkedList(currentUser.getCountry().getOffices());
       }
       Collections.sort(offices, new OfficeComparator());
       List<OfficeVO> officeVOs = OfficeVO.getList(offices);
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>
}
<% } else if("getOfficeContent".equals(command)) {
       Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
       List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
       List<Department> departments = new LinkedList<Department>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           departments.addAll(office.getDepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           departments = RightsItem.getDepartments(currentUser, module, office);
       }
       Collections.sort(departments, new DepartmentComparator());
       for(Department department : departments) {
           departmentVOs.add(new DepartmentVO(department));
       }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
       Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
       List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
       List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
       if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
           subdepartments.addAll(department.getSubdepartments());
       } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
           subdepartments = RightsItem.getSubdepartments(currentUser, module, department);
       }
       Collections.sort(subdepartments, new SubdepartmentComparator());
       for(Subdepartment subdepartment : subdepartments) {
           subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
       }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>
}
<%
} else if("generateReport".equals(command)) {
    ProductivityAndCompletionReportForm productivityAndCompletionReportForm = ProductivityAndCompletionReportForm.getFromJson(request.getParameter("productivityAndCompletionReportForm"));
    Subdepartment subdepartment = null;
    Department department = null;
    Office office = null;
    if(productivityAndCompletionReportForm.getSubdepartmentId() != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(productivityAndCompletionReportForm.getSubdepartmentId()));
    } 
    if(productivityAndCompletionReportForm.getDepartmentId() != null) {
        department = (Department)hs.get(Department.class, new Long(productivityAndCompletionReportForm.getDepartmentId()));
    }
    if(productivityAndCompletionReportForm.getOfficeId() != null) {
        office = (Office)hs.get(Office.class, new Long(productivityAndCompletionReportForm.getOfficeId()));
    }
    List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(office, department, subdepartment, currentUser, module);

    Collections.sort(subdepartments, new SubdepartmentComparator());
    Calendar startDate = productivityAndCompletionReportForm.getStartDate().getCalendar();
    Calendar endDate = productivityAndCompletionReportForm.getEndDate().getCalendar();
    ProductivityAndCompletionReport productivityAndCompletionReport = new ProductivityAndCompletionReport(startDate, endDate, subdepartments, currentUser);
    productivityAndCompletionReport.build();
    ProductivityAndCompletionReportVO productivityAndCompletionReportVO = new ProductivityAndCompletionReportVO(productivityAndCompletionReport);
    %>
    {
        "status": "OK",
        "report": <% gson.toJson(productivityAndCompletionReportVO, out); %>
    }
    <%
} else if("generateXLSReport".equals(command)) {
    ProductivityAndCompletionReportForm productivityAndCompletionReportForm = ProductivityAndCompletionReportForm.getFromJson(request.getParameter("productivityAndCompletionReportForm"));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    String officeCodeName = "ALL";
    String departmentCodeName = "ALL";
    String subdepartmentCodeName = "ALL";
    if(productivityAndCompletionReportForm.getSubdepartmentId() != null) {
        Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(productivityAndCompletionReportForm.getSubdepartmentId()));
        Department department = subdepartment.getDepartment();
        Office office = department.getOffice();
        subdepartments.add(subdepartment);
        subdepartmentCodeName = subdepartment.getCodeName();
        departmentCodeName = department.getCodeName();
        officeCodeName = office.getCodeName();
    } else if(productivityAndCompletionReportForm.getDepartmentId() != null) {
        Department department = (Department)hs.get(Department.class, new Long(productivityAndCompletionReportForm.getDepartmentId()));
        Office office = department.getOffice();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(department.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, department));
        }
        departmentCodeName = department.getCodeName();
        officeCodeName = office.getCodeName();
    } else if(productivityAndCompletionReportForm.getOfficeId() != null) {
        Office office = (Office)hs.get(Office.class, new Long(productivityAndCompletionReportForm.getOfficeId()));
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(office.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, office));
        }
        officeCodeName = office.getCodeName();
    } else {
        Country country = currentUser.getCountry();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(country.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, country));
        }
    }

    if(subdepartments.isEmpty()) {
        %>
        {
            "status": "FAIL",
            "comment": "No subdepartments for given selection"
        }
        <%
        return;
    }
    Collections.sort(subdepartments, new SubdepartmentComparator());
    Calendar startDate = productivityAndCompletionReportForm.getStartDate().getCalendar();
    Calendar endDate = productivityAndCompletionReportForm.getEndDate().getCalendar();
    ProductivityAndCompletionReport productivityAndCompletionReport = new ProductivityAndCompletionReport(startDate, endDate, subdepartments, currentUser);
    productivityAndCompletionReport.build();

    SimpleDateFormat dateFormatterShort = new SimpleDateFormat("ddMMyyyy");
    SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");
    String fileName = "PaC_" + officeCodeName + "_" + departmentCodeName + "_" + subdepartmentCodeName + "_";
    fileName += dateFormatterShort.format(productivityAndCompletionReportForm.getStartDate().getCalendar().getTime());
    fileName += "_";
    fileName += dateFormatterShort.format(productivityAndCompletionReportForm.getEndDate().getCalendar().getTime());
    fileName += "_";
    fileName += dateFormatterLong.format(productivityAndCompletionReport.getCreatedAt());
    fileName += ".xls";

    response.setContentType("application/vnd.ms-excel");
    response.setHeader("content-disposition", "filename=" + fileName);
    ProductivityAndCompletionReportExcelBuilder reb = new ProductivityAndCompletionReportExcelBuilder(productivityAndCompletionReport, response.getOutputStream());
    reb.createWorkbook();
    reb.fillWorkbook();
    reb.writeWorkbook();
} else if("notifyAboutCompletion".equals(command)) {
    List<Long> employeeIds = ListOfLong.getFromJson(request.getParameter("employeeIds")).getList();
    String comment = request.getParameter("comment");
    String commentColor = request.getParameter("commentColor");
    ProductivityAndCompletionReportForm productivityAndCompletionReportForm = ProductivityAndCompletionReportForm.getFromJson(request.getParameter("productivityAndCompletionReportForm"));

    Subdepartment subdepartment = null;
    Department department = null;
    Office office = null;
    if(productivityAndCompletionReportForm.getSubdepartmentId() != null) {
        subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(productivityAndCompletionReportForm.getSubdepartmentId()));
    } 
    if(productivityAndCompletionReportForm.getDepartmentId() != null) {
        department = (Department)hs.get(Department.class, new Long(productivityAndCompletionReportForm.getDepartmentId()));
    }
    if(productivityAndCompletionReportForm.getOfficeId() != null) {
        office = (Office)hs.get(Office.class, new Long(productivityAndCompletionReportForm.getOfficeId()));
    }
    List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(office, department, subdepartment, currentUser, module);

    Collections.sort(subdepartments, new SubdepartmentComparator());
    Calendar startDate = productivityAndCompletionReportForm.getStartDate().getCalendar();
    Calendar endDate = productivityAndCompletionReportForm.getEndDate().getCalendar();
    ProductivityAndCompletionReport productivityAndCompletionReport = new ProductivityAndCompletionReport(startDate, endDate, subdepartments, currentUser);
    productivityAndCompletionReport.build();
    
    List<String> passedEmails = new LinkedList<String>();
    List<String> failedEmails = new LinkedList<String>();
    for(Long employeeId : employeeIds) {
        Employee employee = (Employee)hs.get(Employee.class, employeeId);
        javax.mail.Session mailSession = MailUtils.getSession();
        try {
            String mailContent = MailUtils.getCompletionNotificationMailContent(employee, currentUser, productivityAndCompletionReport, comment, commentColor);
            MailUtils.sendCompletionNotificationMessage(mailSession, mailContent, employee.getEmail(), currentUser.getEmail());
            passedEmails.add(employee.getEmail());
        } catch(Exception mailEx) {
            failedEmails.add(employee.getEmail());
        %><% mailEx.printStackTrace(new PrintWriter(out)); %><%
        }
    }
    %>
    {
        "status": "OK",
        "passedEmails": <% gson.toJson(passedEmails, out); %>,
        "failedEmails": <% gson.toJson(failedEmails, out); %>
    }<%    
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
