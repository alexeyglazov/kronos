/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.*;
import java.util.Calendar;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ContactUtil {
    public static class DescribedContactComparator implements Comparator<DescribedContact> {
        public int compare(DescribedContact o1, DescribedContact o2) {
            String groupName1 = "";
            if(o1.getGroup() != null) {
                groupName1 = o1.getGroup().getName();
            }
            String groupName2 = "";
            if(o2.getGroup() != null) {
                groupName2 = o2.getGroup().getName();
            }
            int result = groupName1.compareTo(groupName2);
            if(result != 0) {
                return result;
            }

            String clientName1 = "";
            if(o1.getClient() != null) {
                clientName1 = o1.getClient().getName();
            }
            String clientName2 = "";
            if(o2.getClient() != null) {
                clientName2 = o2.getClient().getName();
            }
            result = clientName1.compareTo(clientName2);
            if(result != 0) {
                return result;
            }
            
            String contactName1 = o1.getContact().getFirstName() + " " + o1.getContact().getLastName();
            String contactName2 = o2.getContact().getFirstName() + " " + o2.getContact().getLastName();
            result = contactName1.compareTo(contactName2);
            return result;
        }
    }
    public static class DescribedContact {
        private Contact contact;
        private Client client;
        private Group group;
        private ISOCountry clientLegalCountry;
        private ISOCountry clientPostalCountry;
        private ISOCountry country;
        private ISOCountry residencialCountry;

        public DescribedContact(Contact contact, Client client, Group group, ISOCountry clientLegalCountry, ISOCountry clientPostalCountry, ISOCountry country, ISOCountry residencialCountry) {
            this.contact = contact;
            this.client = client;
            this.group = group;
            this.clientLegalCountry = clientLegalCountry;
            this.clientPostalCountry = clientPostalCountry;
            this.country = country;
            this.residencialCountry = residencialCountry;
        }

        public ISOCountry getClientLegalCountry() {
            return clientLegalCountry;
        }

        public void setClientLegalCountry(ISOCountry clientLegalCountry) {
            this.clientLegalCountry = clientLegalCountry;
        }

        public ISOCountry getClientPostalCountry() {
            return clientPostalCountry;
        }

        public void setClientPostalCountry(ISOCountry clientPostalCountry) {
            this.clientPostalCountry = clientPostalCountry;
        }

        public ISOCountry getCountry() {
            return country;
        }

        public void setCountry(ISOCountry country) {
            this.country = country;
        }

        public ISOCountry getResidencialCountry() {
            return residencialCountry;
        }

        public void setResidencialCountry(ISOCountry residencialCountry) {
            this.residencialCountry = residencialCountry;
        }

        public Contact getContact() {
            return contact;
        }

        public void setContact(Contact contact) {
            this.contact = contact;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }
    }
    
    public static List<DescribedContact> getDescribedContacts(ContactManagerFilterForm contactManagerFilterForm, Employee user, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Country country = user.getCountry();

        Group group = null;
        Client client = null;
        List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        List<Employee> employees = new LinkedList<Employee>();
        if(contactManagerFilterForm.getGroupId() != null) {
            group = (Group)hs.get(Group.class, contactManagerFilterForm.getGroupId());
        }
        if(contactManagerFilterForm.getClientId() != null) {
            client = (Client)hs.get(Client.class, contactManagerFilterForm.getClientId());
        }
        for(Long subdepartmentId : contactManagerFilterForm.getSubdepartmentIds()) {
            Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, subdepartmentId);
            subdepartments.add(subdepartment);
        }
        for(Long employeeId : contactManagerFilterForm.getEmployeeIds()) {
            Employee employee = (Employee)hs.get(Employee.class, employeeId);
            employees.add(employee);
        }
     
        String query = "select cc, c, g, clc, cpc, ccc, ccrc from Contact as cc ";
        query += "inner join cc.contactClientLinks as ccl inner join ccl.client as c ";

        if((! employees.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson())) || (! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode()))) {
            query += "left join c.projectCodes as pc ";
        }
        if(! employees.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson())) {
            query += "left join pc.inChargePerson as icp ";
        }
        if(! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode())) {
            query += "left join pc.subdepartment as s ";
        }
        
        if((! employees.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeResponsiblePerson())) || (! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson()))) {
            query += "left join cc.employeeContactLinks as ecl left join ecl.employee as rp ";
        }
        if(! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson())) {
            query += "left join rp.position as p left join p.subdepartment as rps ";
        }
        
        query += "left join c.group as g ";
        query += "left join c.legalCountry as clc ";
        query += "left join c.postalCountry as cpc ";
        query += "left join cc.country as ccc ";
        query += "left join cc.residencialCountry as ccrc ";
        if(contactManagerFilterForm.getContactHistoryItemPresent() != null && contactManagerFilterForm.getContactHistoryItemStatus() != null) {
            query += "left join cc.contactHistoryItems as chi ";
            query += "with ( ";
            query += "chi.status=:status ";
            if(contactManagerFilterForm.getContactHistoryItemRange().getFrom() != null) {
                query += "and chi.modifiedAt>=:rangeFrom ";
            }
            if(contactManagerFilterForm.getContactHistoryItemRange().getTo() != null) {
                query += "and chi.modifiedAt<=:rangeTo ";
            }
            query += ") ";
        }
        
        query += "where ";
        query += "c.workCountry=:country ";
        if(contactManagerFilterForm.getName() != null && ! contactManagerFilterForm.getName().trim().equals("")) {
            query += "and (cc.firstName like :namePattern or cc.lastName like :namePattern or cc.firstNameLocalLanguage like :namePattern or cc.lastNameLocalLanguage like :namePattern)";
        }
        if(contactManagerFilterForm.getEmails() != null && ! contactManagerFilterForm.getEmails().isEmpty()) {
            query += "and (cc.email in (:emails)) ";
        }
        if(contactManagerFilterForm.getIsActive() != null) {
            query += "and cc.isActive=:isActive ";
        }
        if(contactManagerFilterForm.getIsNewsletters() != null) {
            query += "and cc.isNewsletters=:isNewsletters ";
        }
        if(contactManagerFilterForm.getIsReminder() != null) {
            query += "and cc.isReminder=:isReminder ";
        }
        if(contactManagerFilterForm.getPresentType()!= null) {
            query += "and cc.presentType=:presentType ";
        }

        if(! employees.isEmpty()) {
            if(Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson()) && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeResponsiblePerson())) {
                query += "and (icp in (:inChargePersons) or rp in (:responsiblePersons)) ";
            } else if(Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson()) && ! Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeResponsiblePerson())) {
                query += "and icp in (:inChargePersons) ";
            } else if(! Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson()) && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeResponsiblePerson())) {
                query += "and rp in (:responsiblePersons) ";
            }
        }
        if(! subdepartments.isEmpty()) {
            if(Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode()) && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson())) {
                query += "and (s in (:projectCodeSubdepartments) or rps in (:responsiblePersonSubdepartments)) ";
            } else if(Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode()) && ! Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson())) {
                query += "and s in (:projectCodeSubdepartments) ";
            } else if(! Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode()) && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson())) {
                query += "and rps in (:responsiblePersonSubdepartments) ";
            }
        }
        if(group != null) {
            query += "and g=:group ";
        }
        if(client != null) {
            query += "and c=:client ";
        }
        query += "group by cc ";
        if(contactManagerFilterForm.getContactHistoryItemPresent() != null && contactManagerFilterForm.getContactHistoryItemStatus() != null) {
            if(Boolean.TRUE.equals(contactManagerFilterForm.getContactHistoryItemPresent())) {
                query += "having count(chi)>0 ";
            } else if(Boolean.FALSE.equals(contactManagerFilterForm.getContactHistoryItemPresent())) {
                query += "having count(chi)=0 ";
            }
        }
        Query hq = hs.createQuery(query);
        hq.setParameter("country", country);

        if(contactManagerFilterForm.getName() != null && ! contactManagerFilterForm.getName().trim().equals("")) {
            String namePattern = contactManagerFilterForm.getName().trim().replaceAll("\\*", "%");
            if(! namePattern.startsWith("%")) {
                namePattern = ("%" + namePattern);
            }
            if(! namePattern.endsWith("%")) {
                namePattern += "%";
            }            
            hq.setParameter("namePattern", namePattern);
        }        
        if(contactManagerFilterForm.getEmails() != null && ! contactManagerFilterForm.getEmails().isEmpty()) {
            hq.setParameterList("emails", contactManagerFilterForm.getEmails());
        }
        if(contactManagerFilterForm.getContactHistoryItemPresent() != null && contactManagerFilterForm.getContactHistoryItemStatus() != null) {
            hq.setParameter("status", contactManagerFilterForm.getContactHistoryItemStatus());
            if(contactManagerFilterForm.getContactHistoryItemRange().getFrom() != null) {
                hq.setParameter("rangeFrom", contactManagerFilterForm.getContactHistoryItemRange().getFrom().getCalendar().getTime());
            }
            if(contactManagerFilterForm.getContactHistoryItemRange().getTo() != null) {
                hq.setParameter("rangeTo", contactManagerFilterForm.getContactHistoryItemRange().getTo().getCalendar().getTime());
            }
        }

        if(contactManagerFilterForm.getIsActive() != null) {
            hq.setParameter("isActive", contactManagerFilterForm.getIsActive());
        }
        if(contactManagerFilterForm.getIsNewsletters()!= null) {
            hq.setParameter("isNewsletters", contactManagerFilterForm.getIsNewsletters());
        }
        if(contactManagerFilterForm.getIsReminder()!= null) {
            hq.setParameter("isReminder", contactManagerFilterForm.getIsReminder());
        }
        if(contactManagerFilterForm.getPresentType() != null) {
            hq.setParameter("presentType", contactManagerFilterForm.getPresentType());
        }
        
        if(! employees.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeInChargePerson())) {
            hq.setParameterList("inChargePersons", employees);
        }
        if(! employees.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsEmployeeResponsiblePerson())) {
            hq.setParameterList("responsiblePersons", employees);
        }        
        if(! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfProjectCode())) {
            hq.setParameterList("projectCodeSubdepartments", subdepartments);
        }
        if(! subdepartments.isEmpty() && Boolean.TRUE.equals(contactManagerFilterForm.getIsSubdepartmentOfResponsiblePerson())) {
            hq.setParameterList("responsiblePersonSubdepartments", subdepartments);
        }        
        if(group != null) {
            hq.setParameter("group", group);
        }
        if(client != null) {
            hq.setParameter("client", client);
        }    

        List<Object[]> selection = (List<Object[]>)hq.list();
        List<DescribedContact> result = new LinkedList<DescribedContact>();
        for(Object[] tuple : selection) {
            Contact tmpContact = (Contact)tuple[0];
            Client tmpClient = (Client)tuple[1];
            Group tmpGroup = (Group)tuple[2];
            ISOCountry tmpClientLegalCountry = (ISOCountry)tuple[3];
            ISOCountry tmpClientPostalCountry = (ISOCountry)tuple[4];
            ISOCountry tmpContactCountry = (ISOCountry)tuple[5];
            ISOCountry tmpContactResidencialCounty = (ISOCountry)tuple[6];
            DescribedContact describedContact = new DescribedContact(tmpContact, tmpClient, tmpGroup, tmpClientLegalCountry, tmpClientPostalCountry, tmpContactCountry, tmpContactResidencialCounty);
            result.add(describedContact);
        }
        return result;
    }
}
