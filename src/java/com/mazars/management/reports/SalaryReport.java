/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.web.forms.SalaryReportForm;
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
public class SalaryReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int userNameResult = o1.getEmployee().getUserName().compareTo(o2.getEmployee().getUserName());
            return userNameResult;
        }
    }
    public class Row {
        private EmployeePositionHistoryItem employeePositionHistoryItem;
        private Salary salary;
        private LeavesItem leavesItem;
        private Position position;
        private Employee employee;
        private Calendar displayedStart;
        private Calendar displayedEnd;
        private Integer paidLeavesWorkingDaysCount;
        private Integer paidLeavesWorkingDaysTotalCount;
        private Integer unpaidLeavesWorkingDaysCount;
        private Integer unpaidLeavesWorkingDaysTotalCount;

        public Integer getPaidLeavesWorkingDaysCount() {
            return paidLeavesWorkingDaysCount;
        }

        public void setPaidLeavesWorkingDaysCount(Integer paidLeavesWorkingDaysCount) {
            this.paidLeavesWorkingDaysCount = paidLeavesWorkingDaysCount;
        }

        public Integer getPaidLeavesWorkingDaysTotalCount() {
            return paidLeavesWorkingDaysTotalCount;
        }

        public void setPaidLeavesWorkingDaysTotalCount(Integer paidLeavesWorkingDaysTotalCount) {
            this.paidLeavesWorkingDaysTotalCount = paidLeavesWorkingDaysTotalCount;
        }

        public Integer getUnpaidLeavesWorkingDaysCount() {
            return unpaidLeavesWorkingDaysCount;
        }

        public void setUnpaidLeavesWorkingDaysCount(Integer unpaidLeavesWorkingDaysCount) {
            this.unpaidLeavesWorkingDaysCount = unpaidLeavesWorkingDaysCount;
        }

        public Integer getUnpaidLeavesWorkingDaysTotalCount() {
            return unpaidLeavesWorkingDaysTotalCount;
        }

        public void setUnpaidLeavesWorkingDaysTotalCount(Integer unpaidLeavesWorkingDaysTotalCount) {
            this.unpaidLeavesWorkingDaysTotalCount = unpaidLeavesWorkingDaysTotalCount;
        }

        public LeavesItem getLeavesItem() {
            return leavesItem;
        }

        public void setLeavesItem(LeavesItem leavesItem) {
            this.leavesItem = leavesItem;
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

        public Salary getSalary() {
            return salary;
        }

        public void setSalary(Salary salary) {
            this.salary = salary;
        }

        public EmployeePositionHistoryItem getEmployeePositionHistoryItem() {
            return employeePositionHistoryItem;
        }

        public void setEmployeePositionHistoryItem(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.employeePositionHistoryItem = employeePositionHistoryItem;
        }

        public Calendar getDisplayedEnd() {
            return displayedEnd;
        }

        public void setDisplayedEnd(Calendar displayedEnd) {
            this.displayedEnd = displayedEnd;
        }

        public Calendar getDisplayedStart() {
            return displayedStart;
        }

        public void setDisplayedStart(Calendar displayedStart) {
            this.displayedStart = displayedStart;
        }
    }

    private Employee currentUser;
    private Module module;
    private SalaryReportForm form;
    
    private Calendar formStartDate;
    private Calendar formEndDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Country country = null;
    private List<Currency> currencies = new LinkedList<Currency>();
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
    private List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();

    public SalaryReport(SalaryReportForm form, Module module, Employee currentUser) {
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
        this.currencies = CountryCurrency.getCurrencies(country);
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

    public SalaryReportForm getForm() {
        return form;
    }

    public void setForm(SalaryReportForm form) {
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
        for(Holiday holiday : Holiday.getAllByCountryAndRange(country, formStartDate, formEndDate)) {
            this.holidays.add(new YearMonthDate(holiday.getDate()));
        }
        buildPositionsSalariesLeavesReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildPositionsSalariesLeavesReport() throws BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query1 = "";
        query1 += "select e, p, ephi from Employee as e inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s ";
        query1 += "where (ephi.start <= :endDate and (ephi.end >= :startDate or ephi.end = null)) ";
        if(subdepartments != null) {
            query1 += "and s in (:subdepartments) ";
        }
        query1 += "and e.isAdministrator!=true ";
        Query hq1 = hs.createQuery(query1);
        hq1.setParameter("startDate", formStartDate);
        hq1.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq1.setParameterList("subdepartments", subdepartments);
        }
        List<Object[]> selection1 = (List<Object[]>)hq1.list();
        
        
        
        String query2 = "";
        query2 += "select ephi, sal from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.salaries as sal inner join ephi.position as p inner join p.subdepartment as s ";
        query2 += "where ";
        query2 += "(ephi.start <= :endDate and (ephi.end >= :startDate or ephi.end = null)) ";
        query2 += "and ((sal.start <= :endDate and (sal.end >= :startDate or sal.end = null)) and ((ephi.start <= sal.start and (ephi.end >= sal.start or ephi.end = null)) or (sal.start <= ephi.start and (sal.end >= ephi.start or sal.end = null)))) ";
        if(subdepartments != null) {
            query2 += "and s in (:subdepartments) ";
        }
        query2 += "and e.isAdministrator!=true ";
        Query hq2 = hs.createQuery(query2);
        hq2.setParameter("startDate", formStartDate);
        hq2.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq2.setParameterList("subdepartments", subdepartments);
        }
        List<Object[]> selection2 = (List<Object[]>)hq2.list();

        
        
        String query3 = "";
        query3 += "select ephi, li from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.leavesItems as li inner join ephi.position as p inner join p.subdepartment as s ";
        query3 += "where ";
        query3 += "(ephi.start <= :endDate and (ephi.end >= :startDate or ephi.end = null)) ";
        query3 += "and ((li.start <= :endDate and (li.end >= :startDate or li.end = null)) and ((ephi.start <= li.start and (ephi.end >= li.start or ephi.end = null)) or (li.start <= ephi.start and (li.end >= ephi.start or li.end = null)))) ";
        if(subdepartments != null) {
            query3 += "and s in (:subdepartments) ";
        }
        query3 += "and e.isAdministrator!=true ";
        Query hq3= hs.createQuery(query3);
        hq3.setParameter("startDate", formStartDate);
        hq3.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq3.setParameterList("subdepartments", subdepartments);
        }
        List<Object[]> selection3 = (List<Object[]>)hq3.list();

        for(Object[] tuple : selection1) {
            Employee employee = (Employee)tuple[0];
            Position position = (Position)tuple[1];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[2];
            List<Salary> salaries = getSalaries(employeePositionHistoryItem, selection2);
            List<LeavesItem> leavesItems = getLeavesItems(employeePositionHistoryItem, selection3);
            
            Calendar displayedStart = null;
            Calendar displayedEnd = null;
            Calendar employeePositionHistoryItemStart = employeePositionHistoryItem.getStart();
            Calendar employeePositionHistoryItemEnd = employeePositionHistoryItem.getEnd();
            if(employeePositionHistoryItemStart != null && ! employeePositionHistoryItemStart.before(formStartDate) && ! employeePositionHistoryItemStart.after(formEndDate)) {
                displayedStart = employeePositionHistoryItemStart;
            }
            if(employeePositionHistoryItemEnd != null && ! employeePositionHistoryItemEnd.before(formStartDate) && ! employeePositionHistoryItemEnd.after(formEndDate)) {
                displayedEnd = employeePositionHistoryItemEnd;
            }
            
            if(salaries.isEmpty() && leavesItems.isEmpty()) {
                Row row = new Row();
                row.setSalary(null);
                row.setEmployee(employee);
                row.setPosition(position);
                row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
                row.setSalary(null);
                row.setLeavesItem(null);
                row.setDisplayedStart(displayedStart);
                row.setDisplayedEnd(displayedEnd);
                this.rows.add(row);
            } else if(salaries.isEmpty() && ! leavesItems.isEmpty()) {
                for(LeavesItem leavesItem : leavesItems) {
                    Row row = new Row();
                    row.setSalary(null);
                    row.setEmployee(employee);
                    row.setPosition(position);
                    row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
                    row.setSalary(null);
                    row.setLeavesItem(leavesItem);
                    row.setDisplayedStart(displayedStart);
                    row.setDisplayedEnd(displayedEnd);
                    this.rows.add(row);                
                }
            } else if(!salaries.isEmpty() && leavesItems.isEmpty()) {
                for(Salary salary : salaries) {
                    salary.decipherValue();
                    Row row = new Row();
                    row.setSalary(null);
                    row.setEmployee(employee);
                    row.setPosition(position);
                    row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
                    row.setSalary(salary);
                    row.setLeavesItem(null);
                    row.setDisplayedStart(displayedStart);
                    row.setDisplayedEnd(displayedEnd);
                    this.rows.add(row);                
                }
            } else if(!salaries.isEmpty() && !leavesItems.isEmpty()) {
                for(Salary salary : salaries) {
                    salary.decipherValue();
                    for(LeavesItem leavesItem : leavesItems) {
                        Row row = new Row();
                        row.setSalary(null);
                        row.setEmployee(employee);
                        row.setPosition(position);
                        row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
                        row.setSalary(salary);
                        row.setLeavesItem(leavesItem);
                        row.setDisplayedStart(displayedStart);
                        row.setDisplayedEnd(displayedEnd);
                        this.rows.add(row);                
                    }
                }
            }
        }
        buildLeavesWorkingDaysCountReport(LeavesItem.Type.PAID_LEAVE);
        buildLeavesWorkingDaysCountReport(LeavesItem.Type.UNPAID_LEAVE);
        buildLeavesWorkingDaysTotalCountReport();
    }
    private void buildLeavesWorkingDaysCountReport(LeavesItem.Type type) {
        for(Row row : rows) {
            LeavesItem leavesItem = row.getLeavesItem();
            if(leavesItem == null || ! type.equals(leavesItem.getType())) {
                continue;
            }
            Integer count = 0;
            YearMonthDateRange range1 = new YearMonthDateRange(new YearMonthDate(formStartDate), new YearMonthDate(formEndDate));
            YearMonthDateRange range2 = new YearMonthDateRange(leavesItem.getStart() != null ? new YearMonthDate(leavesItem.getStart()) : null, leavesItem.getEnd() != null ? new YearMonthDate(leavesItem.getEnd()) : null);
            YearMonthDateRange leavesItemRange = YearMonthDateRange.getIntersection(range1, range2);
            if(leavesItemRange != null) {
                EmployeePositionHistoryItem employeePositionHistoryItem = row.getEmployeePositionHistoryItem();
                YearMonthDateRange range3 = new YearMonthDateRange(employeePositionHistoryItem.getStart() != null ? new YearMonthDate(employeePositionHistoryItem.getStart()) : null, employeePositionHistoryItem.getEnd() != null ? new YearMonthDate(employeePositionHistoryItem.getEnd()) : null);
                YearMonthDateRange leavesItemRange2 = YearMonthDateRange.getIntersection(range3, leavesItemRange);
                if(leavesItemRange2 != null) {
                    count = YearMonthDate.getDaysCountInRangeWithoutDays(leavesItemRange2.getStart(), leavesItemRange2.getEnd(), this.holidays);
                }
            }
            if(type.equals(LeavesItem.Type.PAID_LEAVE)) {
                row.setPaidLeavesWorkingDaysCount(count);
            } else if(type.equals(LeavesItem.Type.UNPAID_LEAVE)) {
                row.setUnpaidLeavesWorkingDaysCount(count);
            }
        }
    }
    
    private void buildLeavesWorkingDaysTotalCountReport() {
        Map<Long, Integer> perEmployeeDayPaidCounts = new HashMap<Long, Integer>();
        Map<Long, Integer> perEmployeeDayUnpaidCounts = new HashMap<Long, Integer>();
        for(Row row : rows) {
            LeavesItem leavesItem = row.getLeavesItem();
            if(leavesItem == null) {
                continue;
            }
            Employee employee = row.getEmployee();
            Integer paidCount = null;
            Integer unpaidCount = null;
            
            if(LeavesItem.Type.PAID_LEAVE.equals(leavesItem.getType())) {
                paidCount = row.getPaidLeavesWorkingDaysCount();
            } else if(LeavesItem.Type.UNPAID_LEAVE.equals(leavesItem.getType())) {
                unpaidCount = row.getUnpaidLeavesWorkingDaysCount();
            }
            if(paidCount != null) {
                Integer total = perEmployeeDayPaidCounts.get(employee.getId());
                if(total == null) {
                    perEmployeeDayPaidCounts.put(employee.getId(), paidCount);
                } else {
                    perEmployeeDayPaidCounts.put(employee.getId(), paidCount + total);
                }
            }
            if(unpaidCount != null) {
                Integer total = perEmployeeDayUnpaidCounts.get(employee.getId());
                if(total == null) {
                    perEmployeeDayUnpaidCounts.put(employee.getId(), unpaidCount);
                } else {
                    perEmployeeDayUnpaidCounts.put(employee.getId(), unpaidCount + total);
                }
            }            
        }
        for(Row row : rows) {
            Integer unpaidCount = perEmployeeDayUnpaidCounts.get(row.getEmployee().getId());
            Integer paidCount = perEmployeeDayPaidCounts.get(row.getEmployee().getId());
            if(paidCount != null) {
                row.setPaidLeavesWorkingDaysTotalCount(paidCount);
            }
            if(unpaidCount != null) {
                row.setUnpaidLeavesWorkingDaysTotalCount(unpaidCount);
            }
        }
    }
    
    private List<Salary> getSalaries(EmployeePositionHistoryItem employeePositionHistoryItem, List<Object[]> selection) {
        List<Salary> salaries = new LinkedList<Salary>();
        for(Object[] tuple : selection) {
            EmployeePositionHistoryItem employeePositionHistoryItemTmp = (EmployeePositionHistoryItem)tuple[0];
            Salary salary = (Salary)tuple[1];
            if(employeePositionHistoryItem.getId().equals(employeePositionHistoryItemTmp.getId())) {
                salaries.add(salary);
            }            
        }
        return salaries;
    }
    private List<LeavesItem> getLeavesItems(EmployeePositionHistoryItem employeePositionHistoryItem, List<Object[]> selection) {
        List<LeavesItem> leavesItems = new LinkedList<LeavesItem>();
        for(Object[] tuple : selection) {
            EmployeePositionHistoryItem employeePositionHistoryItemTmp = (EmployeePositionHistoryItem)tuple[0];
            LeavesItem leavesItem = (LeavesItem)tuple[1];
            if(employeePositionHistoryItem.getId().equals(employeePositionHistoryItemTmp.getId())) {
                leavesItems.add(leavesItem);
            }            
        }
        return leavesItems;
    }  
}
