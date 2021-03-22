/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.domain;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class JobResult {

    private Long id;
    private String name;
    private Date startDate;
    private Date endDate;
    private byte[] data;
    private Integer dataSize;
    private String fileName;
    private Employee employee;

    public JobResult() {
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

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Integer getDataSize() {
        return dataSize;
    }

    public void setDataSize(Integer dataSize) {
        this.dataSize = dataSize;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public static List<JobResult> getAll() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        return (List<JobResult>)hs.createQuery("select jr from JobResult as jr").list();
    }
    public static List<JobResult> getAll(String name, Employee employee) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select jr from JobResult as jr ";
        if(name != null || employee != null) {
            query += "where ";
        }
        boolean conditionUsed = false;
        if(name != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "jr.name=:name ";
            conditionUsed = true;
        }
        if(employee != null) {
            if(conditionUsed) {
                query += "and ";
            }
            query += "jr.employee=:employee ";
            conditionUsed = true;
        }
        Query q = hs.createQuery(query);
        if(name != null) {
            q.setParameter("name", name);
        }
        if(employee != null) {
            q.setParameter("employee", employee);
        }
        return (List<JobResult>)q.list();
    }
}
