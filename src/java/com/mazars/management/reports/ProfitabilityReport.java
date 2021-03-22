/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.ClientComparator;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
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
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.jobs.Job;
import com.mazars.management.web.forms.ProfitabilityReportForm;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ProfitabilityReport {
    private class ClientAndDepartment {
        Client client;
        Department department;
        public ClientAndDepartment(Client client, Department department) {
            this.client = client;
            this.department = department;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }
    }
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
        private Client client;
        private EmployeePositionHistoryItem employeePositionHistoryItem;
        private Task task;
        private Position position;
        private StandardPosition standardPosition;
        private Long timeSpent;
        private StandardSellingRate standardSellingRate;
        private StandardCost standardCost;
        private StandardSellingRateGroup standardSellingRateGroup;
        private StandardCostGroup standardCostGroup;
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

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public StandardCost getStandardCost() {
            return standardCost;
        }

        public void setStandardCost(StandardCost standardCost) {
            this.standardCost = standardCost;
        }

        public StandardSellingRate getStandardSellingRate() {
            return standardSellingRate;
        }

        public void setStandardSellingRate(StandardSellingRate standardSellingRate) {
            this.standardSellingRate = standardSellingRate;
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

        public Position getPosition() {
            return position;
        }

        public void setPosition(Position position) {
            this.position = position;
        }

        public StandardPosition getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(StandardPosition standardPosition) {
            this.standardPosition = standardPosition;
        }

        public StandardSellingRateGroup getStandardSellingRateGroup() {
            return standardSellingRateGroup;
        }

        public void setStandardSellingRateGroup(StandardSellingRateGroup standardSellingRateGroup) {
            this.standardSellingRateGroup = standardSellingRateGroup;
        }

        public StandardCostGroup getStandardCostGroup() {
            return standardCostGroup;
        }

        public void setStandardCostGroup(StandardCostGroup standardCostGroup) {
            this.standardCostGroup = standardCostGroup;
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
    
    private Job job;

    public ProfitabilityReport(ProfitabilityReportForm form, Module module, Employee currentUser) {
        
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
        subdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();

        currencies = CountryCurrency.getCurrencies(country);
    }
    public ProfitabilityReport(ProfitabilityReportForm form, Module module, Employee currentUser, Job job) {
        this(form, module, currentUser);
        this.job = job;
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
        int counter = 0;
        List<ClientAndDepartment> clientAndDepartments = getClientAndDepartments();
        for(Department department : getDepartments(clientAndDepartments)) {
            List<Client> clients = getClients(clientAndDepartments, department);
            Collections.sort(clients, new ClientComparator());
            for(Client client : clients) {
                if(job != null) {
                    job.setPart(((double)counter) / clientAndDepartments.size());
                }
                buildReport(client, department);
                counter++;
            }
        }
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    private List<ClientAndDepartment> getClientAndDepartments() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c, d from ";
        query += "TimeSpentItem as tsi inner join tsi.projectCode as pc inner join pc.client as c inner join pc.client ";
        query += "inner join pc.subdepartment as pc_s inner join pc_s.department as d ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        if(this.clients != null && ! this.clients.isEmpty()) {
            query += "and c in (:clients) ";
        }
        query += "and pc_s in (:subdepartments) ";
        query += "group by c, d ";     
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        if(this.clients != null && ! this.clients.isEmpty()) {
            hq.setParameterList("clients", clients);
        }
        hq.setParameterList("subdepartments", subdepartments);
        List<ClientAndDepartment> clientAndDepartments = new LinkedList<ClientAndDepartment>();
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            Department department = (Department)tuple[1];
            clientAndDepartments.add(new ClientAndDepartment(client, department));
        }
        return clientAndDepartments;
    }
    private List<Department> getDepartments(List<ClientAndDepartment> clientAndDepartments) {
        List<Department> departments = new LinkedList<Department>();
        for(ClientAndDepartment clientAndDepartment : clientAndDepartments) {
            boolean exists = false;
            for(Department department : departments) {
                if(department.getId().equals(clientAndDepartment.getDepartment().getId())) {
                    exists = true;
                    break;
                }
            }
            if(! exists) {
                departments.add(clientAndDepartment.getDepartment());
            }
        }
        return departments;
    }
    private List<Client> getClients(List<ClientAndDepartment> clientAndDepartments, Department department) {
        List<Client> clients = new LinkedList<Client>();
        for(ClientAndDepartment clientAndDepartment : clientAndDepartments) {
            if(department.equals(clientAndDepartment.getDepartment())) {
                clients.add(clientAndDepartment.getClient());
            }
        }
        return clients;
    }
    private void buildReport(Client client, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, ephi, t, p, sp, ssr, sc, ssrg, scg, tsi.timeSpent from ";
        query += "EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.projectCode as pc inner join pc.client as c inner join tsi.task as t inner join ephi.position as p inner join p.standardPosition as sp inner join p.subdepartment as s ";
        query += "inner join pc.subdepartment as pc_s inner join pc_s.department as d ";
        query += "left join s.standardSellingRateGroups as ssrg ";
        query += "left join ssrg.standardSellingRates as ssr ";
        query += "left join s.standardCostGroups as scg ";
        query += "left join scg.standardCosts as sc ";
        query += "where ";
        query += "(tsi.day>=:startDate and tsi.day<=:endDate) ";
        query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
        query += "and c=:client ";

        query += "and d=:department ";
//        query += "group by pc, ephi, t, ssr, sc ";
//        query += "having ";
//        query += "(ssrg=null or (tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null)) and p=ssr.position) ";
//        query += "and (scg=null or (tsi.day>=scg.start and (tsi.day<=scg.end or scg.end=null)) and p=sc.position) ";
        
        query += "and (ssrg=null or (tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null) and p=ssr.position)) ";
        query += "and (scg=null or (tsi.day>=scg.start and (tsi.day<=scg.end or scg.end=null) and p=sc.position)) ";


        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameter("client", client);
        hq.setParameter("department", department);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[1];
            Task task = (Task)tuple[2];
            Position position = (Position)tuple[3];
            StandardPosition standardPosition = (StandardPosition)tuple[4];
            StandardSellingRate standardSellingRate = (StandardSellingRate)tuple[5];
            StandardCost standardCost = (StandardCost)tuple[6];
            StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)tuple[7];
            StandardCostGroup standardCostGroup = (StandardCostGroup)tuple[8];
            Long timeSpent = new Long((Integer)tuple[9]);
            
            Row row = getRow(projectCode, employeePositionHistoryItem, task, standardSellingRate, standardCost);
            if(row == null) {
                row = new Row();
                row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
                row.setProjectCode(projectCode);
                row.setClient(client); // from parameter
                row.setTask(task);
                row.setPosition(position);
                row.setStandardPosition(standardPosition);
                row.setStandardSellingRate(standardSellingRate);
                row.setStandardCost(standardCost);
                row.setStandardSellingRateGroup(standardSellingRateGroup);
                row.setStandardCostGroup(standardCostGroup);
                row.setTimeSpent(timeSpent);
                rows.add(row);
            } else {
                Long tmpTimeSpent = row.getTimeSpent();
                if(tmpTimeSpent != null) {
                    tmpTimeSpent += timeSpent;
                } else {
                    tmpTimeSpent = timeSpent;
                }
                row.setTimeSpent(tmpTimeSpent);
            }
        }
    }
    private Row getRow(ProjectCode projectCode, EmployeePositionHistoryItem employeePositionHistoryItem, Task task, StandardSellingRate standardSellingRate, StandardCost standardCost) {
        for(Row row : rows) {
            if(row.getProjectCode().equals(projectCode) &&
                row.getEmployeePositionHistoryItem().equals(employeePositionHistoryItem) &&
                row.getTask().equals(task) &&
                ((row.getStandardSellingRate() == null && standardSellingRate == null) || (row.getStandardSellingRate() != null && row.getStandardSellingRate().equals(standardSellingRate)))  &&
                ((row.getStandardCost() == null && standardCost == null) || (row.getStandardCost() != null && row.getStandardCost().equals(standardCost)))    
                    ) {
                return row;
            }
        }
        return null;
    }
}
