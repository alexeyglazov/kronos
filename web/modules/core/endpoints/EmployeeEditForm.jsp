<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.service.MailUtils"%>
<%@page import="javax.mail.PasswordAuthentication"%>
<%@page import="javax.mail.Transport"%>
<%@page import="javax.mail.internet.MimeMessage"%>
<%@page import="javax.mail.Message"%>
<%@page import="javax.mail.internet.InternetAddress"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.db.util.CalendarUtil"%>
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

if("getPositions".equals(command)) {
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    for(Position position : subdepartment.getPositions()) {
        positionVOs.add(new PositionVO(position));
    }
    %>
    {
        "status": "OK",
        "positions": <% gson.toJson(positionVOs, out); %>
    }
    <%
} else if("getCountriesOfficesDepartmentsSubdepartmentsPositionsEmployees".equals(command)) {
    List<CountryVO> countryVOs = new LinkedList<CountryVO>();
    List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    Country firstCountry = null;
    Office firstOffice = null;
    Department firstDepartment = null;
    Subdepartment firstSubdepartment = null;
    Position firstPosition = null;
    for(Country country : Country.getAll()) {
        if(firstCountry == null) {
            firstCountry = country;
        }
        countryVOs.add(new CountryVO(country));
    }
    if(firstCountry != null) {
        for(Office office : firstCountry.getOffices()) {
            if(firstOffice == null) {
                firstOffice = office;
            }
            officeVOs.add(new OfficeVO(office));
        }
    }
    if(firstOffice != null) {
        for(Department department : firstOffice.getDepartments()) {
            if(firstDepartment == null) {
                firstDepartment = department;
            }
            departmentVOs.add(new DepartmentVO(department));
        }
    }
    if(firstDepartment != null) {
        for(Subdepartment subdepartment : firstDepartment.getSubdepartments()) {
            if(firstSubdepartment == null) {
                firstSubdepartment = subdepartment;
            }
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
    }
    if(firstSubdepartment != null) {
        for(Position position : firstSubdepartment.getPositions()) {
            if(firstPosition == null) {
                firstPosition = position;
            }
            positionVOs.add(new PositionVO(position));
        }
    }
    if(firstPosition != null) {
        for(Employee employee : firstPosition.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "countries": <% gson.toJson(countryVOs, out); %>,
        "offices": <% gson.toJson(officeVOs, out); %>,
        "departments": <% gson.toJson(departmentVOs, out); %>,
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "positions": <% gson.toJson(positionVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%
} else if("getOfficesDepartmentsSubdepartmentsPositionsEmployees".equals(command)) {
    Country country = (Country)hs.get(Country.class, new Long(request.getParameter("countryId")));
    List<OfficeVO> officeVOs = new LinkedList<OfficeVO>();
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    Office firstOffice = null;
    Department firstDepartment = null;
    Subdepartment firstSubdepartment = null;
    Position firstPosition = null;
    if(country != null) {
        for(Office office : country.getOffices()) {
            if(firstOffice == null) {
                firstOffice = office;
            }
            officeVOs.add(new OfficeVO(office));
        }
    }
    if(firstOffice != null) {
        for(Department department : firstOffice.getDepartments()) {
            if(firstDepartment == null) {
                firstDepartment = department;
            }
            departmentVOs.add(new DepartmentVO(department));
        }
    }
    if(firstDepartment != null) {
        for(Subdepartment subdepartment : firstDepartment.getSubdepartments()) {
            if(firstSubdepartment == null) {
                firstSubdepartment = subdepartment;
            }
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
    }
    if(firstSubdepartment != null) {
        for(Position position : firstSubdepartment.getPositions()) {
            if(firstPosition == null) {
                firstPosition = position;
            }
            positionVOs.add(new PositionVO(position));
        }
    }
    if(firstPosition != null) {
        for(Employee employee : firstPosition.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "offices": <% gson.toJson(officeVOs, out); %>,
        "departments": <% gson.toJson(departmentVOs, out); %>,
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "positions": <% gson.toJson(positionVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }
    <%
} else if("getDepartmentsSubdepartmentsPositionsEmployees".equals(command)) {
    Office office = (Office)hs.get(Office.class, new Long(request.getParameter("officeId")));
    List<DepartmentVO> departmentVOs = new LinkedList<DepartmentVO>();
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    Department firstDepartment = null;
    Subdepartment firstSubdepartment = null;
    Position firstPosition = null;
    if(office != null) {
        for(Department department : office.getDepartments()) {
            if(firstDepartment == null) {
                firstDepartment = department;
            }
            departmentVOs.add(new DepartmentVO(department));
        }
    }
    if(firstDepartment != null) {
        for(Subdepartment subdepartment : firstDepartment.getSubdepartments()) {
            if(firstSubdepartment == null) {
                firstSubdepartment = subdepartment;
            }
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
    }
    if(firstSubdepartment != null) {
        for(Position position : firstSubdepartment.getPositions()) {
            if(firstPosition == null) {
                firstPosition = position;
            }
            positionVOs.add(new PositionVO(position));
        }
    }
    if(firstPosition != null) {
        for(Employee employee : firstPosition.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "departments": <% gson.toJson(departmentVOs, out); %>,
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "positions": <% gson.toJson(positionVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%
} else if("getSubdepartmentsPositionsEmployees".equals(command)) {
    Department department = (Department)hs.get(Department.class, new Long(request.getParameter("departmentId")));
    List<SubdepartmentVO> subdepartmentVOs = new LinkedList<SubdepartmentVO>();
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    Subdepartment firstSubdepartment = null;
    Position firstPosition = null;
    if(department != null) {
        for(Subdepartment subdepartment : department.getSubdepartments()) {
            if(firstSubdepartment == null) {
                firstSubdepartment = subdepartment;
            }
            subdepartmentVOs.add(new SubdepartmentVO(subdepartment));
        }
    }
    if(firstSubdepartment != null) {
        for(Position position : firstSubdepartment.getPositions()) {
            if(firstPosition == null) {
                firstPosition = position;
            }
            positionVOs.add(new PositionVO(position));
        }
    }
    if(firstPosition != null) {
        for(Employee employee : firstPosition.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "subdepartments": <% gson.toJson(subdepartmentVOs, out); %>,
        "positions": <% gson.toJson(positionVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%
} else if("getPositionsEmployees".equals(command)) {
    Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(request.getParameter("subdepartmentId")));
    List<PositionVO> positionVOs = new LinkedList<PositionVO>();
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    Position firstPosition = null;
    if(subdepartment != null) {
        for(Position position : subdepartment.getPositions()) {
            if(firstPosition == null) {
                firstPosition = position;
            }
            positionVOs.add(new PositionVO(position));
        }
    }
    if(firstPosition != null) {
        for(Employee employee : firstPosition.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "positions": <% gson.toJson(positionVOs, out); %>,
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%
} else if("getEmployees".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("positionId")));
    List<EmployeeWithoutPasswordVO> employeeVOs = new LinkedList<EmployeeWithoutPasswordVO>();

    if(position != null) {
        for(Employee employee : position.getEmployees()) {
            employeeVOs.add(new EmployeeWithoutPasswordVO(employee));
        }
    }
    %>
    {
        "status": "OK",
        "employees": <% gson.toJson(employeeVOs, out); %>
    }<%
}else if("getPosition".equals(command)) {
    Position position = (Position)hs.get(Position.class, new Long(request.getParameter("id")));
    %>
    {
        "status": "OK",
        "positions": <% gson.toJson(new PositionVO(position), out); %>
    }
    <%
} else if("saveEmployee".equals(command)) {
    EmployeeEditForm employeeEditForm = EmployeeEditForm.getFromJson(request.getParameter("employeeEditForm"));
    Employee sameUserNameEmployee = Employee.getByUserName(employeeEditForm.getUserName());
    List<Employee> sameEmailEmployees = Employee.getByEmail(employeeEditForm.getEmail(), true);
    if(sameUserNameEmployee != null && (employeeEditForm.getMode().equals(EmployeeEditForm.Mode.CREATE) || ! sameUserNameEmployee.getId().equals(employeeEditForm.getId()) )) {
        %>{"status": "FAIL", "comment": "Employee with the same User Name already exists"}<%
    } else if(sameEmailEmployees.size() > 0 && (employeeEditForm.getMode().equals(EmployeeEditForm.Mode.CREATE) || ! sameEmailEmployees.get(0).getId().equals(employeeEditForm.getId()) )) {
        %>{"status": "FAIL", "comment": "Employee with the same E-mail already exists"}<%
    } else {
        if(EmployeeEditForm.Mode.CREATE.equals(employeeEditForm.getMode()) ) {
              String password = PasswordUtil.generate();
              String salt = PasswordUtil.generate();
              String hashedPassword = SecurityUtils.getHashAsString(password, salt);
              Position position = (Position)hs.get(Position.class, new Long(employeeEditForm.getPositionId()));
              Employee employee = new Employee();
              EmployeePositionHistoryItem employeePositionHistoryItem = new EmployeePositionHistoryItem();
              employeePositionHistoryItem.setPosition(position);
              employeePositionHistoryItem.setStart(CalendarUtil.getToday());
              employeePositionHistoryItem.setEnd(null);
              employeePositionHistoryItem.setContractType(employeeEditForm.getContractType());
              if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(employeeEditForm.getContractType())) {
                employeePositionHistoryItem.setPartTimePercentage(employeeEditForm.getPartTimePercentage());
              } else {
                employeePositionHistoryItem.setPartTimePercentage(null);
              }
              employee.setUserName(employeeEditForm.getUserName());
              employee.setHashedPassword(hashedPassword);
              employee.setSalt(salt);
              employee.setPasswordToBeChanged(true);
              employee.setFirstName(employeeEditForm.getFirstName());
              employee.setLastName(employeeEditForm.getLastName());
              employee.setFirstNameLocalLanguage(employeeEditForm.getFirstNameLocalLanguage());
              employee.setLastNameLocalLanguage(employeeEditForm.getLastNameLocalLanguage());
              employee.setMaidenName(employeeEditForm.getMaidenName());
              employee.setEmail(employeeEditForm.getEmail());
              employee.setExternalId(employeeEditForm.getExternalId());
              Boolean isProfileAllowed = false;
              if(Employee.Profile.NON_USER.equals(employeeEditForm.getProfile()) || Employee.Profile.USER.equals(employeeEditForm.getProfile())) {
                if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile()) || Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                    isProfileAllowed = true;
                }
              } else if(Employee.Profile.SUPER_USER.equals(employeeEditForm.getProfile())) {
                if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                    isProfileAllowed = true;
                }
              } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(employeeEditForm.getProfile())) {
                if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile()) && currentUser.getIsAdministrator()) {
                    isProfileAllowed = true;
                }
              }
              if(isProfileAllowed) {
                employee.setProfile(employeeEditForm.getProfile());
              } else {
                employee.setProfile(Employee.Profile.USER);
              }
              employee.setIsAdministrator(false);
              employee.setIsActive(employeeEditForm.getIsActive());
              employee.setIsFuture(employeeEditForm.getIsFuture());
              employee.setPosition(position);

              employee.getEmployeePositionHistoryItems().add(employeePositionHistoryItem);
              employeePositionHistoryItem.setEmployee(employee);

              hs.save(employee);
              hs.save(employeePositionHistoryItem);

                javax.mail.Session mailSession = MailUtils.getSession();
                String mailContent = MailUtils.getCreateEmployeeMailContent(employee, password);
                MailUtils.sendCreateEmployeeMessage(mailSession, mailContent, employee.getEmail());
              %>
              {
              "status": "OK",
              "id": <%=employee.getId() %>
              }
              <%
            } else if(EmployeeEditForm.Mode.UPDATE.equals(employeeEditForm.getMode())) {
                Employee employee = (Employee)hs.get(Employee.class, new Long(employeeEditForm.getId()));
                employee.setUserName(employeeEditForm.getUserName());
                employee.setFirstName(employeeEditForm.getFirstName());
                employee.setLastName(employeeEditForm.getLastName());
                employee.setFirstNameLocalLanguage(employeeEditForm.getFirstNameLocalLanguage());
                employee.setLastNameLocalLanguage(employeeEditForm.getLastNameLocalLanguage());
                employee.setMaidenName(employeeEditForm.getMaidenName());
                employee.setEmail(employeeEditForm.getEmail());
                employee.setExternalId(employeeEditForm.getExternalId());
                //employee.setProfile(employeeEditForm.getProfile());
                employee.setIsActive(employeeEditForm.getIsActive());
                employee.setIsFuture(employeeEditForm.getIsFuture());
                hs.save(employee);
                %>
                {
                "status": "OK",
                "id": <%=employee.getId() %>
                }
                <%
            }
    }
} else if("deleteEmployee".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("id")));
    for(Salary salary : employee.getSalaries()) {
        hs.delete(salary);
    }
    for(EmployeePositionHistoryItem employeePositionHistoryItem : employee.getEmployeePositionHistoryItems()) {
        hs.delete(employeePositionHistoryItem);
    }
    for(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem : employee.getEmployeeSubdepartmentHistoryItems()) {
        hs.delete(employeeSubdepartmentHistoryItem);
    }
    hs.delete(employee);
    %>
    {
    "status": "OK"
    }
    <%
} else if("checkEmployeeDependencies".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("id")));
     %>
     {
    "status": "OK",
    "createdProjectCodes": <%=employee.getCreatedProjectCodes().size() %>,
    "closedProjectCodes": <%=employee.getClosedProjectCodes().size() %>,
    "timeSpentItems": <%=employee.getTimeSpentItems().size() %>,
    "clientHistoryItems": <%=employee.getClientHistoryItems().size() %>,
    "salaries": <%=employee.getSalaries().size() %>,
    "employeePositionHistoryItems": <%=employee.getEmployeePositionHistoryItems().size() %>,
    "employeeSubdepartmentHistoryItems": <%=employee.getEmployeeSubdepartmentHistoryItems().size() %>,
    "rightsItems": <%=employee.getRightsItems().size() %>
    }
    <%
} else if("saveExternalId".equals(command)) {
    Employee employee = (Employee)hs.get(Employee.class, new Long(request.getParameter("id")));
    String externalId = request.getParameter("externalId");
    employee.setExternalId(externalId);
    hs.save(employee);
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