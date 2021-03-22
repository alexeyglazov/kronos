/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import org.hibernate.Session;

import java.util.List;
import org.hibernate.Query;

/**
 *
 * @author glazov
 */
public class RightsItem {
    private Long id;
    private Employee employee;
    private Module module;
    private Subdepartment subdepartment;

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }

    public static List<Country> getCountries(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Country>)hs.createQuery("select distinct c from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Office> getOffices(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Office> getOffices(Employee employee, Module module, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and c=:country").setParameter("employee", employee).setParameter("module", module).setParameter("country", country).list();
    }
    public static List<Employee> getEmployees(Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct pe from Employee as e inner join e.rightsItems as ri inner join ri.module as m inner join ri.subdepartment as s inner join s.positions as p inner join p.employees as pe where e=:employee and m=:module").setParameter("employee", user).setParameter("module", module).list();
    }
    public static List<Employee> getEmployees(Employee user, Module module, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct pe from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employees as pe inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and c=:country").setParameter("employee", user).setParameter("module", module).setParameter("country", country).list();
    }
    public static List<Employee> getEmployees(Employee user, Module module, Country country, List<String> externalIds) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct pe from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employees as pe inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and c=:country and pe.externalId in (:externalIds)";
        Query hq = hs.createQuery(query);
        return (List<Employee>)hq.setParameter("employee", user).setParameter("module", module).setParameter("country", country).setParameterList("externalIds", externalIds).list();
    }
    public static List<Employee> getEmployees(Employee employee, Module module, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct pe from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employees as pe inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and o=:office").setParameter("employee", employee).setParameter("module", module).setParameter("office", office).list();
    }
    public static List<Employee> getEmployees(Employee employee, Module module, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct pe from Department as d inner join d.subdepartments as s inner join s.positions as p inner join p.employees as pe inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and d=:department").setParameter("employee", employee).setParameter("module", module).setParameter("department", department).list();
    }
    public static List<Employee> getEmployees(Employee employee, Module module, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Employee>)hs.createQuery("select distinct pe from Subdepartment as s inner join s.positions as p inner join p.employees as pe inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and s=:subdepartment").setParameter("employee", employee).setParameter("module", module).setParameter("subdepartment", subdepartment).list();
    }
    public static List<Department> getDepartments(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Department as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Department> getDepartments(Employee employee, Module module, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and o=:office").setParameter("employee", employee).setParameter("module", module).setParameter("office", office).list();
    }
    public static List<Subdepartment> getSubdepartments(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Subdepartment> getSubdepartments(Employee employee, Module module, Department department) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Department as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and d=:department").setParameter("employee", employee).setParameter("module", module).setParameter("department", department).list();
    }
    public static List<Subdepartment> getSubdepartments(Employee employee, Module module, Office office) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and o=:office").setParameter("employee", employee).setParameter("module", module).setParameter("office", office).list();
    }
    public static List<Subdepartment> getSubdepartments(Employee employee, Module module, Country country) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Country as c inner join c.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.employee as e inner join ri.module as m where e=:employee and m=:module and c=:country").setParameter("employee", employee).setParameter("module", module).setParameter("country", country).list();
    }
    // checks if user has access to employee for the module
    public static Boolean isAvailable(Employee employee, Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Long count = (Long)hs.createQuery("select count(*) from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.rightsItems as ri inner join ri.employee as user inner join ri.module as m where m=:module and e=:employee and user=:user").setParameter("module", module).setParameter("employee", employee).setParameter("user", user).uniqueResult();
        return count != 0;
    }
    // checks if user has access to position for the module
    public static Boolean isAvailable(Position position, Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Long count = (Long)hs.createQuery("select count(*) from Position as p inner join p.subdepartment as s inner join s.rightsItems as ri inner join ri.employee as user inner join ri.module as m where m=:module and p=:position and user=:user").setParameter("module", module).setParameter("position", position).setParameter("user", user).uniqueResult();
        return count != 0;
    }
    public static Boolean isAvailable(Subdepartment subdepartment, Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Long count = (Long)hs.createQuery("select count(*) from Subdepartment as s inner join s.rightsItems as ri inner join ri.employee as user inner join ri.module as m where m=:module and s=:subdepartment and user=:user").setParameter("module", module).setParameter("subdepartment", subdepartment).setParameter("user", user).uniqueResult();
        return count != 0;
    }
    // checks if user has some rights for the module
    public static Boolean isAvailable(Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Long count = (Long)hs.createQuery("select count(*) from RightsItem as ri inner join ri.employee as e inner join ri.module as m where m=:module and e=:employee").setParameter("module", module).setParameter("employee", user).uniqueResult();
        return count != 0;
    }
    public static List<Group> getGroups(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select g from Group as g inner join g.workCountry as wc inner join wc.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where e=:employee and m=:module group by g ").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Client> getClients(Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.workCountry as wc inner join wc.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where e=:employee and m=:module").setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<Client> getClients(Employee employee, Module module, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select distinct c from Group as g inner join g.clients as c inner join  c.workCountry as wc inner join wc.offices as o inner join o.departments as d inner join d.subdepartments as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where g=:group and e=:employee and m=:module").setParameter("group", group).setParameter("employee", employee).setParameter("module", module).list();
    }
    public static List<ProjectCode> getProjectCodes(Employee employee, Module module, Client client) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from Client as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where e=:employee and m=:module and c=:client").setParameter("employee", employee).setParameter("module", module).setParameter("client", client).list();
    }
    public static List<ProjectCode> getProjectCodes(Employee employee, Module module, Group group) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from Group as g inner join g.clients as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where e=:employee and m=:module and g=:group").setParameter("employee", employee).setParameter("module", module).setParameter("group", group).list();
    }
    public static List<ProjectCode> getProjectCodes(Employee employee, Module module, Country clientCountry) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select distinct pc from Country as wc inner join wc.clients as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e where e=:employee and m=:module and wc=:workCountry").setParameter("employee", employee).setParameter("module", module).setParameter("workCountry", clientCountry).list();
    }
    public static List<ProjectCode> getProjectCodes(Employee employee, Module module, Country clientCountry, Date createdAtFrom, Date createdAtTo, Date modifiedAtFrom, Date modifiedAtTo, Date closedAtFrom, Date closedAtTo) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select distinct pc from Country as wc inner join wc.clients as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
        query += "where ";
        query += "e=:employee and m=:module and wc=:workCountry ";
        boolean isUsed = true;
        if(createdAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.createdAt>=:createdAtFrom ";
            isUsed = true;
        }
        if(createdAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.createdAt<=:createdAtTo ";
            isUsed = true;
        }
        if(modifiedAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.modifiedAt>=:modifiedAtFrom ";
            isUsed = true;
        }
        if(modifiedAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.modifiedAt<=:modifiedAtTo ";
            isUsed = true;
        }
        if(closedAtFrom != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.closedAt>=:closedAtFrom ";
            isUsed = true;
        }
        if(closedAtTo != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "pc.closedAt<=:closedAtTo ";
            isUsed = true;
        }
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee);
        hq.setParameter("module", module);
        hq.setParameter("workCountry", clientCountry);
        if(createdAtFrom != null) {
            hq.setParameter("createdAtFrom", createdAtFrom);
        }
        if(createdAtTo != null) {
            hq.setParameter("createdAtTo", createdAtTo);
        }
        if(modifiedAtFrom != null) {
            hq.setParameter("modifiedAtFrom", modifiedAtFrom);
        }
        if(modifiedAtTo != null) {
            hq.setParameter("modifiedAtTo", modifiedAtTo);
        }
        if(closedAtFrom != null) {
            hq.setParameter("closedAtFrom", closedAtFrom);
        }
        if(closedAtTo != null) {
            hq.setParameter("closedAtTo", closedAtTo);
        }        
        return (List<ProjectCode>)hq.list();
    }
    public static List<ProjectCode> getProjectCodes(Employee employee, Module module, Country groupCountry, Group group, Client client, ProjectCode projectCode, Country officeCountry, Office office, Department department, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select distinct pc from ProjectCode as pc ";
        query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
        if(department != null) {
            query += "inner join s.department as d ";
        } else if(office != null) {
            query += "inner join s.department as d inner join d.office as o ";
        } else if(officeCountry != null) {
            query += "inner join s.department as d inner join d.office as o inner join o.country as oc ";
        }
        if(client != null) {
            query += "inner join pc.client as c ";
        } else if(group != null) {
            query += "inner join pc.client as c left join c.group as g ";
        } else if(groupCountry != null) {
            query += "inner join pc.client as c inner join c.workCountry as gc ";
        }
        query += "where ";
        boolean conditionUsed = false;
        if(subdepartment != null) {
            query += "s=:subdepartment ";
        } else if(department != null) {
            query += "d=:department ";
        } else if(office != null) {
            query += "o=:office ";
        } else if(officeCountry != null) {
            query += "oc=:officeCountry ";
        }
        if(subdepartment != null || department != null || office != null || officeCountry != null) {
            conditionUsed = true;
        }
        if(conditionUsed) {
            query += "and ";
        }
        if(projectCode != null) {
            query += "pc=:projectCode ";
        } else if(client != null) {
            query += "c=:client ";
        } else if(group != null) {
            query += "g=:group ";
        } else if(groupCountry != null) {
            query += "gc=:groupCountry ";
        }
        if(projectCode != null || client != null || group != null || groupCountry != null) {
            conditionUsed = true;
        }
        if(conditionUsed) {
            query += "and ";
        }
        query += "e=:employee and m=:module ";
        Query hq = hs.createQuery(query);
        if(subdepartment != null) {
            hq.setParameter("subdepartment", subdepartment);
        } else if(department != null) {
            hq.setParameter("department", department);
        } else if(office != null) {
            hq.setParameter("office", office);
        } else if(officeCountry != null) {
            hq.setParameter("officeCountry", officeCountry);
        }
        if(projectCode != null) {
            hq.setParameter("projectCode", projectCode);
        } else if(client != null) {
            hq.setParameter("client", client);
        } else if(group != null) {
            hq.setParameter("group", group);
        } else if(groupCountry != null) {
            hq.setParameter("groupCountry", groupCountry);
        }
        hq.setParameter("employee", employee).setParameter("module", module);
        return (List<ProjectCode>)hq.list();
    }

    public static List<RightsItem> getRightsItemsBySubdepartmentAndEmployeeSubdepartment(Subdepartment subdepartment, Subdepartment employeeSubdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<RightsItem>)hs.createQuery("select distinct ri from RightsItem as ri inner join ri.employee as e inner join e.position as p inner join p.subdepartment as es inner join ri.subdepartment as s where s=? and es=?").setParameter(0, subdepartment).setParameter(1, employeeSubdepartment).list();
    }
    public static List<RightsItem> getRightsItemsBySubdepartmentAndEmployee(Subdepartment subdepartment, Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<RightsItem>)hs.createQuery("select distinct ri from RightsItem as ri inner join ri.employee as e inner join ri.subdepartment as s where s=? and e=?").setParameter(0, subdepartment).setParameter(1, employee).list();
    }
    public static List<RightsItem> getRightsItemsByEmployee(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<RightsItem>)hs.createQuery("select distinct ri from RightsItem as ri inner join ri.employee as e where e=?").setParameter(0, employee).list();
    }
    public static List<Subdepartment> getSubdepartmentsByEmployee(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.rightsItems as ri inner join ri.employee as e where e=?").setParameter(0, employee).list();
    }
}
