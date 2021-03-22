/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.CodeDetailReport;
import com.mazars.management.reports.CodeDetailReport.View;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


/**
 *
 * @author glazov
 */
public class CodeDetailReportForm {
    
    private List<Long> projectCodeIds = new LinkedList<Long>();
    private YearMonthDate start;
    private YearMonthDate end;
    private Boolean isRateInfoVisible;
    private Long reportCurrencyId;
    private Map<Long, BigDecimal> currencyRates = new HashMap<Long, BigDecimal>();
    CodeDetailReport.View view;
    public CodeDetailReportForm() {
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }

    public YearMonthDate getEnd() {
        return end;
    }

    public void setEnd(YearMonthDate end) {
        this.end = end;
    }

    public List<Long> getProjectCodeIds() {
        return projectCodeIds;
    }

    public void setProjectCodeIds(List<Long> projectCodeIds) {
        this.projectCodeIds = projectCodeIds;
    }

    public Long getReportCurrencyId() {
        return reportCurrencyId;
    }

    public void setReportCurrencyId(Long reportCurrencyId) {
        this.reportCurrencyId = reportCurrencyId;
    }

    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }

    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }

    public Boolean getIsRateInfoVisible() {
        return isRateInfoVisible;
    }

    public void setIsRateInfoVisible(Boolean isRateInfoVisible) {
        this.isRateInfoVisible = isRateInfoVisible;
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }
  
    public static CodeDetailReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CodeDetailReportForm.class);
    }
}
