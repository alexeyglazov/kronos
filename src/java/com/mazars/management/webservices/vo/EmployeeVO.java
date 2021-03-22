/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.webservices.vo;

import com.mazars.management.db.domain.Employee;
import java.util.Date;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name="employee", namespace = "http://services.webservices.management.mazars.com/")
@XmlAccessorType(XmlAccessType.FIELD)
public class EmployeeVO {
    @XmlElement(name="id", namespace = "http://services.webservices.management.mazars.com/")
    private Long id;
    @XmlElement(name="externalId", namespace = "http://services.webservices.management.mazars.com/")
    private String externalId;
    @XmlElement(name="firstName", namespace = "http://services.webservices.management.mazars.com/")
    private String firstName;
    @XmlElement(name="lastName", namespace = "http://services.webservices.management.mazars.com/")
    private String lastName;
    @XmlElement(name="firstNameLocalLanguage", namespace = "http://services.webservices.management.mazars.com/")
    private String firstNameLocalLanguage;
    @XmlElement(name="lastNameLocalLanguage", namespace = "http://services.webservices.management.mazars.com/")
    private String lastNameLocalLanguage;
    @XmlElement(name="userName", namespace = "http://services.webservices.management.mazars.com/")
    private String userName;
    @XmlElement(name="email", namespace = "http://services.webservices.management.mazars.com/")
    private String email;

    public EmployeeVO() {
    }
    public EmployeeVO(Employee employee) {
        this.id = employee.getId();
        this.externalId = employee.getExternalId();
        this.firstName = employee.getFirstName();
        this.lastName = employee.getLastName();
        this.firstNameLocalLanguage = employee.getFirstNameLocalLanguage();
        this.lastNameLocalLanguage = employee.getLastNameLocalLanguage();
        this.userName = employee.getUserName();
        this.email = employee.getEmail();
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstNameLocalLanguage() {
        return firstNameLocalLanguage;
    }

    public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
        this.firstNameLocalLanguage = firstNameLocalLanguage;
    }

    public String getLastNameLocalLanguage() {
        return lastNameLocalLanguage;
    }

    public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
        this.lastNameLocalLanguage = lastNameLocalLanguage;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
