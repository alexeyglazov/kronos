/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.CodeDetailReport;
import com.mazars.management.reports.CodeDetailReport.View;
import java.math.BigDecimal;
import java.util.Map;


/**
 *
 * @author glazov
 */
public class CredentialsReportForm {
    
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private Long activityId;
    private Long groupId;
    private Long clientId;
    private Long activitySectorGroupId;
    private Long activitySectorId;
    private Long countryId;

    public CredentialsReportForm() {
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

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getActivitySectorGroupId() {
        return activitySectorGroupId;
    }

    public void setActivitySectorGroupId(Long activitySectorGroupId) {
        this.activitySectorGroupId = activitySectorGroupId;
    }

    public Long getActivitySectorId() {
        return activitySectorId;
    }

    public void setActivitySectorId(Long activitySectorId) {
        this.activitySectorId = activitySectorId;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }
 
    public static CredentialsReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, CredentialsReportForm.class);
    }
}
