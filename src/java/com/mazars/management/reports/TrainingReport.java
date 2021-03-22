/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.TrainingReportForm;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class TrainingReport {
    public enum SearchType {
        TRAINING,
        KEYWORD
    }
    public class Row {
        private Employee employee;
        private Office office;
        private Department department;
        private Subdepartment subdepartment;
        private Task task;
        private TimeSpentItem timeSpentItem;

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

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

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }

        public TimeSpentItem getTimeSpentItem() {
            return timeSpentItem;
        }

        public void setTimeSpentItem(TimeSpentItem timeSpentItem) {
            this.timeSpentItem = timeSpentItem;
        }
    }

    private Calendar startDate;
    private Calendar endDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();

    private TrainingReportForm form;
    private Date createdAt;

    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private SearchType formSearchType;
    private String formKeyword;
    
    private List<Row> rows = new LinkedList<Row>();
    
    public TrainingReport (TrainingReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        this.formKeyword = form.getKeyword();
        this.formSearchType = form.getSearchType();
        Country country = currentUser.getCountry();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(country.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module));
        }
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
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

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public String getFormKeyword() {
        return formKeyword;
    }

    public void setFormKeyword(String formKeyword) {
        this.formKeyword = formKeyword;
    }

    public SearchType getFormSearchType() {
        return formSearchType;
    }

    public void setFormSearchType(SearchType formSearchType) {
        this.formSearchType = formSearchType;
    }

    public TrainingReportForm getForm() {
        return form;
    }

    public void setForm(TrainingReportForm form) {
        this.form = form;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

  
    public void build() {
        buildTraining();
        this.createdAt = new Date();
    }
    private void buildTraining() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, o, d, s, t, tsi from TimeSpentItem as tsi inner join tsi.employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join tsi.task as t inner join t.taskType as tt inner join tt.subdepartment as tts ";
        query += "where tsi.day>=:startDate and tsi.day<=:endDate ";
        if(SearchType.KEYWORD.equals(this.formSearchType)) {
            query += "and tt.isInternal=true ";
        } else if(SearchType.TRAINING.equals(this.formSearchType)) {
            query += "and t.isTraining=true ";
        }
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        query += "and e.isAdministrator!=true ";
        if(SearchType.KEYWORD.equals(this.formSearchType)) {
            query += "and (t.name like :keyword1 or tsi.description like :keyword2) ";
        }
        query += "order by e.userName, tsi.day ";
        
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        if(SearchType.KEYWORD.equals(this.formSearchType)) {
            hq.setParameter("keyword1", "%" + this.formKeyword + "%");
            hq.setParameter("keyword2", "%" + this.formKeyword + "%");
        }
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Office office = (Office)tuple[1];
            Department department = (Department)tuple[2];
            Subdepartment subdepartment = (Subdepartment)tuple[3]; 
            Task task = (Task)tuple[4];
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[5]; 
            Row row = new Row();
            row.setEmployee(employee);
            row.setOffice(office);
            row.setDepartment(department);       
            row.setSubdepartment(subdepartment);
            row.setTask(task);
            row.setTimeSpentItem(timeSpentItem);
            rows.add(row);
        }
    }
}
