/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.ActRequest;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.*;

/**
 *
 * @author glazov
 */
public class InvoiceRequestReportVO {
    public class InvoiceRequestEntry {
        private Long id;
        private BigDecimal totalAmount;
        private Long invoiceCurrencyId;
        private String reference;
        private YearMonthDate date;

        public InvoiceRequestEntry(InvoiceRequest invoiceRequest, BigDecimal invoiceRequestTotalAmount) {
            this.id = invoiceRequest.getId();
            this.totalAmount = invoiceRequestTotalAmount;
            if(invoiceRequest.getInvoiceCurrency() != null) {
                this.invoiceCurrencyId = invoiceRequest.getInvoiceCurrency().getId();
            }
            this.reference = invoiceRequest.getReference();
            if(invoiceRequest.getDate() != null) {
                this.date = new YearMonthDate(invoiceRequest.getDate());
            }
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public Long getInvoiceCurrencyId() {
            return invoiceCurrencyId;
        }

        public void setInvoiceCurrencyId(Long invoiceCurrencyId) {
            this.invoiceCurrencyId = invoiceCurrencyId;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public YearMonthDate getDate() {
            return date;
        }

        public void setDate(YearMonthDate date) {
            this.date = date;
        }        
    }
    public class ActRequestEntry {
        private Long id;
        private BigDecimal totalAmount;
        private Long invoiceCurrencyId;
        private String reference;
        private YearMonthDate date;

        public ActRequestEntry(ActRequest actRequest, BigDecimal actRequestTotalAmount) {
            this.id = actRequest.getId();
            this.totalAmount = actRequestTotalAmount;
            if(actRequest.getInvoiceCurrency() != null) {
                this.invoiceCurrencyId = actRequest.getInvoiceCurrency().getId();
            }
            this.reference = actRequest.getReference();
            if(actRequest.getDate() != null) {
                this.date = new YearMonthDate(actRequest.getDate());
            }
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public Long getInvoiceCurrencyId() {
            return invoiceCurrencyId;
        }

        public void setInvoiceCurrencyId(Long invoiceCurrencyId) {
            this.invoiceCurrencyId = invoiceCurrencyId;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public YearMonthDate getDate() {
            return date;
        }

        public void setDate(YearMonthDate date) {
            this.date = date;
        }        
    }  
    public class TaxInvoiceRequestEntry {
        private Long id;
        private String reference;
        private YearMonthDate date;

        public TaxInvoiceRequestEntry(TaxInvoiceRequest taxInvoiceRequest) {
            this.id = taxInvoiceRequest.getId();
            this.reference = taxInvoiceRequest.getReference();
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public YearMonthDate getDate() {
            return date;
        }

        public void setDate(YearMonthDate date) {
            this.date = date;
        }        
    }  
    public class FeesAdvanceEntry {
        private BigDecimal totalAmount;
        private Long feesAdvanceCurrencyId;

        public FeesAdvanceEntry(FeesItem feesItem, BigDecimal feesAdvanceTotalAmount) {
            this.totalAmount = feesAdvanceTotalAmount;
            if(feesItem.getFeesAdvanceCurrency() != null) {
                this.feesAdvanceCurrencyId = feesItem.getFeesAdvanceCurrency().getId();
            }
        }

        public BigDecimal getTotalAmount() {
            return totalAmount;
        }

        public void setTotalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
        }

        public Long getFeesAdvanceCurrencyId() {
            return feesAdvanceCurrencyId;
        }

        public void setFeesAdvanceCurrencyId(Long feesAdvanceCurrencyId) {
            this.feesAdvanceCurrencyId = feesAdvanceCurrencyId;
        }
    }      
    public class BlockVO {
        private Long clientId;
        private String clientName;
        private Long projectCodeId;
        private String projectCodeCode;
        private String projectCodeDescription;
        private YearMonthDateTime projectCodeCreatedAt;
        private YearMonthDateTime projectCodeClosedAt;
        private YearMonthDate lastFillingDay;
        private Long timeSpent;
        private Boolean withVAT;
        private InvoiceRequestPacket.Status status;
        private List<InvoiceRequestEntry> invoiceRequestEntries = new LinkedList<InvoiceRequestEntry>();
        private ActRequestEntry actRequestEntry;
        private TaxInvoiceRequestEntry taxInvoiceRequestEntry;
        private FeesAdvanceEntry feesAdvanceEntry;
      
        public BlockVO(InvoiceRequestReport.Block block) {
            if(block.getClient() != null) {
                clientId = block.getClient().getId();
                clientName = block.getClient().getName();
            }    
            if(block.getProjectCode() != null) {
                projectCodeId = block.getProjectCode().getId();
                projectCodeCode = block.getProjectCode().getCode();
                projectCodeDescription = block.getProjectCode().getDescription();
                if(block.getProjectCode().getCreatedAt() != null) {
                    projectCodeCreatedAt = new YearMonthDateTime(block.getProjectCode().getCreatedAt());
                }
                if(block.getProjectCode().getClosedAt() != null) {
                    projectCodeClosedAt = new YearMonthDateTime(block.getProjectCode().getClosedAt());
                }
            }
            if(block.getLastFillingDay() != null) {
                lastFillingDay = new YearMonthDate(block.getLastFillingDay());
            }
            if(block.getInvoiceRequestPacket() != null) {
                status = block.getInvoiceRequestPacket().getStatus();
                withVAT = block.getInvoiceRequestPacket().getWithVAT();
            }
            for(InvoiceRequest invoiceRequest : block.getInvoiceRequestInfo().keySet()) {
                BigDecimal invoiceRequestTotalAmount = block.getInvoiceRequestInfo().get(invoiceRequest);
                InvoiceRequestEntry invoiceRequestEntry = new InvoiceRequestEntry(invoiceRequest, invoiceRequestTotalAmount);
                invoiceRequestEntries.add(invoiceRequestEntry);
            }
            if(block.getActRequest() != null) {
                BigDecimal actRequestTotalAmount = block.getActRequestTotalAmount();
                this.actRequestEntry = new ActRequestEntry(block.getActRequest(), actRequestTotalAmount);
            }
            if(block.getTaxInvoiceRequest() != null) {
                this.taxInvoiceRequestEntry = new TaxInvoiceRequestEntry(block.getTaxInvoiceRequest());
            }
            if(block.getFeesItem() != null) {
                BigDecimal feesAdvanceTotalAmount = block.getFeesAdvanceTotalAmount();
                this.feesAdvanceEntry = new FeesAdvanceEntry(block.getFeesItem(), feesAdvanceTotalAmount);
            }
            timeSpent = block.getTimeSpent();
        }

        public Boolean isWithVAT() {
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

        public List<InvoiceRequestEntry> getInvoiceRequestEntries() {
            return invoiceRequestEntries;
        }

        public void setInvoiceRequestEntries(List<InvoiceRequestEntry> invoiceRequestEntries) {
            this.invoiceRequestEntries = invoiceRequestEntries;
        }

        public ActRequestEntry getActRequestEntry() {
            return actRequestEntry;
        }

        public void setActRequestEntry(ActRequestEntry actRequestEntry) {
            this.actRequestEntry = actRequestEntry;
        }

        public TaxInvoiceRequestEntry getTaxInvoiceRequestEntry() {
            return taxInvoiceRequestEntry;
        }

        public void setTaxInvoiceRequestEntry(TaxInvoiceRequestEntry taxInvoiceRequestEntry) {
            this.taxInvoiceRequestEntry = taxInvoiceRequestEntry;
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

        public YearMonthDateTime getProjectCodeCreatedAt() {
            return projectCodeCreatedAt;
        }

        public void setProjectCodeCreatedAt(YearMonthDateTime projectCodeCreatedAt) {
            this.projectCodeCreatedAt = projectCodeCreatedAt;
        }

        public YearMonthDateTime getProjectCodeClosedAt() {
            return projectCodeClosedAt;
        }

        public void setProjectCodeClosedAt(YearMonthDateTime projectCodeClosedAt) {
            this.projectCodeClosedAt = projectCodeClosedAt;
        }

        public YearMonthDate getLastFillingDay() {
            return lastFillingDay;
        }

        public void setLastFillingDay(YearMonthDate lastFillingDay) {
            this.lastFillingDay = lastFillingDay;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public FeesAdvanceEntry getFeesAdvanceEntry() {
            return feesAdvanceEntry;
        }

        public void setFeesAdvanceEntry(FeesAdvanceEntry feesAdvanceEntry) {
            this.feesAdvanceEntry = feesAdvanceEntry;
        }
    }

    private YearMonthDateTime createdAt;
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    
    private Boolean isFilterUsed;
    private Boolean isInvoiceRequestsFilterUsed;
    private List<BlockVO> blocks = new LinkedList<BlockVO>();

    public InvoiceRequestReportVO(InvoiceRequestReport invoiceRequestReport) {
        this.createdAt = new YearMonthDateTime(invoiceRequestReport.getCreatedAt());
        this.currencies = CurrencyVO.getList(invoiceRequestReport.getCurrencies());
        
        if(invoiceRequestReport.getFilter() != null) {
            this.isFilterUsed = invoiceRequestReport.getFilter().isUsed();
        }
        if(invoiceRequestReport.getInvoiceRequestsFilter() != null) {
            this.isInvoiceRequestsFilterUsed = invoiceRequestReport.getInvoiceRequestsFilter().isUsed();
        }
        
        for(InvoiceRequestReport.Block block : invoiceRequestReport.getBlocks()) {
            this.blocks.add(new BlockVO(block));
        }
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

    public Boolean isIsFilterUsed() {
        return isFilterUsed;
    }

    public void setIsFilterUsed(Boolean isFilterUsed) {
        this.isFilterUsed = isFilterUsed;
    }

    public Boolean isIsInvoiceRequestsFilterUsed() {
        return isInvoiceRequestsFilterUsed;
    }

    public void setIsInvoiceRequestsFilterUsed(Boolean isInvoiceRequestsFilterUsed) {
        this.isInvoiceRequestsFilterUsed = isInvoiceRequestsFilterUsed;
    }

    public List<BlockVO> getBlocks() {
        return blocks;
    }

    public void setRows(List<BlockVO> blocks) {
        this.blocks = blocks;
    }
}
