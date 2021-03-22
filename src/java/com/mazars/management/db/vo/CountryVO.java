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
public class CountryVO {
    private Long id;
    private String name;
    private String description;
    public CountryVO() {};

    public CountryVO(Country country) {
        this.id = country.getId();
        this.name = country.getName();
        this.description = country.getDescription();
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

}
