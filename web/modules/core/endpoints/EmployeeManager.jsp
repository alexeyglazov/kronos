<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="javax.mail.PasswordAuthentication"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.db.comparators.LeavesItemComparator"%>
<%@page import="com.mazars.management.db.comparators.PositionComparator"%>
<%@page import="com.mazars.management.db.comparators.SubdepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.DepartmentComparator"%>
<%@page import="com.mazars.management.db.comparators.EmployeeComparator"%>
<%@page import="com.mazars.management.db.comparators.OfficeComparator"%>
<%@page import="javax.mail.Authenticator"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.*"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="com.mazars.management.security.PasswordUtil"
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
        List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
        List<EmployeeWithExtendedPositionVO> employeeVOs = new LinkedList<EmployeeWithExtendedPositionVO>();
        List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();
        Boolean active = null;
        if("true".equalsIgnoreCase(request.getParameter("isActive"))) {
            active = true;
        } else if("false".equalsIgnoreCase(request.getParameter("isActive"))) {
            active = false;
        }
        Country country = currentUser.getCountry();
        List<Office> offices = new LinkedList<Office>();
        List<Employee> employees = new LinkedList<Employee>();

        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            offices = new LinkedList<Office>(country.getOffices());
            employees = new LinkedList<Employee>(country.getEmployees());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            offices = new LinkedList<Office>(RightsItem.getOffices(currentUser, module, country));
            employees = new LinkedList<Employee>(RightsItem.getEmployees(currentUser, module, country) );
        }        

        Collections.sort(offices, new OfficeComparator());
        for(Office office : offices) {
            officeVOs.add(new OfficeVO(office));
        }
        Collections.sort(employees, new EmployeeComparator());
        for(Employee employee : employees) {
            if(active == null || active.equals(employee.getIsActive())) {
                employeeVOs.add(new EmployeeWithExtendedPositionVO(employee));
            }
        }
        for(Holiday holiday : Holiday.getAllByCountry(country)) {
            holidays.add(new YearMonthDate(holiday.getDate()));
        }        
%>
{
"status": "OK",
"offices": <% gson.toJson(officeVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>,
"holidays": <% gson.toJson(holidays, out); %>
}
<%
} else if("getOfficeContent".equals(command)) {
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<EmployeeWithExtendedPositionVO> employeeVOs = new LinkedList<EmployeeWithExtendedPositionVO>();
    Boolean active = null;
    if("true".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = true;
    } else if("false".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = false;
    }
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
    List<Department> departments = new LinkedList<Department>();
    List<Employee> employees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        departments = new LinkedList<Department>(office.getDepartments());
        employees = new LinkedList<Employee>(office.getEmployees());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        departments = new LinkedList<Department>(RightsItem.getDepartments(currentUser, module, office));
        employees = new LinkedList<Employee>(RightsItem.getEmployees(currentUser, module, office) );
    }
    Collections.sort(departments, new DepartmentComparator());
    for(Department department : departments) {
        departmentVOs.add(new DepartmentVO(department));
    }
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
            if(active == null || active.equals(employee.getIsActive())) {
                employeeVOs.add(new EmployeeWithExtendedPositionVO(employee));
            }
    }
%>
{
"status": "OK",
"departments": <% gson.toJson(departmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getDepartmentContent".equals(command)) {
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<EmployeeWithExtendedPositionVO> employeeVOs = new LinkedList<EmployeeWithExtendedPositionVO>();
    Boolean active = null;
    if("true".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = true;
    } else if("false".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = false;
    }
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
    List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    List<Employee> employees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(department.getSubdepartments());
        employees = new LinkedList<Employee>(department.getEmployees());
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        subdepartments = new LinkedList<Subdepartment>(RightsItem.getSubdepartments(currentUser, module, department));
        employees = new LinkedList<Employee>(RightsItem.getEmployees(currentUser, module, department) );
    }
    Collections.sort(subdepartments, new SubdepartmentComparator());
    for(Subdepartment subdepartment : subdepartments) {
        subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
    }
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
            if(active == null || active.equals(employee.getIsActive())) {
                employeeVOs.add(new EmployeeWithExtendedPositionVO(employee));
            }
    }
%>
{
"status": "OK",
"subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getSubdepartmentContent".equals(command)) {
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithExtendedPositionVO> employeeVOs = new LinkedList<EmployeeWithExtendedPositionVO>();
    Boolean active = null;
    if("true".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = true;
    } else if("false".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = false;
    }
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<Position> positions = new LinkedList<Position>();
    List<Employee> employees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        if(subdepartment.getDepartment().getOffice().getCountry().getId().equals(currentUser.getCountry().getId())) {
            positions = new LinkedList<Position>(subdepartment.getPositions());
            employees = new LinkedList<Employee>(subdepartment.getEmployees());
        }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(subdepartment, currentUser, module)) {
            positions = new LinkedList<Position>(subdepartment.getPositions());
            employees = new LinkedList<Employee>(subdepartment.getEmployees());
        }
    }
    Collections.sort(positions, new PositionComparator());
    for(Position position : positions) {
        positionVOs.add(new PositionVO(position));
    }
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
            if(active == null || active.equals(employee.getIsActive())) {
                employeeVOs.add(new EmployeeWithExtendedPositionVO(employee));
            }
    }
%>
{
"status": "OK",
"positions": <% gson.toJson(positionVOs, out); %>,
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getPositionContent".equals(command)) {
    List<EmployeeWithExtendedPositionVO> employeeVOs = new LinkedList<EmployeeWithExtendedPositionVO>();
    Boolean active = null;
    if("true".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = true;
    } else if("false".equalsIgnoreCase(request.getParameter("isActive"))) {
        active = false;
    }
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
    List<Employee> employees = new LinkedList<Employee>();
    if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
        if(position.getSubdepartment().getDepartment().getOffice().getCountry().getId().equals(currentUser.getCountry().getId())) {
            employees = new LinkedList<Employee>(position.getEmployees());
        }
    } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
        if(RightsItem.isAvailable(position, currentUser, module)) {
            employees = new LinkedList<Employee>(position.getEmployees());
        }
    }
    Collections.sort(employees, new EmployeeComparator());
    for(Employee employee : employees) {
            if(active == null || active.equals(employee.getIsActive())) {
                employeeVOs.add(new EmployeeWithExtendedPositionVO(employee));
            }
    }
%>
{
"status": "OK",
"employees": <% gson.toJson(employeeVOs, out); %>
}
<%
} else if("getEmployeeContent".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    List<ExtendedEmployeePositionHistoryItemVO> employeePositionHistoryItemVOs = new LinkedList<ExtendedEmployeePositionHistoryItemVO>();
    List<LeavesItemVO> leavesItemVOs = new LinkedList<LeavesItemVO>();
    List<ConciseEmployee> linkedEmployees = new ArrayList<ConciseEmployee>();
    if(employee != null) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getEmployeePositionHistoryItems(employee);
        EmployeePositionHistoryItem.assignCareerStatuses(employeePositionHistoryItems);
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
            employeePositionHistoryItemVOs.add(new ExtendedEmployeePositionHistoryItemVO(employeePositionHistoryItem));
        }
        List<LeavesItem> leavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
        Collections.sort(leavesItems, new LeavesItemComparator());
        for(LeavesItem leavesItem : leavesItems) {
            leavesItemVOs.add(new LeavesItemVO(leavesItem));
        }
        linkedEmployees = ConciseEmployee.getList(NaturalPerson.getLinkedEmployees(employee));
    }
    %>
    {
    "status": "OK",
    "employee": <% gson.toJson(new EmployeeWithoutPasswordVO(employee), out); %>,
    "employeePositionHistoryItems": <% gson.toJson(employeePositionHistoryItemVOs, out); %>,
    "leavesItems": <% gson.toJson(leavesItemVOs, out); %>,
    "linkedEmployees": <% gson.toJson(linkedEmployees, out); %>
    }
    <%
} else if("regeneratePassword".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("employeeId")));
    String password = PasswordUtil.generate();
    String salt = PasswordUtil.generate();
    String hashedPassword = SecurityUtils.getHashAsString(password, salt);
    employee.setHashedPassword(hashedPassword);
    employee.setSalt(salt);
    employee.setPasswordToBeChanged(true);
    hs.save(employee);
    
        javax.mail.Session mailSession = MailUtils.getSession();
        String mailContent = MailUtils.getRegenerateEmployeePasswordMailContent(employee, password);
        MailUtils.sendRegenerateEmployeePasswordMessage(mailSession, mailContent, employee.getEmail());
      %>
      {
      "status": "OK",
      "id": <%=employee.getId() %>
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