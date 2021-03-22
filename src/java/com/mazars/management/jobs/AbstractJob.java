/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.jobs;

/**
 *
 * @author Glazov
 */
public abstract class AbstractJob {
    private String timePattern;
    private boolean initialized = false;
    public abstract void execute();
    public abstract void init() throws Exception;

    public String getTimePattern() {
        return timePattern;
    }

    public void setTimePattern(String timePattern) {
        this.timePattern = timePattern;
    }

    public boolean getInitialized() {
        return initialized;
    }

    public void setInitialized(boolean initialized) {
        this.initialized = initialized;
    }
    
}
