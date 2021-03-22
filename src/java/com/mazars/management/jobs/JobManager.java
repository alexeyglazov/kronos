/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import com.mazars.management.db.domain.Employee;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 *
 * @author Glazov
 */
public class JobManager  {
    private static JobManager instance;
    private List<Job> jobs = new ArrayList<Job>();
    
    private JobManager (){
    }
    public static JobManager getInstance(){
        if (instance == null){
                instance = new JobManager();
        }
        return instance;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }
    
    public List<Job> getJobs(String jobName, Employee employee) {
        List<Job> jobsTmp = new LinkedList<Job>();
        for(Job job : jobs) {
            if(jobName == null && employee == null) {
                jobsTmp.add(job);
            } else if(jobName == null && employee != null) {
                if(job.getEmployee() != null && employee.getId().equals(job.getEmployee().getId())) {
                    jobsTmp.add(job);
                }
            } else if(jobName != null && employee == null) {
                if(jobName.equals(job.getName())) {
                    jobsTmp.add(job);
                }            
            } else if(jobName != null && employee != null) {
                if(jobName.equals(job.getName()) && job.getEmployee() != null && employee.getId().equals(job.getEmployee().getId())) {
                    jobsTmp.add(job);
                }            
            }
        }
        return jobs;
    }
    public void addJob(Job job) {
        jobs.add(job);
        (new Thread(job)).start();
    }
    
    public void removeJob(Job job) {
        jobs.remove(job);
    }
}
