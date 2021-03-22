/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.service.LeavesBalanceCalculator;
import com.mazars.management.web.forms.LeavesReportForm;
import com.mazars.management.web.vo.LeavesBalanceCalculatorResult;
import java.io.UnsupportedEncodingException;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class LeavesReport {
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
        private Position position;
        private StandardPosition standardPosition;
        private Employee employee;
        private LeavesBalanceCalculator leavesBalanceCalculator;

        public Row() {
        }

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

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public LeavesBalanceCalculator getLeavesBalanceCalculator() {
            return leavesBalanceCalculator;
        }

        public void setLeavesBalanceCalculator(LeavesBalanceCalculator leavesBalanceCalculator) {
            this.leavesBalanceCalculator = leavesBalanceCalculator;
        }
    }

    private Employee currentUser;
    private Module module;
    private LeavesReportForm form;
    
    private Calendar formDate;
    private Boolean formIsActive;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;

    public LeavesReport(LeavesReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formDate = form.getDate().getCalendar();
        this.formIsActive = form.getIsActive();
        
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

    public LeavesReportForm getForm() {
        return form;
    }

    public void setForm(LeavesReportForm form) {
        this.form = form;
    }

    public Calendar getFormDate() {
        return formDate;
    }

    public void setFormDate(Calendar formDate) {
        this.formDate = formDate;
    }

    public Boolean getFormIsActive() {
        return formIsActive;
    }

    public void setFormIsActive(Boolean formIsActive) {
        this.formIsActive = formIsActive;
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
        buildEmployeeReport();
        buildBalanceReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildEmployeeReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select o, d, s, p, sp, e from Employee as e ";
        query += "inner join e.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "inner join p.standardPosition as sp ";
        query += "where ";
        query += "e.isAdministrator!=true ";
        if(formIsActive != null) {
            query += "and e.isActive=:isActive ";
        }
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        Query hq = hs.createQuery(query);
        if(formIsActive != null) {
            hq.setParameter("isActive", formIsActive);
        }
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        query += "group by e ";
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Office office = (Office)tuple[0];
            Department ddepartment = (Department)tuple[1];
            Subdepartment subdepartment = (Subdepartment)tuple[2];
            Position position = (Position)tuple[3];
            StandardPosition standardPosition = (StandardPosition)tuple[4];
            Employee employee = (Employee)tuple[5];
            Row row = new Row();
            row.setOffice(office);
            row.setDepartment(ddepartment);
            row.setSubdepartment(subdepartment);
            row.setPosition(position);
            row.setStandardPosition(standardPosition);
            row.setEmployee(employee);
            rows.add(row);
        }
    }
    public void buildBalanceReport() {
        for(Row row : rows) {
            Employee employee = row.getEmployee();
            LeavesBalanceCalculator leavesBalanceCalculator = new LeavesBalanceCalculator();
            leavesBalanceCalculator.setEmployee(employee);
            leavesBalanceCalculator.setDate(new YearMonthDate(formDate));
            leavesBalanceCalculator.calculateBalance();
            row.setLeavesBalanceCalculator(leavesBalanceCalculator);
        }
    }
}
