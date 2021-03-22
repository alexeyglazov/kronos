/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.vo;
import com.mazars.management.db.domain.ISOCountry;
import java.util.LinkedList;
import java.util.List;
/**
 *
 * @author glazov
 */
public class ISOCountryVO {
    private Long id;
    private String name;
    private String alpha2Code;
    private String alpha3Code;
    private String numericCode;
    public ISOCountryVO() {
    }
    public ISOCountryVO(ISOCountry iSOCountry) {
        id = iSOCountry.getId();
        name = iSOCountry.getName();
        alpha2Code = iSOCountry.getAlpha2Code();
        alpha3Code = iSOCountry.getAlpha3Code();
        numericCode = iSOCountry.getNumericCode();
    }

    public String getAlpha2Code() {
        return alpha2Code;
    }

    public void setAlpha2Code(String alpha2Code) {
        this.alpha2Code = alpha2Code;
    }

    public String getAlpha3Code() {
        return alpha3Code;
    }

    public void setAlpha3Code(String alpha3Code) {
        this.alpha3Code = alpha3Code;
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

    public String getNumericCode() {
        return numericCode;
    }

    public void setNumericCode(String numericCode) {
        this.numericCode = numericCode;
    }
    public static List<ISOCountryVO> getList(List<ISOCountry> isoCountries) {
        List<ISOCountryVO> isoCountryVOs = new LinkedList<ISOCountryVO>();
        if(isoCountries == null) {
            return null;
        }
        for(ISOCountry isoCountry : isoCountries) {
           isoCountryVOs.add(new ISOCountryVO(isoCountry));
        }
        return isoCountryVOs;
    }
    
}
