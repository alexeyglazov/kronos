/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.Agreement.Type;
import java.util.Calendar;

/**
 *
 * @author glazov
 */
public class AgreementVO {
    private Long id;
    private String number;
    private Boolean isSigned;
    private Calendar date;
    private Agreement.Type type;
    private Boolean isRenewal;
    private String comment;

    public AgreementVO() {
    }
    public AgreementVO(Agreement agreement) {
        id = agreement.getId();
        number = agreement.getNumber();
        isSigned = agreement.getIsSigned();
        date = agreement.getDate();
        type = agreement.getType();
        isRenewal = agreement.getIsRenewal();
        comment = agreement.getComment();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Calendar getDate() {
        return date;
    }

    public void setDate(Calendar date) {
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

    public void setRenewal(Boolean isRenewal) {
        this.isRenewal = isRenewal;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

}
