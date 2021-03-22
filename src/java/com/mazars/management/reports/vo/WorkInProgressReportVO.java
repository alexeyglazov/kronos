/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class WorkInProgressReportVO {
    public class Subreport {
        private String groupName;
        private String clientName;
        private Long projectCodeId;
        private String code;
        private Calendar projectCodeStart;
        private Calendar projectCodeEnd;
        private FeesItem.Type type;

        public Subreport() {
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Calendar getProjectCodeEnd() {
            return projectCodeEnd;
        }

        public void setProjectCodeEnd(Calendar projectCodeEnd) {
            this.projectCodeEnd = projectCodeEnd;
        }

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public Calendar getProjectCodeStart() {
            return projectCodeStart;
        }

        public void setProjectCodeStart(Calendar projectCodeStart) {
            this.projectCodeStart = projectCodeStart;
        }

        public Subreport(WorkInProgressReport.Subreport subreport) {
            ProjectCode projectCode = subreport.getProjectCode();
            this.projectCodeId = projectCode.getId();
            this.code = projectCode.getCode();
            this.projectCodeStart = projectCode.getStartDate();
            this.projectCodeEnd = projectCode.getEndDate();
            FeesItem feesItem = projectCode.getFeesItem();
            if(feesItem != null) {
                this.type = feesItem.getType();
            }
            this.clientName = projectCode.getClient().getName();
            this.groupName = projectCode.getClient().getGroup().getName();
        }
    }
    public class NoBudgetSubreport extends Subreport {
        private List<NoBudgetRow> rows = new LinkedList<NoBudgetRow>();

        public List<NoBudgetRow> getRows() {
            return rows;
        }

        public void setRows(List<NoBudgetRow> rows) {
            this.rows = rows;
        }

        public NoBudgetSubreport(WorkInProgressReport.Subreport subreport) {
            super(subreport);
            for(WorkInProgressReport.Row row : subreport.getRows()) {
                this.rows.add(new NoBudgetRow((WorkInProgressReport.NoBudgetRow)row));
            }
        }
    }
    public class QuotationSubreport extends Subreport {
        private Long quotationSellingRateCurrencyId;
        private Long invoiceCurrencyId;
        private BigDecimal currencyRate;
        private BigDecimal negociated;
        private List<QuotationRow> rows = new LinkedList<QuotationRow>();

        public List<QuotationRow> getRows() {
            return rows;
        }
        public void setRows(List<QuotationRow> rows) {
            this.rows = rows;
        }
        public BigDecimal getCurrencyRate() {
            return currencyRate;
        }
        public void setCurrencyRate(BigDecimal currencyRate) {
            this.currencyRate = currencyRate;
        }
        public Long getQuotationSellingRateCurrencyId() {
            return quotationSellingRateCurrencyId;
        }
        public void setQuotationSellingRateCurrencyId(Long quotationSellingRateCurrencyId) {
            this.quotationSellingRateCurrencyId = quotationSellingRateCurrencyId;
        }
        public Long getInvoiceCurrencyId() {
            return invoiceCurrencyId;
        }
        public void setInvoiceCurrencyId(Long invoiceCurrencyId) {
            this.invoiceCurrencyId = invoiceCurrencyId;
        }
        public BigDecimal getNegociated() {
            return negociated;
        }
        public void setNegociated(BigDecimal negociated) {
            this.negociated = negociated;
        }
        public QuotationSubreport(WorkInProgressReport.Subreport subreport) {
            super(subreport);
            //todo
            //Currency quotationSellingRateCurrency = subreport.getProjectCode().getFeesItem().getQuotationSellingRateCurrency();
            //if(quotationSellingRateCurrency != null) {
            //    quotationSellingRateCurrencyId = quotationSellingRateCurrency.getId();
            //}
            Currency feesInvoiceCurrency = subreport.getProjectCode().getFeesItem().getFeesInvoiceCurrency();
            if(feesInvoiceCurrency != null) {
                invoiceCurrencyId = feesInvoiceCurrency.getId();
            }
            currencyRate = subreport.getProjectCode().getFeesItem().getQuotationCurrencyRate();
            negociated = subreport.getProjectCode().getFeesItem().getQuotationNegociated();
            for(WorkInProgressReport.Row row : subreport.getRows()) {
                this.rows.add(new QuotationRow((WorkInProgressReport.QuotationRow)row));
            }
        }
    }
    public class FlatFeeSubreport extends Subreport {
        private List<FlatFeeRow> rows = new LinkedList<FlatFeeRow>();

        public List<FlatFeeRow> getRows() {
            return rows;
        }

        public void setRows(List<FlatFeeRow> rows) {
            this.rows = rows;
        }

        public FlatFeeSubreport(WorkInProgressReport.Subreport subreport) {
            super(subreport);
            for(WorkInProgressReport.Row row : subreport.getRows()) {
                this.rows.add(new FlatFeeRow((WorkInProgressReport.FlatFeeRow)row));
            }
        }
    }
    public class TimeSpentSubreport extends Subreport {
        private List<TimeSpentRow> rows = new LinkedList<TimeSpentRow>();

        public List<TimeSpentRow> getRows() {
            return rows;
        }

        public void setRows(List<TimeSpentRow> rows) {
            this.rows = rows;
        }

        public TimeSpentSubreport(WorkInProgressReport.Subreport subreport) {
            super(subreport);
            for(WorkInProgressReport.Row row : subreport.getRows()) {
                this.rows.add(new TimeSpentRow((WorkInProgressReport.TimeSpentRow)row));
            }
        }
    }
    public class Row {
        private Long positionId;
        private String positionName;
        private Long standardPositionId;
        private String standardPositionName;
        private BigDecimal averageCvStandardSellingRate;
        private Long spentTime;
        public Row() {
        }
        public Row(WorkInProgressReport.Row row) {
            if(row.getPosition() != null) {
                this.positionId = row.getPosition().getId();
                this.positionName = row.getPosition().getName();
            }
            if(row.getStandardPosition() != null) {
                this.standardPositionId = row.getStandardPosition().getId();
                this.standardPositionName = row.getStandardPosition().getName();
            }
            this.averageCvStandardSellingRate = row.getAverageCvStandardSellingRate();
            this.spentTime = row.getSpentTime();
        }

        public Long getSpentTime() {
            return spentTime;
        }

        public void setSpentTime(Long spentTime) {
            this.spentTime = spentTime;
        }

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public Long getStandardPositionId() {
            return standardPositionId;
        }

        public void setStandardPositionId(Long standardPositionId) {
            this.standardPositionId = standardPositionId;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public BigDecimal getAverageCvStandardSellingRate() {
            return averageCvStandardSellingRate;
        }

        public void setAverageCvStandardSellingRate(BigDecimal averageCvStandardSellingRate) {
            this.averageCvStandardSellingRate = averageCvStandardSellingRate;
        }
    }
    public class QuotationRow extends Row {
        Integer positionQuotationTime;
        BigDecimal positionQuotationRate;
        public QuotationRow() {
            super();
        }
        public QuotationRow(WorkInProgressReport.QuotationRow row) {
            super(row);
            if(row.getPositionQuotation() != null) {
                positionQuotationTime = row.getPositionQuotation().getTime();
                //todo positionQuotationRate = row.getPositionQuotation().getStandardSellingRate();
            }
        }
        public Integer getPositionQuotationTime() {
            return positionQuotationTime;
        }

        public void setPositionQuotationTime(Integer positionQuotationTime) {
            this.positionQuotationTime = positionQuotationTime;
        }

        public BigDecimal getPositionQuotationRate() {
            return positionQuotationRate;
        }

        public void setPositionQuotationRate(BigDecimal positionQuotationRate) {
            this.positionQuotationRate = positionQuotationRate;
        }
    }
    public class FlatFeeRow extends Row {
        BigDecimal positionQuotationRate;
        public FlatFeeRow() {
            super();
        }
        public FlatFeeRow(WorkInProgressReport.FlatFeeRow row) {
            super(row);
            if(row.getPositionQuotation() != null) {
                //todo positionQuotationRate = row.getPositionQuotation().getStandardSellingRate();
            }
        }
        public BigDecimal getPositionQuotationRate() {
            return positionQuotationRate;
        }

        public void setPositionQuotationRate(BigDecimal positionQuotationRate) {
            this.positionQuotationRate = positionQuotationRate;
        }
    }
    public class TimeSpentRow extends Row  {
        BigDecimal positionQuotationRate;
        public TimeSpentRow() {
            super();
        }
        public TimeSpentRow(WorkInProgressReport.TimeSpentRow row) {
            super(row);
            if(row.getPositionQuotation() != null) {
                //todo positionQuotationRate = row.getPositionQuotation().getStandardSellingRate();
            }
        }
        public BigDecimal getPositionQuotationRate() {
            return positionQuotationRate;
        }

        public void setPositionQuotationRate(BigDecimal positionQuotationRate) {
            this.positionQuotationRate = positionQuotationRate;
        }
    }
    public class NoBudgetRow extends Row  {
        public NoBudgetRow() {
            super();
        }
        public NoBudgetRow(WorkInProgressReport.NoBudgetRow row) {
            super(row);
        }
    }

    private List<NoBudgetSubreport> noBudgetSubreports = new LinkedList<NoBudgetSubreport>();
    private List<QuotationSubreport> quotationSubreports = new LinkedList<QuotationSubreport>();
    private List<FlatFeeSubreport> flatFeeSubreports = new LinkedList<FlatFeeSubreport>();
    private List<TimeSpentSubreport> timeSpentSubreports = new LinkedList<TimeSpentSubreport>();
    private Calendar endDate;
    private Map<Long, BigDecimal> currencyRates = new HashMap<Long, BigDecimal>();
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private CurrencyVO mainCurrency;
    private Date createdAt;

    public WorkInProgressReportVO(WorkInProgressReport workInProgressReport) {
        this.createdAt = workInProgressReport.getCreatedAt();
        this.endDate = workInProgressReport.getEndDate();
        for(WorkInProgressReport.Subreport subreport : workInProgressReport.getSubreports()) {
            FeesItem.Type type = null;
            if(subreport.getProjectCode().getFeesItem() != null) {
                type = subreport.getProjectCode().getFeesItem().getType();
            }
            if(type == null) {
                this.noBudgetSubreports.add(new NoBudgetSubreport(subreport));
            } else if(FeesItem.Type.QUOTATION.equals(type)) {
                this.quotationSubreports.add(new QuotationSubreport(subreport));
            } else if(FeesItem.Type.FLAT_FEE.equals(type)) {
                this.flatFeeSubreports.add(new FlatFeeSubreport(subreport));
            } else if(FeesItem.Type.TIMESPENT.equals(type)) {
                this.timeSpentSubreports.add(new TimeSpentSubreport(subreport));
            }
        }
        for(Long currencyId : workInProgressReport.getCurrencyRates().keySet()) {
            this.currencyRates.put(currencyId, workInProgressReport.getCurrencyRates().get(currencyId));
        }
        for(Currency currency : workInProgressReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
        this.mainCurrency = new CurrencyVO(workInProgressReport.getMainCurrency());
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

    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }

    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<QuotationSubreport> getQuotationSubreports() {
        return quotationSubreports;
    }

    public void setQuotationSubreports(List<QuotationSubreport> quotationSubreports) {
        this.quotationSubreports = quotationSubreports;
    }


    public List<FlatFeeSubreport> getFlatFeeSubreports() {
        return flatFeeSubreports;
    }

    public void setFlatFeeSubreports(List<FlatFeeSubreport> flatFeeSubreports) {
        this.flatFeeSubreports = flatFeeSubreports;
    }

    public List<NoBudgetSubreport> getNoBudgetSubreports() {
        return noBudgetSubreports;
    }

    public void setNoBudgetSubreports(List<NoBudgetSubreport> noBudgetSubreports) {
        this.noBudgetSubreports = noBudgetSubreports;
    }

    public List<TimeSpentSubreport> getTimeSpentSubreports() {
        return timeSpentSubreports;
    }

    public void setTimeSpentSubreports(List<TimeSpentSubreport> timeSpentSubreports) {
        this.timeSpentSubreports = timeSpentSubreports;
    }
}
