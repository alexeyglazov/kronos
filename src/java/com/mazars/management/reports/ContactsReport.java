/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.ContactsReportForm;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ContactsReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            String groupName1 = "";
            String groupName2 = "";
            if(o1.getGroup() != null) {
                groupName1 = o1.getGroup().getName();
            }
            if(o2.getGroup() != null) {
                groupName2 = o2.getGroup().getName();
            }
            int a = groupName1.compareTo(groupName2);
            if(a != 0) {
                return a;
            }
            a = o1.getClient().getName().compareTo(o2.getClient().getName());
            if(a != 0) {
                return a;
            }
            a = o1.getContact().getLastName().compareTo(o2.getContact().getLastName());
            if(a != 0) {
                return a;
            }
            a = o1.getContact().getFirstName().compareTo(o2.getContact().getFirstName());
            if(a != 0) {
                return a;
            }
            return a;
        }
    }    
    public class Row {
        private Group group;
        private Client client;
        private ISOCountry clientPostalCountry;
        private ISOCountry clientLegalCountry;

        private Contact contact;
        private ISOCountry contactResidencialCountry;
        private ISOCountry contactCountry;
        private List<Employee> responsiblePersons = new LinkedList<Employee>();
        private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();

        public Row() {
        }

        public List<Employee> getResponsiblePersons() {
            return responsiblePersons;
        }

        public void setResponsiblePersons(List<Employee> responsiblePersons) {
            this.responsiblePersons = responsiblePersons;
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Contact getContact() {
            return contact;
        }

        public void setContact(Contact contact) {
            this.contact = contact;
        }

        public ISOCountry getContactResidencialCountry() {
            return contactResidencialCountry;
        }

        public void setContactResidencialCountry(ISOCountry contactResidencialCountry) {
            this.contactResidencialCountry = contactResidencialCountry;
        }

        public ISOCountry getContactCountry() {
            return contactCountry;
        }

        public void setContactCountry(ISOCountry contactCountry) {
            this.contactCountry = contactCountry;
        }

        public ISOCountry getClientPostalCountry() {
            return clientPostalCountry;
        }

        public void setClientPostalCountry(ISOCountry clientPostalCountry) {
            this.clientPostalCountry = clientPostalCountry;
        }

        public ISOCountry getClientLegalCountry() {
            return clientLegalCountry;
        }

        public void setClientLegalCountry(ISOCountry clientLegalCountry) {
            this.clientLegalCountry = clientLegalCountry;
        }

        public List<Subdepartment> getSubdepartments() {
            return subdepartments;
        }

        public void setSubdepartments(List<Subdepartment> subdepartments) {
            this.subdepartments = subdepartments;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<Employee> responsiblePersons = new LinkedList<Employee>();
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Employee currentUser;
    private Module module;
    private ContactsReportForm form;
    private Date createdAt;
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private Activity formActivity;
    private Contact.NormalPosition formNormalPosition;

    public ContactsReport(ContactsReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        if(this.form.getActivityId() != null) {
            this.formActivity = (Activity)hs.get(Activity.class, new Long(form.getActivityId()));
        }
        if(this.form.getNormalPosition()!= null) {
            this.formNormalPosition = form.getNormalPosition();
        }
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<Employee> getResponsiblePersons() {
        return responsiblePersons;
    }

    public void setResponsiblePersons(List<Employee> responsiblePersons) {
        this.responsiblePersons = responsiblePersons;
    }

    public Employee getCurrentUser() {
        return currentUser;
    }

    public void setCurrentUser(Employee currentUser) {
        this.currentUser = currentUser;
    }

    public Module getModule() {
        return module;
    }

    public void setModule(Module module) {
        this.module = module;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public ContactsReportForm getForm() {
        return form;
    }

    public void setForm(ContactsReportForm form) {
        this.form = form;
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public Activity getFormActivity() {
        return formActivity;
    }

    public void setFormActivity(Activity formActivity) {
        this.formActivity = formActivity;
    }

    public Contact.NormalPosition getFormNormalPosition() {
        return formNormalPosition;
    }

    public void setFormNormalPosition(Contact.NormalPosition formNormalPosition) {
        this.formNormalPosition = formNormalPosition;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }



    public void build() {
        buildClientReport();
        buildResponsiblePersons();
        buildSubdepartmentReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildClientReport() {
        Country country = currentUser.getCountry();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select g, c, cc, ccrc, ccc, cpc, clc from Contact as cc ";
        query += "inner join cc.contactClientLinks as ccl inner join ccl.client as c left join c.group as g ";
        
        query += "left join cc.residencialCountry as ccrc ";
        query += "left join cc.country as ccc ";
        query += "left join c.postalCountry as cpc ";
        query += "left join c.legalCountry as clc ";

        query += "left join c.projectCodes as pc ";
        query += "left join pc.activity as a ";
        query += "left join a.subdepartment as s ";
        query += "left join s.department as d ";
        query += "left join d.office as o ";
            
        query += "where ";
        query += "c.workCountry=:workCountry ";
        if(formOffice != null) {
            query += "and o=:office ";
        }
        if(formDepartment != null) {
            query += "and d=:department ";
        }
        if(formSubdepartment != null) {
            query += "and s=:subdepartment ";
        }
        if(formActivity != null) {
            query += "and a=:activity ";
        }
        if(formNormalPosition != null) {
            query += "and cc.normalPosition=:normalPosition ";
        }
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            query += "and s in :subdepartments ";
        }
        query += "group by ccl ";
        Query hq = hs.createQuery(query);
        hq.setParameter("workCountry", country);
        if(formOffice != null) {
            hq.setParameter("office", formOffice);
        }
        if(formDepartment != null) {
            hq.setParameter("department", formDepartment);
        }
        if(formSubdepartment != null) {
            hq.setParameter("subdepartment", formSubdepartment);
        }
        if(formActivity != null) {
            hq.setParameter("activity", formActivity);
        }
        if(formNormalPosition != null) {
            hq.setParameter("normalPosition", formNormalPosition);
        }        
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
            hq.setParameterList("subdepartments", allowedSubdepartments);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Group group = (Group)tuple[0];
            Client client = (Client)tuple[1];
            Contact contact = (Contact)tuple[2];
            ISOCountry contactResidencialCountry = (ISOCountry)tuple[3];
            ISOCountry contactCountry = (ISOCountry)tuple[4];   
            ISOCountry clientPostalCountry = (ISOCountry)tuple[5];  
            ISOCountry clientLegalCountry = (ISOCountry)tuple[6];  
            Row row = new Row();
            row.setGroup(group);
            row.setClient(client);
            row.setContact(contact);
            row.setContactResidencialCountry(contactResidencialCountry);
            row.setContactCountry(contactCountry);
            row.setClientPostalCountry(clientPostalCountry);
            row.setClientLegalCountry(clientLegalCountry);
            this.rows.add(row);
        }
    }
    public void buildResponsiblePersons() {
        Country country = currentUser.getCountry();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select cc, e from Contact as cc ";
        query += "inner join cc.contactClientLinks as ccl inner join ccl.client as c ";
        query += "inner join cc.employeeContactLinks as ecl ";
        query += "inner join ecl.employee as e ";
        
        query += "left join c.projectCodes as pc ";
        query += "left join pc.activity as a ";
        query += "left join a.subdepartment as s ";
        query += "left join s.department as d ";
        query += "left join d.office as o ";
            
        query += "where ";
        query += "c.workCountry=:workCountry ";
        if(formOffice != null) {
            query += "and o=:office ";
        }
        if(formDepartment != null) {
            query += "and d=:department ";
        }
        if(formSubdepartment != null) {
            query += "and s=:subdepartment ";
        }
        if(formActivity != null) {
            query += "and a=:activity ";
        }
        if(formNormalPosition != null) {
            query += "and cc.normalPosition=:normalPosition ";
        }
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            query += "and s in :subdepartments ";
        }
        query += "group by ecl ";
        Query hq = hs.createQuery(query);
        hq.setParameter("workCountry", country);
        if(formOffice != null) {
            hq.setParameter("office", formOffice);
        }
        if(formDepartment != null) {
            hq.setParameter("department", formDepartment);
        }
        if(formSubdepartment != null) {
            hq.setParameter("subdepartment", formSubdepartment);
        }
        if(formActivity != null) {
            hq.setParameter("activity", formActivity);
        }
        if(formNormalPosition != null) {
            hq.setParameter("normalPosition", formNormalPosition);
        }        
        if(formOffice != null || formDepartment != null || formSubdepartment != null || formActivity != null) {
            List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
            hq.setParameterList("subdepartments", allowedSubdepartments);
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Contact contact = (Contact)tuple[0];
            Employee employee = (Employee)tuple[1];
            Row row = getRow(contact);
            if(row != null) {
                row.getResponsiblePersons().add(employee);
            }
            if(! responsiblePersons.contains(employee)) {
                responsiblePersons.add(employee);
            }
        }

    }
    public void buildSubdepartmentReport() {
        Set clients = new HashSet<Client>();
        for(Row row : rows) {
            clients.add(row.getClient());
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c, s from Client as c ";      
        query += "inner join c.subdepartmentClientLinks as scl ";
        query += "inner join scl.subdepartment as s ";
        query += "where ";
        query += "c in (:clients) ";
        query += "group by scl ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("clients", clients);       
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            Subdepartment subdepartment = (Subdepartment)tuple[1];
            for(Row row : rows) {
                if(row.getClient().equals(client)) {
                    row.getSubdepartments().add(subdepartment);
                }
            }
            if(! subdepartments.contains(subdepartment)) {
                subdepartments.add(subdepartment);
            }
        }
    }    
    private Row getRow(Contact contact) {
        for(Row row : rows) {
            if(row.getContact().getId().equals(contact.getId())) {
                return row;
            }
        }
        return null;
    }
}
