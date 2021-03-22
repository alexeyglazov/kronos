/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.EmployeeComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.IndividualPerformanceReportForm;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class IndividualPerformanceReport {
    public class EmployeeReportComparator implements Comparator<EmployeeReport> {
        @Override
        public int compare(EmployeeReport o1, EmployeeReport o2) {
            return o1.getEmployee().getUserName().compareToIgnoreCase(o2.getEmployee().getUserName());
        }
    }
    public class EmployeeReport {
        Employee employee;
        Map<Client, Long> clientTimespentItems = new HashMap<Client, Long>();
        Map<Task, Long> notInternalTaskTimespentItems = new HashMap<Task, Long>();
        Map<Task, Long> internalTaskTimespentItems = new HashMap<Task, Long>();

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Map<Task, Long> getInternalTaskTimespentItems() {
            return internalTaskTimespentItems;
        }

        public void setInternalTaskTimespentItems(Map<Task, Long> internalTaskTimespentItems) {
            this.internalTaskTimespentItems = internalTaskTimespentItems;
        }

        public Map<Task, Long> getNotInternalTaskTimespentItems() {
            return notInternalTaskTimespentItems;
        }

        public void setNotInternalTaskTimespentItems(Map<Task, Long> notInternalTaskTimespentItems) {
            this.notInternalTaskTimespentItems = notInternalTaskTimespentItems;
        }

        public Map<Client, Long> getClientTimespentItems() {
            return clientTimespentItems;
        }

        public void setClientTimespentItems(Map<Client, Long> clientTimespentItems) {
            this.clientTimespentItems = clientTimespentItems;
        }
    }
    
    private List<EmployeeReport> employeeReports = new LinkedList<EmployeeReport>();

    private IndividualPerformanceReportForm form;
    
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private Employee formEmployee;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    private Calendar startDate;
    private Calendar endDate;
    private List<Employee> employees = new LinkedList<Employee>();
    private Date createdAt;
    
    public IndividualPerformanceReport(IndividualPerformanceReportForm form, Module module, Employee currentUser) {
        this.form = form;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        if(this.form.getEmployeeId() != null) {
            this.formEmployee = (Employee)hs.get(Employee.class, new Long(form.getEmployeeId()));
        }
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        Country country = currentUser.getCountry();
        if(this.formEmployee != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees.add(this.formEmployee);
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                if(RightsItem.isAvailable(this.formEmployee, currentUser, module)) {
                    employees.add(this.formEmployee);
                }
            }
        } else if(this.formSubdepartment != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees.addAll(this.formSubdepartment.getEmployees());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                if(RightsItem.isAvailable(this.formSubdepartment, currentUser, module)) {
                    employees.addAll(this.formSubdepartment.getEmployees());
                }
            }
        } else if(this.formDepartment != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees.addAll(this.formDepartment.getEmployees());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                employees.addAll(RightsItem.getEmployees(currentUser, module, this.formDepartment));
            }
        } else if(this.formOffice != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees.addAll(this.formOffice.getEmployees());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                employees.addAll(RightsItem.getEmployees(currentUser, module, this.formOffice));
            }
        } else {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                employees.addAll(country.getEmployees());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                employees.addAll(RightsItem.getEmployees(currentUser, module, country));
            }
        }
        List<Employee> tmpEmployees = new LinkedList<Employee>();
        for(Employee employee : employees) {
            if(employee.getIsAdministrator() != true ) {
                tmpEmployees.add(employee);
            }
        }
        employees = tmpEmployees;
        Collections.sort(employees, new EmployeeComparator(EmployeeComparator.Mode.USERNAME));
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();
    }

    public List<EmployeeReport> getEmployeeReports() {
        return employeeReports;
    }

    public void setEmployeeReports(List<EmployeeReport> employeeReports) {
        this.employeeReports = employeeReports;
    }

    public IndividualPerformanceReportForm getForm() {
        return form;
    }

    public void setForm(IndividualPerformanceReportForm form) {
        this.form = form;
    }

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public Employee getFormEmployee() {
        return formEmployee;
    }

    public void setFormEmployee(Employee formEmployee) {
        this.formEmployee = formEmployee;
    }

    
    
    
    
    
    
    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }


    public Date getCreatedAt() {
        return createdAt;
    }

    public void build() {
        buildClientReport();
        buildNotInternalTaskReport();
        buildInternalTaskReport();
        Collections.sort(this.employeeReports, new EmployeeReportComparator());
        this.createdAt = new Date();
    }
    public void buildClientReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, c, sum(tsi.timeSpent) from ";
        query += "Employee as e inner join e.timeSpentItems as tsi inner join tsi.projectCode as pc inner join pc.client as c ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        query += "and e in (:employees) ";
        query += "and e.isAdministrator!=true ";
        query += "group by e, c ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameterList("employees", employees);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Client client = (Client)tuple[1];
            Long timespent = (Long)tuple[2];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.employeeReports.add(employeeReport);
            }
            employeeReport.getClientTimespentItems().put(client, timespent);
        }
    }
    public void buildNotInternalTaskReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, t, sum(tsi.timeSpent) from ";
        query += "Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        query += "and e in (:employees) ";
        query += "and e.isAdministrator!=true ";
        query += "and tt.isInternal!=true ";
        query += "group by e, t ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameterList("employees", employees);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Task task = (Task)tuple[1];
            Long timespent = (Long)tuple[2];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.employeeReports.add(employeeReport);
            }
            employeeReport.getNotInternalTaskTimespentItems().put(task, timespent);
        }
    }
    public void buildInternalTaskReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, t, sum(tsi.timeSpent) from ";
        query += "Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        query += "and e in (:employees) ";
        query += "and e.isAdministrator!=true ";
        query += "and tt.isInternal=true ";
        query += "group by e, t ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameterList("employees", employees);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Task task = (Task)tuple[1];
            Long timespent = (Long)tuple[2];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.employeeReports.add(employeeReport);
            }
            employeeReport.getInternalTaskTimespentItems().put(task, timespent);
        }
    }
    public EmployeeReport getEmployeeReport(Employee employee) {
        for(EmployeeReport employeeReport : employeeReports) {
            if(employeeReport.getEmployee().getId().equals(employee.getId())) {
                return employeeReport;
            }
        }
        return null;
    }
}
