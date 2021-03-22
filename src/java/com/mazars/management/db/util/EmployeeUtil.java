/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.*;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class EmployeeUtil {
    protected static String getHQLForEmployeeFilteredList(EmployeeFilter filter, EmployeeSorter sorter) {
        String query = "";
        query += "select e from Employee as e ";
        query += "inner join e.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        
        query += "where ";
        query += "s in :subdepartments ";
        if(filter.isOfficeIdUsed()) {
            query += "and o=:office ";
        }
        if(filter.isDepartmentIdUsed()) {
            query += "and d=:department ";
        }
        if(filter.isSubdepartmentIdUsed()) {
            query += "and s=:subdepartment ";
        }
        if(filter.isEmployeeIdUsed()) {
            query += "and e=:employee ";
        }

        
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isFirstNameUsed()) {
                query += "e.firstName ";
            }
            if(sorter.isLastNameUsed()) {
                query += "e.lastName ";
            }
            if(sorter.isUserNameUsed()) {
                query += "e.userName ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }
        return query;
    }
    protected static String getHQLForCountOfEmployeeFilteredList(EmployeeFilter filter) {
        String query = "";
        query += "select count(e2) from Employee as e2 where e2.id in ( ";
        
        query += "select e.id from Employee as e ";
        query += "inner join e.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
                
        query += "where ";
        query += "s in :subdepartments ";
        if(filter.isOfficeIdUsed()) {
            query += "and o=:office ";
        }
        if(filter.isDepartmentIdUsed()) {
            query += "and d=:department ";
        }
        if(filter.isSubdepartmentIdUsed()) {
            query += "and s=:subdepartment ";
        }
        if(filter.isEmployeeIdUsed()) {
            query += "and e=:employee ";
        }
       
        query += "group by pc ";
        
        query += ")"; //end of subselect
        
        return query;
    }
    
    protected static void setParametersForEmployeeFilteredList(Query hq, EmployeeFilter filter, List<Subdepartment> subdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isOfficeIdUsed()) {
            Office office = (Office)hs.get(Office.class, filter.getOfficeId());
            hq.setParameter("office", office);
        }
        if(filter.isDepartmentIdUsed()) {
            Department department = (Department)hs.get(Department.class, filter.getDepartmentId());
            hq.setParameter("department", department);
        }
        if(filter.isSubdepartmentIdUsed()) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            hq.setParameter("subdepartment", subdepartment);
        }
        if(filter.isEmployeeIdUsed()) {
            Employee employee = (Employee)hs.get(Employee.class, filter.getEmployeeId());
            hq.setParameter("employee", employee);
        }
        hq.setParameterList("subdepartments", subdepartments);
    }
    protected static void setParametersForCountOfEmployeeFilteredList(Query hq, EmployeeFilter filter, List<Subdepartment> subdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isOfficeIdUsed()) {
            Office office = (Office)hs.get(Office.class, filter.getOfficeId());
            hq.setParameter("office", office);
        }
        if(filter.isDepartmentIdUsed()) {
            Department department = (Department)hs.get(Department.class, filter.getDepartmentId());
            hq.setParameter("department", department);
        }
        if(filter.isSubdepartmentIdUsed()) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            hq.setParameter("subdepartment", subdepartment);
        }
        if(filter.isEmployeeIdUsed()) {
            Employee employee = (Employee)hs.get(Employee.class, filter.getEmployeeId());
            hq.setParameter("employee", employee);
        }
        hq.setParameterList("subdepartments", subdepartments);
    }
    public static List<Employee> getEmployeeFilteredList(EmployeeFilter filter, EmployeeSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForEmployeeFilteredList(filter, sorter);
        
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForEmployeeFilteredList(hq, filter, allowedSubdepartments);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        return (List<Employee>)hq.list();
    }
    public static Long getCountOfEmployeeFilteredList(EmployeeFilter filter, EmployeeSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForCountOfEmployeeFilteredList(filter);
        
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForCountOfEmployeeFilteredList(hq, filter, allowedSubdepartments);
        return (Long)hq.uniqueResult();       
    }
}
