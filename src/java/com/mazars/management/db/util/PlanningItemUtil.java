/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class PlanningItemUtil {
    public static class DescribedPlanningItem {
        private PlanningItem planningItem;
        private Employee employee;
        private Subdepartment targetSubdepartment;
        private Subdepartment sourceSubdepartment;
        private Employee inChargePerson;
        private Client client;
        private Task task;
        private PlanningGroup planningGroup;
        private PlanningType planningType;
        private List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        
        public DescribedPlanningItem() {
        }

        public PlanningGroup getPlanningGroup() {
            return planningGroup;
        }

        public void setPlanningGroup(PlanningGroup planningGroup) {
            this.planningGroup = planningGroup;
        }

        public PlanningItem getPlanningItem() {
            return planningItem;
        }

        public void setPlanningItem(PlanningItem planningItem) {
            this.planningItem = planningItem;
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }

        public Employee getInChargePerson() {
            return inChargePerson;
        }

        public void setInChargePerson(Employee inChargePerson) {
            this.inChargePerson = inChargePerson;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public List<ProjectCode> getProjectCodes() {
            return projectCodes;
        }

        public void setProjectCodes(List<ProjectCode> projectCodes) {
            this.projectCodes = projectCodes;
        }

        public Subdepartment getTargetSubdepartment() {
            return targetSubdepartment;
        }

        public void setTargetSubdepartment(Subdepartment targetSubdepartment) {
            this.targetSubdepartment = targetSubdepartment;
        }

        public Subdepartment getSourceSubdepartment() {
            return sourceSubdepartment;
        }

        public void setSourceSubdepartment(Subdepartment sourceSubdepartment) {
            this.sourceSubdepartment = sourceSubdepartment;
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }

        public PlanningType getPlanningType() {
            return planningType;
        }

        public void setPlanningType(PlanningType planningType) {
            this.planningType = planningType;
        }
    }
    
    public static List<DescribedPlanningItem> getDescribedPlanningItems(Subdepartment subdepartment, Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, c, pc, t, pg, pt from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "inner join pg.planningType as pt ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.client as c ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";
        query += "where ";
        query += "not (pi.startDate>:end or pi.endDate<:start) ";
        query += "and (ts=:targetSubdepartment or ss=:sourceSubdepartment) ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameter("targetSubdepartment", subdepartment);
        hq.setParameter("sourceSubdepartment", subdepartment);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            Client client = (Client)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            Task task = (Task)tuple[7];
            PlanningGroup planningGroup = (PlanningGroup)tuple[8];
            PlanningType planningType = (PlanningType)tuple[9];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(employee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningType);
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }

    public static List<DescribedPlanningItem> getDescribedPlanningItems(Client client, Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, pc, t, pg, pt from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "inner join pg.planningType as pt ";
        query += "inner join pg.client as c ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";
        query += "where ";
        query += "not (pi.startDate>:end or pi.endDate<:start) ";
        query += "and c=:client ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameter("client", client);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            ProjectCode projectCode = (ProjectCode)tuple[5];
            Task task = (Task)tuple[6];
            PlanningGroup planningGroup = (PlanningGroup)tuple[7];
            PlanningType planningType = (PlanningType)tuple[8];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(employee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningType);
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }
    
    public static List<DescribedPlanningItem> getDescribedPlanningItems(Employee employee, Calendar start, Calendar end) {
        List<Employee> employees = new LinkedList<Employee>();
        employees.add(employee);
        return getDescribedPlanningItems(employees, start, end);
    }
    
    public static List<DescribedPlanningItem> getDescribedPlanningItems(List<Employee> employees, Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, c, pc, t, pg, pt from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "inner join pg.planningType as pt ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.client as c ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";

        query += "where ";
        query += "not (pi.startDate>:end or pi.endDate<:start) ";
        query += "and e in :employees ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameterList("employees", employees);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee planningEmployee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            Client client = (Client)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            Task task = (Task)tuple[7];
            PlanningGroup planningGroup = (PlanningGroup)tuple[8];
            PlanningType planningType = (PlanningType)tuple[9];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(planningEmployee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningType);
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }
    public static List<DescribedPlanningItem> getDescribedPlanningItemsByEmployeeIds(List<Long> employeeIds, Calendar start, Calendar end) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, c, pc, t, pg, pt from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "inner join pg.planningType as pt ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.client as c ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";

        query += "where ";
        query += "not (pi.startDate>:end or pi.endDate<:start) ";
        query += "and e.id in :employeeIds ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("start", start);
        hq.setParameter("end", end);
        hq.setParameterList("employeeIds", employeeIds);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee planningEmployee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            Client client = (Client)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            Task task = (Task)tuple[7];
            PlanningGroup planningGroup = (PlanningGroup)tuple[8];
            PlanningType planningType = (PlanningType)tuple[9];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(planningEmployee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningType);
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }    
    public static List<DescribedPlanningItem> getDescribedPlanningItemsByPlanningGroup(PlanningGroup planningGroup) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, c, pc, t  from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.client as c ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";
        query += "where ";
        query += "pg=:planningGroup ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("planningGroup", planningGroup);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            Client client = (Client)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            Task task = (Task)tuple[7];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(employee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningGroup.getPlanningType());
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }
    public static List<DescribedPlanningItem> getDescribedPlanningItemsByIds(List<Long> planningItemIds) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pi, ts, ss, e, icp, c, pc, t, pg, pt from PlanningItem as pi ";
        query += "inner join pi.employee as e ";
        query += "inner join pi.targetSubdepartment as ts ";
        query += "inner join pi.sourceSubdepartment as ss ";
        query += "inner join pi.planningGroup as pg ";
        query += "inner join pg.planningType as pt ";
        query += "left join pg.inChargePerson as icp ";
        query += "left join pg.client as c ";
        query += "left join pg.task as t ";
        query += "left join pg.planningGroupToProjectCodeLinks as pgtpcl ";
        query += "left join pgtpcl.projectCode as pc ";
        query += "where ";
        query += "pi.id in :planningItemIds ";
        query += "group by pi, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("planningItemIds", planningItemIds);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedPlanningItem> result = new LinkedList<DescribedPlanningItem>();
        for(Object[] tuple : selection) {
            PlanningItem planningItem = (PlanningItem)tuple[0];
            Subdepartment targetSubdepartment = (Subdepartment)tuple[1];
            Subdepartment sourceSubdepartment = (Subdepartment)tuple[2];
            Employee employee = (Employee)tuple[3];
            Employee inChargePerson = (Employee)tuple[4];
            Client client = (Client)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            Task task = (Task)tuple[7];
            PlanningGroup planningGroup = (PlanningGroup)tuple[8];
            PlanningType planningType = (PlanningType)tuple[9];
            
            DescribedPlanningItem describedPlanningItem = getDescribedPlanningItem(result, planningItem.getId());
            if(describedPlanningItem == null) {
                describedPlanningItem = new DescribedPlanningItem();
                describedPlanningItem.setPlanningItem(planningItem);
                describedPlanningItem.setTargetSubdepartment(targetSubdepartment);
                describedPlanningItem.setSourceSubdepartment(sourceSubdepartment);
                describedPlanningItem.setEmployee(employee);
                describedPlanningItem.setInChargePerson(inChargePerson);
                describedPlanningItem.setClient(client);
                describedPlanningItem.setTask(task);
                describedPlanningItem.setPlanningGroup(planningGroup);
                describedPlanningItem.setPlanningType(planningType);
                result.add(describedPlanningItem);               
            }
            if(projectCode != null) {
                List<ProjectCode> projectCodes = describedPlanningItem.getProjectCodes();
                projectCodes.add(projectCode);
                describedPlanningItem.setProjectCodes(projectCodes);
            }           
        }
        return result;
    }
    private static DescribedPlanningItem getDescribedPlanningItem(List<DescribedPlanningItem> items, Long id) {
        for(DescribedPlanningItem item : items) {
            if(item.getPlanningItem().getId().equals(id) ) {
                return item;
            }
        }
        return null;
    }
    public static List<Long> getEmployeeIds(List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems) {
        List<Long> employeeIds = new LinkedList<Long>();
        for(PlanningItemUtil.DescribedPlanningItem describedPlanningItem : describedPlanningItems) {
            Long id = describedPlanningItem.getEmployee().getId();
            if(! employeeIds.contains(id)) {
                employeeIds.add(id);
            }
        }
        return employeeIds;
    }
}
