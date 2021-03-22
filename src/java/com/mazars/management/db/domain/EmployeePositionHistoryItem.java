/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class EmployeePositionHistoryItem {
    public enum ContractType {
        FULL_TIME,
        PART_TIME,
        TIME_SPENT
    }
    public enum CareerStatus {
        STARTING,
        MIDDLE,
        ENDING,
        ONLY
    }
    public enum TimeStatus {
        PAST,
        CURRENT,
        FUTURE
    }
    private Long id;
    private Calendar start;
    private Calendar end;
    private Employee employee;
    private Position position;
    private ContractType contractType;
    private Integer partTimePercentage;
    private CareerStatus careerStatus;
    public EmployeePositionHistoryItem() {
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
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

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public ContractType getContractType() {
        return contractType;
    }

    public void setContractType(ContractType contractType) {
        this.contractType = contractType;
    }

    public Integer getPartTimePercentage() {
        return partTimePercentage;
    }

    public void setPartTimePercentage(Integer partTimePercentage) {
        this.partTimePercentage = partTimePercentage;
    }

    public CareerStatus getCareerStatus() {
        return careerStatus;
    }

    public void setCareerStatus(CareerStatus careerStatus) {
        this.careerStatus = careerStatus;
    }

    public static List<EmployeePositionHistoryItem> getEmployeePositionHistoryItems(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<EmployeePositionHistoryItem>)hs.createQuery("select ephi from EmployeePositionHistoryItem as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }
    public static List<EmployeePositionHistoryItem> getSortedEmployeePositionHistoryItems(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<EmployeePositionHistoryItem>)hs.createQuery("select ephi from EmployeePositionHistoryItem as ephi inner join ephi.employee as e where e=:employee order by ephi.start desc").setParameter("employee", employee).list();
    }
    public static List<EmployeePositionHistoryItem> getEmployeePositionHistoryItems(Employee employee, Subdepartment subdepartment) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<EmployeePositionHistoryItem>)hs.createQuery("select ephi from Subdepartment as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee and s=:subdepartment order by ephi.start desc").setParameter("employee", employee).setParameter("subdepartment", subdepartment).list();
    }
    public static EmployeePositionHistoryItem getFirstEmployeePositionHistoryItem(Employee employee) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getEmployeePositionHistoryItems(employee);
        if(employeePositionHistoryItems.isEmpty()) {
            return null;
        }
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        return employeePositionHistoryItems.get(0);
    }

    public static EmployeePositionHistoryItem getLatestEmployeePositionHistoryItem(Employee employee) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getSortedEmployeePositionHistoryItems(employee);
        if(employeePositionHistoryItems.isEmpty()) {
            return null;
        }
        return employeePositionHistoryItems.get(0);
    }
    public static EmployeePositionHistoryItem getLatestEmployeePositionHistoryItem(Employee employee, Subdepartment subdepartment) {
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = EmployeePositionHistoryItem.getEmployeePositionHistoryItems(employee, subdepartment);
        if(employeePositionHistoryItems.isEmpty()) {
            return null;
        }
        return employeePositionHistoryItems.get(0);
    }
    public static List<StandardPosition> getStandardPositions(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<StandardPosition>)hs.createQuery("select distinct sp from StandardPosition as sp inner join sp.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }
    public static List<Position> getPositions(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Position>)hs.createQuery("select distinct p from Position as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }
    public static List<Subdepartment> getSubdepartments(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Subdepartment>)hs.createQuery("select distinct s from Subdepartment as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }

    public static List<Department> getDepartments(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Department>)hs.createQuery("select distinct d from Department as d inner join d.subdepartments as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }
    public static List<Office> getOffices(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Office>)hs.createQuery("select distinct o from Office as o inner join o.departments as d inner join d.subdepartments as s inner join s.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e where e=:employee").setParameter("employee", employee).list();
    }
    public static void checkConsistency(List<EmployeePositionHistoryItem> items) {
        Collections.sort(items, new EmployeePositionHistoryItemComparator());
    }
    public static Calendar getMinStart() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (Calendar)hs.createQuery("select min(ephi.start) from EmployeePositionHistoryItem as ephi ").uniqueResult();
    }
    public TimeStatus getTimeStatus(Calendar day) {
        if(this.getStart().after(day)) {
            return TimeStatus.FUTURE;                    
        } else if(this.getEnd() != null && this.getEnd().before(day)) {
            return TimeStatus.PAST;
        } else {
            return TimeStatus.CURRENT;
        }
    }
    public static void assignCareerStatuses(List<EmployeePositionHistoryItem> employeePositionHistoryItems) {
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        if(employeePositionHistoryItems.isEmpty()) {
            return;
        } else if(employeePositionHistoryItems.size() == 1) {
            employeePositionHistoryItems.get(0).setCareerStatus(CareerStatus.ONLY);
        } else if(employeePositionHistoryItems.size() == 2) {
            employeePositionHistoryItems.get(0).setCareerStatus(CareerStatus.STARTING);
            employeePositionHistoryItems.get(1).setCareerStatus(CareerStatus.ENDING);
        } else {
            employeePositionHistoryItems.get(0).setCareerStatus(CareerStatus.STARTING);
            int count = 0;
            for(EmployeePositionHistoryItem emploeEmployeePositionHistoryItem : employeePositionHistoryItems) {
                if(count == 0 || count == employeePositionHistoryItems.size() - 1) {
                    count++;
                    continue;
                }
                emploeEmployeePositionHistoryItem.setCareerStatus(CareerStatus.MIDDLE);
                count++;
            }
            employeePositionHistoryItems.get(employeePositionHistoryItems.size() - 1).setCareerStatus(CareerStatus.ENDING);
        }
    }
    public static List<YearMonthDateRange> getEmptyRanges(Employee employee, YearMonthDateRange reportRange) {
        List<YearMonthDateRange> positionRanges = new LinkedList<YearMonthDateRange>();
        for(EmployeePositionHistoryItem employeePositionHistoryItem : employee.getEmployeePositionHistoryItems()) {
            Calendar positionStartCalendar = employeePositionHistoryItem.getStart();
            Calendar positionEndCalendar = employeePositionHistoryItem.getEnd();
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
            if(realPositionRange != null) {
                positionRanges.add(realPositionRange);
            }
        }
        List<YearMonthDateRange> emptyRanges = YearMonthDateRange.getSubtraction(reportRange, positionRanges);
        return emptyRanges;
    }

    @Override
    public int hashCode() {
        int hash = 3;
        hash = 89 * hash + Objects.hashCode(this.id);
        return hash;
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof EmployeePositionHistoryItem)) {
            return false;
        }
        final EmployeePositionHistoryItem other = (EmployeePositionHistoryItem) obj;
        if (!Objects.equals(this.id, other.id)) {
            return false;
        }
        return true;
    }
    
}
