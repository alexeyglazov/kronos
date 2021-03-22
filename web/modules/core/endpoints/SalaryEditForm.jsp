<%-- 
    Document   : subdepartments
    Created on : 31.03.2011, 13:08:03
    Author     : glazov
--%><%@page import="com.mazars.management.db.comparators.SalaryComparator"%>
<%@page import="java.util.Collections"%>
<%@page contentType="text/html" pageEncoding="UTF-8"
    import="java.util.List"
    import="java.util.LinkedList"
    import="java.util.Locale"
    import="com.mazars.management.db.domain.*"
    import="com.mazars.management.db.vo.*"
    import="com.mazars.management.web.forms.*"
    import="com.mazars.management.db.util.HibernateUtil"
    import="org.hibernate.Session"
    import="com.google.gson.Gson"
    import="java.util.Calendar"
    import="com.mazars.management.web.security.AccessChecker"
    import="java.util.Map"
    import="java.util.HashMap"
%><%
request.setCharacterEncoding("UTF-8");
Employee currentUser = (Employee)session.getAttribute("currentUser");
String command = request.getParameter("command");
Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
Gson gson = new Gson();
try {
hs.beginTransaction();
Module module = Module.getByName("Salary");


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
    Country country = employee.getPosition().getSubdepartment().getDepartment().getOffice().getCountry();
    List<CurrencyVO> currencyVOs = new LinkedList<CurrencyVO>();
    for(Currency currency : CountryCurrency.getCurrencies(country)) {
        currencyVOs.add(new CurrencyVO(currency));
    }
    %>
    {
        "status": "OK",
        "currencies": <% gson.toJson(currencyVOs, out); %>
    }
    <%
} else if("saveSalary".equals(command)) {
    SalaryEditForm salaryEditForm = SalaryEditForm.getFromJson(request.getParameter("salaryEditForm"));
    Employee employee = (Employee)hs.get(Employee.class, new Long(salaryEditForm.getEmployeeId()));
    if(RightsItem.isAvailable(employee, currentUser, module)) {
        if(SalaryEditForm.Mode.CREATE.equals(salaryEditForm.getMode()) ) {
              Currency currency = (Currency)hs.get(Currency.class, new Long(salaryEditForm.getCurrencyId()));
              Salary salary = new Salary();
              salary.setValue(salaryEditForm.getValue());
              salary.setEmployee(employee);
              salary.setCurrency(currency);
              Calendar start = null;
              Calendar end = null;
              if(salaryEditForm.getStart() != null) {
                    start = salaryEditForm.getStart().getCalendar();
              }
              if(salaryEditForm.getEnd() != null) {
                    end = salaryEditForm.getEnd().getCalendar();
              }
              salary.setStart(start);
              salary.setEnd(end);
              salary.encipherValue();
              
              List<Salary> salaries = new LinkedList<Salary>(employee.getSalaries());
              if(! salaries.isEmpty()) {
                Collections.sort(salaries, new SalaryComparator());
                Salary lastSalary = salaries.get(salaries.size() - 1);
                if(lastSalary.getStart().before(salary.getStart())) {
                    Calendar lastSalaryEnd = (new YearMonthDate(salary.getStart())).getCalendar();
                    lastSalaryEnd.add(Calendar.DAY_OF_MONTH, -1);
                    lastSalary.setEnd(lastSalaryEnd);
                    hs.save(lastSalary);
                }
              }        
              hs.save(salary);
             %>
             {
             "status": "OK"
             }
             <%
         } else if(SalaryEditForm.Mode.UPDATE.equals(salaryEditForm.getMode())) {
              Salary salary = (Salary)hs.get(Salary.class, new Long(salaryEditForm.getId()));
              Currency currency = (Currency)hs.get(Currency.class, new Long(salaryEditForm.getCurrencyId()));
              salary.setCurrency(currency);
              salary.setValue(salaryEditForm.getValue());
              Calendar start = null;
              Calendar end = null;
              if(salaryEditForm.getStart() != null) {
                    start = salaryEditForm.getStart().getCalendar();
              }
              if(salaryEditForm.getEnd() != null) {
                    end = salaryEditForm.getEnd().getCalendar();
              }
              salary.setStart(start);
              salary.setEnd(end);
              salary.encipherValue();
              hs.save(salary);
             %>
             {
             "status": "OK"
             }
             <%
         }
    } else {
        %>{
        "status": "FAIL",
        "comment": "You do not have access to the Subdepartment this Employee belongs to"
        }<%
    }
} else if("deleteSalary".equals(command)) {
    Salary salary = (Salary)hs.get(Salary.class, new Long(request.getParameter("id")));
    if(RightsItem.isAvailable(salary.getEmployee(), currentUser, module)) {
        hs.delete(salary);
        %>
        {
        "status": "OK"
        }
        <%
    } else {
        %>
        {
        "status": "FAIL",
        "comment": "You do not have access to the Subdepartment this Employee belongs to"
        }
        <%
    }
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