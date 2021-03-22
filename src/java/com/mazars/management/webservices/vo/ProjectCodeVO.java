/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import java.util.Date;

/**
 *
 * @author glazov
 */
public class ProjectCodeVO {
    String code;
    Date createdAt;
    Date modifiedAt;
    Date closedAt;
    Boolean isDead;
    String comment;

    public ProjectCodeVO() {
    }

    public ProjectCodeVO(com.mazars.management.db.domain.ProjectCode projectCode) {
        com.mazars.management.db.domain.Client client = projectCode.getClient();
        com.mazars.management.db.domain.Group group = client.getGroup();
        code = projectCode.getCode();
        createdAt = projectCode.getCreatedAt();
        modifiedAt = projectCode.getModifiedAt();
        closedAt = projectCode.getClosedAt();
        isDead = projectCode.getIsDead();
        comment = projectCode.getComment();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public Date getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Date closedAt) {
        this.closedAt = closedAt;
    }

    public Boolean getIsDead() {
        return isDead;
    }

    public void setIsDead(Boolean isDead) {
        this.isDead = isDead;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
