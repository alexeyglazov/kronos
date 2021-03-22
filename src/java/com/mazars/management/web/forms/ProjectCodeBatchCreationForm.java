/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.service.StringUtils;
import com.mazars.management.web.vo.Period;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class ProjectCodeBatchCreationForm {
    private List<Long> clientIds = new LinkedList<Long>();
    private List<Long> activityIds = new LinkedList<Long>();
    private List<Period> periods = new LinkedList<Period>();
    private Integer year = null;
    private String comment;
    private String description;
    private Boolean isDead;
    private Boolean isClosed;
    // For example 2010 must be displayed as 2010-2011
    private Integer financialYear;
    
    private List<String> projectCodeCodes = new LinkedList<String>();
    private Map<String, BigDecimal> feesAdvanceAmounts = new HashMap<String, BigDecimal>();
    private Map<String, Long> feesAdvanceCurrencyIds = new HashMap<String, Long>();
    private Map<String, Long> feesPaymentCurrencyIds = new HashMap<String, Long>();
    private Map<String, YearMonthDate> feesAdvanceDates = new HashMap<String, YearMonthDate>();
    private Map<String, Boolean> isFutureItems = new HashMap<String, Boolean>();
    private Map<String, Long> inChargePersonIds = new HashMap<String, Long>();
    private Map<String, Long> inChargePartnerIds = new HashMap<String, Long>();
    
    public ProjectCodeBatchCreationForm() {
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

    public Map<String, Long> getFeesPaymentCurrencyIds() {
        return feesPaymentCurrencyIds;
    }

    public void setFeesPaymentCurrencyIds(Map<String, Long> feesPaymentCurrencyIds) {
        this.feesPaymentCurrencyIds = feesPaymentCurrencyIds;
    }

    public Boolean getIsDead() {
        return isDead;
    }

    public void setIsDead(Boolean isDead) {
        this.isDead = isDead;
    }

    public Boolean getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(Boolean isClosed) {
        this.isClosed = isClosed;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Map<String, Long> getInChargePersonIds() {
        return inChargePersonIds;
    }

    public void setInChargePersonIds(Map<String, Long> inChargePersonIds) {
        this.inChargePersonIds = inChargePersonIds;
    }

    public Map<String, Long> getInChargePartnerIds() {
        return inChargePartnerIds;
    }

    public void setInChargePartnerIds(Map<String, Long> inChargePartnerIds) {
        this.inChargePartnerIds = inChargePartnerIds;
    }

    public List<String> getProjectCodeCodes() {
        return projectCodeCodes;
    }

    public void setProjectCodeCodes(List<String> projectCodeCodes) {
        this.projectCodeCodes = projectCodeCodes;
    }

    public Map<String, BigDecimal> getFeesAdvanceAmounts() {
        return feesAdvanceAmounts;
    }

    public void setFeesAdvanceAmounts(Map<String, BigDecimal> feesAdvanceAmounts) {
        this.feesAdvanceAmounts = feesAdvanceAmounts;
    }

    public Map<String, Long> getFeesAdvanceCurrencyIds() {
        return feesAdvanceCurrencyIds;
    }

    public void setFeesAdvanceCurrencyIds(Map<String, Long> feesAdvanceCurrencyIds) {
        this.feesAdvanceCurrencyIds = feesAdvanceCurrencyIds;
    }

    public Map<String, Boolean> getIsFutureItems() {
        return isFutureItems;
    }

    public void setIsFutureItems(Map<String, Boolean> isFutureItems) {
        this.isFutureItems = isFutureItems;
    }

    public Map<String, YearMonthDate> getFeesAdvanceDates() {
        return feesAdvanceDates;
    }

    public void setFeesAdvanceDates(Map<String, YearMonthDate> feesAdvanceDates) {
        this.feesAdvanceDates = feesAdvanceDates;
    }

    public List<Long> getClientIds() {
        return clientIds;
    }

    public void setClientIds(List<Long> clientIds) {
        this.clientIds = clientIds;
    }

    public List<Long> getActivityIds() {
        return activityIds;
    }

    public void setActivityIds(List<Long> activityIds) {
        this.activityIds = activityIds;
    }

    public List<Period> getPeriods() {
        return periods;
    }

    public void setPeriods(List<Period> periods) {
        this.periods = periods;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public static ProjectCodeBatchCreationForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeBatchCreationForm.class);
    }
    public void normalize() {
        comment = StringUtils.stripNonValidXMLCharacters(comment);
        description = StringUtils.stripNonValidXMLCharacters(description);
    }
}
