/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.*;

/**
 *
 * @author glazov
 */
public class InvoiceDocumentReportVO {
    public class RowVO {
        private Long clientId;
        private String clientName;
        private Long projectCodeId;
        private String projectCodeCode;
        private String projectCodeDescription;
        private InvoiceDocumentReport.Type type;
        private InvoiceRequestPacket.Status status;
        private Boolean withVAT;
        private String comment;
        private BigDecimal invoiceTotalAmount;
        private Long invoiceInvoiceCurrencyId;
        private Long invoicePaymentCurrencyId;
        private YearMonthDate invoiceDate;
        private String invoiceReference;
        private String invoiceComment;
        private BigDecimal actTotalAmount;
        private Long actInvoiceCurrencyId;
        private Long actPaymentCurrencyId;
        private YearMonthDate actDate;
        private String actReference;
        private String actComment;
        private String taxInvoiceReference;
        private YearMonthDateTime time;
      
        public RowVO(InvoiceDocumentReport.Row row) {
            if(row.getClient() != null) {
                clientId = row.getClient().getId();
                clientName = row.getClient().getName();
            }    
            if(row.getProjectCode() != null) {
                projectCodeId = row.getProjectCode().getId();
                projectCodeCode = row.getProjectCode().getCode();
                projectCodeDescription = row.getProjectCode().getDescription();
            }
            if(row.getInvoiceRequestPacket() != null) {
                status = row.getInvoiceRequestPacket().getStatus();
                withVAT = row.getInvoiceRequestPacket().getWithVAT();
                comment = row.getInvoiceRequestPacket().getComment();
            }
            type = row.getType();
            if(row.getInvoiceRequest() != null) {
                invoiceTotalAmount = row.getInvoiceRequestTotalAmount();
                invoiceInvoiceCurrencyId = row.getInvoiceInvoiceCurrency().getId();
                invoicePaymentCurrencyId = row.getInvoicePaymentCurrency().getId();
                invoiceDate = new YearMonthDate(row.getInvoiceRequest().getDate());
                invoiceReference = row.getInvoiceRequest().getReference();
            } else if(row.getActRequest() != null) {
                actTotalAmount = row.getActRequestTotalAmount();
                actInvoiceCurrencyId = row.getActInvoiceCurrency().getId();
                actPaymentCurrencyId = row.getActPaymentCurrency().getId();
                actDate = new YearMonthDate(row.getActRequest().getDate());
                actReference = row.getActRequest().getReference();
            } else if(row.getTaxInvoiceRequest() != null) {
                taxInvoiceReference = row.getTaxInvoiceRequest().getReference();
            }
            invoiceComment = row.getInvoiceComment();
            actComment = row.getActComment();
            if(row.getTime() != null) {
                time = new YearMonthDateTime(row.getTime());
            }
        }

        public String getInvoiceReference() {
            return invoiceReference;
        }

        public void setInvoiceReference(String invoiceReference) {
            this.invoiceReference = invoiceReference;
        }

        public String getActReference() {
            return actReference;
        }

        public void setActReference(String actReference) {
            this.actReference = actReference;
        }

        public String getTaxInvoiceReference() {
            return taxInvoiceReference;
        }

        public void setTaxInvoiceReference(String taxInvoiceReference) {
            this.taxInvoiceReference = taxInvoiceReference;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }

        public Boolean getWithVAT() {
            return withVAT;
        }

        public void setWithVAT(Boolean withVAT) {
            this.withVAT = withVAT;
        }

        public InvoiceRequestPacket.Status getStatus() {
            return status;
        }

        public void setStatus(InvoiceRequestPacket.Status status) {
            this.status = status;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public String getProjectCodeDescription() {
            return projectCodeDescription;
        }

        public void setProjectCodeDescription(String projectCodeDescription) {
            this.projectCodeDescription = projectCodeDescription;
        }

        public InvoiceDocumentReport.Type getType() {
            return type;
        }

        public void setType(InvoiceDocumentReport.Type type) {
            this.type = type;
        }

        public Long getInvoiceInvoiceCurrencyId() {
            return invoiceInvoiceCurrencyId;
        }

        public void setInvoiceInvoiceCurrencyId(Long invoiceInvoiceCurrencyId) {
            this.invoiceInvoiceCurrencyId = invoiceInvoiceCurrencyId;
        }

        public Long getInvoicePaymentCurrencyId() {
            return invoicePaymentCurrencyId;
        }

        public void setInvoicePaymentCurrencyId(Long invoicePaymentCurrencyId) {
            this.invoicePaymentCurrencyId = invoicePaymentCurrencyId;
        }

        public YearMonthDate getInvoiceDate() {
            return invoiceDate;
        }

        public void setInvoiceDate(YearMonthDate invoiceDate) {
            this.invoiceDate = invoiceDate;
        }

        public BigDecimal getInvoiceTotalAmount() {
            return invoiceTotalAmount;
        }

        public void setInvoiceTotalAmount(BigDecimal invoiceTotalAmount) {
            this.invoiceTotalAmount = invoiceTotalAmount;
        }

        public BigDecimal getActTotalAmount() {
            return actTotalAmount;
        }

        public void setActTotalAmount(BigDecimal actTotalAmount) {
            this.actTotalAmount = actTotalAmount;
        }

        public Long getActInvoiceCurrencyId() {
            return actInvoiceCurrencyId;
        }

        public void setActInvoiceCurrencyId(Long actInvoiceCurrencyId) {
            this.actInvoiceCurrencyId = actInvoiceCurrencyId;
        }

        public Long getActPaymentCurrencyId() {
            return actPaymentCurrencyId;
        }

        public void setActPaymentCurrencyId(Long actPaymentCurrencyId) {
            this.actPaymentCurrencyId = actPaymentCurrencyId;
        }

        public YearMonthDate getActDate() {
            return actDate;
        }

        public void setActDate(YearMonthDate actDate) {
            this.actDate = actDate;
        }

        public String getInvoiceComment() {
            return invoiceComment;
        }

        public void setInvoiceComment(String invoiceComment) {
            this.invoiceComment = invoiceComment;
        }

        public String getActComment() {
            return actComment;
        }

        public void setActComment(String actComment) {
            this.actComment = actComment;
        }

        public YearMonthDateTime getTime() {
            return time;
        }

        public void setTime(YearMonthDateTime time) {
            this.time = time;
        }
    }

    private Boolean isFilterUsed;
    private Boolean isInvoiceRequestsFilterUsed;
    private YearMonthDateTime createdAt;
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    
    private List<RowVO> rows = new LinkedList<RowVO>();

    public InvoiceDocumentReportVO(InvoiceDocumentReport invoiceDocumentReport) {
        if(invoiceDocumentReport.getFilter() != null) {
            this.isFilterUsed = invoiceDocumentReport.getFilter().isUsed();
        }
        if(invoiceDocumentReport.getInvoiceRequestsFilter() != null) {
            this.isInvoiceRequestsFilterUsed = invoiceDocumentReport.getInvoiceRequestsFilter().isUsed();
        }
        this.createdAt = new YearMonthDateTime(invoiceDocumentReport.getCreatedAt());
        this.currencies = CurrencyVO.getList(invoiceDocumentReport.getCurrencies());
        
        for(InvoiceDocumentReport.Row row : invoiceDocumentReport.getRows()) {
            this.rows.add(new RowVO(row));
        }
    }

    public Boolean getIsFilterUsed() {
        return isFilterUsed;
    }

    public void setIsFilterUsed(Boolean isFilterUsed) {
        this.isFilterUsed = isFilterUsed;
    }

    public Boolean getIsInvoiceRequestsFilterUsed() {
        return isInvoiceRequestsFilterUsed;
    }

    public void setIsInvoiceRequestsFilterUsed(Boolean isInvoiceRequestsFilterUsed) {
        this.isInvoiceRequestsFilterUsed = isInvoiceRequestsFilterUsed;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<CurrencyVO> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<CurrencyVO> currencies) {
        this.currencies = currencies;
    }

    public List<RowVO> getRows() {
        return rows;
    }

    public void setRows(List<RowVO> rows) {
        this.rows = rows;
    }
}
