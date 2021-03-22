/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;

import com.mazars.management.db.domain.BusinessTripItem;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.domain.TaskType;
import com.mazars.management.db.domain.TimeSpentItem;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.OutOfOfficeReportForm;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class OutOfOfficeReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            String employeeLastName1 = "";
            String employeeLastName2 = "";
            String employeeFirstName1 = "";
            String employeeFirstName2 = "";
            if(o1.getEmployee() != null) {
                employeeLastName1 = o1.getEmployee().getLastName();
                employeeFirstName1 = o1.getEmployee().getFirstName();
            }
            if(o2.getEmployee() != null) {
                employeeLastName2 = o2.getEmployee().getLastName();
                employeeFirstName2 = o2.getEmployee().getFirstName();
            }
            int a = employeeLastName1.compareTo(employeeLastName2);
            if(a != 0) {
                return a;
            }
            a = employeeFirstName1.compareTo(employeeFirstName2);
            if(a != 0) {
                return a;
            }
            a = o1.getStartDate().compareTo(o2.getStartDate());
            if(a != 0) {
                return a;
            }
            a = o1.getEndDate().compareTo(o2.getEndDate());
            if(a != 0) {
                return a;
            }
            return a;
        }
    }        
    public class Row {
        private Employee employee;
        private Calendar startDate;
        private Calendar endDate;

        public Row() {
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Calendar getStartDate() {
            return startDate;
        }

        public void setStartDate(Calendar startDate) {
            this.startDate = startDate;
        }

        public Calendar getEndDate() {
            return endDate;
        }

        public void setEndDate(Calendar endDate) {
            this.endDate = endDate;
        }
    }
    public class TaskRow extends Row {
        private Task task;

        public TaskRow() {
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }       
    }
    public class BusinessTripRow extends Row {
        private ProjectCode projectCode;

        public BusinessTripRow() {
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private OutOfOfficeReportForm form;
    
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    private Calendar startDate;
    private Calendar endDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Date createdAt;
    
    public OutOfOfficeReport(OutOfOfficeReportForm form, Module module, Employee currentUser) {
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
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();
        subdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }
    
    public void build() {
        buildReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    private void buildReport() {
        buildTaskReport();
        buildBusinessTripReport();
    }
    private void buildTaskReport() {
        List<Task> allTasks = TaskType.getCommonInternalTasks();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select t, e, tsi from ";
        query += "Task as t inner join t.timeSpentItems as tsi inner join tsi.employee as e inner join e.position as p inner join p.subdepartment as s ";
        query += "where ";
        query += "tsi.day>=:startDate and tsi.day<=:endDate ";
        query += "and t in (:tasks) ";
        query += "and s in (:subdepartments) ";
        query += "order by t.id, e.id, tsi.day ";
        
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameterList("tasks", allTasks);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        TaskRow row = new TaskRow();
        for(Object[] tuple : selection) {
            Task task = (Task)tuple[0];
            Employee employee = (Employee)tuple[1];
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[2];
            
            if(
                    row.getTask() == null || 
                    row.getEmployee() == null || 
                    row.getStartDate() == null ||
                    row.getEndDate() == null ||
                    ! row.getTask().getId().equals(task.getId()) ||
                    ! row.getEmployee().getId().equals(employee.getId())
            ) {
                row = new TaskRow();
                row.setTask(task);
                row.setEmployee(employee);
                row.setStartDate(timeSpentItem.getDay());
                row.setEndDate(timeSpentItem.getDay());
                rows.add(row);
            } else {
                if((new YearMonthDate(row.getEndDate()).getShifted(1)).equals(new YearMonthDate(timeSpentItem.getDay()))) {
                    row.setEndDate(timeSpentItem.getDay());
                } else {
                    row = new TaskRow();
                    row.setTask(task);
                    row.setEmployee(employee);
                    row.setStartDate(timeSpentItem.getDay());
                    row.setEndDate(timeSpentItem.getDay());
                    rows.add(row);                
                }
            }
        }                
    }
        
    private void buildBusinessTripReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, e, bti from ";
        query += "ProjectCode as pc inner join pc.businessTripItems as bti inner join bti.employee as e inner join pc.subdepartment as s ";
        query += "where ";
        query += "bti.day>=:startDate and bti.day<=:endDate ";
        query += "and s in (:subdepartments) ";
        query += "order by pc.id, e.id, bti.day ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        BusinessTripRow row = new BusinessTripRow();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Employee employee = (Employee)tuple[1];
            BusinessTripItem businessTripItem = (BusinessTripItem)tuple[2];
            
            if(
                    row.getProjectCode() == null || 
                    row.getEmployee() == null || 
                    row.getStartDate() == null ||
                    row.getEndDate() == null ||
                    ! row.getProjectCode().getId().equals(projectCode.getId()) ||
                    ! row.getEmployee().getId().equals(employee.getId())
            ) {
                row = new BusinessTripRow();
                row.setProjectCode(projectCode);
                row.setEmployee(employee);
                row.setStartDate(businessTripItem.getDay());
                row.setEndDate(businessTripItem.getDay());
                rows.add(row);
            } else {
                if((new YearMonthDate(row.getEndDate()).getShifted(1)).equals(new YearMonthDate(businessTripItem.getDay()))) {
                    row.setEndDate(businessTripItem.getDay());
                } else {
                    row = new BusinessTripRow();
                    row.setProjectCode(projectCode);
                    row.setEmployee(employee);
                    row.setStartDate(businessTripItem.getDay());
                    row.setEndDate(businessTripItem.getDay());
                    rows.add(row);                
                }
            }
        }        
    }
}
