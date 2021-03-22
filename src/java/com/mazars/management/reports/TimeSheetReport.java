/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.TimeSheetReportForm;
import java.util.*;
import java.util.Calendar;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class TimeSheetReport {
    public class Row {
        private String groupName;
        private String clientName;
        private String code;
        private Calendar day;
        private Integer timeSpent;
        private String description;
        private String taskTypeName;
        private String taskName;
        private Date modifiedAt;

        public Row(String groupName, String clientName, String code, Calendar day, Integer timeSpent, String description, String taskTypeName, String taskName, Date modifiedAt) {
            this.groupName = groupName;
            this.clientName = clientName;
            this.code = code;
            this.day = day;
            this.timeSpent = timeSpent;
            this.description = description;
            this.taskTypeName = taskTypeName;
            this.taskName = taskName;
            this.modifiedAt = modifiedAt;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
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

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Date getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(Date modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }
    }

    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
    private Employee currentUser;
    private Module module;
    private TimeSheetReportForm form;
    private Calendar formStartDate;
    private Calendar formEndDate;
    private Employee formEmployee;
    private Subdepartment formEmployeeSubdepartment;
    private Department formEmployeeDepartment;

    public TimeSheetReport(TimeSheetReportForm form, Module module, Employee currentUser) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = form.getStartDate().getCalendar();
        this.formEndDate = form.getEndDate().getCalendar();
        this.formEmployee = (Employee)hs.get(Employee.class, form.getEmployeeId());
        this.formEmployeeSubdepartment = formEmployee.getSubdepartment();
        this.formEmployeeDepartment = formEmployeeSubdepartment.getDepartment();
    }
    public List<Row> getRows() {
        return rows;
    }

    public Date getCreatedAt() {
        return createdAt;
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

    public TimeSheetReportForm getForm() {
        return form;
    }

    public void setForm(TimeSheetReportForm form) {
        this.form = form;
    }

    public Calendar getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(Calendar formStartDate) {
        this.formStartDate = formStartDate;
    }

    public Calendar getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(Calendar formEndDate) {
        this.formEndDate = formEndDate;
    }

    public Employee getFormEmployee() {
        return formEmployee;
    }

    public void setFormEmployee(Employee formEmployee) {
        this.formEmployee = formEmployee;
    }

    public Subdepartment getFormEmployeeSubdepartment() {
        return formEmployeeSubdepartment;
    }

    public void setFormEmployeeSubdepartment(Subdepartment formEmployeeSubdepartment) {
        this.formEmployeeSubdepartment = formEmployeeSubdepartment;
    }

    public Department getFormEmployeeDepartment() {
        return formEmployeeDepartment;
    }

    public void setFormEmployeeDepartment(Department formEmployeeDepartment) {
        this.formEmployeeDepartment = formEmployeeDepartment;
    }

    public void build() {
        process(getSelection());
        this.createdAt = new Date();
    }
    public List<Object[]> getSelection() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select tsi, pc.code, c.name, g.name, t.name, tt.name from Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt left join tsi.projectCode as pc left join pc.client as c left join c.group as g ";
        query += "where tsi.day>=:startDate and tsi.day<=:endDate and e=:employee ";
        query += "and e.isAdministrator!=true ";
        query += "order by g.name, c.name, pc.code, tsi.day";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", formStartDate).setParameter("endDate", formEndDate);
        hq.setParameter("employee", formEmployee);
        return (List<Object[]>)hq.list();
    }
    public void process(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[0];
            String groupName = (String)tuple[3];
            String clientName = (String)tuple[2];
            String code = (String)tuple[1];
            Calendar day = timeSpentItem.getDay();
            Integer timeSpent = timeSpentItem.getTimeSpent();
            String description = timeSpentItem.getDescription();
            String taskTypeName = (String)tuple[5];
            String taskName = (String)tuple[4];
            Date modifiedAt = timeSpentItem.getModifiedAt();
            Row row = new Row(groupName, clientName, code, day, timeSpent, description, taskTypeName, taskName, modifiedAt);
            this.rows.add(row);
        }
    }
}
