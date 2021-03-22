/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.complex.EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class EmployeeSubdepartmentHistoryItem {
    public enum Type {
        PROJECT_ACCESS,
        TASK_AND_PROJECT_ACCESS,
        PROJECT_CODE_CONFLICT_NOTIFICATION,
        CLIENT_CONFLICT_NOTIFICATION
    }
    private Long id;
    private Calendar start;
    private Calendar end;
    private Subdepartment subdepartment;
    private Employee employee;
    private Type type;
    public EmployeeSubdepartmentHistoryItem() {
    }

    public Subdepartment getSubdepartment() {
        return subdepartment;
    }

    public void setSubdepartment(Subdepartment subdepartment) {
        this.subdepartment = subdepartment;
    }



    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
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

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }


    public static List<Group> getCurrentGroupsForOpenProjectCodes(Employee employee) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Group>)hs.createQuery("select g from Group as g inner join g.clients as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and pc.isClosed=false and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Client> getCurrentClientsForOpenProjectCodes(Employee employee) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Client as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and pc.isClosed=false and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Client> getCurrentClientsForOpenProjectCodes(Employee employee, Group group) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Client>)hs.createQuery("select c from Group as g inner join g.clients as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and pc.isClosed=false and g=:group and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("group", group).setParameter("day", today).list();
    }
    public static List<ProjectCode> getCurrentOpenProjectCodes(Employee employee) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from ProjectCode as pc inner join pc.subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and pc.isClosed=false and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<ProjectCode> getCurrentOpenProjectCodes(Employee employee, Client client) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<ProjectCode>)hs.createQuery("select pc from Client as c inner join c.projectCodes as pc inner join pc.subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and pc.isClosed=false and c=:client and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("client", client).setParameter("day", today).list();
    }
    public static List<Office> getCurrentOffices(Employee employee, EmployeeSubdepartmentHistoryItem.Type type) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<Office> getCurrentOffices(Employee employee) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Department> getCurrentDepartments(Employee employee, EmployeeSubdepartmentHistoryItem.Type type) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Department as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<Department> getCurrentDepartments(Employee employee, EmployeeSubdepartmentHistoryItem.Type type, Office office) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where o=:office and e=:employee and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("office", office).setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<Department> getCurrentDepartments(Employee employee, Office office) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where o=:office and e=:employee and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("office", office).setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee, EmployeeSubdepartmentHistoryItem.Type type) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee, EmployeeSubdepartmentHistoryItem.Type type, Department department) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Department as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where d=:department and e=:employee and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("department", department).setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee, Department department) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Department as d inner join d.subdepartments as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where d=:department and e=:employee and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("department", department).setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Subdepartment> getCurrentSubdepartments(Employee employee) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e where e=:employee and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("day", today).list();
    }
    public static List<Subdepartment> getCurrentSubdepartmentsForOpenProjectCodes(Employee employee, EmployeeSubdepartmentHistoryItem.Type type) {
        Calendar today = CalendarUtil.getToday();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.employeeSubdepartmentHistoryItems as eshi inner join eshi.employee as e inner join s.projectCodes as pc where e=:employee and pc.isClosed=false and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("type", type).setParameter("day", today).list();
    }
    public static List<EmployeeSubdepartmentHistoryItem> getEmployeeSubdepartmentHistoryItems(Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<EmployeeSubdepartmentHistoryItem>)hs.createQuery("select eshi from EmployeeSubdepartmentHistoryItem as eshi inner join eshi.subdepartment as s where s=:subdepartment").setParameter("subdepartment", subdepartment).list();
    }
    public static List<EmployeeSubdepartmentHistoryItem> getAll(Employee employee, Subdepartment subdepartment, EmployeeSubdepartmentHistoryItem.Type type, Calendar day) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<EmployeeSubdepartmentHistoryItem>)hs.createQuery("select distinct eshi from EmployeeSubdepartmentHistoryItem as eshi where eshi.employee=:employee and eshi.subdepartment=:subdepartment and eshi.type=:type and eshi.start<=:day and (eshi.end>=:day or eshi.end is null)").setParameter("employee", employee).setParameter("subdepartment", subdepartment).setParameter("type", type).setParameter("day", day).list();
    }
    public static List<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment> getEmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo(Office subdepartmentOffice, Department subdepartmentDepartment, Subdepartment subdepartment,
                Office employeeOffice, Department employeeDepartment, Subdepartment employeeSubdepartment, Employee employee,
                Calendar startDate, Calendar endDate) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select eshi, ee, es, ed, eo, ss, sd, so from EmployeeSubdepartmentHistoryItem as eshi ";
        query += "inner join eshi.subdepartment as ss inner join ss.department as sd inner join sd.office as so ";
        query += "inner join eshi.employee as ee inner join ee.position as ep inner join ep.subdepartment as es inner join es.department as ed inner join ed.office as eo ";
        if(
           subdepartmentOffice != null ||     
           subdepartmentDepartment != null ||     
           subdepartment != null ||     
           employeeOffice != null ||     
           employeeDepartment != null ||     
           employeeSubdepartment != null ||     
           employee != null ||     
           startDate != null ||
           endDate != null) {
            query += "where ";
        }
        boolean conditionUsed = false; 
        
        if(subdepartment != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "ss=:subdepartment ";
            conditionUsed = true;
        } else if(subdepartmentDepartment != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "sd=:subdepartmentDepartment ";
            conditionUsed = true;
        } else if(subdepartmentOffice != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "so=:subdepartmentOffice ";
            conditionUsed = true;
        }
        if(employee != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "ee=:employee ";
            conditionUsed = true;
        } else if(employeeSubdepartment != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "es=:employeeSubdepartment ";
            conditionUsed = true;
        } else if(employeeDepartment != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "ed=:employeeDepartment ";
            conditionUsed = true;
        } else if(employeeOffice != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "eo=:employeeOffice ";
            conditionUsed = true;
        }
        if(startDate == null && endDate != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "eshi.start<=:endDate ";
            conditionUsed = true;
        } else if(startDate != null && endDate == null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "(eshi.end>=:startDate or eshi.end=null) ";
            conditionUsed = true;
        } else if(startDate != null && endDate != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "(eshi.start<=:endDate and (eshi.end>=:startDate or eshi.end=null)) ";
            conditionUsed = true;
        }
        
        Query hq = hs.createQuery(query);
        if(subdepartment != null) {
            hq.setParameter("subdepartment", subdepartment);
        } else if(subdepartmentDepartment != null) {
            hq.setParameter("subdepartmentDepartment", subdepartmentDepartment);
        } else if(subdepartmentOffice != null) {
            hq.setParameter("subdepartmentOffice", subdepartmentOffice);
        }
        if(employee != null) {
            hq.setParameter("employee", employee);
        } else if(employeeSubdepartment != null) {
            hq.setParameter("employeeSubdepartment", employeeSubdepartment);
        } else if(employeeDepartment != null) {
            hq.setParameter("employeeDepartment", employeeDepartment);
        } else if(employeeOffice != null) {
            hq.setParameter("employeeOffice", employeeOffice);
        }
        if(startDate != null) {
            hq.setParameter("startDate", startDate);
        }
        if(endDate != null) {
            hq.setParameter("endDate", endDate);
        }
        List<Object[]> result = (List<Object[]>)hq.list();
        List<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment> employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo = new LinkedList<EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment>();
        for(Object[] tuple : result) {
            EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment = new EmployeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment(
                    (EmployeeSubdepartmentHistoryItem)tuple[0],
                    (Employee)tuple[1],
                    (Subdepartment)tuple[2],
                    (Department)tuple[3],
                    (Office)tuple[4],
                    (Subdepartment)tuple[5],
                    (Department)tuple[6],
                    (Office)tuple[7]
                    ); 
            employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo.add(employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartment);
        }
        return employeeSubdepartmentHistoryItemWithEmployeeAndSubdepartmentInfo;
    }
    public static List<EmployeeSubdepartmentHistoryItem> getEmployeeSubdepartmentHistoryItems(List<Employee> employees, List<Subdepartment> subdepartments, EmployeeSubdepartmentHistoryItem.Type type, Calendar startDate, Calendar endDate) {
        List<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems = new ArrayList<EmployeeSubdepartmentHistoryItem>();
        if((employees != null && employees.isEmpty()) || (subdepartments != null && subdepartments.isEmpty())) {
            return employeeSubdepartmentHistoryItems;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select eshi from EmployeeSubdepartmentHistoryItem as eshi ";
        query += "where ";
        boolean isUsed = false;
        if(employees != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "eshi.employee in (:employees) ";
            isUsed = true;
        }
        if(subdepartments != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "eshi.subdepartment in (:subdepartments) ";
            isUsed = true;
        }
        if(type != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "eshi.type=:type ";
            isUsed = true;
        }
        if(startDate != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "(eshi.end>=:startDate or eshi.end=null) ";
            isUsed = true;
        } 
        if(endDate != null) {
            if(isUsed) {
                query += "and ";
            }
            query += "(eshi.start<=:endDate) ";
            isUsed = true;
        }        
        Query hq = hs.createQuery(query);
        if(employees != null) {
            hq.setParameterList("employees", employees);
        }    
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }    
        if(type != null) {
            hq.setParameter("type", type);
        }
        if(startDate != null) {
            hq.setParameter("startDate", startDate);
        }
        if(endDate != null) {
            hq.setParameter("endDate", endDate);
        }
        
        employeeSubdepartmentHistoryItems = (List<EmployeeSubdepartmentHistoryItem>)hq.list();
        return employeeSubdepartmentHistoryItems;
    }
    public static List<Employee> getEmployees(List<Employee> employees, List<Subdepartment> subdepartments, EmployeeSubdepartmentHistoryItem.Type type, Calendar startDate, Calendar endDate) {
        List<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems = EmployeeSubdepartmentHistoryItem.getEmployeeSubdepartmentHistoryItems(employees, subdepartments, type, startDate, endDate);
        List<Employee> tmpEmployees = new ArrayList<Employee>();
        for(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem : employeeSubdepartmentHistoryItems) {
            tmpEmployees.add(employeeSubdepartmentHistoryItem.getEmployee());
        }
        return tmpEmployees;
    }
    public static List<Subdepartment> getSubdepartments(List<Employee> employees, List<Subdepartment> subdepartments, EmployeeSubdepartmentHistoryItem.Type type, Calendar startDate, Calendar endDate) {
        List<EmployeeSubdepartmentHistoryItem> employeeSubdepartmentHistoryItems = EmployeeSubdepartmentHistoryItem.getEmployeeSubdepartmentHistoryItems(employees, subdepartments, type, startDate, endDate);
        List<Subdepartment> tmpSubdepartments = new ArrayList<Subdepartment>();
        for(EmployeeSubdepartmentHistoryItem employeeSubdepartmentHistoryItem : employeeSubdepartmentHistoryItems) {
            tmpSubdepartments.add(employeeSubdepartmentHistoryItem.getSubdepartment());
        }
        return tmpSubdepartments;
    }
}
