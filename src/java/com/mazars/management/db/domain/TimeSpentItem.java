/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.*;
import com.mazars.management.db.vo.YearMonth;
import org.hibernate.Session;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
/**
 *
 * @author glazov
 */
public class TimeSpentItem {
    private Long id;
    private Calendar day;
    private Integer timeSpent;
    private String description;
    private Date modifiedAt;
    private Employee employee;
    private ProjectCode projectCode;
    private Task task;

    public TimeSpentItem() {
    }

    public Calendar getDay() {
        return day;
    }

    public void setDay(Calendar day) {
        this.day = day;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }
   

    public static List<TimeSpentItem> getAll(Employee employee, Task task, ProjectCode projectCode, Calendar day) {
        Calendar start = day;
        Calendar end = new GregorianCalendar();
        CalendarUtil.truncateTime(end);
        end.set(Calendar.YEAR, start.get(Calendar.YEAR));
        end.set(Calendar.MONTH, start.get(Calendar.MONTH));
        end.set(Calendar.DAY_OF_MONTH, start.get(Calendar.DAY_OF_MONTH));
        end.add(Calendar.DAY_OF_MONTH, 1);
        return getAll(employee, task, projectCode, start, end);
    }
    public static List<TimeSpentItem> getAll(Employee employee, Task task, ProjectCode projectCode, Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select tsi from TimeSpentItem as tsi ";
        query += "where ";
        query += "tsi.employee=:employee ";
        query += "and tsi.day>=:start ";
        query += "and tsi.day<:end ";
        query += "and tsi.task=:task ";
        if(projectCode != null) {
            query += "and tsi.projectCode=:projectCode ";
        }
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameter("task", task);
        if(projectCode != null) {
            hq.setParameter("projectCode", projectCode);
        }
        return (List<TimeSpentItem>)hq.list();
    }
    
    public static List<TimeSpentItem> getAllByEmployeeYearMonth(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<TimeSpentItem>)hs.createQuery("select tsi from Employee as e inner join e.timeSpentItems as tsi where e=:employee and tsi.day >= :day1 and tsi.day < :day2").setParameter("employee", employee).setParameter("day1", beginDate).setParameter("day2", endDate).list();
    }
    public static List<TimeSpentItem> getAllBySubdepartmentBeginDateEndDate(Subdepartment subdepartment, Calendar beginDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<TimeSpentItem>)hs.createQuery("select tsi from Subdepartment as s inner join s.positions as p inner join p.employee as e inner join e.timeSpentItems as tsi where s=? and tsi.day >= ? and tsi.day < ?").setParameter(0, subdepartment).setParameter(1, beginDate).setParameter(2, endDate).list();
    }

    public static List<ProjectCode> getAllProjectCodesByEmployeeYearMonth(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from ProjectCode as pc inner join pc.timeSpentItems as tsi inner join tsi.employee as e where e.id=? and tsi.day >= ? and tsi.day < ? group by pc.id").setParameter(0, employee.getId()).setParameter(1, beginDate).setParameter(2, endDate).list();
    }
    public static List<Task> getAllTasksByEmployeeYearMonth(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Task>)hs.createQuery("select t from Task as t inner join t.timeSpentItems as tsi inner join tsi.employee as e where e.id=? and tsi.day >= ? and tsi.day < ? group by t.id").setParameter(0, employee.getId()).setParameter(1, beginDate).setParameter(2, endDate).list();
    }
    public static List<TaskType> getAllTaskTypesByEmployeeYearMonth(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<TaskType>)hs.createQuery("select distinct tt from TaskType as tt inner join tt.tasks as t inner join t.timeSpentItems as tsi inner join tsi.employee as e where e.id=? and tsi.day >= ? and tsi.day < ?").setParameter(0, employee.getId()).setParameter(1, beginDate).setParameter(2, endDate).list();
    }

    public static Calendar getMinDay(ProjectCode projectCode) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select min(tsi.day) from TimeSpentItem as tsi where tsi.projectCode=:projectCode ").setParameter("projectCode", projectCode).uniqueResult();
    }
    public static Calendar getMaxDay(ProjectCode projectCode) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select max(tsi.day) from TimeSpentItem as tsi where tsi.projectCode=:projectCode ").setParameter("projectCode", projectCode).uniqueResult();
    }
    public static Calendar getMinDay() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select min(tsi.day) from TimeSpentItem as tsi").uniqueResult();
    }
    public static Calendar getMaxDay() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select max(tsi.day) from TimeSpentItem as tsi").uniqueResult();
    }
    public static Integer getMinYear() {
        Calendar minDay = getMinDay();
        if(minDay != null) {
            return minDay.get(Calendar.YEAR);
        }
        return null;
    }
    public static Integer getMaxYear() {
        Calendar maxDay = getMaxDay();
        if(maxDay != null) {
            return maxDay.get(Calendar.YEAR);
        }
        return null;
    }
    public static List<TimeSpentItem> getAll(Employee employee, ProjectCode projectCode, Calendar day) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(projectCode != null) {
            return (List<TimeSpentItem>)hs.createQuery("select distinct tsi from TimeSpentItem as tsi where tsi.employee=:employee and tsi.projectCode=:projectCode and tsi.day=:day").setParameter("employee", employee).setParameter("projectCode", projectCode).setParameter("day", day).list();
        } else {
            return (List<TimeSpentItem>)hs.createQuery("select distinct tsi from TimeSpentItem as tsi where tsi.employee=:employee and tsi.projectCode=null and tsi.day=:day").setParameter("employee", employee).setParameter("day", day).list();
        }
    }
    public static List<YearMonth> getReportedMonths(ProjectCode projectCode) {
        Set<YearMonth> months = new HashSet<YearMonth>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select tsi.day from TimeSpentItem as tsi ";
        query += "where tsi.projectCode=:projectCode ";
        query += "group by tsi.day ";
        Query hq = hs.createQuery(query);
        hq.setParameter("projectCode", projectCode);
        List<Calendar> selection = (List<Calendar>)hq.list();
        for(Calendar day : selection) {
            YearMonth month = new YearMonth(day);
            months.add(month);
        }
        return new LinkedList<YearMonth>(months);
    }
    public static Date getLastModifiedAt(ProjectCode projectCode, YearMonth month) {
        Calendar start = CalendarUtil.getBeginDateForYearMonth(month.getYear(), month.getMonth());
        Calendar end = CalendarUtil.getEndDateForYearMonth(month.getYear(), month.getMonth());
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select max(tsi.modifiedAt) from TimeSpentItem as tsi ";
        query += "where ";
        query += "tsi.projectCode=:projectCode ";
        query += "and tsi.day>=:start and tsi.day<:end ";
        Query hq = hs.createQuery(query);
        hq.setParameter("projectCode", projectCode);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        Date lastModifiedAt = (Date)hq.uniqueResult();
        return lastModifiedAt;
    }
    public static Long getTimeSpent(ProjectCode projectCode, YearMonth month) {
        Calendar start = CalendarUtil.getBeginDateForYearMonth(month.getYear(), month.getMonth());
        Calendar end = CalendarUtil.getEndDateForYearMonth(month.getYear(), month.getMonth());
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select sum(tsi.timeSpent) from TimeSpentItem as tsi ";
        query += "where ";
        query += "tsi.projectCode=:projectCode ";
        query += "and tsi.day>=:start and tsi.day<:end ";
        Query hq = hs.createQuery(query);
        hq.setParameter("projectCode", projectCode);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        Long timeSpent = (Long)hq.uniqueResult();
        return timeSpent;
    }
    public static Long getTimeSpent(ProjectCode projectCode) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select sum(tsi.timeSpent) from TimeSpentItem as tsi ";
        query += "where ";
        query += "tsi.projectCode=:projectCode ";
        Query hq = hs.createQuery(query);
        hq.setParameter("projectCode", projectCode);
        Long timeSpent = (Long)hq.uniqueResult();
        return timeSpent;
    }

}
