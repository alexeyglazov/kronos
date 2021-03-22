/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.ClientComparator;
import com.mazars.management.db.comparators.DepartmentComparator;
import com.mazars.management.db.comparators.EmployeeComparator;
import com.mazars.management.db.comparators.GroupComparator;
import com.mazars.management.db.comparators.OfficeComparator;
import com.mazars.management.db.comparators.PositionComparator;
import com.mazars.management.db.comparators.ProjectCodeComparator;
import com.mazars.management.db.comparators.SubdepartmentComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.TaskReportForm;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class TaskReport {
    public class Row {
        private Group group;
        private Client client;
        private ProjectCode projectCode;
        private Employee employee;
        private Position position;
        private Subdepartment subdepartment;
        private Department department;
        private Office office;
        private Long timeSpent;

        public Row() {
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Position getPosition() {
            return position;
        }

        public void setPosition(Position position) {
            this.position = position;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }

        public Office getOffice() {
            return office;
        }

        public void setOffice(Office office) {
            this.office = office;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
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

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }
    }
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int result = 0;
            result = officeComparator.compare(o1.getOffice(), o2.getOffice());
            if(result != 0) {
                return result;
            }
            result = departmentComparator.compare(o1.getDepartment(), o2.getDepartment());
            if(result != 0) {
                return result;
            }
            result = subdepartmentComparator.compare(o1.getSubdepartment(), o2.getSubdepartment());
            if(result != 0) {
                return result;
            }
            result = positionComparator.compare(o1.getPosition(), o2.getPosition());
            if(result != 0) {
                return result;
            }
            result = employeeComparator.compare(o1.getEmployee(), o2.getEmployee());
            if(result != 0) {
                return result;
            }
            result = projectCodeComparator.compare(o1.getProjectCode(), o2.getProjectCode());
            return result;
        }
    }
    OfficeComparator officeComparator = new OfficeComparator();
    DepartmentComparator departmentComparator = new DepartmentComparator();
    SubdepartmentComparator subdepartmentComparator = new SubdepartmentComparator();
    PositionComparator positionComparator = new PositionComparator();
    EmployeeComparator employeeComparator = new EmployeeComparator();
    ProjectCodeComparator projectCodeComparator = new ProjectCodeComparator();
    
    private List<Row> rows = new LinkedList<Row>();
    private List<Office> offices = new LinkedList<Office>();
    private List<Department> departments = new LinkedList<Department>();
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<Position> positions = new LinkedList<Position>();
    private List<Employee> employees = new LinkedList<Employee>();
    private List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    private List<Client> clients = new LinkedList<Client>();
    private List<Group> groups = new LinkedList<Group>();

    private Task formTask;
    private Calendar formStartDate;
    private Calendar formEndDate;

    private Date createdAt;
    
    private Employee currentUser;
    private Module module;
    private TaskReportForm form;
    

    public TaskReport(TaskReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getTaskId() != null) {
            this.formTask = (Task)hs.get(Task.class, new Long(form.getTaskId()));
        }
        if(this.form.getStartDate() != null) {
            this.formStartDate = this.form.getStartDate().getCalendar();
        }
        if(this.form.getEndDate() != null) {
            this.formEndDate = this.form.getEndDate().getCalendar();
        }
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<Office> getOffices() {
        return offices;
    }

    public void setOffices(List<Office> offices) {
        this.offices = offices;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<Position> getPositions() {
        return positions;
    }

    public void setPositions(List<Position> positions) {
        this.positions = positions;
    }

    public List<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(List<Employee> employees) {
        this.employees = employees;
    }

    public List<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    public List<Group> getGroups() {
        return groups;
    }

    public void setGroups(List<Group> groups) {
        this.groups = groups;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Task getFormTask() {
        return formTask;
    }

    public void setFormTask(Task formTask) {
        this.formTask = formTask;
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

    public void build() {
        buildTimespentReport();
        findEntitiesInRows();
        employeeComparator.setMode(EmployeeComparator.Mode.FIRSTNAME_LASTNAME);
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildTimespentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select o, d, s, p, e, pc, c, g, sum(tsi.timeSpent) from Task as t ";
        query += "inner join t.timeSpentItems as tsi ";
        query += "inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "left join tsi.projectCode as pc ";
        query += "left join pc.client as c ";
        query += "left join c.group as g ";

        query += "where "
        + "t=:task ";
        if(this.formStartDate != null) {
            query += "and tsi.day>=:startDate ";
        }                        
        if(this.formEndDate != null) {
            query += "and tsi.day<=:endDate ";
        }                        
        query += "and (ephi.start<=tsi.day and (ephi.end=null or ephi.end>=tsi.day)) ";
        query += "group by e, p, pc, t";
        Query hq = hs.createQuery(query);
        hq.setParameter("task", formTask);
        if(this.formStartDate != null) {
            hq.setParameter("startDate", formStartDate);
        }
        if(this.formEndDate != null) {
            hq.setParameter("endDate", formEndDate);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            //o, d, s, p, ephi, e, sum(tsi.timeSpent)
            Office office = (Office)tuple[0];
            Department department = (Department)tuple[1];
            Subdepartment subdepartment = (Subdepartment)tuple[2];
            Position position = (Position)tuple[3];
            Employee employee = (Employee)tuple[4];
            ProjectCode projectCode = (ProjectCode)tuple[5];
            Client client = (Client)tuple[6];
            Group group = (Group)tuple[7];
            Long timeSpent = (Long)tuple[8];
            Row row = new Row();
            row.setOffice(office);
            row.setDepartment(department);
            row.setSubdepartment(subdepartment);
            row.setPosition(position);
            row.setEmployee(employee);
            row.setTimeSpent(timeSpent);
            row.setProjectCode(projectCode);
            row.setClient(client);
            row.setGroup(group);
            rows.add(row);
        }
    }
    public void findEntitiesInRows() {
        for(Row row : rows) {
            Office office = row.getOffice();
            Department department = row.getDepartment();
            Subdepartment subdepartment = row.getSubdepartment();
            Position position = row.getPosition();
            Employee employee = row.getEmployee();
            ProjectCode projectCode = row.getProjectCode();
            Client client = row.getClient();
            Group group = row.getGroup();
            if(! offices.contains(office)) {
                offices.add(office);
            }
            if(! departments.contains(department)) {
                departments.add(department);
            }
            if(! subdepartments.contains(subdepartment)) {
                subdepartments.add(subdepartment);
            }
            if(! positions.contains(position)) {
                positions.add(position);
            }
            if(! employees.contains(employee)) {
                employees.add(employee);
            }
            if(projectCode != null && ! projectCodes.contains(projectCode)) {
                projectCodes.add(projectCode);
            }
            if(client != null && ! clients.contains(client)) {
                clients.add(client);
            }
            if(group != null && ! groups.contains(group)) {
                groups.add(group);
            }
        }
        Collections.sort(offices, new OfficeComparator());
        Collections.sort(departments, new DepartmentComparator());
        Collections.sort(subdepartments, new SubdepartmentComparator());
        Collections.sort(positions, new PositionComparator());
        Collections.sort(employees, new EmployeeComparator());
        Collections.sort(projectCodes, new ProjectCodeComparator());
        Collections.sort(clients, new ClientComparator());
        Collections.sort(groups, new GroupComparator());
    }
}
