/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.YearMonthDate;
import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author glazov
 */
public class FeesItemEditForm {
    public static class PositionQuotation {
        private Long id;
        private Long positionId;
        private Integer time;

        public PositionQuotation() {
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

        public Integer getTime() {
            return time;
        }

        public void setTime(Integer time) {
            this.time = time;
        }
    }
    
    public enum Mode {
        CREATE,
        UPDATE
    }
    private FeesItemEditForm.Mode mode;
    private Long id;
    private YearMonthDate date;
    private Long projectCodeId;
    
    private FeesItem.Type type;

    private Long feesAdvanceCurrencyId;
    private Long feesInvoiceCurrencyId;
    private Long feesPaymentCurrencyId;
    private Long feesActCurrencyId;

    private List<PositionQuotation> positionQuotations = new LinkedList<PositionQuotation>();
    private BigDecimal quotationCurrencyRate;
    private BigDecimal quotationNegociated;

    private BigDecimal vat;
    private String comment;

    public FeesItemEditForm() {
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFeesActCurrencyId() {
        return feesActCurrencyId;
    }

    public void setFeesActCurrencyId(Long feesActCurrencyId) {
        this.feesActCurrencyId = feesActCurrencyId;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Long getFeesAdvanceCurrencyId() {
        return feesAdvanceCurrencyId;
    }

    public void setFeesAdvanceCurrencyId(Long feesAdvanceCurrencyId) {
        this.feesAdvanceCurrencyId = feesAdvanceCurrencyId;
    }

    public Long getFeesInvoiceCurrencyId() {
        return feesInvoiceCurrencyId;
    }

    public void setFeesInvoiceCurrencyId(Long feesInvoiceCurrencyId) {
        this.feesInvoiceCurrencyId = feesInvoiceCurrencyId;
    }

    public Long getFeesPaymentCurrencyId() {
        return feesPaymentCurrencyId;
    }

    public void setFeesPaymentCurrencyId(Long feesPaymentCurrencyId) {
        this.feesPaymentCurrencyId = feesPaymentCurrencyId;
    }

    public List<PositionQuotation> getPositionQuotations() {
        return positionQuotations;
    }

    public void setPositionQuotations(List<PositionQuotation> positionQuotations) {
        this.positionQuotations = positionQuotations;
    }

    public BigDecimal getQuotationCurrencyRate() {
        return quotationCurrencyRate;
    }

    public void setQuotationCurrencyRate(BigDecimal quotationCurrencyRate) {
        this.quotationCurrencyRate = quotationCurrencyRate;
    }

    public BigDecimal getQuotationNegociated() {
        return quotationNegociated;
    }

    public void setQuotationNegociated(BigDecimal quotationNegociated) {
        this.quotationNegociated = quotationNegociated;
    }

    public BigDecimal getVat() {
        return vat;
    }

    public void setVat(BigDecimal vat) {
        this.vat = vat;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public static FeesItemEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, FeesItemEditForm.class);
    }
}
