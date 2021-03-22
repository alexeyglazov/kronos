<%-- 
    Document   : helper
    Created on : 30.03.2011, 14:05:19
    Author     : glazov
--%>

<%@page import="com.mazars.management.db.util.CalendarUtil"%>
<%@page import="com.mazars.management.security.SecurityUtils"%>
<%@page import="com.mazars.management.security.PasswordUtil"%>
<%@page import="java.util.Locale"%>
<%@page import="com.mazars.management.service.ConfigUtils"%>
<%@ page language="java"
    contentType="text/html; charset=UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="java.util.Map"
    import="java.util.HashMap"
%>
<%!
Map<String, String> getFields(HttpServletRequest r) {
    Map<String, String> fields = new HashMap<String, String>();
    fields.put("countryName", r.getParameter("countryName"));
    fields.put("officeName", r.getParameter("officeName"));
    fields.put("officeCodeName", r.getParameter("officeCodeName"));
    fields.put("departmentName", r.getParameter("departmentName"));
    fields.put("departmentCodeName", r.getParameter("departmentCodeName"));
    fields.put("subdepartmentName", r.getParameter("subdepartmentName"));
    fields.put("subdepartmentCodeName", r.getParameter("subdepartmentCodeName"));
    fields.put("positionName", r.getParameter("positionName"));
    fields.put("employeeUserName", r.getParameter("employeeUserName"));
    fields.put("employeePassword", r.getParameter("employeePassword"));
    fields.put("employeeFirstName", r.getParameter("employeeFirstName"));
    fields.put("employeeLastName", r.getParameter("employeeLastName"));
    fields.put("employeeEmail", r.getParameter("employeeEmail"));
    for(String name : fields.keySet()) {
        fields.put(name, fields.get(name).trim());
    }
    return fields;
}
List<String> validateForm(Map<String, String> fields) {
    List<String> errors = new LinkedList<String>();
    if(fields.get("countryName") == null || "".equals(fields.get("countryName"))) {
        errors.add("countryName is empty");
    }
    if(fields.get("officeName") == null || "".equals(fields.get("officeName"))) {
        errors.add("officeName is empty");
    }
    if(fields.get("officeCodeName") == null || "".equals(fields.get("officeCodeName"))) {
        errors.add("officeCodeName is empty");
    }
    if(fields.get("departmentName") == null || "".equals(fields.get("departmentName"))) {
        errors.add("departmentName is empty");
    }
    if(fields.get("departmentCodeName") == null || "".equals(fields.get("departmentCodeName"))) {
        errors.add("departmentCodeName is empty");
    }
    if(fields.get("subdepartmentName") == null || "".equals(fields.get("subdepartmentName"))) {
        errors.add("subdepartmentName is empty");
    }
    if(fields.get("subdepartmentCodeName") == null || "".equals(fields.get("subdepartmentCodeName"))) {
        errors.add("subdepartmentCodeName is empty");
    }
    if(fields.get("positionName") == null || "".equals(fields.get("positionName"))) {
        errors.add("positionName is empty");
    }
    if(fields.get("employeeUserName") == null || "".equals(fields.get("employeeUserName"))) {
        errors.add("employeeUserName is empty");
    }
    if(fields.get("employeePassword") == null || "".equals(fields.get("employeePassword"))) {
        errors.add("employeePassword is empty");
    }
    if(fields.get("employeeFirstName") == null || "".equals(fields.get("employeeFirstName"))) {
        errors.add("employeeFirstName is empty");
    }
    if(fields.get("employeeLastName") == null || "".equals(fields.get("employeeLastName"))) {
        errors.add("employeeLastName is empty");
    }
    if(fields.get("employeeEmail") == null || "".equals(fields.get("employeeEmail"))) {
        errors.add("employeeEmail is empty");
    }
    return errors;
}
%>
<%
request.setCharacterEncoding("UTF-8");

Boolean isAdminLoggedIn = (Boolean)session.getAttribute("isAdminLoggedIn");
if(! Boolean.TRUE.equals(isAdminLoggedIn)) {
    response.sendRedirect("./login.jsp");
    return;
}

Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
try {
    hs.beginTransaction();
    
Locale locale = new Locale("en");
String moduleBaseUrl = "/modules/core/";
Map<String, String> bodies = new HashMap<String, String>();

Map<String, String> pageProperties = new HashMap<String, String>();
pageProperties.put("title", "Create employee");
pageProperties.put("description", "Page is used to create country, office, department, employee in database");
pageProperties.put("keywords", "country, office, department, employee");

List<String> jsFiles = new LinkedList<String>();
//jsFiles.add("main.js");

request.setAttribute("isAdminLoggedIn", isAdminLoggedIn);
request.setAttribute("bodies", bodies);
request.setAttribute("pageProperties", pageProperties);
request.setAttribute("locale", locale);

request.setAttribute("jsFiles", jsFiles);
request.setAttribute("content", moduleBaseUrl + "elements/admin/employee.jsp");
String frametemplate = moduleBaseUrl + "frametemplates/admin.jsp";
%>
<%
    String command = request.getParameter("command");
    if(command == null) {
        command = "start";
    }
    String displayStatus = null;
    String displayMessage = null;
    if("start".equals(command)) {
        List<StandardPosition> standardPositions = StandardPosition.getAll();
        request.setAttribute("standardPositions", standardPositions);
        displayStatus = "showForm";
    } else if("createEmployee".equals(command)) {
        Map<String, String> fields = getFields(request);
        List<String> errors = validateForm(fields);
        if(! errors.isEmpty()) {
            List<StandardPosition> standardPositions = StandardPosition.getAll();
            request.setAttribute("standardPositions", standardPositions);

            displayStatus = "errorOnEmployeeCreation";
            displayMessage = "";
            for(String error : errors) {
                displayMessage += error + "<br />";
            }
        } else if(Employee.getTotalCount() > 0) {
            List<StandardPosition> standardPositions = StandardPosition.getAll();
            request.setAttribute("standardPositions", standardPositions);
            displayStatus = "errorOnEmployeeCreation";
            displayMessage = "There is one or more Employee in database. You can not add new ones here.";
        } else {
            StandardPosition standardPosition = (StandardPosition)hs.get(StandardPosition.class, new Long(request.getParameter("standardPositionId")));
            
            Country country = new Country();
            Office office = new Office();
            Department department = new Department();
            Subdepartment subdepartment = new Subdepartment();
            Position position = new Position();
            EmployeePositionHistoryItem employeePositionHistoryItem = new EmployeePositionHistoryItem();
            Employee employee = new Employee();

            country.setName(request.getParameter("countryName"));
            office.setName(request.getParameter("officeName"));
            office.setCodeName(request.getParameter("officeCodeName"));
            office.setCountry(country);
            office.setIsActive(true);

            department.setName(request.getParameter("departmentName"));
            department.setCodeName(request.getParameter("departmentCodeName"));
            department.setOffice(office);
            department.setIsActive(true);
            department.setIsBusinessTrippable(false);

            subdepartment.setName(request.getParameter("subdepartmentName"));
            subdepartment.setCodeName(request.getParameter("subdepartmentCodeName"));
            subdepartment.setDepartment(department);
            subdepartment.setIsActive(true);

            position.setName(request.getParameter("positionName"));
            position.setSubdepartment(subdepartment);
            position.setStandardPosition(standardPosition);
            position.setIsActive(true);

            employee.setPosition(position);
            employee.setUserName(request.getParameter("employeeUserName"));
            String password = request.getParameter("employeePassword");
            String salt = PasswordUtil.generate();
            String hashedPassword = SecurityUtils.getHashAsString(password, salt);
            employee.setHashedPassword(hashedPassword);
            employee.setSalt(salt);
            employee.setFirstName(request.getParameter("employeeFirstName"));
            employee.setLastName(request.getParameter("employeeLastName"));
            employee.setEmail(request.getParameter("employeeEmail"));
            employee.setIsActive(true);
            employee.setIsAdministrator(true);
            employee.setProfile(Employee.Profile.COUNTRY_ADMINISTRATOR);
            employee.setPasswordToBeChanged(false);

            employeePositionHistoryItem.setPosition(position);
            employeePositionHistoryItem.setEmployee(employee);
            employeePositionHistoryItem.setStart(CalendarUtil.getToday());
            employeePositionHistoryItem.setEnd(null);
            employeePositionHistoryItem.setContractType(EmployeePositionHistoryItem.ContractType.FULL_TIME);

            employee.getEmployeePositionHistoryItems().add(employeePositionHistoryItem);
            hs.save(country);
            hs.save(office);
            hs.save(department);
            hs.save(subdepartment);
            hs.save(position);
            hs.save(employee);
            hs.save(employeePositionHistoryItem);
            displayStatus = "successOnEmployeeCreation";   
            displayMessage = "Country, Office, Department, Subdepartment, Position, Employee, EmployeePositionHistoryItem have been successfully created";
        }
    }
    
    
    hs.getTransaction().commit();
    
    request.setAttribute("displayStatus", displayStatus);               
    request.setAttribute("displayMessage", displayMessage);     
            
    %><jsp:include page="<%=frametemplate %>" flush="true" /><%
} catch (Exception ex) {
    hs.getTransaction().rollback();
    throw ex;
}
%>











