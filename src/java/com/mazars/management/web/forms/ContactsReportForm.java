/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.Contact;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.CodeDetailReport;
import com.mazars.management.reports.CodeDetailReport.View;
import java.math.BigDecimal;
import java.util.Map;


/**
 *
 * @author glazov
 */
public class ContactsReportForm {
    
    private Long officeId;
    private Long departmentId;
    private Long subdepartmentId;
    private Long activityId;
    private Contact.NormalPosition normalPosition;

    public ContactsReportForm() {
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

    public Contact.NormalPosition getNormalPosition() {
        return normalPosition;
    }

    public void setNormalPosition(Contact.NormalPosition normalPosition) {
        this.normalPosition = normalPosition;
    }

    public static ContactsReportForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ContactsReportForm.class);
    }
}
