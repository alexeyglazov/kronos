/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.StandardCost;
import com.mazars.management.db.domain.StandardCostGroup;
import com.mazars.management.db.domain.StandardPosition;
import com.mazars.management.db.domain.StandardSellingRate;
import com.mazars.management.db.domain.StandardSellingRateGroup;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.CodeListReportForm;
import java.math.BigDecimal;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class CodeListReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int a = o1.getProjectCode().getCode().compareTo(o2.getProjectCode().getCode());
            return a;
        }
    }
    public class Row {
        private ProjectCode projectCode;
        private Client client;
        private Group group;
        
        public Row() {
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
    private List<Row> rows = new LinkedList<Row>();
    private CodeListReportForm form;
    
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Date createdAt;

    public CodeListReport(CodeListReportForm form, Module module, Employee currentUser) {
        this.form = form;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
      
        Country country = currentUser.getCountry();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(country.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            // access to all subdepartments
            subdepartments.addAll(country.getSubdepartments());
        }
    }

    public CodeListReportForm getForm() {
        return form;
    }

    public void setForm(CodeListReportForm form) {
        this.form = form;
    }


    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }


    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public void build() {
        buildReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    private void buildReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, c, g from ";
        query += "ProjectCode as pc inner join pc.subdepartment as s inner join pc.client as c left join c.group as g ";
        query += "where ";
        query += "s in (:subdepartments) ";
        
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Group group = (Group)tuple[2];
            Row row = new Row();
            row.setProjectCode(projectCode);
            row.setClient(client);
            row.setGroup(group);
            rows.add(row);
        }
    }
}
