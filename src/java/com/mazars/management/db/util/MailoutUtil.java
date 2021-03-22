/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.db.util;

import com.mazars.management.db.domain.Contact;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.Mailout;
import com.mazars.management.db.domain.MailoutRecipient;
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
public class MailoutUtil {
    public static class DescribedMailoutRecipient {
        private MailoutRecipient mailoutRecipient;
        private Contact contact;
        private Employee employee;

        public DescribedMailoutRecipient() {
        }

        public MailoutRecipient getMailoutRecipient() {
            return mailoutRecipient;
        }

        public void setMailoutRecipient(MailoutRecipient mailoutRecipient) {
            this.mailoutRecipient = mailoutRecipient;
        }

        public Contact getContact() {
            return contact;
        }

        public void setContact(Contact contact) {
            this.contact = contact;
        }

        public Employee getEmployee() {
            return employee;
        }

        public void setEmployee(Employee employee) {
            this.employee = employee;
        }
    } 
    
    public static List<Mailout> getMailouts() {
        List<Mailout> mailouts = new LinkedList<Mailout>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select m from Mailout as m left join m.mailoutHistoryItems as mhi ";
        query += "group by m ";
        query += "order by mhi.time ";
        Query hq = hs.createQuery(query);
        mailouts = (List<Mailout>)hq.list();
        return mailouts;
    }    
    public static List<MailoutUtil.DescribedMailoutRecipient> getDescribedMailoutRecipients(Mailout mailout) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select mr, c, e from Mailout as m inner join m.mailoutRecipients as mr left join mr.contact as c left join mr.employee as e ";
        query += "where m=:mailout ";
        Query hq = hs.createQuery(query);
        hq.setParameter("mailout",mailout);
        List<Object[]> selection = (List<Object[]>)hq.list();
        List<MailoutUtil.DescribedMailoutRecipient> result = new LinkedList<MailoutUtil.DescribedMailoutRecipient>();
        for(Object[] tuple : selection) {
            MailoutUtil.DescribedMailoutRecipient describedMailoutRecipient = new MailoutUtil.DescribedMailoutRecipient();
            describedMailoutRecipient.setMailoutRecipient((MailoutRecipient)tuple[0]);
            describedMailoutRecipient.setContact((Contact)tuple[1]);
            describedMailoutRecipient.setEmployee((Employee)tuple[2]);
            result.add(describedMailoutRecipient);
        }
        return result;
    }
}
