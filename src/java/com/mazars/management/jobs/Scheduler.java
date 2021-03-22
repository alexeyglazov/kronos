/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimerTask;

/**
 *
 * @author Glazov
 */
public class Scheduler extends TimerTask  {
    private static Scheduler instance;
    private List<AbstractJob> jobs = new ArrayList<AbstractJob>();
    private Scheduler (){
    }
    public static Scheduler getInstance(){
        if (instance == null){
                instance = new Scheduler();
        }
        return instance;
    }

    public List<AbstractJob> getJobs() {
        return jobs;
    }

    public void setJobs(List<AbstractJob> jobs) {
        this.jobs = jobs;
    }
    
    public void run() {
        Date time = new Date();
        for(AbstractJob job : jobs) {
            if(job.getInitialized() && checkTimePattern(time, job.getTimePattern())) {
                job.execute();
            }
        }
    }
    public boolean checkTimePattern(Date time, String timePattern) {
        if(time == null || timePattern == null) {
            return false;
        }
        Calendar cal = new GregorianCalendar();
        cal.setTime(time);
        String[] parts = timePattern.split(" ");
        Set<Integer> minutes = getSet(parts[0]);
        Set<Integer> hours = getSet(parts[1]);
        Set<Integer> monthDays = getSet(parts[2]);
        Set<Integer> months = getSet(parts[3]);
        Set<Integer> years = getSet(parts[4]);
        Set<Integer> weekDays = getSet(parts[5]);
        if(minutes != null && ! minutes.contains(cal.get(Calendar.MINUTE))) {
            return false;
        }
        if(hours != null && ! hours.contains(cal.get(Calendar.HOUR_OF_DAY))) {
            return false;
        }
        if(monthDays != null && ! monthDays.contains(cal.get(Calendar.DAY_OF_MONTH))) {
            return false;
        }
        if(months != null && ! months.contains(cal.get(Calendar.MONTH))) {
            return false;
        }
        if(years != null && ! years.contains(cal.get(Calendar.YEAR))) {
            return false;
        }
        if(weekDays != null && ! weekDays.contains(cal.get(Calendar.DAY_OF_WEEK))) {
            return false;
        }
        return true;
    }
    private Set<Integer> getSet(String pattern) {
        Set<Integer> set = new HashSet<Integer>();
        if(pattern == null || pattern.equals("") || pattern.equals("*")) {
            return null;
        }
        if(pattern.indexOf(",") != -1) {
             String[] parts = pattern.split(",");
             for(String part : parts) {
                 set.addAll(getSet(part));
             }
        } else if(pattern.indexOf("-") != -1) {
            String[] parts = pattern.split("-");
            int left = Integer.parseInt(parts[0]);
            int right = Integer.parseInt(parts[1]);
            for(int i = left; i <= right; i++) {
                set.add(i);
            }
        } else {
            set.add(Integer.parseInt(pattern));
        }
        return set;
    }
    public static String analyzeTimePattern(String timePattern) {
        if(timePattern == null || timePattern.equals("")) {
            return "monthCloserNotificationTimePattern is not set";
        }
        String[] parts = timePattern.split(" ");
        if(parts.length != 6) {
            return "monthCloserNotificationTimePattern must consist of 6 parts";
        }
        for(int i = 0; i<parts.length; i++) {
            String result = analyzePart(parts[i]);
            if(result != null) {
                return "monthCloserNotificationTimePattern error in part " + i + ", " + result;
            }
        }
        return null;
    }
    private static String analyzePart(String pattern) {
        if(pattern == null || pattern.equals("")) {
            return "Empty part";
        }
        if(pattern.equals("*")) {
            return null;
        }
        if(pattern.indexOf(",") != -1) {
             String[] parts = pattern.split(",");
             for(String part : parts) {
                 return analyzePart(part);
             }
        } else if(pattern.indexOf("-") != -1) {
            String[] parts = pattern.split("-");
            try{
                int left = Integer.parseInt(parts[0]);
                int right = Integer.parseInt(parts[1]);
                if(right<left) {
                    return "Incorrect range bounds";
                }
            } catch (NumberFormatException e) {
                return "Number format exception";
            } catch (Exception e) {
                return e.getMessage();
            }
        } else {
            try{
                Integer.parseInt(pattern);
            } catch (NumberFormatException e) {
                return "Number format exception";
            }
        }
        return null;
    }
}
