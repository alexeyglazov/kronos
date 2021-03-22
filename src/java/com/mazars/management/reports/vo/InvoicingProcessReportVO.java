/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.FeesAdvance;
import com.mazars.management.db.domain.FeesInvoice;
import com.mazars.management.db.domain.FeesPayment;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.forms.InvoicingProcessReportForm;
import java.util.*;

/**
 *
 * @author glazov
 */
public class InvoicingProcessReportVO {
    public class ProjectCodeBlockVO {
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        private Long projectCodeId;
        private String projectCodeCode;
        private FeesItemVOH feesItem;
        private OutOfPocketItemVOH outOfPocketItem;
        private List<FeesAdvanceVO> feesAdvances = new LinkedList<FeesAdvanceVO>();
        private List<FeesInvoiceVO> feesInvoices = new LinkedList<FeesInvoiceVO>();
        private List<FeesPaymentVO> feesPayments = new LinkedList<FeesPaymentVO>();
        
        public ProjectCodeBlockVO(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock) {
            if(projectCodeBlock.getGroup() != null) {
                groupId = projectCodeBlock.getGroup().getId();
                groupName = projectCodeBlock.getGroup().getName();
            }
            if(projectCodeBlock.getClient() != null) {
                clientId = projectCodeBlock.getClient().getId();
                clientName = projectCodeBlock.getClient().getName();
            }
            if(projectCodeBlock.getProjectCode() != null) {
                projectCodeId = projectCodeBlock.getProjectCode().getId();
                projectCodeCode = projectCodeBlock.getProjectCode().getCode();
            }
            if(projectCodeBlock.getFeesItem() != null) {
                feesItem = new FeesItemVOH(projectCodeBlock.getFeesItem());
            }    
            for(FeesAdvance feesAdvance : projectCodeBlock.getFeesAdvances()) {
                feesAdvances.add(new FeesAdvanceVO(feesAdvance));
            }
            for(FeesInvoice feesInvoice : projectCodeBlock.getFeesInvoices()) {
                feesInvoices.add(new FeesInvoiceVO(feesInvoice));
            }
            for(FeesPayment feesPayment : projectCodeBlock.getFeesPayments()) {
                feesPayments.add(new FeesPaymentVO(feesPayment));
            }
        }

        public Long getGroupId() {
            return groupId;
        }

        public List<FeesAdvanceVO> getFeesAdvances() {
            return feesAdvances;
        }

        public void setFeesAdvances(List<FeesAdvanceVO> feesAdvances) {
            this.feesAdvances = feesAdvances;
        }

        public List<FeesInvoiceVO> getFeesInvoices() {
            return feesInvoices;
        }

        public void setFeesInvoices(List<FeesInvoiceVO> feesInvoices) {
            this.feesInvoices = feesInvoices;
        }

        public List<FeesPaymentVO> getFeesPayments() {
            return feesPayments;
        }

        public void setFeesPayments(List<FeesPaymentVO> feesPayments) {
            this.feesPayments = feesPayments;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
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

        public FeesItemVOH getFeesItem() {
            return feesItem;
        }

        public void setFeesItem(FeesItemVOH feesItem) {
            this.feesItem = feesItem;
        }

        public OutOfPocketItemVOH getOutOfPocketItem() {
            return outOfPocketItem;
        }

        public void setOutOfPocketItem(OutOfPocketItemVOH outOfPocketItem) {
            this.outOfPocketItem = outOfPocketItem;
        }

    }

    private YearMonthDateTime createdAt;
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private CurrencyVO mainCurrency = new CurrencyVO();
    
    private Boolean isFilterUsed;
    private List<ProjectCodeBlockVO> projectCodeBlocks = new LinkedList<ProjectCodeBlockVO>();
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private InvoicingProcessReportForm.DocumentType formDocumentTypeToSearch;
    private InvoicingProcessReportForm.DocumentType formDocumentTypeToShow;

    public InvoicingProcessReportVO(InvoicingProcessReport invoicingProcessReport) {
        if(invoicingProcessReport.getForm().getProjectCodeListFilter() != null) {
            this.isFilterUsed = invoicingProcessReport.getForm().getProjectCodeListFilter().isUsed();
        }
        this.createdAt = new YearMonthDateTime(invoicingProcessReport.getCreatedAt());
        this.currencies = CurrencyVO.getList(invoicingProcessReport.getCurrencies());
        this.mainCurrency = new CurrencyVO(invoicingProcessReport.getMainCurrency());
             
        for(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock : invoicingProcessReport.getProjectCodeBlocks()) {
            this.projectCodeBlocks.add(new ProjectCodeBlockVO(projectCodeBlock));
        }
        this.formStartDate = invoicingProcessReport.getFormStartDate();
        this.formEndDate = invoicingProcessReport.getFormEndDate();
        this.formDocumentTypeToSearch = invoicingProcessReport.getFormDocumentTypeToSearch();
        this.formDocumentTypeToShow = invoicingProcessReport.getFormDocumentTypeToShow();
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

    public CurrencyVO getMainCurrency() {
        return mainCurrency;
    }

    public void setMainCurrency(CurrencyVO mainCurrency) {
        this.mainCurrency = mainCurrency;
    }

    public Boolean isIsFilterUsed() {
        return isFilterUsed;
    }

    public void setIsFilterUsed(Boolean isFilterUsed) {
        this.isFilterUsed = isFilterUsed;
    }

    public List<ProjectCodeBlockVO> getProjectCodeBlocks() {
        return projectCodeBlocks;
    }

    public void setProjectCodeBlocks(List<ProjectCodeBlockVO> projectCodeBlocks) {
        this.projectCodeBlocks = projectCodeBlocks;
    }

}
