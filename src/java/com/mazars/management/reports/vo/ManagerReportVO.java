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
import java.util.List;
import java.util.LinkedList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class ManagerReportVO {
    public class Row {
        private Long officeId;
        private Long departmentId;
        private Long inChargePersonId;
        private Long clientId;
        private Long projectCodeId;
        private String projectCodeCode;
        private Boolean projectCodeIsClosed;
        private BigDecimal feesAmount;
        private BigDecimal costAmount;
        private BigDecimal budgetAmount;
        private FeesItem.Type type;
        private BigDecimal feesInvoiceAmount;
        private BigDecimal feesPaymentAmount;
        private BigDecimal outOfPocketInvoiceAmount;
        private BigDecimal outOfPocketPaymentAmount;
        
        public Row(ManagerReport.Row row) {
            this.officeId = row.getOffice().getId();
            this.departmentId = row.getDepartment().getId();
            if(row.getInChargePerson() != null) {
                this.inChargePersonId = row.getInChargePerson().getId();
            }
            this.clientId = row.getClient().getId();
            this.projectCodeId = row.getProjectCode().getId();
            this.projectCodeCode = row.getProjectCode().getCode();
            this.projectCodeIsClosed = row.getProjectCode().getIsClosed();
            this.feesAmount = row.getFeesAmount();
            this.costAmount = row.getCostAmount();
            this.budgetAmount = row.getBudgetAmount();
            this.type = row.getType();
            this.feesInvoiceAmount = row.getFeesInvoiceAmount();
            this.feesPaymentAmount = row.getFeesPaymentAmount();
            this.outOfPocketInvoiceAmount = row.getOutOfPocketInvoiceAmount();
            this.outOfPocketPaymentAmount = row.getOutOfPocketPaymentAmount();
        }

        public Long getOfficeId() {
            return officeId;
        }

        public void setOfficeId(Long officeId) {
            this.officeId = officeId;
        }

        public Long getDepartmentId() {
            return departmentId;
        }

        public void setDepartmentId(Long departmentId) {
            this.departmentId = departmentId;
        }

        public Long getInChargePersonId() {
            return inChargePersonId;
        }

        public void setInChargePersonId(Long inChargePersonId) {
            this.inChargePersonId = inChargePersonId;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
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

        public Boolean getProjectCodeIsClosed() {
            return projectCodeIsClosed;
        }

        public void setProjectCodeIsClosed(Boolean projectCodeIsClosed) {
            this.projectCodeIsClosed = projectCodeIsClosed;
        }

        public BigDecimal getFeesAmount() {
            return feesAmount;
        }

        public void setFeesAmount(BigDecimal feesAmount) {
            this.feesAmount = feesAmount;
        }

        public BigDecimal getCostAmount() {
            return costAmount;
        }

        public void setCostAmount(BigDecimal costAmount) {
            this.costAmount = costAmount;
        }

        public BigDecimal getBudgetAmount() {
            return budgetAmount;
        }

        public void setBudgetAmount(BigDecimal budgetAmount) {
            this.budgetAmount = budgetAmount;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }

        public BigDecimal getFeesInvoiceAmount() {
            return feesInvoiceAmount;
        }

        public void setFeesInvoiceAmount(BigDecimal feesInvoiceAmount) {
            this.feesInvoiceAmount = feesInvoiceAmount;
        }

        public BigDecimal getFeesPaymentAmount() {
            return feesPaymentAmount;
        }

        public void setFeesPaymentAmount(BigDecimal feesPaymentAmount) {
            this.feesPaymentAmount = feesPaymentAmount;
        }

        public BigDecimal getOutOfPocketInvoiceAmount() {
            return outOfPocketInvoiceAmount;
        }

        public void setOutOfPocketInvoiceAmount(BigDecimal outOfPocketInvoiceAmount) {
            this.outOfPocketInvoiceAmount = outOfPocketInvoiceAmount;
        }

        public BigDecimal getOutOfPocketPaymentAmount() {
            return outOfPocketPaymentAmount;
        }

        public void setOutOfPocketPaymentAmount(BigDecimal outOfPocketPaymentAmount) {
            this.outOfPocketPaymentAmount = outOfPocketPaymentAmount;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<OfficeVO> offices = new LinkedList<OfficeVO>();
    private List<DepartmentVO> departments = new LinkedList<DepartmentVO>();
    private List<EmployeeWithoutPasswordVO> inChargePersons = new LinkedList<EmployeeWithoutPasswordVO>();
    private List<ClientVO> clients = new LinkedList<ClientVO>();
    private int noFinancialYearProjectCodesCount = 0;
    private int noBudgetProjectCodesCount = 0;
    private int noInChargePersonProjectCodesCount = 0;
    
    private List<CurrencyVO> currencies = new LinkedList<CurrencyVO>();
    private CurrencyVO mainCurrency = new CurrencyVO();
    private YearMonthDateTime createdAt;

    private Long formOfficeId;
    private String formOfficeName;
    private Long formDepartmentId;
    private String formDepartmentName;
    private Integer formGrossMargin;
    private String formReportCurrencyCode;
    private Integer formFinancialYear;
    private Map<Long, BigDecimal> formCurrencyRates;

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

    public String getFormReportCurrencyCode() {
        return formReportCurrencyCode;
    }

    public void setFormReportCurrencyCode(String formReportCurrencyCode) {
        this.formReportCurrencyCode = formReportCurrencyCode;
    }


    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<OfficeVO> getOffices() {
        return offices;
    }

    public void setOffices(List<OfficeVO> offices) {
        this.offices = offices;
    }

    public List<DepartmentVO> getDepartments() {
        return departments;
    }

    public void setDepartments(List<DepartmentVO> departments) {
        this.departments = departments;
    }

    public List<EmployeeWithoutPasswordVO> getInChargePersons() {
        return inChargePersons;
    }

    public void setInChargePersons(List<EmployeeWithoutPasswordVO> inChargePersons) {
        this.inChargePersons = inChargePersons;
    }

    public List<ClientVO> getClients() {
        return clients;
    }

    public void setClients(List<ClientVO> clients) {
        this.clients = clients;
    }

    public CurrencyVO getMainCurrency() {
        return mainCurrency;
    }

    public void setMainCurrency(CurrencyVO mainCurrency) {
        this.mainCurrency = mainCurrency;
    }

    public Integer getFormGrossMargin() {
        return formGrossMargin;
    }

    public void setFormGrossMargin(Integer formGrossMargin) {
        this.formGrossMargin = formGrossMargin;
    }

    public Integer getFormFinancialYear() {
        return formFinancialYear;
    }

    public void setFormFinancialYear(Integer formFinancialYear) {
        this.formFinancialYear = formFinancialYear;
    }

    public Map<Long, BigDecimal> getFormCurrencyRates() {
        return formCurrencyRates;
    }

    public void setFormCurrencyRates(Map<Long, BigDecimal> formCurrencyRates) {
        this.formCurrencyRates = formCurrencyRates;
    }

    public int getNoFinancialYearProjectCodesCount() {
        return noFinancialYearProjectCodesCount;
    }

    public void setNoFinancialYearProjectCodesCount(int noFinancialYearProjectCodesCount) {
        this.noFinancialYearProjectCodesCount = noFinancialYearProjectCodesCount;
    }

    public int getNoBudgetProjectCodesCount() {
        return noBudgetProjectCodesCount;
    }

    public void setNoBudgetProjectCodesCount(int noBudgetProjectCodesCount) {
        this.noBudgetProjectCodesCount = noBudgetProjectCodesCount;
    }

    public int getNoInChargePersonProjectCodesCount() {
        return noInChargePersonProjectCodesCount;
    }

    public void setNoInChargePersonProjectCodesCount(int noInChargePersonProjectCodesCount) {
        this.noInChargePersonProjectCodesCount = noInChargePersonProjectCodesCount;
    }

    public Long getFormOfficeId() {
        return formOfficeId;
    }

    public void setFormOfficeId(Long formOfficeId) {
        this.formOfficeId = formOfficeId;
    }

    public Long getFormDepartmentId() {
        return formDepartmentId;
    }

    public void setFormDepartmentId(Long formDepartmentId) {
        this.formDepartmentId = formDepartmentId;
    }

    public ManagerReportVO(ManagerReport managerReport) {
        this.createdAt = new YearMonthDateTime(managerReport.getCreatedAt());
        if(managerReport.getFormOffice() != null) {
            this.formOfficeId = managerReport.getFormOffice().getId();
            this.formOfficeName = managerReport.getFormOffice().getName();
        }
        if(managerReport.getFormDepartment() != null) {
            this.formDepartmentId = managerReport.getFormDepartment().getId();
            this.formDepartmentName = managerReport.getFormDepartment().getName();
        }
        if(managerReport.getFormReportCurrency() != null) {
            this.formReportCurrencyCode = managerReport.getFormReportCurrency().getCode();
        }
        if(managerReport.getFormFinancialYear() != null) {
            this.formFinancialYear = managerReport.getFormFinancialYear();
        }
        if(managerReport.getFormGrossMargin() != null) {
            this.formGrossMargin = managerReport.getFormGrossMargin();
        }
        this.formCurrencyRates = managerReport.getFormCurrencyRates();
        for(Currency currency : managerReport.getCurrencies()) {
            this.currencies.add(new CurrencyVO(currency));
        }
        this.mainCurrency = new CurrencyVO(managerReport.getMainCurrency());
        
        
        for(ManagerReport.Row row : managerReport.getRows()) {
            this.rows.add(new ManagerReportVO.Row(row));
        }
        for(Office office : managerReport.getOffices()) {
            this.offices.add(new OfficeVO(office));
        }
        for(Department department : managerReport.getDepartments()) {
            this.departments.add(new DepartmentVO(department));
        }
        for(Employee inChargePerson : managerReport.getInChargePersons()) {
            this.inChargePersons.add(new EmployeeWithoutPasswordVO(inChargePerson));
        }
        for(Client client : managerReport.getClients()) {
            this.clients.add(new ClientVO(client));
        }
        noFinancialYearProjectCodesCount = managerReport.getNoFinancialYearProjectCodes().size();
        noBudgetProjectCodesCount = managerReport.getNoBudgetProjectCodes().size();
        noInChargePersonProjectCodesCount = managerReport.getNoInChargePersonProjectCodes().size();

    }
}
