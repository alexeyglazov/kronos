/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.util;

import com.mazars.management.db.domain.BusinessTripItem;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.ProjectCode;
import java.util.Calendar;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class BusinessTripItemUtil {
    public static class DescribedBusinessTripItem {
        private BusinessTripItem businessTripItem;
        private ProjectCode projectCode;

        public DescribedBusinessTripItem() {
        }

        public BusinessTripItem getBusinessTripItem() {
            return businessTripItem;
        }

        public void setBusinessTripItem(BusinessTripItem businessTripItem) {
            this.businessTripItem = businessTripItem;
        }

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }
    } 
    
    public static List<BusinessTripItemUtil.DescribedBusinessTripItem> getDescribedBusinessTripItems(Employee employee, int year, int month) {
        Calendar beginDate = CalendarUtil.getBeginDateForYearMonth(year, month);
        Calendar endDate = CalendarUtil.getEndDateForYearMonth(year, month);
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select bti, pc from Employee as e inner join e.businessTripItems as bti inner join bti.projectCode as pc ";
        query += "where e=:employee and bti.day >= :day1 and bti.day < :day2 ";
        Query hq = hs.createQuery(query);
        hq.setParameter("employee", employee).setParameter("day1", beginDate).setParameter("day2", endDate);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<BusinessTripItemUtil.DescribedBusinessTripItem> result = new LinkedList<BusinessTripItemUtil.DescribedBusinessTripItem>();
        for(Object[] tuple : selection) {
            BusinessTripItemUtil.DescribedBusinessTripItem describedBusinessTripItem = new BusinessTripItemUtil.DescribedBusinessTripItem();
            describedBusinessTripItem.setBusinessTripItem((BusinessTripItem)tuple[0]);
            describedBusinessTripItem.setProjectCode((ProjectCode)tuple[1]);
            result.add(describedBusinessTripItem);
        }
        return result;
    }
}
