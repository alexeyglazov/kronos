/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.service;

import com.mazars.management.db.comparators.LeavesItemComparator;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Holiday;
import com.mazars.management.db.domain.LeavesItem;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class LeavesBalanceCalculator {
    public class MonthDayCount {
        Integer months = 0;
        Integer days = 0;

        public MonthDayCount() {
        }

        public Integer getMonths() {
            return months;
        }

        public void setMonths(Integer months) {
            this.months = months;
        }

        public Integer getDays() {
            return days;
        }

        public void setDays(Integer days) {
            this.days = days;
        }      
        public void addMonths(Integer monthsToAdd) {
            months += monthsToAdd;
        }
        public void addDays(Integer daysToAdd) {
            days += daysToAdd;
        }

        @Override
        public String toString() {
            return "MonthDayCount{" + "months=" + months + ", days=" + days + '}';
        }
    }    
    public class Stage {
        private YearMonthDateRange period;
        Integer annualPaidLeave;
        MonthDayCount duration;
        Double days;

        public Stage() {
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

        public MonthDayCount getDuration() {
            return duration;
        }

        public void setDuration(MonthDayCount duration) {
            this.duration = duration;
        }

        public Double getDays() {
            return days;
        }

        public void setDays(Double days) {
            this.days = days;
        }
    }
    public class SpentLeaveItem {
        private YearMonthDateRange period;
        Integer days;

        public SpentLeaveItem() {
        }

        public YearMonthDateRange getPeriod() {
            return period;
        }

        public void setPeriod(YearMonthDateRange period) {
            this.period = period;
        }

        public Integer getDays() {
            return days;
        }

        public void setDays(Integer days) {
            this.days = days;
        }
    }
    
    Employee employee;
    YearMonthDate date;
    List<Stage> stages = new LinkedList<Stage>();
    List<SpentLeaveItem> spentLeaveItems = new LinkedList<SpentLeaveItem>();

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public List<Stage> getStages() {
        return stages;
    }

    public void setStages(List<Stage> stages) {
        this.stages = stages;
    }

    public List<SpentLeaveItem> getSpentLeaveItems() {
        return spentLeaveItems;
    }

    public void setSpentLeaveItems(List<SpentLeaveItem> spentLeaveItems) {
        this.spentLeaveItems = spentLeaveItems;
    }

    public LeavesBalanceCalculator() {
    }
    
    
    public void calculateBalance() {
        List<EmployeePositionHistoryItemUtils.CareerItem> careerItems = EmployeePositionHistoryItemUtils.getCareerItems(employee);
        for(EmployeePositionHistoryItemUtils.CareerItem careerItem : careerItems) {
            if(careerItem.getPeriod().getStart().compareTo(date) > 0) {
                continue;
            }
            if(careerItem.getPeriod().getEnd() == null || careerItem.getPeriod().getEnd().compareTo(date) > 0) {
                careerItem.getPeriod().setEnd(date);
            }
            Stage stage = new Stage();
            stage.setPeriod(careerItem.getPeriod());
            stage.setAnnualPaidLeave(careerItem.getAnnualPaidLeave());
            stages.add(stage);
        }
        List<YearMonthDateRange> specialLeaves = this.getSpecialLeaves();
        stages = this.reduceStagesByLeavesItems(stages, specialLeaves);
        for(Stage stage : stages) {
            MonthDayCount duration = new MonthDayCount();
            this.calculateDuration(duration, stage.getPeriod());
            stage.setDuration(duration);
            stage.setDays(this.getLeavesDays(stage));
        }
        List<YearMonthDate> holidays = new LinkedList<YearMonthDate>();
        for(Holiday holiday : Holiday.getAllByCountry(employee.getCountry())) {
            holidays.add(new YearMonthDate(holiday.getDate()));
        }
        for(YearMonthDateRange period: this.getStandardLeaves()) {
            SpentLeaveItem spentLeaveItem = new SpentLeaveItem();
            spentLeaveItem.setPeriod(period);
            spentLeaveItem.setDays(YearMonthDate.getDaysCountInRangeWithoutDays(period.getStart(), period.getEnd(), holidays));
            spentLeaveItems.add(spentLeaveItem);
        }
    }
    public List<YearMonthDateRange> getSpecialLeaves() {
        List<YearMonthDateRange> specialLeaves = new LinkedList<YearMonthDateRange>();
        List<YearMonthDateRange> tmpLeaves = new LinkedList<YearMonthDateRange>();
        List<LeavesItem> leavesItems = new LinkedList<LeavesItem>(employee.getLeavesItems());
        Collections.sort(leavesItems, new LeavesItemComparator());
        for(LeavesItem leavesItem : leavesItems) {
            if(! LeavesItem.Type.UNPAID_LEAVE.equals(leavesItem.getType()) && ! LeavesItem.Type.PARENTAL_LEAVE.equals(leavesItem.getType())) {
                continue;
            }                
            YearMonthDateRange leavesItemRange = new YearMonthDateRange(leavesItem.getStart(), leavesItem.getEnd());
            if(leavesItemRange.getStart().compareTo(date) > 0) {
                continue;
            }
            if(! tmpLeaves.isEmpty() && leavesItemRange.getStart().compareTo(tmpLeaves.get(tmpLeaves.size() - 1).getEnd().getShifted(1)) == 0) {
                tmpLeaves.get(tmpLeaves.size() - 1).setEnd(leavesItemRange.getEnd());
            } else {
                tmpLeaves.add(leavesItemRange);
            }
        }
        for(YearMonthDateRange leavesItem : tmpLeaves) {
            if(leavesItem.getEnd().compareTo(leavesItem.getStart().getShifted(14)) >= 0) {
               specialLeaves.add(leavesItem); 
            }
        }
        return specialLeaves;
    }
    public List<Stage> reduceStagesByLeavesItems(List<Stage> stages, List<YearMonthDateRange> leavesPeriods) {
        List<Stage> result = new LinkedList<Stage>(stages);
        for(YearMonthDateRange leavesPeriod : leavesPeriods) {
            List<Stage> r = new LinkedList<Stage>();
            for(Stage stage : result) {
                List<Stage> tmpResults = this.reduceStageByLeavesItem(stage, leavesPeriod);
                if(! tmpResults.isEmpty()) {
                    r.addAll(tmpResults);
                }
            }
            result = r;
        }
        return result;
    }
    public List<Stage> reduceStageByLeavesItem(Stage stage, YearMonthDateRange leavesPeriod) {
        List<Stage> result = new LinkedList<Stage>();
        List<YearMonthDateRange> subtraction = YearMonthDateRange.getSubtraction(stage.getPeriod(), leavesPeriod);
        for(YearMonthDateRange period : subtraction) {
            Stage p = new Stage();
            p.setPeriod(period);
            p.setAnnualPaidLeave(stage.getAnnualPaidLeave());
            result.add(p);
        }
        return result;
    }
    public List<YearMonthDateRange> getStandardLeaves() {
        List<YearMonthDateRange> standardLeaves = new LinkedList<YearMonthDateRange>();
        for(LeavesItem leavesItem : employee.getLeavesItems()) {
            if(LeavesItem.Type.PAID_LEAVE.equals(leavesItem.getType())) {
                YearMonthDateRange leavesItemRange = new YearMonthDateRange(leavesItem.getStart(), leavesItem.getEnd());
                if(leavesItemRange.getStart().compareTo(date) > 0) {
                    continue;
                }
                if(leavesItemRange.getEnd() == null || leavesItemRange.getEnd().compareTo(date) > 0) {
                    leavesItemRange.setEnd(date);
                }
                standardLeaves.add(leavesItemRange);
            }
        }
        return standardLeaves;
    }
    public void calculateDuration(MonthDayCount duration, YearMonthDateRange range) {
        YearMonthDate start = range.getStart();
        YearMonthDate end = range.getEnd();
        if(start.getYear().equals(end.getYear()) && start.getMonth().equals(end.getMonth())) {
            int days = (1 + end.getDayOfMonth() - start.getDayOfMonth());
            if(days == YearMonthDate.getDaysInCertainYearMonth(start.getYear(), start.getMonth())) {
                duration.addMonths(1);
            } else {
                duration.addDays(days);
            }
        } else if(start.getYear().equals(end.getYear())) {
            YearMonthDate endTmp = new YearMonthDate(start.getYear(), start.getMonth(), YearMonthDate.getDaysInCertainYearMonth(start.getYear(), start.getMonth()));
            YearMonthDate startTmp = new YearMonthDate(end.getYear(), end.getMonth(), 1);
            this.calculateDuration(duration, new YearMonthDateRange(start, endTmp));
            if(end.getMonth() - start.getMonth() > 1) {
                duration.addMonths(end.getMonth() - start.getMonth() - 1);
            }        
            this.calculateDuration(duration, new YearMonthDateRange(startTmp, end));        
        } else {
            YearMonthDate endTmp = new YearMonthDate(start.getYear(), 11, 31);
            YearMonthDate startTmp = new YearMonthDate(end.getYear(), 0, 1);
            this.calculateDuration(duration, new YearMonthDateRange(start, endTmp));
            if(end.getYear() - start.getYear() > 1) {
                duration.addMonths(12 * (end.getYear() - start.getYear() - 1));
            }        
            this.calculateDuration(duration, new YearMonthDateRange(startTmp, end));
        }
    }    
    public Double getLeavesDays(Stage stage) {
        YearMonthDate start = stage.getPeriod().getStart();
        YearMonthDate end = stage.getPeriod().getEnd();
        
        Double part = 0.0;
        if(! start.getMonth().equals(end.getMonth()) || ! start.getYear().equals(end.getYear()) ) {
            int startMonthDays = YearMonthDate.getDaysInCertainYearMonth(start.getYear(), start.getMonth());
            int endMonthDays = YearMonthDate.getDaysInCertainYearMonth(end.getYear(), end.getMonth());

            YearMonthDate startMonthEndDay = new YearMonthDate(start.getYear(), start.getMonth(), startMonthDays);
            YearMonthDate endMonthStartDay = new YearMonthDate(end.getYear(), end.getMonth(), 1);

            int startMonthWorkedDays = YearMonthDate.getDaysInRange(start, startMonthEndDay);
            int endMonthWorkedDays = YearMonthDate.getDaysInRange(endMonthStartDay, end);
            if(! start.getDayOfMonth().equals(1)) {
                part += (0.0 + startMonthWorkedDays) / startMonthDays;
            }
            if(! end.getDayOfMonth().equals(endMonthDays)) {
                part += (0.0 + endMonthWorkedDays) / endMonthDays;
            }
        } else {
            if(stage.getDuration().getDays() > 0) {
                int startMonthDays = YearMonthDate.getDaysInCertainYearMonth(start.getYear(), start.getMonth());
                int startMonthWorkedDays = YearMonthDate.getDaysInRange(start, end);
                part += (0.0 + startMonthWorkedDays) / startMonthDays;
            }
        }
        int months = 0;
        if(part < 0.5) {
            months = stage.getDuration().getMonths();
        } else if(part < 1.5) {
            months = stage.getDuration().getMonths() + 1;
        } else {
            months = stage.getDuration().getMonths() + 2;
        }
        Double leavesDays = (months / 12.0) * stage.getAnnualPaidLeave();
        return leavesDays;
    }
}
