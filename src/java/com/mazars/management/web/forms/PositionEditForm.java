/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;

/**
 *
 * @author glazov
 */
public class PositionEditForm {
    public enum Mode {
        CREATE,
        UPDATE
    }
    private PositionEditForm.Mode mode;
    private Long id;
    private Long subdepartmentId;
    private Long standardPositionId;
    private String name;
    private String localLanguageName;
    private String visitCardName;
    private String localLanguageVisitCardName;
    private Boolean isActive;

    public PositionEditForm() {
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getStandardPositionId() {
        return standardPositionId;
    }

    public void setStandardPositionId(Long standardPositionId) {
        this.standardPositionId = standardPositionId;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }

    public String getLocalLanguageName() {
        return localLanguageName;
    }

    public void setLocalLanguageName(String localLanguageName) {
        this.localLanguageName = localLanguageName;
    }

    public String getVisitCardName() {
        return visitCardName;
    }

    public void setVisitCardName(String visitCardName) {
        this.visitCardName = visitCardName;
    }

    public String getLocalLanguageVisitCardName() {
        return localLanguageVisitCardName;
    }

    public void setLocalLanguageVisitCardName(String localLanguageVisitCardName) {
        this.localLanguageVisitCardName = localLanguageVisitCardName;
    }

    public static PositionEditForm getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, PositionEditForm.class);
    }

}
