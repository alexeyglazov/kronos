/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.util;

import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.domain.TaskType;
import com.mazars.management.db.domain.TimeSpentItem;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class TimeSpentItemUtil {
    public static class DescribedTimeSpentItem {
        private TimeSpentItem timeSpentItem;
        private ProjectCode projectCode;
        private Task task;
        private TaskType taskType;

        public DescribedTimeSpentItem() {
        }

        public TimeSpentItem getTimeSpentItem() {
            return timeSpentItem;
        }

        public void setTimeSpentItem(TimeSpentItem timeSpentItem) {
            this.timeSpentItem = timeSpentItem;
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }

        public TaskType getTaskType() {
            return taskType;
        }

        public void setTaskType(TaskType taskType) {
            this.taskType = taskType;
        }
    } 
    
    public static List<TimeSpentItemUtil.DescribedTimeSpentItem> getDescribedTimeSpentItems(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select tsi, t, tt, pc from Employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt left join tsi.projectCode as pc ";
        query += "where e=:employee and tsi.day >= :day1 and tsi.day < :day2 ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee).setParameter("day1", beginDate).setParameter("day2", endDate);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<TimeSpentItemUtil.DescribedTimeSpentItem> result = new LinkedList<TimeSpentItemUtil.DescribedTimeSpentItem>();
        for(Object[] tuple : selection) {
            TimeSpentItemUtil.DescribedTimeSpentItem describedTimeSpentItem = new TimeSpentItemUtil.DescribedTimeSpentItem();
            describedTimeSpentItem.setTimeSpentItem((TimeSpentItem)tuple[0]);
            describedTimeSpentItem.setTask((Task)tuple[1]);
            describedTimeSpentItem.setTaskType((TaskType)tuple[2]);
            describedTimeSpentItem.setProjectCode((ProjectCode)tuple[3]);
            result.add(describedTimeSpentItem);
        }
        return result;
    }
}
