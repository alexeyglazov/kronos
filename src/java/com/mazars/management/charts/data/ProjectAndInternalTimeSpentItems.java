/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.charts.data;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class ProjectAndInternalTimeSpentItems {
    public enum View {
        TIME,
        PERCENT
    }
   private Employee employee;
   private Calendar startDate;
   private Calendar endDate;
   private View view;
   private Map<ProjectCode, Long> projectTimeSpentItems = new HashMap<ProjectCode, Long>();
   private Map<Task, Long> internalTimeSpentItems = new HashMap<Task, Long>();

    public ProjectAndInternalTimeSpentItems() {
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Map<ProjectCode, Long> getProjectTimeSpentItems() {
        return projectTimeSpentItems;
    }

    public void setProjectTimeSpentItems(Map<ProjectCode, Long> projectTimeSpentItems) {
        this.projectTimeSpentItems = projectTimeSpentItems;
    }

    public Map<Task, Long> getInternalTimeSpentItems() {
        return internalTimeSpentItems;
    }

    public void setInternalTimeSpentItems(Map<Task, Long> internalTimeSpentItems) {
        this.internalTimeSpentItems = internalTimeSpentItems;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }
    
   public void build() {
       this.buildProjectTimeSpentItems();
       this.buildInternalTimeSpentItems();
   }
   private void buildProjectTimeSpentItems() {
       this.projectTimeSpentItems = new HashMap<ProjectCode, Long>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, sum(tsi.timeSpent) from TimeSpentItem as tsi inner join tsi.employee as e inner join tsi.projectCode as pc ";
        query += "where e=:employee ";
        query += "and tsi.day>=:startDate ";
        query += "and tsi.day<=:endDate ";
        query += "group by e, pc ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", this.employee);
        hq.setParameter("startDate", this.startDate);
        hq.setParameter("endDate", this.endDate);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Long timeSpent = (Long)tuple[1];
            this.projectTimeSpentItems.put(projectCode, timeSpent);
        }
   }
   private void buildInternalTimeSpentItems() {
       this.internalTimeSpentItems = new HashMap<Task, Long>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select t, sum(tsi.timeSpent) from TimeSpentItem as tsi inner join tsi.employee as e inner join tsi.task as t inner join t.taskType as tt ";
        query += "where e=:employee ";
        query += "and tsi.day>=:startDate ";
        query += "and tsi.day<=:endDate ";
        query += "and tt.isInternal=true ";
        query += "and t.isIdle=false ";
        query += "group by e, t ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", this.employee);
        hq.setParameter("startDate", this.startDate);
        hq.setParameter("endDate", this.endDate);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Task task = (Task)tuple[0];
            Long timeSpent = (Long)tuple[1];
            this.internalTimeSpentItems.put(task, timeSpent);
        }
   }
}
