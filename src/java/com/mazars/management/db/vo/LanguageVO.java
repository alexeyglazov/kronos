/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.Language;
import com.mazars.management.db.domain.Language.Type;
/**
 *
 * @author glazov
 */
public class LanguageVO {
    private Long id;
    private String name;
    private Language.Type type;
    public LanguageVO() {
    }
    public LanguageVO(Language language) {
        this.id = language.getId();
        this.name = language.getName();
        this.type = language.getType();
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

    public Type getType() {
        return type;
    }

    public void setType(Type type) {
        this.type = type;
    }
}
