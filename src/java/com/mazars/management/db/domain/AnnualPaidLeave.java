/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.comparators.AnnualPaidLeaveComparator;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class AnnualPaidLeave {
    private Long id;
    private Calendar start;
    private Calendar end;
    private EmployeePositionHistoryItem.ContractType contractType;
    private Integer duration;
    private Position position;

    public AnnualPaidLeave() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public EmployeePositionHistoryItem.ContractType getContractType() {
        return contractType;
    }

    public void setContractType(EmployeePositionHistoryItem.ContractType contractType) {
        this.contractType = contractType;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }
    public static List<AnnualPaidLeave> getByPostionAndContractType(Position position, EmployeePositionHistoryItem.ContractType contractType) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select apl from AnnualPaidLeave as apl ";
        query += "where ";
        query += "apl.position=:position ";
        query += "and apl.contractType=:contractType ";
        Query hq = hs.createQuery(query);
        hq.setParameter("position", position);
        hq.setParameter("contractType", contractType);
        return (List<AnnualPaidLeave>)hq.list();
    }
    public static List<AnnualPaidLeave> getByEmployee(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select apl from AnnualPaidLeave as apl ";
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
        return (List<AnnualPaidLeave>)hq.list();    
    }
    public static List<String> validate(Position position) {
        List<String> errors = new LinkedList<String>();
        List<AnnualPaidLeave> annualPaidLeaves =  new LinkedList<AnnualPaidLeave>(position.getAnnualPaidLeaves());
        List<AnnualPaidLeave> fullTimeAnnualPaidLeaves =  new LinkedList<AnnualPaidLeave>();
        List<AnnualPaidLeave> partTimeAnnualPaidLeaves =  new LinkedList<AnnualPaidLeave>();
        List<AnnualPaidLeave> timeSpentAnnualPaidLeaves =  new LinkedList<AnnualPaidLeave>();
        Collections.sort(annualPaidLeaves, new AnnualPaidLeaveComparator());
        for(AnnualPaidLeave annualPaidLeave : annualPaidLeaves) {
            if(EmployeePositionHistoryItem.ContractType.FULL_TIME.equals(annualPaidLeave.getContractType())) {
                fullTimeAnnualPaidLeaves.add(annualPaidLeave);
            } else if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(annualPaidLeave.getContractType())) {
                partTimeAnnualPaidLeaves.add(annualPaidLeave);
            } else if(EmployeePositionHistoryItem.ContractType.TIME_SPENT.equals(annualPaidLeave.getContractType())) {
                timeSpentAnnualPaidLeaves.add(annualPaidLeave);
            }
        }
        errors.addAll(validate(fullTimeAnnualPaidLeaves, "Full Time Annual Paid Leaves"));
        errors.addAll(validate(partTimeAnnualPaidLeaves, "Part Time Annual Paid Leaves"));
        errors.addAll(validate(timeSpentAnnualPaidLeaves, "Time Spent Annual Paid Leaves"));
        return errors;
    }
    private static List<String> validate(List<AnnualPaidLeave> annualPaidLeaves, String type) {
        List<String> errors = new LinkedList<String>();
        if(annualPaidLeaves.isEmpty()) {
            errors.add(type + ". No data at all.");
        } else if(annualPaidLeaves.size() == 1) {
            if(annualPaidLeaves.get(0).getEnd() != null) {
                errors.add(type + ". End Date should be undefined");
            }
        } else {
            int undefinedEndCount = 0;
            for(AnnualPaidLeave annualPaidLeave : annualPaidLeaves) {
                if(annualPaidLeave.getEnd() == null) {
                    undefinedEndCount++;
                }
            }
            if(undefinedEndCount == 0) {
                errors.add(type + ". Last Item End Date should be undefined");
            } else if(undefinedEndCount == 1) {
                if(annualPaidLeaves.get(annualPaidLeaves.size() -1 ).getEnd() == null) {
                    int count = 0;
                    YearMonthDate prevEnd = null;
                    for(AnnualPaidLeave annualPaidLeave : annualPaidLeaves) {
                        if(count == 0) {
                            prevEnd = new YearMonthDate(annualPaidLeave.getEnd());
                            count++;
                            continue;
                        }
                        if(! prevEnd.getShifted(1).equals(new YearMonthDate(annualPaidLeave.getStart()))) {
                            errors.add(type + ". End Date incorrect. Item (" + count + ")");
                        }
                        if(annualPaidLeave.getEnd() != null) {
                            prevEnd = new YearMonthDate(annualPaidLeave.getEnd());
                        }
                        count++;
                    }     
                } else {
                    errors.add(type + ". End Date undefined for item that is not last");
                }
            } else if(undefinedEndCount > 1) {
                errors.add(type + ". More than one End Date undefined");
            }
        }        
        return errors;
    }
}
