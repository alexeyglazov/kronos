/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.Agreement;
import com.mazars.management.db.domain.Agreement.Type;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.vo.YearMonthDate;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class AgreementEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private AgreementEditForm.Mode mode;
    private Long id;
    private Long projectCodeId;
    private String number;
    private Boolean isSigned;
    private YearMonthDate date;
    private Agreement.Type type;
    private Boolean isRenewal;
    private String comment;

    private FeesItem budget;

    public AgreementEditForm() {
        
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectCodeId() {
        return projectCodeId;
    }

    public void setProjectCodeId(Long projectCodeId) {
        this.projectCodeId = projectCodeId;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Boolean getIsSigned() {
        return isSigned;
    }

    public void setIsSigned(Boolean isSigned) {
        this.isSigned = isSigned;
    }

    public YearMonthDate getDate() {
        return date;
    }

    public void setDate(YearMonthDate date) {
        this.date = date;
    }

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }

    public Boolean getIsRenewal() {
        return isRenewal;
    }

    public void setIsRenewal(Boolean isRenewal) {
        this.isRenewal = isRenewal;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public FeesItem getBudget() {
        return budget;
    }

    public void setBudget(FeesItem budget) {
        this.budget = budget;
    }
    
    public static AgreementEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, AgreementEditForm.class);
    }
}
