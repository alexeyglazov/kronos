/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import java.util.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Query;
import java.util.Calendar;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.vo.YearMonthDate;
/**
 *
 * @author glazov
 */
public class MonthlyTimeSheetReport {
    public class EmployeeReport {
        private Employee employee;
        List<ProjetCodeRow> projetCodeRows = new LinkedList<ProjetCodeRow>();
        List<TaskRow> idleTaskRows = new LinkedList<TaskRow>();
        NotIdleInternalTasksRow notIdleInternalTasksRow;

        public EmployeeReport() {
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public List<ProjetCodeRow> getProjetCodeRows() {
            return projetCodeRows;
        }

        public void setProjetCodeRows(List<ProjetCodeRow> projetCodeRows) {
            this.projetCodeRows = projetCodeRows;
        }

        public List<TaskRow> getIdleTaskRows() {
            return idleTaskRows;
        }

        public void setIdleTaskRows(List<TaskRow> idleTaskRows) {
            this.idleTaskRows = idleTaskRows;
        }

        public NotIdleInternalTasksRow getNotIdleInternalTasksRow() {
            return notIdleInternalTasksRow;
        }

        public void setNotIdleInternalTasksRow(NotIdleInternalTasksRow notIdleInternalTasksRow) {
            this.notIdleInternalTasksRow = notIdleInternalTasksRow;
        }
    }
    public class ProjetCodeRow {
        private ProjectCode projectCode;
        private Map<YearMonthDate, Long> spentTimes = new HashMap<YearMonthDate, Long>();

        public ProjetCodeRow() {
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Map<YearMonthDate, Long> getSpentTimes() {
            return spentTimes;
        }

        public void setSpentTimes(Map<YearMonthDate, Long> spentTimes) {
            this.spentTimes = spentTimes;
        }

    }
    public class TaskRow {
        private Task task;
        private Map<YearMonthDate, Long> spentTimes = new HashMap<YearMonthDate, Long>();

        public TaskRow() {
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }

        public Map<YearMonthDate, Long> getSpentTimes() {
            return spentTimes;
        }

        public void setSpentTimes(Map<YearMonthDate, Long> spentTimes) {
            this.spentTimes = spentTimes;
        }
    }
    public class NotIdleInternalTasksRow {
        private Map<YearMonthDate, Long> spentTimes = new HashMap<YearMonthDate, Long>();

        public NotIdleInternalTasksRow() {
        }

        public Map<YearMonthDate, Long> getSpentTimes() {
            return spentTimes;
        }

        public void setSpentTimes(Map<YearMonthDate, Long> spentTimes) {
            this.spentTimes = spentTimes;
        }
    }

    private List<EmployeeReport> employeeReports = new LinkedList<EmployeeReport>();

    private Date createdAt;
    private Integer year;
    private Integer month;

    public MonthlyTimeSheetReport(Integer year, Integer month) {
        this.year = year;
        this.month = month;
    }

    public List<EmployeeReport> getEmployeeReports() {
        return employeeReports;
    }

    public void setEmployeeReports(List<EmployeeReport> employeeReports) {
        this.employeeReports = employeeReports;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void build() {
        processProjectCode(getProjectCodeSelection(year, month));
        processIdleTask(getIdleTaskSelection(year, month));
        processNotIdleInternalTasks(getNotIdleInternalTasksSelection(year, month));
        this.createdAt = new Date();
    }
    public List<Object[]> getEmployeesSelection(Integer year, Integer month) {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select distinct e from Employee as e inner join e.employeepPositionHistoryItems as ephi ";
        query += "where ephi.start>=:startDate and (ephi.end<:endDate or ephi.end=null) ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processEmployees(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.getEmployeeReports().add(employeeReport);
            }
        }
    }

    public List<Object[]> getProjectCodeSelection(Integer year, Integer month) {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, pc, tsi.day, sum(tsi.timeSpent) from Employee as e inner join e.timeSpentItems as tsi inner join tsi.projectCode as pc ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and e.isAdministrator!=true ";
        query += "group by e, pc, tsi.day ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processProjectCode(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            ProjectCode projectCode = (ProjectCode)tuple[1];
            Calendar day = (Calendar)tuple[2];
            Long timeSpent = (Long)tuple[3];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.getEmployeeReports().add(employeeReport);
            }
            ProjetCodeRow projetCodeRow = getProjetCodeRow(employeeReport, projectCode);
            if(projetCodeRow == null) {
                projetCodeRow = new ProjetCodeRow();
                projetCodeRow.setProjectCode(projectCode);
                employeeReport.getProjetCodeRows().add(projetCodeRow);
            }
            Long timeSpentTmp = null;
            YearMonthDate yearMonthDate = new YearMonthDate(day);
            for(YearMonthDate dayTmp : projetCodeRow.getSpentTimes().keySet()) {
                if(dayTmp.equals(yearMonthDate)) {
                    timeSpentTmp = projetCodeRow.getSpentTimes().get(dayTmp);
                    timeSpentTmp = timeSpentTmp + timeSpent;
                    break;
                }
            }
            if(timeSpentTmp == null) {
                projetCodeRow.getSpentTimes().put(yearMonthDate, timeSpent);
            }
        }
    }
    public List<Object[]> getIdleTaskSelection(Integer year, Integer month) {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, t, tsi.day, sum(tsi.timeSpent) from Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and t.isIdle=true ";
        query += "and e.isAdministrator!=true ";
        query += "group by e, t, tsi.day ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processIdleTask(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Task task = (Task)tuple[1];
            Calendar day = (Calendar)tuple[2];
            Long timeSpent = (Long)tuple[3];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.getEmployeeReports().add(employeeReport);
            }
            TaskRow taskRow = getIdleTaskRow(employeeReport, task);
            if(taskRow == null) {
                taskRow = new TaskRow();
                taskRow.setTask(task);
                employeeReport.getIdleTaskRows().add(taskRow);
            }
            Long timeSpentTmp = null;
            YearMonthDate yearMonthDate = new YearMonthDate(day);
            for(YearMonthDate dayTmp : taskRow.getSpentTimes().keySet()) {
                if(dayTmp.equals(yearMonthDate)) {
                    timeSpentTmp = taskRow.getSpentTimes().get(dayTmp);
                    timeSpentTmp = timeSpentTmp + timeSpent;
                    break;
                }
            }
            if(timeSpentTmp == null) {
                taskRow.getSpentTimes().put(yearMonthDate, timeSpent);
            }
        }
    }
    public List<Object[]> getNotIdleInternalTasksSelection(Integer year, Integer month) {
        Calendar startDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, tsi.day, sum(tsi.timeSpent) from Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query += "where tsi.day>=:startDate and tsi.day<:endDate ";
        query += "and t.isIdle=false and tt.isInternal=true ";
        query += "and e.isAdministrator!=true ";
        query += "group by e, tsi.day ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        return (List<Object[]>)hq.list();
    }
    public void processNotIdleInternalTasks(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Calendar day = (Calendar)tuple[1];
            Long timeSpent = (Long)tuple[2];
            EmployeeReport employeeReport = getEmployeeReport(employee);
            if(employeeReport == null) {
                employeeReport = new EmployeeReport();
                employeeReport.setEmployee(employee);
                this.getEmployeeReports().add(employeeReport);
            }
            NotIdleInternalTasksRow notIdleInternalTasksRow = employeeReport.getNotIdleInternalTasksRow();
            if(notIdleInternalTasksRow == null) {
                notIdleInternalTasksRow = new NotIdleInternalTasksRow();
                employeeReport.setNotIdleInternalTasksRow(notIdleInternalTasksRow);
            }
            Long timeSpentTmp = null;
            YearMonthDate yearMonthDate = new YearMonthDate(day);
            for(YearMonthDate dayTmp : notIdleInternalTasksRow.getSpentTimes().keySet()) {
                if(dayTmp.equals(yearMonthDate)) {
                    timeSpentTmp = notIdleInternalTasksRow.getSpentTimes().get(dayTmp);
                    timeSpentTmp = timeSpentTmp + timeSpent;
                    break;
                }
            }
            if(timeSpentTmp == null) {
                notIdleInternalTasksRow.getSpentTimes().put(yearMonthDate, timeSpent);
            }
        }
    }
    private EmployeeReport getEmployeeReport(Employee employee) {
        for(EmployeeReport employeeReport : this.getEmployeeReports() ) {
            if(employeeReport.getEmployee().getId().equals(employee.getId())) {
                return employeeReport;
            }
        }
        return null;
    }
    private ProjetCodeRow getProjetCodeRow(EmployeeReport employeeReport, ProjectCode projectCode) {
        for(ProjetCodeRow projetCodeRow : employeeReport.getProjetCodeRows()) {
            if(projetCodeRow.getProjectCode().getId().equals(projectCode.getId())) {
                return projetCodeRow;
            }
        }
        return null;
    }
    private TaskRow getIdleTaskRow(EmployeeReport employeeReport, Task task) {
        for(TaskRow taskRow : employeeReport.getIdleTaskRows()) {
            if(taskRow.getTask().getId().equals(task.getId())) {
                return taskRow;
            }
        }
        return null;
    }
}
