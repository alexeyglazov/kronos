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
public class InvoicingReportForm {
    private Map<Long, BigDecimal> currencyRates;
    private ProjectCodeListFilter filter;
    private InvoiceRequestsFilter invoiceRequestsFilter;

    public InvoicingReportForm() {
    }

    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }

    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }

    public ProjectCodeListFilter getFilter() {
        return filter;
    }

    public void setFilter(ProjectCodeListFilter filter) {
        this.filter = filter;
    }

    public InvoiceRequestsFilter getInvoiceRequestsFilter() {
        return invoiceRequestsFilter;
    }

    public void setInvoiceRequestsFilter(InvoiceRequestsFilter invoiceRequestsFilter) {
        this.invoiceRequestsFilter = invoiceRequestsFilter;
    }
  
    public static InvoicingReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, InvoicingReportForm.class);
    }
}
