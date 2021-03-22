/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.ClientComparator;
import com.mazars.management.db.comparators.EmployeeComparator;
import com.mazars.management.db.comparators.GroupComparator;
import com.mazars.management.db.comparators.ProjectCodeComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.ActualTimespentReportForm;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ActualTimespentReport {
    public class Row {
        private Group group;
        private Client client;
        private ProjectCode projectCode;
        private Employee employee;
        private Long timespent;

        public Row() {
        }
        public Employee getEmployee() {
            return employee;
        }
        public void setEmployee(Employee employee) {
            this.employee = employee;
        }
        public Long getTimespent() {
            return timespent;
        }
        public void setTimespent(Long timespent) {
            this.timespent = timespent;
        }
        public ProjectCode getProjectCode() {
            return projectCode;
        }
        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }
    }
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int result = 0;
            String groupName1 = "";
            String groupName2 = "";
            if(o1.getGroup() != null) {
                groupName1 = o1.getGroup().getName();
            }
            if(o2.getGroup() != null) {
                groupName2 = o2.getGroup().getName();
            }
            result = groupName1.compareTo(groupName2);
            if(result != 0) {
                return result;
            }
            result = clientComparator.compare(o1.getClient(), o2.getClient());
            if(result != 0) {
                return result;
            }
            result = projectCodeComparator.compare(o1.getProjectCode(), o2.getProjectCode());
            if(result != 0) {
                return result;
            }
            result = employeeComparator.compare(o1.getEmployee(), o2.getEmployee());
            if(result != 0) {
                return result;
            }
            return result;
        }
    }
    GroupComparator groupComparator = new GroupComparator();
    ClientComparator clientComparator = new ClientComparator();
    ProjectCodeComparator projectCodeComparator = new ProjectCodeComparator();
    EmployeeComparator employeeComparator = new EmployeeComparator();
    
    private List<Row> rows = new LinkedList<Row>();
    private Group formGroup;
    private Client formClient;
    private ProjectCode formProjectCode;
    private Integer formYear;
    private Date createdAt;
    private Employee currentUser;
    private Module module;
    private ActualTimespentReportForm form;
    

    public ActualTimespentReport(ActualTimespentReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getGroupId() != null) {
            this.formGroup = (Group)hs.get(Group.class, new Long(form.getGroupId()));
        }
        if(this.form.getClientId() != null) {
            this.formClient = (Client)hs.get(Client.class, new Long(form.getClientId()));
        }
        if(this.form.getProjectCodeId() != null) {
            this.formProjectCode = (ProjectCode)hs.get(ProjectCode.class, new Long(form.getProjectCodeId()));
        }
        this.formYear = this.form.getYear();
    }

    public Group getFormGroup() {
        return formGroup;
    }
    public void setFormGroup(Group formGroup) {
        this.formGroup = formGroup;
    }
    public Client getFormClient() {
        return formClient;
    }
    public void setFormClient(Client formClient) {
        this.formClient = formClient;
    }
    public ProjectCode getFormProjectCode() {
        return formProjectCode;
    }
    public void setFormProjectCode(ProjectCode formProjectCode) {
        this.formProjectCode = formProjectCode;
    }

    public Integer getFormYear() {
        return formYear;
    }

    public void setFormYear(Integer formYear) {
        this.formYear = formYear;
    }
    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void build() {
        buildTimespentReport();
        employeeComparator.setMode(EmployeeComparator.Mode.FIRSTNAME_LASTNAME);
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildTimespentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select g, c, pc, e, sum(tsi.timeSpent) from TimeSpentItem as tsi ";
        query += "inner join tsi.employee as e ";
        query += "inner join tsi.projectCode as pc inner join pc.client as c left join c.group as g ";
        query += "inner join pc.subdepartment as s ";
        
        query += "where ";
        query += "s in :subdepartments ";
        query += "and pc.year=:year ";
        if(this.formGroup != null) {
            query += "and g=:group ";
        }                        
        if(this.formClient != null) {
            query += "and c=:client ";
        }                        
        if(this.formProjectCode != null) {
            query += "and pc=:projectCode ";
        }                        
        query += "group by pc, e ";
        Query hq = hs.createQuery(query);
        List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        hq.setParameterList("subdepartments", subdepartments);
        hq.setParameter("year", this.formYear);
        if(this.formGroup != null) {
            hq.setParameter("group", this.formGroup);
        }
        if(this.formClient != null) {
            hq.setParameter("client", this.formClient);
        }
        if(this.formProjectCode != null) {
            hq.setParameter("projectCode", this.formProjectCode);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            //pc, e, sum(tsi.timeSpent)
            Group group = (Group)tuple[0];
            Client client = (Client)tuple[1];
            ProjectCode projectCode = (ProjectCode)tuple[2];
            Employee employee = (Employee)tuple[3];
            Long timespent = (Long)tuple[4];
            Row row = new Row();
            row.setGroup(group);
            row.setClient(client);
            row.setProjectCode(projectCode);
            row.setEmployee(employee);
            row.setTimespent(timespent);
            rows.add(row);
        }
    }
}
