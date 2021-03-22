package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.LinkedList;
import java.util.List;

public class ClosedMonthVO {
    private Long id;
    private Integer year;
    private Integer month;

    public ClosedMonthVO() {}

    public ClosedMonthVO(ClosedMonth closedMonth) {
        this.id = closedMonth.getId();
        this.year = closedMonth.getYear();
        this.month = closedMonth.getMonth();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public static List<ClosedMonthVO> getList(List<ClosedMonth> closedMonths) {
        List<ClosedMonthVO> closedMonthVOs = new LinkedList<ClosedMonthVO>();
        if(closedMonths == null) {
            return null;
        }
        for(ClosedMonth closedMonth : closedMonths) {
           closedMonthVOs.add(new ClosedMonthVO(closedMonth));
        }
        return closedMonthVOs;
    }
}
