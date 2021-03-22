/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.*;
import com.mazars.management.web.forms.FTEReportForm;
import java.util.*;
import java.util.Calendar;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class EmployeeFTEReport {
    public class RowComparator implements Comparator<Row> {
        public int compare(Row o1, Row o2) {
            int userNameResult = o1.getEmployee().getUserName().compareTo(o2.getEmployee().getUserName());
            if(userNameResult != 0) {
                return userNameResult;
            }
            return o1.getEmployeePositionHistoryItem().getStart().compareTo(o2.getEmployeePositionHistoryItem().getStart());
        }
    }
    public class Row {
        private EmployeePositionHistoryItem employeePositionHistoryItem;
        private Position position;
        private StandardPosition standardPosition;
        private Employee employee;
        private Long timeSpent;
        private Integer positionWorkingDaysCount = 0;
        private Integer workingDaysCount = 0;
        private Double fte = 0.0;

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
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

        public Integer getWorkingDaysCount() {
            return workingDaysCount;
        }

        public void setWorkingDaysCount(Integer workingDaysCount) {
            this.workingDaysCount = workingDaysCount;
        }

        public Integer getPositionWorkingDaysCount() {
            return positionWorkingDaysCount;
        }

        public void setPositionWorkingDaysCount(Integer positionWorkingDaysCount) {
            this.positionWorkingDaysCount = positionWorkingDaysCount;
        }

        public EmployeePositionHistoryItem getEmployeePositionHistoryItem() {
            return employeePositionHistoryItem;
        }

        public void setEmployeePositionHistoryItem(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.employeePositionHistoryItem = employeePositionHistoryItem;
        }

        public Double getFte() {
            return fte;
        }

        public void setFte(Double fte) {
            this.fte = fte;
        }
        
        
    }
  
    private List<Row> rows = new LinkedList<Row>();
    private Integer workingDaysCount = 0;
    private List<YearMonthDate> simpleFreedays = new LinkedList<YearMonthDate>();
    private Calendar formStartDate;
    private Calendar formEndDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Employee currentUser;
    private Module module;
    private FTEReportForm form;

    public Integer getWorkingDaysCount() {
        return workingDaysCount;
    }

    public void setWorkingDaysCount(Integer workingDaysCount) {
        this.workingDaysCount = workingDaysCount;
    }

    public List<YearMonthDate> getSimpleFreedays() {
        return simpleFreedays;
    }

    public void setSimpleFreedays(List<YearMonthDate> simpleFreedays) {
        this.simpleFreedays = simpleFreedays;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    private Date createdAt;

    public EmployeeFTEReport(FTEReportForm fteReportForm, Module module, Employee currentUser) {
        this.form = fteReportForm;
        this.module = module;
        this.currentUser = currentUser;
        
        this.formStartDate = fteReportForm.getStartDate().getCalendar();
        this.formEndDate = fteReportForm.getEndDate().getCalendar();

        this.subdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);      
    }

    public Date getCreatedAt() {
        return createdAt;
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

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }
    public void build() {
        List<Freeday> freedays = Freeday.getAllByCountryAndRange(currentUser.getCountry(), formStartDate, formEndDate);
        for(Freeday freeday : freedays) {
            simpleFreedays.add(new YearMonthDate(freeday.getDate()));
        }
        this.workingDaysCount = YearMonthDate.getDaysCountInRangeWithoutDays(new YearMonthDate(formStartDate), new YearMonthDate(formEndDate), simpleFreedays);

        processTimeSpentSelection(getTimeSpentSelection());
        processNotTimeSpentSelection(getNotTimeSpentSelection());
        processLeavesSelection(getLeavesSelection());
        calculatePositionWorkingDays();
        calculateFte();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public List<Object[]> getTimeSpentSelection() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select sum(tsi.timeSpent), e, p, sp, ephi from TimeSpentItem as tsi ";
        query += "inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join p.subdepartment as s ";
        query += "where tsi.day >= :startDate and tsi.day <= :endDate ";
        query += "and ephi.contractType=:contractType ";
        query += "and ((ephi.start <= tsi.day and ephi.end > tsi.day) or (ephi.start <= tsi.day and ephi.end is null)) ";
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        query += "and e.isAdministrator!=true ";
        query += "group by e, ephi ";
        Query hq = hs.createQuery(query);
        hq.setParameter("contractType", EmployeePositionHistoryItem.ContractType.TIME_SPENT);
        hq.setParameter("startDate", formStartDate);
        hq.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        return (List<Object[]>)hq.list();
    }
    public void processTimeSpentSelection(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            Long timeSpent = (Long)tuple[0];
            Employee employee = (Employee)tuple[1];
            Position position = (Position)tuple[2];
            StandardPosition standardPosition = (StandardPosition)tuple[3];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[4];
            Row row = new Row();
            row.setEmployee(employee);
            row.setPosition(position);
            row.setStandardPosition(standardPosition);
            row.setTimeSpent(timeSpent);
            row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
            this.rows.add(row);
        }
    }
    public List<Object[]> getNotTimeSpentSelection() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select distinct ephi, e, p, sp  from Employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join p.subdepartment as s ";
        query += "where not ephi.contractType=:contractType ";
        query += "and (ephi.start<=:endDate and (ephi.end>=:startDate or ephi.end=null)) ";
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameter("contractType", EmployeePositionHistoryItem.ContractType.TIME_SPENT);
        hq.setParameter("startDate", formStartDate);
        hq.setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        return (List<Object[]>)hq.list();
    }
    public void processNotTimeSpentSelection(List<Object[]> selection) {
        for(Object[] tuple : selection) {
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[0];
            Employee employee = (Employee)tuple[1];
            Position position = (Position)tuple[2];
            StandardPosition standardPosition = (StandardPosition)tuple[3];
            Row row = new Row();
            row.setEmployee(employee);
            row.setPosition(position);
            row.setStandardPosition(standardPosition);
            row.setTimeSpent(null);
            row.setEmployeePositionHistoryItem(employeePositionHistoryItem);
            this.rows.add(row);
        }
    }
    public List<Object[]> getLeavesSelection() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select li, ephi  from LeavesItem as li ";
        query += "inner join li.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.subdepartment as s ";
        query += "where (ephi.start<=:endDate and (ephi.end>=:startDate or ephi.end=null)) ";
        query += "and (li.start<=:endDate and (li.end>=:startDate or li.end=null)) ";
        query += "and ((ephi.start<=li.end or li.end=null) and (li.start<=ephi.end or ephi.end=null)) ";
        if(subdepartments != null) {
            query += "and s in (:subdepartments) ";
        }
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", formStartDate).setParameter("endDate", formEndDate);
        if(subdepartments != null) {
            hq.setParameterList("subdepartments", subdepartments);
        }
        return (List<Object[]>)hq.list();
    }
    public void processLeavesSelection(List<Object[]> selection) {
        YearMonthDate reportStart = null;
        YearMonthDate reportEnd = null;
        if(formStartDate != null) {
            reportStart = new YearMonthDate(formStartDate);
        }
        if(formEndDate != null) {
            reportEnd = new YearMonthDate(formEndDate);
        }
        YearMonthDateRange reportRange = new YearMonthDateRange(reportStart, reportEnd);
        for(Row row : rows) {
            Calendar positionStartCalendar = row.getEmployeePositionHistoryItem().getStart();
            Calendar positionEndCalendar = row.getEmployeePositionHistoryItem().getEnd();
            YearMonthDate positionStart = null;
            YearMonthDate positionEnd = null;
            if(positionStartCalendar != null) {
                positionStart = new YearMonthDate(positionStartCalendar);
            }
            if(positionEndCalendar != null) {
                positionEnd = new YearMonthDate(positionEndCalendar);
            }
            YearMonthDateRange positionRange = new YearMonthDateRange(positionStart, positionEnd);
            YearMonthDateRange realPositionRange = YearMonthDateRange.getIntersection(reportRange, positionRange);

            List<YearMonthDateRange> excludedLeavesRanges = new LinkedList<YearMonthDateRange>();
            for(Object[] tuple : selection) {
                LeavesItem leavesItem = (LeavesItem)tuple[0];
                EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[1];
                if(row.getEmployeePositionHistoryItem().equals(employeePositionHistoryItem)) {
                    YearMonthDate leavesStart = null;
                    YearMonthDate leavesEnd = null;
                    if(leavesItem.getStart() != null) {
                        leavesStart = new YearMonthDate(leavesItem.getStart());
                    }
                    if(leavesItem.getEnd() != null) {
                        leavesEnd = new YearMonthDate(leavesItem.getEnd());
                    }
                    YearMonthDateRange leavesRange = new YearMonthDateRange(leavesStart, leavesEnd);
                    if(
                            LeavesItem.Type.PAID_LEAVE.equals(leavesItem.getType())
                            || (LeavesItem.Type.UNPAID_LEAVE.equals(leavesItem.getType()) && YearMonthDate.getDaysInRange(leavesStart, leavesEnd)<=15)
                            ) {
                        continue;
                    }
                    excludedLeavesRanges.add(leavesRange);
                }
            }
            List<YearMonthDateRange> ranges = YearMonthDateRange.getSubtraction(realPositionRange, excludedLeavesRanges);
            int count = 0;
            for(YearMonthDateRange range : ranges) {
                count += YearMonthDate.getDaysCountInRangeWithoutDays(range.getStart(), range.getEnd(), this.simpleFreedays);
            }
            row.setWorkingDaysCount(count);
        }
}
    public void calculatePositionWorkingDays() {
        YearMonthDate reportStart = null;
        YearMonthDate reportEnd = null;
        if(formStartDate != null) {
            reportStart = new YearMonthDate(formStartDate);
        }
        if(formEndDate != null) {
            reportEnd = new YearMonthDate(formEndDate);
        }
        YearMonthDateRange reportRange = new YearMonthDateRange(reportStart, reportEnd);
        for(Row row : rows) {
            Calendar positionStartCalendar = row.getEmployeePositionHistoryItem().getStart();
            Calendar positionEndCalendar = row.getEmployeePositionHistoryItem().getEnd();
            YearMonthDate positionStart = null;
            YearMonthDate positionEnd = null;
            if(positionStartCalendar != null) {
                positionStart = new YearMonthDate(positionStartCalendar);
            }
            if(positionEndCalendar != null) {
                positionEnd = new YearMonthDate(positionEndCalendar);
            }
            YearMonthDateRange positionRange = new YearMonthDateRange(positionStart, positionEnd);
            YearMonthDateRange realPositionRange = YearMonthDateRange.getIntersection(reportRange, positionRange);
            row.setPositionWorkingDaysCount(YearMonthDate.getDaysCountInRangeWithoutDays(realPositionRange.getStart(), realPositionRange.getEnd(), simpleFreedays));
        }
    } 
    public void calculateFte() {
        for(Row row : rows) {
            Double fte = null;
            if(this.workingDaysCount != 0) {
                if(EmployeePositionHistoryItem.ContractType.FULL_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    fte = new Double(row.getWorkingDaysCount()) / new Double(this.workingDaysCount);
                } else if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    fte = row.getEmployeePositionHistoryItem().getPartTimePercentage() * new Double(row.getWorkingDaysCount()) / (100 * (new Double(this.workingDaysCount)));
                } else if(EmployeePositionHistoryItem.ContractType.TIME_SPENT.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    fte = row.getTimeSpent() / (60 * 8 * (new Double(this.workingDaysCount)));
                }
            }
            row.setFte(fte);
        }
    } 
   
}
