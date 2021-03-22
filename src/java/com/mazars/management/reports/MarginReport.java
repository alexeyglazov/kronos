/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import java.util.*;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.StandardCost;
import com.mazars.management.db.domain.StandardSellingRate;

import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.ProfitabilityReportForm;
import org.hibernate.Session;
import org.hibernate.Query;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class MarginReport {
    public class RowComparator implements Comparator<Row> {
        public int compare(Row o1, Row o2) {
            int a = o1.getProjectCode().getCode().compareTo(o2.getProjectCode().getCode());
            if(a != 0) {
                return a;
            }
            a = o1.getEmployeePositionHistoryItem().getEmployee().getUserName().compareTo(o2.getEmployeePositionHistoryItem().getEmployee().getUserName());
            if(a != 0) {
                return a;
            }
            a = o1.getEmployeePositionHistoryItem().getPosition().getName().compareTo(o2.getEmployeePositionHistoryItem().getPosition().getName());
            if(a != 0) {
                return a;
            }
            a = o1.getTask().getName().compareTo(o2.getTask().getName());
            return a;
        }
    }
    public class Row {
        private ProjectCode projectCode;
        private EmployeePositionHistoryItem employeePositionHistoryItem;
        private Task task;
        private Long timeSpent;
        private StandardSellingRate standardSellingRate;
        private StandardCost standardCost;
        public Row() {
        }

        public EmployeePositionHistoryItem getEmployeePositionHistoryItem() {
            return employeePositionHistoryItem;
        }

        public void setEmployeePositionHistoryItem(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.employeePositionHistoryItem = employeePositionHistoryItem;
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public StandardSellingRate getStandardSellingRate() {
            return standardSellingRate;
        }

        public void setStandardSellingRate(StandardSellingRate standardSellingRate) {
            this.standardSellingRate = standardSellingRate;
        }

        public StandardCost getStandardCost() {
            return standardCost;
        }

        public void setStandardCost(StandardCost standardCost) {
            this.standardCost = standardCost;
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<Currency> currencies = new LinkedList<Currency>();
    private ProfitabilityReportForm form;
    
    private Group formGroup;
    private Client formClient;
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    private Calendar startDate;
    private Calendar endDate;
    private List<Client> clients = new LinkedList<Client>();
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Date createdAt;

    public MarginReport(ProfitabilityReportForm form, Module module, Employee currentUser) {
        this.form = form;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getGroupId() != null) {
            this.formGroup = (Group)hs.get(Group.class, new Long(form.getGroupId()));
        }
        if(this.form.getClientId() != null) {
            this.formClient = (Client)hs.get(Client.class, new Long(form.getClientId()));
        }
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
        Country country = currentUser.getCountry();
        if(this.formClient != null) {
            clients.add(this.formClient);
        } else if(formGroup != null) {
            clients.addAll(formGroup.getClients());
        }
        if(this.formSubdepartment != null) {
            subdepartments.add(this.formSubdepartment);
        } else if(this.formDepartment != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                subdepartments.addAll(this.formDepartment.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, this.formDepartment));
            }
        } else if(this.formOffice != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                subdepartments.addAll(this.formOffice.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, this.formOffice));
            }
        } else {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                subdepartments.addAll(country.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module));
            }
        }
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();

        currencies = CountryCurrency.getCurrencies(country);
    }

    public ProfitabilityReportForm getForm() {
        return form;
    }

    public void setForm(ProfitabilityReportForm form) {
        this.form = form;
    }

    public Client getFormClient() {
        return formClient;
    }

    public void setFormClient(Client formClient) {
        this.formClient = formClient;
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

    public Group getFormGroup() {
        return formGroup;
    }

    public void setFormGroup(Group formGroup) {
        this.formGroup = formGroup;
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

    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
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

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    public void build() {
        buildReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildReport() {
        List<Object[]> selection = getSelection();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[1];
            Task task = (Task)tuple[2];
            StandardSellingRate standardSellingRate = (StandardSellingRate)tuple[3];
            StandardCost standardCost = (StandardCost)tuple[4];
            Long timeSpent = (Long)tuple[5];
            Row row = new Row();
            row = new Row();
            row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
            row.setProjectCode(projectCode);
            row.setTask(task);
            row.setStandardSellingRate(standardSellingRate);
            row.setStandardCost(standardCost);
            row.setTimeSpent(timeSpent);
            rows.add(row);
        }
    }
    
    private List<Object[]> getSelection() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, ephi, t, ssri, sci, sum(tsi.timeSpent), ssrg, scg, tsi, p from ";
        query += "EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.projectCode as pc inner join tsi.task as t inner join ephi.position as p inner join p.subdepartment as s ";
        if(this.clients != null && ! this.clients.isEmpty()) {
            query += "inner join pc.client as c ";
        }
        query += "inner join pc.subdepartment as pc_s ";
        query += "left join s.standardSellingRateGroups as ssrg ";
        query += "left join ssrg.standardSellingRates as ssri ";
        query += "left join s.standardCostGroups as scg ";
        query += "left join scg.standardCosts as sci ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
        if(this.clients != null && ! this.clients.isEmpty()) {
            query += "and c in (:clients) ";
        }
        query += "and pc_s in (:subdepartments) ";
        query += "and e.isAdministrator!=true ";
        query += "group by pc, ephi, t, ssri, sci ";
        query += "having ";
        query += "(ssrg=null or (tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null)) and p.standardPosition=ssri.standardPosition) ";
        query += "and (scg=null or (tsi.day>=scg.start and (tsi.day<=scg.end or scg.end=null)) and p.standardPosition=sci.standardPosition) ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        if(this.clients != null && ! this.clients.isEmpty()) {
            hq.setParameterList("clients", clients);
        }
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        return selection;
    }
}
