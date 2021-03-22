/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.web.forms.HRAdministrativeReportForm;
import com.mazars.management.web.forms.SalaryReportForm;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class HRAdministrativeReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int userNameResult = o1.getEmployee().getUserName().compareTo(o2.getEmployee().getUserName());
            return userNameResult;
        }
    }
    public class Row {
        private Office office;
        private Department department;
        private Subdepartment subdepartment;
        private StandardPosition standardPosition;
        private Position position;
        private Employee employee;
        private EmployeePositionHistoryItem employeePositionHistoryItem;

        public Office getOffice() {
            return office;
        }

        public void setOffice(Office office) {
            this.office = office;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
        }

        public StandardPosition getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(StandardPosition standardPosition) {
            this.standardPosition = standardPosition;
        }

        public Position getPosition() {
            return position;
        }

        public void setPosition(Position position) {
            this.position = position;
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public EmployeePositionHistoryItem getEmployeePositionHistoryItem() {
            return employeePositionHistoryItem;
        }

        public void setEmployeePositionHistoryItem(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.employeePositionHistoryItem = employeePositionHistoryItem;
        }

    }

    private Employee currentUser;
    private Module module;
    private HRAdministrativeReportForm form;
    
    private Calendar formStartDate;
    private Calendar formEndDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Country country = null;
    private List<Currency> currencies = new LinkedList<Currency>();
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
    private List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();

    public HRAdministrativeReport(HRAdministrativeReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = form.getStartDate().getCalendar();
        this.formEndDate = form.getEndDate().getCalendar();
        this.country = currentUser.getCountry();
        
        if(currentUser.getProfile().equals(Employee.Profile.SUPER_USER)) {
            this.subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, currentUser.getCountry() ));
        } else if(currentUser.getProfile().equals(Employee.Profile.COUNTRY_ADMINISTRATOR)) {
            this.subdepartments.addAll(currentUser.getCountry().getSubdepartments());
        }
    }

    public List<Row> getRows() {
        return rows;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public HRAdministrativeReportForm getForm() {
        return form;
    }

    public void setForm(HRAdministrativeReportForm form) {
        this.form = form;
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

    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }
    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public Employee getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(Employee currentUser) {
        this.currentUser = currentUser;
    }
    public void build() throws BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException{
        buildCarreerReport();
        buildCareerStatusReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildCarreerReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select o, d, s, sp, p, e, ephi from Employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "inner join p.standardPosition as sp ";
        query += "where (ephi.start <= :endDate and (ephi.end >= :startDate or ephi.end = null)) ";
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", formStartDate);
        hq.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            Office office = (Office)tuple[0];
            Department department = (Department)tuple[1];
            Subdepartment subdepartment = (Subdepartment)tuple[2];
            StandardPosition standardPosition = (StandardPosition)tuple[3];
            Position position = (Position)tuple[4];
            Employee employee = (Employee)tuple[5];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[6];
            
            Row row = new Row();
            row.setOffice(office);
            row.setDepartment(department);
            row.setSubdepartment(subdepartment);
            row.setStandardPosition(standardPosition);
            row.setPosition(position);
            row.setEmployee(employee);
            row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
            this.rows.add(row);
        }
    }
    public void buildCareerStatusReport() {
        Set<Employee> employees = new HashSet<Employee>();
        for(Row row : rows) {
            employees.add(row.getEmployee());
        }
        for(Employee employee : employees) {
            List<EmployeePositionHistoryItem> employeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItem>(employee.getEmployeePositionHistoryItems());
            EmployeePositionHistoryItem.assignCareerStatuses(employeePositionHistoryItems);
            List<Row> employeeRows = this.getRows(employee);
            for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
                for(Row row : employeeRows) {
                    if(row.getEmployeePositionHistoryItem().getId().equals(employeePositionHistoryItem.getId())) {
                        row.getEmployeePositionHistoryItem().setCareerStatus(employeePositionHistoryItem.getCareerStatus());
                        break;
                    }
                }
            }
        }
    }
    private List<Row> getRows(Employee employee) {
        List<Row> selectedRows = new LinkedList<Row>();
        for(Row row : rows) {
            if(row.getEmployee().getId().equals(employee.getId())) {
                selectedRows.add(row);
            }
        }
        return selectedRows;
    }
}
