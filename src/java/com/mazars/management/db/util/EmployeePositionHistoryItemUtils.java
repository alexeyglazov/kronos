/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.util;

import com.mazars.management.db.domain.AnnualPaidLeave;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.StandardPosition;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.service.LeavesBalanceCalculator;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class EmployeePositionHistoryItemUtils {
    public static class DescribedCarreerItem {
        private EmployeePositionHistoryItem employeePositionHistoryItem;
        private Employee employee;
        private Position position;
        private StandardPosition standardPosition;
        private Subdepartment subdepartment;

        public EmployeePositionHistoryItem getEmployeePositionHistoryItem() {
            return employeePositionHistoryItem;
        }

        public void setEmployeePositionHistoryItem(EmployeePositionHistoryItem employeePositionHistoryItem) {
            this.employeePositionHistoryItem = employeePositionHistoryItem;
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

        public StandardPosition getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(StandardPosition standardPosition) {
            this.standardPosition = standardPosition;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
        }
        public static DescribedCarreerItem getDescribedCarreerItemWithoutCarreer(Employee employee) {
            DescribedCarreerItem describedCarreerItem = new DescribedCarreerItem();
            describedCarreerItem.setStandardPosition(null);
            describedCarreerItem.setPosition(null);
            describedCarreerItem.setEmployee(employee);
            describedCarreerItem.setEmployeePositionHistoryItem(null);
            describedCarreerItem.setSubdepartment(null);
            return describedCarreerItem;
        }
    }
    public static class CareerItem {
        private YearMonthDateRange period;
        Integer annualPaidLeave;

        public CareerItem() {
        }

        public YearMonthDateRange getPeriod() {
            return period;
        }

        public void setPeriod(YearMonthDateRange period) {
            this.period = period;
        }

        public Integer getAnnualPaidLeave() {
            return annualPaidLeave;
        }

        public void setAnnualPaidLeave(Integer annualPaidLeave) {
            this.annualPaidLeave = annualPaidLeave;
        }
    }
    public static class CareerItemComparator implements Comparator<CareerItem> {
        public int compare(CareerItem o1, CareerItem o2) {
            return o1.getPeriod().getStart().compareTo(o2.getPeriod().getStart());
        }
    }
    public static List<DescribedCarreerItem> getDescribedCarreerItems(Subdepartment subdepartment, Calendar start, Calendar end) {
        List<DescribedCarreerItem> describedCarreerItems = new LinkedList<EmployeePositionHistoryItemUtils.DescribedCarreerItem>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select sp, p, e, ephi from EmployeePositionHistoryItem as ephi  ";
        query += "inner join ephi.employee as e ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        if(subdepartment != null) {
            query += "inner join p.subdepartment as s ";
        }
        query += "where ";
        query += "((ephi.start<=:end) and (ephi.end=null or ephi.end>=:start)) ";
        if(subdepartment != null) {
            query += "and s=:subdepartment ";
        }
        query += "group by ephi ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        if(subdepartment != null) {
            hq.setParameter("subdepartment", subdepartment);
        }    
        List<Object[]> tuples = (List<Object[]>)hq.list();
        for(Object[] tuple : tuples) {
            DescribedCarreerItem describedCarreerItem = new DescribedCarreerItem();
            describedCarreerItem.setStandardPosition((StandardPosition)tuple[0]);
            describedCarreerItem.setPosition((Position)tuple[1]);
            describedCarreerItem.setEmployee((Employee)tuple[2]);
            describedCarreerItem.setEmployeePositionHistoryItem((EmployeePositionHistoryItem)tuple[3]);
            describedCarreerItem.setSubdepartment(subdepartment);
            describedCarreerItems.add(describedCarreerItem);
        }
        return describedCarreerItems;
    }
    public static List<DescribedCarreerItem> getDescribedCarreerItemsWithCarreer(List<Long> employeeIds, Calendar start, Calendar end) {
        List<DescribedCarreerItem> describedCarreerItems = new LinkedList<EmployeePositionHistoryItemUtils.DescribedCarreerItem>();
        if(employeeIds.isEmpty()) {
            return describedCarreerItems;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select sp, p, e, ephi, s from EmployeePositionHistoryItem as ephi  ";
        query += "inner join ephi.employee as e ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join p.subdepartment as s ";
        query += "where ";
        query += "((ephi.start<=:end) and (ephi.end=null or ephi.end>=:start)) ";
        query += "and e.id in (:employeeIds) ";
        query += "group by ephi ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameterList("employeeIds", employeeIds);
        List<Object[]> tuples = (List<Object[]>)hq.list();
        for(Object[] tuple : tuples) {
            DescribedCarreerItem describedCarreerItem = new DescribedCarreerItem();
            describedCarreerItem.setStandardPosition((StandardPosition)tuple[0]);
            describedCarreerItem.setPosition((Position)tuple[1]);
            describedCarreerItem.setEmployee((Employee)tuple[2]);
            describedCarreerItem.setEmployeePositionHistoryItem((EmployeePositionHistoryItem)tuple[3]);
            describedCarreerItem.setSubdepartment((Subdepartment)tuple[4]);
            describedCarreerItems.add(describedCarreerItem);
        }
        return describedCarreerItems;
    }
    public static List<DescribedCarreerItem> getDescribedCarreerItemsWithoutCarreer(List<Long> employeeIds) {
        List<DescribedCarreerItem> describedCarreerItems = new LinkedList<EmployeePositionHistoryItemUtils.DescribedCarreerItem>();
        if(employeeIds.isEmpty()) {
            return describedCarreerItems;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e from Employee as e  ";
        query += "where ";
        query += "e.id in (:employeeIds) ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("employeeIds", employeeIds);
        List<Employee> employees = (List<Employee>)hq.list();
        for(Employee employee : employees) {
            DescribedCarreerItem describedCarreerItem = new DescribedCarreerItem();
            describedCarreerItem.setStandardPosition(null);
            describedCarreerItem.setPosition(null);
            describedCarreerItem.setEmployee(employee);
            describedCarreerItem.setEmployeePositionHistoryItem(null);
            describedCarreerItem.setSubdepartment(null);
            describedCarreerItems.add(describedCarreerItem);
        }
        return describedCarreerItems;
    }
    public static List<DescribedCarreerItem> getDescribedCarreerItems(List<Long> employeeIds, Calendar start, Calendar end) {
        List<DescribedCarreerItem> describedCarreerItems = new LinkedList<EmployeePositionHistoryItemUtils.DescribedCarreerItem>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select sp, p, e, ephi, s from EmployeePositionHistoryItem as ephi  ";
        query += "inner join ephi.employee as e ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join p.subdepartment as s ";
        query += "where ";
        query += "((ephi.start<=:end) and (ephi.end=null or ephi.end>=:start)) ";
        query += "and e.id in :employeeIds ";
        query += "group by ephi ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameterList("employeeIds", employeeIds);
        List<Object[]> tuples = (List<Object[]>)hq.list();
        for(Object[] tuple : tuples) {
            DescribedCarreerItem describedCarreerItem = new DescribedCarreerItem();
            describedCarreerItem.setStandardPosition((StandardPosition)tuple[0]);
            describedCarreerItem.setPosition((Position)tuple[1]);
            describedCarreerItem.setEmployee((Employee)tuple[2]);
            describedCarreerItem.setEmployeePositionHistoryItem((EmployeePositionHistoryItem)tuple[3]);
            describedCarreerItem.setSubdepartment((Subdepartment)tuple[4]);
            describedCarreerItems.add(describedCarreerItem);
        }
        return describedCarreerItems;
    }    
    public static List<DescribedCarreerItem> merge(List<DescribedCarreerItem> list1, List<DescribedCarreerItem> list2) {
        List<DescribedCarreerItem> result = new LinkedList<DescribedCarreerItem>();
        result.addAll(list1);
        for(DescribedCarreerItem item : list2) {
            boolean found = false;
            for(DescribedCarreerItem itemTmp : list1) {
                if(itemTmp.getEmployeePositionHistoryItem().getId().equals(item.getEmployeePositionHistoryItem().getId()))  {
                    found = true;
                    break;
                }
            }
            if(! found) {
                result.add(item);
            }
        }
        return result;
    }
    public static List<CareerItem> getCareerItems(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select apl, ephi from AnnualPaidLeave as apl ";
        query += "inner join apl.position as p ";
        query += "inner join p.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.employee as e ";
        query += "where ";
        query += "e=:employee ";
        query += "and apl.contractType=ephi.contractType ";
        query += "and ( ";
        query += "(apl.start=null and apl.end=null) ";
        query += "or (apl.start=null and apl.end!=null and ephi.start<=apl.end) ";
        query += "or (apl.start!=null and apl.end=null and (ephi.end=null or ephi.end>=apl.start)) ";
        query += "or (apl.start!=null and apl.end!=null and (ephi.start<=apl.end and (ephi.end=null or ephi.end>=apl.start))) ";
        query += ") ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee);
        List<Object[]> tuples = (List<Object[]>)hq.list();
        
        List<CareerItem> tmpCareerItems = new LinkedList<CareerItem>();
        for(Object[] tuple : tuples) {
            AnnualPaidLeave annualPaidLeave = (AnnualPaidLeave)tuple[0];
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[1];
            YearMonthDateRange positionPeriod = new YearMonthDateRange(employeePositionHistoryItem.getStart(), employeePositionHistoryItem.getEnd());
            YearMonthDateRange annualPaidLeavePeriod = new YearMonthDateRange(annualPaidLeave.getStart(), annualPaidLeave.getEnd());
            YearMonthDateRange range = YearMonthDateRange.getIntersection(positionPeriod, annualPaidLeavePeriod);
            if(range != null) {
                CareerItem careerItem = new CareerItem();
                careerItem.setPeriod(range);
                careerItem.setAnnualPaidLeave(annualPaidLeave.getDuration());
                tmpCareerItems.add(careerItem);
            }
        }
        Collections.sort(tmpCareerItems, new CareerItemComparator());
        List<CareerItem> careerItems = new LinkedList<CareerItem>();
        for(CareerItem careerItem : tmpCareerItems) {
            if(careerItems.isEmpty()) {
                careerItems.add(careerItem);
            } else if(! careerItems.get(careerItems.size() - 1).getAnnualPaidLeave().equals(careerItem.getAnnualPaidLeave()) ) {
                careerItems.add(careerItem);
            } else if(careerItems.get(careerItems.size() - 1).getPeriod().getEnd() == null) {
            } else if(careerItems.get(careerItems.size() - 1).getPeriod().getEnd().getShifted(1).compareTo(careerItem.getPeriod().getStart()) < 0 ) { 
                careerItems.add(careerItem);
            } else {
                careerItems.get(careerItems.size() - 1).getPeriod().setEnd(careerItem.getPeriod().getEnd());
            }
        }
        return careerItems;
    }
}
