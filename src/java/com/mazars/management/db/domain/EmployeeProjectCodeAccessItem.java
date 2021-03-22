/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import java.util.Calendar;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.CalendarUtil;
import org.hibernate.Session;
import java.util.List;
/**
 *
 * @author glazov
 */
public class EmployeeProjectCodeAccessItem {
    private Long id;
    private ProjectCode projectCode;
    private Employee employee;
    public EmployeeProjectCodeAccessItem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public ProjectCode getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(ProjectCode projectCode) {
        this.projectCode = projectCode;
    }

    public static List<Group> getCurrentGroupsForOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select g from Group as g inner join g.clients as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee and pc.isClosed=false ").setParameter("employee", employee).list();
    }
    public static List<Client> getCurrentClientsForOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee and pc.isClosed=false ").setParameter("employee", employee).list();
    }
    public static List<Client> getCurrentClientsForOpenProjectCodes(Employee employee, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Group as g inner join g.clients as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee and pc.isClosed=false and g=:group ").setParameter("employee", employee).setParameter("group", group).list();
    }
    public static List<Client> getCurrentClientsForOpenProjectCodes(Employee employee, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e inner join pc.subdepartment as s where e=:employee and pc.isClosed=false and s=:subdepartment ").setParameter("employee", employee).setParameter("subdepartment", subdepartment).list();
    }
    public static List<ProjectCode> getCurrentOpenProjectCodes(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from ProjectCode as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee and pc.isClosed=false ").setParameter("employee", employee).list();
    }
    public static List<ProjectCode> getCurrentOpenProjectCodes(Employee employee, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from Client as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee and pc.isClosed=false and c=:client ").setParameter("employee", employee).setParameter("client", client).list();
    }
    public static List<ProjectCode> getCurrentOpenProjectCodes(Employee employee, Client client, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from Client as c inner join c.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e inner join pc.subdepartment as s where e=:employee and pc.isClosed=false and c=:client and s=:subdepartment ").setParameter("employee", employee).setParameter("client", client).setParameter("subdepartment", subdepartment).list();
    }
    public static List<Office> getCurrentOffices(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee ").setParameter("employee", employee).list();
    }
    public static List<Department> getCurrentDepartments(Employee employee, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where o=:office and e=:employee ").setParameter("office", office).setParameter("employee", employee).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Department as d inner join d.subdepartments as s inner join s.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where d=:department and e=:employee ").setParameter("department", department).setParameter("employee", employee).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.projectCodes as pc inner join pc.employeeProjectCodeAccessItems as epcai inner join epcai.employee as e where e=:employee ").setParameter("employee", employee).list();
    }
}
