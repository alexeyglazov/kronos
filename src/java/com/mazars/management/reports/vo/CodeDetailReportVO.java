/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.reports.CodeDetailReport.View;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class CodeDetailReportVO {
    public class DescribedProjectCode {
        private ProjectCodeVO projectCode;
        private SubdepartmentVO subdepartment;
        private ClientVO client;
        private EmployeeWithoutPasswordVO inChargePerson;

        public ProjectCodeVO getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCodeVO projectCode) {
            this.projectCode = projectCode;
        }

        public SubdepartmentVO getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(SubdepartmentVO subdepartment) {
            this.subdepartment = subdepartment;
        }

        public ClientVO getClient() {
            return client;
        }

        public void setClient(ClientVO client) {
            this.client = client;
        }

        public EmployeeWithoutPasswordVO getInChargePerson() {
            return inChargePerson;
        }

        public void setInChargePerson(EmployeeWithoutPasswordVO inChargePerson) {
            this.inChargePerson = inChargePerson;
        }

        public DescribedProjectCode(ProjectCode projectCode) {
            this.projectCode = new ProjectCodeVO(projectCode);

            if(projectCode.getInChargePerson() != null) {
                this.inChargePerson = new EmployeeWithoutPasswordVO(projectCode.getInChargePerson());
            }
            this.subdepartment = new SubdepartmentVO(projectCode.getSubdepartment());
            this.client = new ClientVO(projectCode.getClient());
        }
    }    
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private Long timeSpentItemId;
        private String employeeFirstName;
        private String employeeLastName;
        private String positionName;
        private String standardPositionName;
        private String taskTypeName;
        private String taskName;
        private Integer timeSpent;
        private String description;
        private Long standardSellingRateGroupCurrencyId;
        private BigDecimal standardSellingRateAmount;
        private Calendar day;
        private YearMonthDateTime modifiedAt;

        public Row(CodeDetailReport.Row row) {
            this.projectCodeId = row.getProjectCodeId();
            this.projectCodeCode = row.getProjectCodeCode();
            this.timeSpentItemId = row.getTimeSpentItemId();
            this.employeeFirstName = row.getEmployeeFirstName();
            this.employeeLastName = row.getEmployeeLastName();
            this.positionName = row.getPositionName();
            this.standardPositionName = row.getStandardPositionName();
            this.taskTypeName = row.getTaskTypeName();
            this.taskName = row.getTaskName();
            this.timeSpent = row.getTimeSpent();
            this.description = row.getDescription();
            this.standardSellingRateGroupCurrencyId = row.getStandardSellingRateGroupCurrencyId();
            this.standardSellingRateAmount = row.getStandardSellingRateAmount();
            this.day = row.getDay();
            if(row.getModifiedAt() != null) {
                this.modifiedAt = new YearMonthDateTime(row.getModifiedAt());
            }
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

        public Long getTimeSpentItemId() {
            return timeSpentItemId;
        }

        public void setTimeSpentItemId(Long timeSpentItemId) {
            this.timeSpentItemId = timeSpentItemId;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public Long getStandardSellingRateGroupCurrencyId() {
            return standardSellingRateGroupCurrencyId;
        }

        public void setStandardSellingRateGroupCurrencyId(Long standardSellingRateGroupCurrencyId) {
            this.standardSellingRateGroupCurrencyId = standardSellingRateGroupCurrencyId;
        }

        public BigDecimal getStandardSellingRateAmount() {
            return standardSellingRateAmount;
        }

        public void setStandardSellingRateAmount(BigDecimal standardSellingRateAmount) {
            this.standardSellingRateAmount = standardSellingRateAmount;
        }

        public Calendar getDay() {
            return day;
        }

        public void setDay(Calendar day) {
            this.day = day;
        }

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public String getEmployeeLastName() {
            return employeeLastName;
        }

        public void setEmployeeLastName(String employeeLastName) {
            this.employeeLastName = employeeLastName;
        }

        public YearMonthDateTime getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(YearMonthDateTime modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;
    List<DescribedProjectCode> describedProjectCodes = new LinkedList<DescribedProjectCode>();
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private CurrencyVO mainCurrency = new CurrencyVO();
    CodeDetailReport.View view;

    private CurrencyVO formReportCurrency;
    private Map<Long, BigDecimal> formCurrencyRates;
    private Boolean formIsRateInfoVisible;
    private YearMonthDate formStart;
    private YearMonthDate formEnd;

    public CodeDetailReportVO(CodeDetailReport codeDetailReport) {
        for(CodeDetailReport.Row row : codeDetailReport.getRows()) {
            this.rows.add(new CodeDetailReportVO.Row(row));
        }
        this.createdAt = new YearMonthDateTime(codeDetailReport.getCreatedAt());
        for(ProjectCode projectCode : codeDetailReport.getFormProjectCodes()) {
            this.describedProjectCodes.add(new DescribedProjectCode(projectCode));
        }

        if(codeDetailReport.getFormReportCurrency() != null) {
            this.formReportCurrency = new CurrencyVO(codeDetailReport.getFormReportCurrency());
        }
        this.formStart = codeDetailReport.getFormStart();
        this.formEnd = codeDetailReport.getFormEnd();
        this.formIsRateInfoVisible = codeDetailReport.getFormIsRateInfoVisible();
        this.formCurrencyRates = codeDetailReport.getFormCurrencyRates();
        for(Currency currency : codeDetailReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
        this.mainCurrency = new CurrencyVO(codeDetailReport.getMainCurrency());
        this.view = codeDetailReport.getView();
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<DescribedProjectCode> getDescribedProjectCodes() {
        return describedProjectCodes;
    }

    public void setDescribedProjectCodes(List<DescribedProjectCode> describedProjectCodes) {
        this.describedProjectCodes = describedProjectCodes;
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
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

    public CurrencyVO getFormReportCurrency() {
        return formReportCurrency;
    }

    public void setFormReportCurrency(CurrencyVO formReportCurrency) {
        this.formReportCurrency = formReportCurrency;
    }

    public Map<Long, BigDecimal> getFormCurrencyRates() {
        return formCurrencyRates;
    }

    public void setFormCurrencyRates(Map<Long, BigDecimal> formCurrencyRates) {
        this.formCurrencyRates = formCurrencyRates;
    }

    public Boolean getFormIsRateInfoVisible() {
        return formIsRateInfoVisible;
    }

    public void setFormIsRateInfoVisible(Boolean formIsRateInfoVisible) {
        this.formIsRateInfoVisible = formIsRateInfoVisible;
    }

    public YearMonthDate getFormStart() {
        return formStart;
    }

    public void setFormStart(YearMonthDate formStart) {
        this.formStart = formStart;
    }

    public YearMonthDate getFormEnd() {
        return formEnd;
    }

    public void setFormEnd(YearMonthDate formEnd) {
        this.formEnd = formEnd;
    }
    
}
