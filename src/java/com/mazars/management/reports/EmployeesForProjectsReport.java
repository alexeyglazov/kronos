/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.FeesActComparator;
import java.util.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Query;
import java.util.Calendar;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.web.forms.EmployeesForProjectsReportForm;
/**
 *
 * @author glazov
 */
public class EmployeesForProjectsReport {
    public class RowComparator implements Comparator<Row> {
        public int compare(Row o1, Row o2) {
            return o1.getEmployee().getUserName().compareTo(o2.getEmployee().getUserName());
        }
    }

    public class Row {
        private Office office;
        private Department department;
        private Subdepartment subdepartment;
        private Employee employee;
        private ProjectCode projectCode;
        private Long timeSpent;
        private List<FeesAct> feesActs = new LinkedList<FeesAct>();

        public Office getOffice() {
            return office;
        }

        public void setOffice(Office office) {
            this.office = office;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public List<FeesAct> getFeesActs() {
            return feesActs;
        }

        public void setFeesActs(List<FeesAct> feesActs) {
            this.feesActs = feesActs;
        }
    }

    private Employee currentUser;
    private Module module;
    private EmployeesForProjectsReportForm form;
    
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
    private Integer formYear;
    private Integer formMonth;
    private Subdepartment formSubdepartment;
    private Department formDepartment;
    private Office formOffice;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();

    public EmployeesForProjectsReport(EmployeesForProjectsReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }        
        this.formYear = form.getYear();
        this.formMonth = form.getMonth();
    }
    public List<Row> getRows() {
        return rows;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Integer getFormYear() {
        return formYear;
    }

    public void setFormYear(Integer formYear) {
        this.formYear = formYear;
    }

    public Integer getFormMonth() {
        return formMonth;
    }

    public void setFormMonth(Integer formMonth) {
        this.formMonth = formMonth;
    }

    public Employee getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(Employee currentUser) {
        this.currentUser = currentUser;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public EmployeesForProjectsReportForm getForm() {
        return form;
    }

    public void setForm(EmployeesForProjectsReportForm form) {
        this.form = form;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }


    public void build() {
        this.subdepartments = Subdepartment.getAllowedSubdepartments(this.formOffice, this.formDepartment, this.formSubdepartment, currentUser, module);

        processProject(getProjectSelection());
        processInternal(getInternalSelection());
        processFeesActs(getFeesActsSelection());
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public List<Object[]> getProjectSelection() {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(this.formYear, this.formMonth);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(this.formYear, this.formMonth);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select o, d, s, e, pc, sum(tsi.timeSpent) from TimeSpentItem as tsi inner join tsi.projectCode as pc inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s ";
        query += "inner join s.department as d inner join d.office as o ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and (tsi.day >= ephi.start and (tsi.day <= ephi.end or ephi.end=null)) ";
        query += "and s in :subdepartments ";
        query += "and e.isAdministrator!=true ";
        query += "group by e, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", this.subdepartments);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processProject(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Office office = (Office)tuple[0];
            Department department = (Department)tuple[1];
            Subdepartment subdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            ProjectCode projectCode = (ProjectCode)tuple[4];
            Long timeSpent = (Long)tuple[5];
            Row row = new Row();
            row.setOffice(office);
            row.setDepartment(department);
            row.setSubdepartment(subdepartment);
            row.setEmployee(employee);
            row.setProjectCode(projectCode);
            row.setTimeSpent(timeSpent);
            this.rows.add(row);
        }
    }
    public List<Object[]> getInternalSelection() {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(this.formYear, this.formMonth);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(this.formYear, this.formMonth);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select o, d, s, e, sum(tsi.timeSpent) from TimeSpentItem as tsi inner join tsi.task as t inner join t.taskType as tt inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s ";
        query += "inner join s.department as d inner join d.office as o ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and tt.isInternal=true and t.isIdle=false ";
        query += "and (tsi.day >= ephi.start and (tsi.day <= ephi.end or ephi.end=null)) ";
        query += "and s in :subdepartments ";
        query += "and e.isAdministrator!=true ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameterList("subdepartments", this.subdepartments);
        return (List<Object[]>)hq.list();
    }
    public void processInternal(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Office office = (Office)tuple[0];
            Department department = (Department)tuple[1];
            Subdepartment subdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            Long timeSpent = (Long)tuple[4];
            Row row = new Row();
            row.setOffice(office);
            row.setDepartment(department);
            row.setSubdepartment(subdepartment);
            row.setEmployee(employee);
            row.setProjectCode(null);
            row.setTimeSpent(timeSpent);
            this.rows.add(row);
        }
    }
    public List<Object[]> getFeesActsSelection() {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(this.formYear, this.formMonth);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(this.formYear, this.formMonth);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, fa from TimeSpentItem as tsi inner join tsi.projectCode as pc inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s ";
        query += "inner join pc.feesItem as fi inner join fi.feesActs as fa ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and (tsi.day >= ephi.start and (tsi.day <= ephi.end or ephi.end=null)) ";
        query += "and s in :subdepartments ";
        query += "and e.isAdministrator!=true ";
        query += "group by fa ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", this.subdepartments);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processFeesActs(List<Object[]> selection) {
        Map<ProjectCode, List<FeesAct>> projectCodesFeesActs = new HashMap<ProjectCode, List<FeesAct>>();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesAct feesAct = (FeesAct)tuple[1];
            List<FeesAct> feesActs = projectCodesFeesActs.get(projectCode);
            if(feesActs == null) {
                feesActs = new LinkedList<FeesAct>();
                projectCodesFeesActs.put(projectCode, feesActs);
            }
            feesActs.add(feesAct);
        }
        for(ProjectCode projectCode : projectCodesFeesActs.keySet()) {
            List<FeesAct> feesActs = projectCodesFeesActs.get(projectCode);
            if(feesActs != null && ! feesActs.isEmpty()) {
                Collections.sort(feesActs, new FeesActComparator());
                Collections.reverse(feesActs);
            }
            List<Row> selectedRows = getRows(projectCode);
            for(Row row : selectedRows) {
                row.setFeesActs(feesActs);
            }
        }
    }
    private List<Row> getRows(ProjectCode projectCode) {
        List<Row> selectedRows = new LinkedList<Row>();
        for(Row row : rows) {
            if(row.getProjectCode() != null && row.getProjectCode().getId().equals(projectCode.getId())) {
                selectedRows.add(row);
            }
        }
        return selectedRows;
    }
}
