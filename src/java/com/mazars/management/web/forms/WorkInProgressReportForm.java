/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import java.math.BigDecimal;
import java.util.Map;


/**
 *
 * @author glazov
 */
public class WorkInProgressReportForm {

    private YearMonthDate endDate;
    private Map<Long, BigDecimal> currencyRates;
    private WorkInProgressReportFilter filter;

    public WorkInProgressReportForm() {
    }

    public WorkInProgressReportFilter getFilter() {
        return filter;
    }

    public void setFilter(WorkInProgressReportFilter filter) {
        this.filter = filter;
    }

    public YearMonthDate getEndDate() {
        return endDate;
    }

    public void setEndDate(YearMonthDate endDate) {
        this.endDate = endDate;
    }

    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }

    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }

   
    public static WorkInProgressReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, WorkInProgressReportForm.class);
    }
}
