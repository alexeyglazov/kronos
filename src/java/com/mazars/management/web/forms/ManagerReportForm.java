/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import java.math.BigDecimal;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class ManagerReportForm {
    private Long officeId;
    private Long departmentId;
    private Long reportCurrencyId;
    private Integer financialYear;
    private Integer grossMargin;
    private Map<Long, BigDecimal> currencyRates;

    public ManagerReportForm() {
    }

    public Long getReportCurrencyId() {
        return reportCurrencyId;
    }

    public void setReportCurrencyId(Long reportCurrencyId) {
        this.reportCurrencyId = reportCurrencyId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }


    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Integer getGrossMargin() {
        return grossMargin;
    }

    public void setGrossMargin(Integer grossMargin) {
        this.grossMargin = grossMargin;
    }

    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }

    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }
    
    public static ManagerReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ManagerReportForm.class);
    }
}
