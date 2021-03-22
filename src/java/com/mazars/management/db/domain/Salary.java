/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.security.SecurityUtils;
import java.io.UnsupportedEncodingException;
import org.hibernate.Session;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Calendar;
import java.math.BigDecimal;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;

/**
 *
 * @author glazov
 */
public class Salary {

    private Long id;
    private Calendar start;
    private Calendar end;
    private BigDecimal value;
    private byte[] encipheredValue;
    private Currency currency;
    private Employee employee;

    public Salary() {
    }

    public void encipherValue() throws BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException {
        if(value == null) {
            encipheredValue = null;
        } else {
            encipheredValue = SecurityUtils.encipher(value.toEngineeringString().getBytes("UTF8"));
        }
    }
    public void decipherValue() throws BadPaddingException, IllegalBlockSizeException, UnsupportedEncodingException {
        if(encipheredValue == null) {
            value = null;
        } else {
            value = new BigDecimal(new String(SecurityUtils.decipher(encipheredValue), "UTF8"));
        }    
    }
    
    public byte[] getEncipheredValue() {
        return encipheredValue;
    }

    public void setEncipheredValue(byte[] encipheredValue) {        
        this.encipheredValue = encipheredValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Currency getCurrency() {
        return currency;
    }

    public void setCurrency(Currency currency) {
        this.currency = currency;
    }

    public Calendar getEnd() {
        return end;
    }

    public void setEnd(Calendar end) {
        this.end = end;
    }

    public Calendar getStart() {
        return start;
    }

    public void setStart(Calendar start) {
        this.start = start;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public static List<Salary> getSortedSalaries(Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<Salary>)hs.createQuery("select s from Salary as s inner join s.employee where e=:employee order by li.start desc").setParameter("employee", employee).list();
    }

}
