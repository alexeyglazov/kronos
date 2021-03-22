/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;

import com.mazars.management.db.util.HibernateUtil;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class NaturalPerson {
    private Long id;
    private Set<Employee> employees = new HashSet<Employee>();
    public NaturalPerson() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }
    public static List<Employee> getLinkedEmployees(Employee employee) {
        Set<Employee> employees = new HashSet<Employee>();
        NaturalPerson naturalPerson = employee.getNaturalPerson();
        if(naturalPerson != null) {
            employees = naturalPerson.getEmployees();
            employees.remove(employee);
        }
        return new LinkedList<Employee>(employees);
    }
}
