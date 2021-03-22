/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.BusinessTripItem;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.BusinessTripReportForm;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class BusinessTripReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int a = o1.getProjectCode().getCode().compareTo(o2.getProjectCode().getCode());
            if(a != 0) {
                return a;
            }
            a = o1.getEmployee().getUserName().compareTo(o2.getEmployee().getUserName());
            if(a != 0) {
                return a;
            }
            a = o1.getStartDate().compareTo(o2.getStartDate());
            return a;
        }
    }
    public class Row {
        private ProjectCode projectCode;
        private Client client;
        private Employee employee;    
        private Long businessTripDaysCount;
        private Calendar startDate;
        private Calendar endDate;
        
        public Row() {
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Long getBusinessTripDaysCount() {
            return businessTripDaysCount;
        }

        public void setBusinessTripDaysCount(Long businessTripDaysCount) {
            this.businessTripDaysCount = businessTripDaysCount;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
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
    private List<Row> rows = new LinkedList<Row>();
    private BusinessTripReportForm form;
    
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    private Calendar startDate;
    private Calendar endDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Date createdAt;

    public BusinessTripReport(BusinessTripReportForm form, Module module, Employee currentUser) {
        this.form = form;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
      
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        Country country = currentUser.getCountry();
        if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
            subdepartments.addAll(country.getSubdepartments());
        } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
            subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module));
        }
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();
    }

    public BusinessTripReportForm getForm() {
        return form;
    }

    public void setForm(BusinessTripReportForm form) {
        this.form = form;
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


    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
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
        query += "select pc, c, e, bti from ";
        query += "ProjectCode as pc inner join pc.client as c inner join pc.businessTripItems as bti inner join bti.employee as e inner join pc.subdepartment as s ";
        query += "where ";
        query += "bti.day>=:startDate and bti.day<=:endDate ";
        query += "and s in (:subdepartments) ";
        query += "order by pc.id, e.id, bti.day ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        Row row = new Row();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Employee employee = (Employee)tuple[2];
            BusinessTripItem businessTripItem = (BusinessTripItem)tuple[3];
            
            if(
                    row.getProjectCode() == null || 
                    row.getEmployee() == null || 
                    row.getStartDate() == null ||
                    row.getEndDate() == null ||
                    ! row.getProjectCode().getId().equals(projectCode.getId()) ||
                    ! row.getEmployee().getId().equals(employee.getId())
            ) {
                row = new Row();
                row.setProjectCode(projectCode);
                row.setClient(client);
                row.setEmployee(employee);
                row.setStartDate(businessTripItem.getDay());
                row.setEndDate(businessTripItem.getDay());
                row.setBusinessTripDaysCount(new Long(1));
                rows.add(row);
            } else {
                if((new YearMonthDate(row.getEndDate()).getShifted(1)).equals(new YearMonthDate(businessTripItem.getDay()))) {
                    row.setEndDate(businessTripItem.getDay());
                    row.setBusinessTripDaysCount(row.getBusinessTripDaysCount() + new Long(1));
                } else {
                    row = new Row();
                    row.setProjectCode(projectCode);
                    row.setClient(client);
                    row.setEmployee(employee);
                    row.setStartDate(businessTripItem.getDay());
                    row.setEndDate(businessTripItem.getDay());
                    row.setBusinessTripDaysCount(new Long(1));
                    rows.add(row);                
                }
            }
        }
    }
}
