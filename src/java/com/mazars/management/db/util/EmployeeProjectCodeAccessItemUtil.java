/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.*;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class EmployeeProjectCodeAccessItemUtil {
    public static class DescribedEmployeeProjectCodeAccessItem {
        private EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem;
        private ProjectCode projectCode;
        private Employee employee;
        private Office projectCodeOffice;
        private Department projectCodeDepartment;
        private Subdepartment projectCodeSubdepartment;
        private Office employeeOffice;
        private Department employeeDepartment;
        private Subdepartment employeeSubdepartment;


        public DescribedEmployeeProjectCodeAccessItem() {
        }

        public EmployeeProjectCodeAccessItem getEmployeeProjectCodeAccessItem() {
            return employeeProjectCodeAccessItem;
        }

        public void setEmployeeProjectCodeAccessItem(EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem) {
            this.employeeProjectCodeAccessItem = employeeProjectCodeAccessItem;
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

        public Office getProjectCodeOffice() {
            return projectCodeOffice;
        }

        public void setProjectCodeOffice(Office projectCodeOffice) {
            this.projectCodeOffice = projectCodeOffice;
        }

        public Department getProjectCodeDepartment() {
            return projectCodeDepartment;
        }

        public void setProjectCodeDepartment(Department projectCodeDepartment) {
            this.projectCodeDepartment = projectCodeDepartment;
        }

        public Subdepartment getProjectCodeSubdepartment() {
            return projectCodeSubdepartment;
        }

        public void setProjectCodeSubdepartment(Subdepartment projectCodeSubdepartment) {
            this.projectCodeSubdepartment = projectCodeSubdepartment;
        }

        public Office getEmployeeOffice() {
            return employeeOffice;
        }

        public void setEmployeeOffice(Office employeeOffice) {
            this.employeeOffice = employeeOffice;
        }

        public Department getEmployeeDepartment() {
            return employeeDepartment;
        }

        public void setEmployeeDepartment(Department employeeDepartment) {
            this.employeeDepartment = employeeDepartment;
        }

        public Subdepartment getEmployeeSubdepartment() {
            return employeeSubdepartment;
        }

        public void setEmployeeSubdepartment(Subdepartment employeeSubdepartment) {
            this.employeeSubdepartment = employeeSubdepartment;
        }
    }    
    public static List<DescribedEmployeeProjectCodeAccessItem> getDescribedEmployeeProjectCodeAccessItems(List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems) {
        List<DescribedEmployeeProjectCodeAccessItem> describedEmployeeProjectCodeAccessItems = new LinkedList<DescribedEmployeeProjectCodeAccessItem>();
        if(employeeProjectCodeAccessItems.isEmpty()) {
            return describedEmployeeProjectCodeAccessItems;
        }
        String query = "";
        query += "select epcai, e, pc, es, ed, eo, pcs, pcd, pco from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.employee as e inner join e.position as p inner join p.subdepartment as es inner join es.department as ed inner join ed.office as eo ";
        query += "inner join epcai.projectCode as pc inner join pc.subdepartment as pcs inner join pcs.department as pcd inner join pcd.office as pco ";
        query += "where epcai in (:employeeProjectCodeAccessItems) ";
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("employeeProjectCodeAccessItems", employeeProjectCodeAccessItems);
        describedEmployeeProjectCodeAccessItems = new LinkedList<DescribedEmployeeProjectCodeAccessItem>();
        List<Object[]> tuples = (List<Object[]>)hq.list();
        for(Object[] tuple : tuples) {
            EmployeeProjectCodeAccessItem employeeProjectCodeAccessItem = (EmployeeProjectCodeAccessItem)tuple[0];
            Employee employee = (Employee)tuple[1];
            ProjectCode projectCode = (ProjectCode)tuple[2];
            Subdepartment employeeSubdepartment = (Subdepartment)tuple[3];
            Department employeeDepartment = (Department)tuple[4];
            Office employeeOffice = (Office)tuple[5];        
            Subdepartment projectCodeSubdepartment = (Subdepartment)tuple[6];
            Department projectCodeDepartment = (Department)tuple[7];
            Office projectCodeOffice = (Office)tuple[8];  
            DescribedEmployeeProjectCodeAccessItem describedEmployeeProjectCodeAccessItem = new DescribedEmployeeProjectCodeAccessItem();
            describedEmployeeProjectCodeAccessItem.setEmployeeProjectCodeAccessItem(employeeProjectCodeAccessItem);
            describedEmployeeProjectCodeAccessItem.setEmployee(employee);
            describedEmployeeProjectCodeAccessItem.setProjectCode(projectCode);
            describedEmployeeProjectCodeAccessItem.setEmployeeSubdepartment(employeeSubdepartment);
            describedEmployeeProjectCodeAccessItem.setEmployeeDepartment(employeeDepartment);
            describedEmployeeProjectCodeAccessItem.setEmployeeOffice(employeeOffice);
            describedEmployeeProjectCodeAccessItem.setProjectCodeSubdepartment(projectCodeSubdepartment);
            describedEmployeeProjectCodeAccessItem.setProjectCodeDepartment(projectCodeDepartment);
            describedEmployeeProjectCodeAccessItem.setProjectCodeOffice(projectCodeOffice);
            describedEmployeeProjectCodeAccessItems.add(describedEmployeeProjectCodeAccessItem);
        }
        return describedEmployeeProjectCodeAccessItems; 
    }
    public static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItems(List<ProjectCode> projectCodes, List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        if(projectCodes == null) {
            if(employees == null) {
                return getEmployeeProjectCodeAccessItems(sorter, limiter, allowedSubdepartments);
            } else {
                return getEmployeeProjectCodeAccessItemsByEmployees(employees, sorter, limiter);
            }
        } else {
            if(employees == null) {
                return getEmployeeProjectCodeAccessItemsByProjectCodes(projectCodes, sorter, limiter);
            } else {
                return getEmployeeProjectCodeAccessItemsByProjectCodesAndEmployees(projectCodes, employees, sorter, limiter);
            }            
        }
    }
    public static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItems(ProjectCodeListFilter projectCodeFilter, EmployeeFilter employeeFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
        EmployeeSorter employeeSorter = new EmployeeSorter();
        ProjectCodeListSorter projectCodeSorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter projectCodeLimiter = new ProjectCodeListLimiter();
        List<Employee> employees = null;
        List<ProjectCode> projectCodes = null;        
        if(projectCodeFilter.isUsed()) {
            projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, invoiceRequestsFilter, projectCodeSorter, projectCodeLimiter, allowedSubdepartments);
        }
        if(employeeFilter.isUsed() ) {
            employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, employeeSorter, projectCodeLimiter, allowedSubdepartments);
        }

        return getEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    }
    private static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItemsByProjectCodesAndEmployees(List<ProjectCode> projectCodes, List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new LinkedList<EmployeeProjectCodeAccessItem>();
        String query = "";
        if(employees.isEmpty() || projectCodes.isEmpty()) {
            return employeeProjectCodeAccessItems;
        }
        query += "select epcai from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.employee as e ";
        query += "inner join epcai.projectCode as pc ";
        query += "where e in (:employees) and pc in (:projectCodes)";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("employees", employees);
        hq.setParameterList("projectCodes", projectCodes);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        employeeProjectCodeAccessItems = (List<EmployeeProjectCodeAccessItem>)hq.list();
        return employeeProjectCodeAccessItems;
    }
    private static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItemsByEmployees(List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new LinkedList<EmployeeProjectCodeAccessItem>();
        String query = "";
        if(employees.isEmpty()) {
            return employeeProjectCodeAccessItems;
        }

        query += "select epcai from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.employee as e ";
        if(sorter.isCodeUsed()) {
            query += "inner join epcai.projectCode as pc ";
        }
        query += "where e in (:employees) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("employees", employees);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        employeeProjectCodeAccessItems = (List<EmployeeProjectCodeAccessItem>)hq.list();;
        return employeeProjectCodeAccessItems;
    }
    private static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItemsByProjectCodes(List<ProjectCode> projectCodes, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new LinkedList<EmployeeProjectCodeAccessItem>();
        String query = "";
        if(projectCodes.isEmpty()) {
            return employeeProjectCodeAccessItems;
        }
        query += "select epcai from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", projectCodes);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        employeeProjectCodeAccessItems = (List<EmployeeProjectCodeAccessItem>)hq.list();;
        return employeeProjectCodeAccessItems;
    }
    private static List<EmployeeProjectCodeAccessItem> getEmployeeProjectCodeAccessItems(ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        List<EmployeeProjectCodeAccessItem> employeeProjectCodeAccessItems = new LinkedList<EmployeeProjectCodeAccessItem>();
        String query = "";
        query += "select epcai from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.projectCode as pc inner join pc.subdepartment as pcs ";
        query += "inner join epcai.employee as e inner join e.position as p inner join p.subdepartment as es ";
        query += "where ";
        query += "pcs in (:subdepartments) ";
        query += "and es in (:subdepartments) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", allowedSubdepartments);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        employeeProjectCodeAccessItems = (List<EmployeeProjectCodeAccessItem>)hq.list();;
        return employeeProjectCodeAccessItems;
    }
    
    public static Long getCountOfEmployeeProjectCodeAccessItems(List<ProjectCode> projectCodes, List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        if(projectCodes == null) {
            if(employees == null) {
                return getCountOfEmployeeProjectCodeAccessItems(sorter, limiter, allowedSubdepartments);
            } else {
                return getCountOfEmployeeProjectCodeAccessItemsByEmployees(employees, sorter, limiter);
            }
        } else {
            if(employees == null) {
                return getCountOfEmployeeProjectCodeAccessItemsByProjectCodes(projectCodes, sorter, limiter);
            } else {
                return getCountOfEmployeeProjectCodeAccessItemsByProjectCodesAndEmployees(projectCodes, employees, sorter, limiter);
            }            
        }
    }
    public static Long getCountOfEmployeeProjectCodeAccessItems(ProjectCodeListFilter projectCodeFilter, EmployeeFilter employeeFilter, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
        EmployeeSorter employeeSorter = new EmployeeSorter();
        ProjectCodeListSorter projectCodeSorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter projectCodeLimiter = new ProjectCodeListLimiter();
        List<Employee> employees = null;
        List<ProjectCode> projectCodes = null;        
        if(projectCodeFilter.isUsed()) {
            projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(projectCodeFilter, invoiceRequestsFilter, projectCodeSorter, projectCodeLimiter, allowedSubdepartments);
        }
        if(employeeFilter.isUsed() ) {
            employees = EmployeeUtil.getEmployeeFilteredList(employeeFilter, employeeSorter, projectCodeLimiter, allowedSubdepartments);
        }
        return getCountOfEmployeeProjectCodeAccessItems(projectCodes, employees, sorter, limiter, allowedSubdepartments);
    }
    private static Long getCountOfEmployeeProjectCodeAccessItemsByProjectCodesAndEmployees(List<ProjectCode> projectCodes, List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        String query = "";
        if(employees.isEmpty() || projectCodes.isEmpty()) {
            return new Long(0);
        }
        query += "select count(epcai2) from EmployeeProjectCodeAccessItem as epcai2 where epcai2.id in ( ";
        
        query += "select epcai.id from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.employee as e ";
        query += "inner join epcai.projectCode as pc ";
        query += "where e in (:employees) and pc in (:projectCodes)";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }
        query += ") ";
        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("employees", employees);
        hq.setParameterList("projectCodes", projectCodes);
        return (Long)hq.uniqueResult(); 
    }
    private static Long getCountOfEmployeeProjectCodeAccessItemsByEmployees(List<Employee> employees, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        String query = "";
        if(employees.isEmpty()) {
            return new Long(0);
        }

        query += "select count(epcai2) from EmployeeProjectCodeAccessItem as epcai2 where epcai2.id in ( ";

        query += "select epcai.id from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.employee as e ";
        if(sorter.isCodeUsed()) {
            query += "inner join epcai.projectCode as pc ";
        }
        query += "where e in (:employees) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }
        query += ") ";

        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        return (Long)hq.uniqueResult(); 
    }
    private static Long getCountOfEmployeeProjectCodeAccessItemsByProjectCodes(List<ProjectCode> projectCodes, ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter) {
        String query = "";
        if(projectCodes.isEmpty()) {
            return new Long(0);
        }
        query += "select count(epcai2) from EmployeeProjectCodeAccessItem as epcai2 where epcai2.id in ( ";

        query += "select epcai.id from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        query += ") ";

        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", projectCodes);
        return (Long)hq.uniqueResult(); 
    }
    private static Long getCountOfEmployeeProjectCodeAccessItems(ProjectCodeListSorter sorter, ProjectCodeListLimiter limiter, List<Subdepartment> allowedSubdepartments) {
        String query = "";
        query += "select count(epcai2) from EmployeeProjectCodeAccessItem as epcai2 where epcai2.id in ( ";

        query += "select epcai.id from EmployeeProjectCodeAccessItem as epcai ";
        query += "inner join epcai.projectCode as pc inner join pc.subdepartment as pcs ";
        query += "inner join epcai.employee as e inner join e.position as p inner join p.subdepartment as es ";
        query += "where ";
        query += "pcs in (:subdepartments) ";
        query += "and es in (:subdepartments) ";
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isCodeUsed()) {
                query += "pc.code ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }    
        query += ") ";

        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", allowedSubdepartments);
        return (Long)hq.uniqueResult(); 
    }
}
