package com.mazars.management.db.vo;
import com.mazars.management.db.domain.*;
import java.util.Set;
import java.util.HashSet;

public class ContactVOH extends ContactVO {
    private Long residencialCountryId;
    private Long countryId;

    public ContactVOH() {}

    public ContactVOH(Contact contact) {
        super(contact);
        if(contact.getResidencialCountry() != null) {
            this.residencialCountryId = contact.getResidencialCountry().getId();
        }
        if(contact.getCountry() != null) {
            this.countryId = contact.getCountry().getId();
        }        
    }

    public Long getResidencialCountryId() {
        return residencialCountryId;
    }

    public void setResidencialCountryId(Long residencialCountryId) {
        this.residencialCountryId = residencialCountryId;
    }

    public Long getCountryId() {
        return countryId;
    }

    public void setCountryId(Long countryId) {
        this.countryId = countryId;
    }
    
}
