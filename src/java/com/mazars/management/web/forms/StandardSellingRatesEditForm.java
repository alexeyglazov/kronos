/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.LinkedList;

/**
 *
 * @author glazov
 */
public class StandardSellingRatesEditForm {
    public static class StandardSellingRate {
        private Long id;
        private Long positionId;
        private BigDecimal amount;

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
        }
    }
    public enum Mode {
        CREATE,
        UPDATE
    }
    private StandardSellingRatesEditForm.Mode mode;
    private Long standardSellingRateGroupId;
    private Long subdepartmentId;
    private Long currencyId;
    private YearMonthDate start;
    private YearMonthDate end;
    private List<StandardSellingRate> standardSellingRates = new LinkedList<StandardSellingRate>();

    public List<StandardSellingRate> getStandardSellingRates() {
        return standardSellingRates;
    }

    public void setStandardSellingRates(List<StandardSellingRate> standardSellingRates) {
        this.standardSellingRates = standardSellingRates;
    }

    public Long getCurrencyId() {
        return currencyId;
    }

    public void setCurrencyId(Long currencyId) {
        this.currencyId = currencyId;
    }

    public YearMonthDate getEnd() {
        return end;
    }

    public void setEnd(YearMonthDate end) {
        this.end = end;
    }

    public Long getStandardSellingRateGroupId() {
        return standardSellingRateGroupId;
    }

    public void setStandardSellingRateGroupId(Long standardSellingRateGroupId) {
        this.standardSellingRateGroupId = standardSellingRateGroupId;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public YearMonthDate getStart() {
        return start;
    }

    public void setStart(YearMonthDate start) {
        this.start = start;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public StandardSellingRatesEditForm() {
    }

    public static StandardSellingRatesEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, StandardSellingRatesEditForm.class);
    }
}
