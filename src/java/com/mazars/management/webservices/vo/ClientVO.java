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
public class ClientVO {
    Long id;
    String name;
    String code;
    Date modifiedAt;

    public ClientVO() {
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Date getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(Date modifiedAt) {
        this.modifiedAt = modifiedAt;
    }
}
