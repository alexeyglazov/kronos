/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.ProjectCode.PeriodDate;
import com.mazars.management.db.domain.ProjectCode.PeriodMonth;
import com.mazars.management.db.domain.ProjectCode.PeriodQuarter;
import com.mazars.management.db.domain.ProjectCode.PeriodType;
import com.mazars.management.db.vo.*;
import com.mazars.management.service.StringUtils;
import java.math.BigDecimal;
/**
 *
 * @author glazov
 */
public class ProjectCodeForm {
    private Long officeId;
    private Long subdepartmentId;
    private Long clientId;
    private Integer year;
    private Long activityId;
    private ProjectCode.PeriodType periodType;
    private ProjectCode.PeriodQuarter periodQuarter;
    private ProjectCode.PeriodMonth periodMonth;
    private ProjectCode.PeriodDate periodDate;
    private Integer periodCounter;
    private String comment;
    private String description;
    private Boolean isFuture;
    private Boolean isDead;
    private Boolean isClosed;
    // For example 2010 must be displayed as 2010-2011
    private Integer financialYear;
    private Long inChargePersonId;
    private Long inChargePartnerId;
    private BigDecimal feesAdvanceAmount;
    private Long feesAdvanceCurrencyId;
    private Long feesPaymentCurrencyId;
    private YearMonthDate feesAdvanceDate = new YearMonthDate();
    private String projectCodeCode;

    public ProjectCodeForm() {
    }

    public String getProjectCodeCode() {
        return projectCodeCode;
    }

    public void setProjectCodeCode(String projectCodeCode) {
        this.projectCodeCode = projectCodeCode;
    }

    public Long getInChargePersonId() {
        return inChargePersonId;
    }

    public void setInChargePersonId(Long inChargePersonId) {
        this.inChargePersonId = inChargePersonId;
    }

    public Long getInChargePartnerId() {
        return inChargePartnerId;
    }

    public void setInChargePartnerId(Long inChargePartnerId) {
        this.inChargePartnerId = inChargePartnerId;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }

    public Boolean getIsDead() {
        return isDead;
    }

    public void setIsDead(Boolean isDead) {
        this.isDead = isDead;
    }

    public Boolean getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(Boolean isFuture) {
        this.isFuture = isFuture;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Integer getPeriodCounter() {
        return periodCounter;
    }

    public void setPeriodCounter(Integer periodCounter) {
        this.periodCounter = periodCounter;
    }

    public PeriodDate getPeriodDate() {
        return periodDate;
    }

    public void setPeriodDate(PeriodDate periodDate) {
        this.periodDate = periodDate;
    }

    public PeriodMonth getPeriodMonth() {
        return periodMonth;
    }

    public void setPeriodMonth(PeriodMonth periodMonth) {
        this.periodMonth = periodMonth;
    }

    public PeriodQuarter getPeriodQuarter() {
        return periodQuarter;
    }

    public void setPeriodQuarter(PeriodQuarter periodQuarter) {
        this.periodQuarter = periodQuarter;
    }

    public PeriodType getPeriodType() {
        return periodType;
    }

    public void setPeriodType(PeriodType periodType) {
        this.periodType = periodType;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public BigDecimal getFeesAdvanceAmount() {
        return feesAdvanceAmount;
    }

    public void setFeesAdvanceAmount(BigDecimal feesAdvanceAmount) {
        this.feesAdvanceAmount = feesAdvanceAmount;
    }

    public Long getFeesAdvanceCurrencyId() {
        return feesAdvanceCurrencyId;
    }

    public void setFeesAdvanceCurrencyId(Long feesAdvanceCurrencyId) {
        this.feesAdvanceCurrencyId = feesAdvanceCurrencyId;
    }

    public YearMonthDate getFeesAdvanceDate() {
        return feesAdvanceDate;
    }

    public void setFeesAdvanceDate(YearMonthDate feesAdvanceDate) {
        this.feesAdvanceDate = feesAdvanceDate;
    }

    public Long getFeesPaymentCurrencyId() {
        return feesPaymentCurrencyId;
    }

    public void setFeesPaymentCurrencyId(Long feesPaymentCurrencyId) {
        this.feesPaymentCurrencyId = feesPaymentCurrencyId;
    }

    public static ProjectCodeForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeForm.class);
    }
    public void normalize() {
        comment = StringUtils.stripNonValidXMLCharacters(comment);
        description = StringUtils.stripNonValidXMLCharacters(description);
    }
}
