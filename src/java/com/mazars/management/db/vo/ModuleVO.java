/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;

/**
 *
 * @author glazov
 */
public class ModuleVO {
    private Long id;
    private String name;
    private String description;
    private Boolean isReport;
    public ModuleVO() {}

    public ModuleVO(Module module) {
        this.id = module.getId();
        this.name = module.getName();
        this.description = module.getDescription();
        this.isReport = module.getIsReport();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getIsReport() {
        return isReport;
    }

    public void setIsReport(Boolean isReport) {
        this.isReport = isReport;
    }
}
