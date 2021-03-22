/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.TimerTask;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public abstract class Job extends TimerTask {
    String name;
    Date startDate;
    Employee employee;
    double part;

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public double getPart() {
        return part;
    }

    public void setPart(double part) {
        this.part = part;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    @Override
    public void run() {
        try{
            execute();
        } catch(Exception e) {
            e.printStackTrace();
        }
        JobManager.getInstance().removeJob(this);      
    }
    public abstract void execute() throws Exception;
}
