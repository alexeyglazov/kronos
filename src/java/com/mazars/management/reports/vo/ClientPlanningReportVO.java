/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.PlanningItemUtil;
import com.mazars.management.db.vo.ClientVO;
import com.mazars.management.db.vo.CurrencyVO;
import com.mazars.management.db.vo.GroupVO;
import com.mazars.management.db.vo.SubdepartmentVO;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.reports.*;
import com.mazars.management.web.forms.ClientPlanningReportForm;
import com.mazars.management.web.vo.PlanningToolInfo;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ClientPlanningReportVO {
    public class Row {
        PlanningToolInfo.PositionVO position;
        PlanningToolInfo.StandardPositionVO standardPosition;
        YearMonthDate startDate;
        YearMonthDate endDate;
        Long currencyId;
        private BigDecimal standardSellingRateAmount;
        private Map<Long, BigDecimal> timeItems = new HashMap<Long, BigDecimal>();

        public Row(ClientPlanningReport.Row row) {
            this.position = row.getPosition();
            this.standardPosition = row.getStandardPosition();
            this.startDate = row.getStartDate();
            this.endDate = row.getEndDate();
            this.currencyId = row.getCurrencyId();
            this.standardSellingRateAmount = row.getStandardSellingRateAmount();
            Map<Long, BigDecimal> tmpTimeItems = new HashMap<Long, BigDecimal>();
            for(Long planningTypeId : row.getTimeItems().keySet()) {
                BigDecimal time = row.getTimeItems().get(planningTypeId);
                tmpTimeItems.put(planningTypeId, time);
            }
            this.setTimeItems(tmpTimeItems);
        }

        public PlanningToolInfo.PositionVO getPosition() {
            return position;
        }

        public void setPosition(PlanningToolInfo.PositionVO position) {
            this.position = position;
        }

        public PlanningToolInfo.StandardPositionVO getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(PlanningToolInfo.StandardPositionVO standardPosition) {
            this.standardPosition = standardPosition;
        }

        public Long getCurrencyId() {
            return currencyId;
        }

        public void setCurrencyId(Long currencyId) {
            this.currencyId = currencyId;
        }

        public YearMonthDate getStartDate() {
            return startDate;
        }

        public void setStartDate(YearMonthDate startDate) {
            this.startDate = startDate;
        }

        public YearMonthDate getEndDate() {
            return endDate;
        }

        public void setEndDate(YearMonthDate endDate) {
            this.endDate = endDate;
        }

        public BigDecimal getStandardSellingRateAmount() {
            return standardSellingRateAmount;
        }

        public void setStandardSellingRateAmount(BigDecimal standardSellingRateAmount) {
            this.standardSellingRateAmount = standardSellingRateAmount;
        }

        public Map<Long, BigDecimal> getTimeItems() {
            return timeItems;
        }

        public void setTimeItems(Map<Long, BigDecimal> timeItems) {
            this.timeItems = timeItems;
        }
        
    }
    public class Subreport {
        private PlanningToolInfo.ClientVO client;
        private List<Row> rows = new LinkedList<Row>();
        private Set<PlanningToolInfo.PlanningTypeVO> planningTypes = new HashSet<PlanningToolInfo.PlanningTypeVO>();
        private Set<CurrencyVO> currencies = new HashSet<CurrencyVO>();

        public Subreport() {
        }
        public Subreport(ClientPlanningReport.Subreport subreport) {
            if(subreport.getClient() != null) {
                this.client = subreport.getClient();
            }
            for(ClientPlanningReport.Row tmpRow : subreport.getRows()) {
                Row row = new Row(tmpRow);
                rows.add(row);
            }
            for(PlanningToolInfo.PlanningTypeVO planningType : subreport.getPlanningTypes()) {
                planningTypes.add(planningType);
            }
            for(CurrencyVO currency : subreport.getCurrencies()) {
                currencies.add(currency);
            }
        }
        public PlanningToolInfo.ClientVO getClient() {
            return client;
        }

        public void setClient(PlanningToolInfo.ClientVO client) {
            this.client = client;
        }

        public List<Row> getRows() {
            return rows;
        }
        public void setRows(List<Row> rows) {
            this.rows = rows;
        }

        public Set<PlanningToolInfo.PlanningTypeVO> getPlanningTypes() {
            return planningTypes;
        }

        public void setPlanningTypes(Set<PlanningToolInfo.PlanningTypeVO> planningTypes) {
            this.planningTypes = planningTypes;
        }

        public Set<CurrencyVO> getCurrencies() {
            return currencies;
        }

        public void setCurrencies(Set<CurrencyVO> currencies) {
            this.currencies = currencies;
        }
    }
    
    private List<Subreport> subreports = new LinkedList<Subreport>();
    private GroupVO formGroup;
    private ClientVO formClient;
    private SubdepartmentVO formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;    
    private YearMonthDateTime createdAt;

    public ClientPlanningReportVO(ClientPlanningReport clientPlanningReport) {
        this.createdAt = new YearMonthDateTime(clientPlanningReport.getCreatedAt());
        this.formStartDate = new YearMonthDate(clientPlanningReport.getFormStartDate());
        this.formEndDate = new YearMonthDate(clientPlanningReport.getFormEndDate());
        if(clientPlanningReport.getFormClient() != null) {
            this.formClient = new ClientVO(clientPlanningReport.getFormClient());
        }
        this.formSubdepartment = new SubdepartmentVO(clientPlanningReport.getFormSubdepartment());
        for(ClientPlanningReport.Subreport subreport : clientPlanningReport.getSubreports()) {
            this.subreports.add(new Subreport(subreport));
        }
    }

    public List<Subreport> getSubreports() {
        return subreports;
    }

    public void setSubreports(List<Subreport> subreports) {
        this.subreports = subreports;
    }

    public GroupVO getFormGroup() {
        return formGroup;
    }

    public void setFormGroup(GroupVO formGroup) {
        this.formGroup = formGroup;
    }

    public ClientVO getFormClient() {
        return formClient;
    }

    public void setFormClient(ClientVO formClient) {
        this.formClient = formClient;
    }

    public SubdepartmentVO getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(SubdepartmentVO formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
