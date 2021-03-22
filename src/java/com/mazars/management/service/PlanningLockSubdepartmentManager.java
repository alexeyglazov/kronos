/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Subdepartment;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author glazov
 */
public class PlanningLockSubdepartmentManager {
    public static class Item {
        private Employee employee;
        private Date lockedAt;

        public Item() {
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Date getLockedAt() {
            return lockedAt;
        }

        public void setLockedAt(Date lockedAt) {
            this.lockedAt = lockedAt;
        }
        
    }
    private static PlanningLockSubdepartmentManager instance;
    private Map<Subdepartment, Item> items = new HashMap<Subdepartment, Item>();
    public static synchronized PlanningLockSubdepartmentManager getInstance() {
        if (instance == null) {
            instance = new PlanningLockSubdepartmentManager();
        }
        return instance;
    }

    private PlanningLockSubdepartmentManager() {
    }

    public Map<Subdepartment, Item> getItems() {
        return items;
    }

    public void setItems(Map<Subdepartment, Item> items) {
        this.items = items;
    }
    
    public Subdepartment findKey(Subdepartment subdepartment) {
        for(Subdepartment subdepartmentTmp : items.keySet()) {
            if(subdepartmentTmp.getId().equals(subdepartment.getId())) {
                return subdepartmentTmp;
            }
        }
        return null;
    }
    public Item findItem(Subdepartment subdepartment) {
        Subdepartment key = this.findKey(subdepartment);
        if(key != null) {
            return items.get(key);
        }
        return null;
    }
    public void removeItem(Subdepartment subdepartment) {
        Subdepartment key = this.findKey(subdepartment);
        if(key != null) {
            items.remove(key);
        }
    }
}
