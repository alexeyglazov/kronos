/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class CRMClientReport {
    public class Row {
        private Group group;
        private ISOCountry groupCountry;
        private ISOCountry groupListingCountry;
        private Client client;
        private List<Subdepartment> clientSubdepartments = new LinkedList<Subdepartment>();
        private ISOCountry clientCountry;
        private ISOCountry clientLegalCountry;
        private ISOCountry clientPostalCountry;
        private List<ActivitySector> clientActivitySectors = new LinkedList<ActivitySector>();
        private ISOCountry clientListingCountry;
        public Row() {
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public ISOCountry getGroupCountry() {
            return groupCountry;
        }

        public void setGroupCountry(ISOCountry groupCountry) {
            this.groupCountry = groupCountry;
        }

        public ISOCountry getGroupListingCountry() {
            return groupListingCountry;
        }

        public void setGroupListingCountry(ISOCountry groupListingCountry) {
            this.groupListingCountry = groupListingCountry;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public List<Subdepartment> getClientSubdepartments() {
            return clientSubdepartments;
        }

        public void setClientSubdepartments(List<Subdepartment> clientSubdepartments) {
            this.clientSubdepartments = clientSubdepartments;
        }

        public ISOCountry getClientCountry() {
            return clientCountry;
        }

        public void setClientCountry(ISOCountry clientCountry) {
            this.clientCountry = clientCountry;
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

        public List<ActivitySector> getClientActivitySectors() {
            return clientActivitySectors;
        }

        public void setClientActivitySectors(List<ActivitySector> clientActivitySectors) {
            this.clientActivitySectors = clientActivitySectors;
        }

        public ISOCountry getClientListingCountry() {
            return clientListingCountry;
        }

        public void setClientListingCountry(ISOCountry clientListingCountry) {
            this.clientListingCountry = clientListingCountry;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
     private List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
    private Date createdAt = null;
    public CRMClientReport() {
    }
    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<ActivitySector> getActivitySectors() {
        return activitySectors;
    }

    public void setActivitySectors(List<ActivitySector> activitySectors) {
        this.activitySectors = activitySectors;
    }

    public void build() {
        buildReport();
        buildActivitySectorsReport();
        buildSubdepartmentReport();
        this.activitySectors = ActivitySector.getAll();
        this.createdAt = new Date();
    }
    public void buildReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select g, gc, glc, c, cc, clc, cpc, clistc ";
        query += "from Client as c left join c.group as g ";
        query += "left join g.country as gc ";
        query += "left join g.listingCountry as glc ";
        query += "left join c.country as cc ";
        query += "left join c.legalCountry as clc ";
        query += "left join c.postalCountry as cpc ";
        query += "left join c.listingCountry as clistc ";
        query += "group by c ";
        query += "order by g.name, c.name";

        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Group group = (Group)tuple[0];
            ISOCountry groupCountry = (ISOCountry)tuple[1];
            ISOCountry groupListingCountry = (ISOCountry)tuple[2];      
            Client client = (Client)tuple[3];
            ISOCountry clientCountry = (ISOCountry)tuple[4];
            ISOCountry clientLegalCountry = (ISOCountry)tuple[5]; 
            ISOCountry clientPostalCountry = (ISOCountry)tuple[6];
            ISOCountry clientListingCountry = (ISOCountry)tuple[7]; 
            Row row = new Row();
            row.setGroup(group);
            row.setGroupCountry(groupCountry);
            row.setGroupListingCountry(groupListingCountry);
            row.setClient(client);
            row.setClientCountry(clientCountry);
            row.setClientLegalCountry(clientLegalCountry);
            row.setClientPostalCountry(clientPostalCountry);
            row.setClientListingCountry(clientListingCountry);
            this.rows.add(row);
        }
    }
    private void buildActivitySectorsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c, asec from Client as c inner join c.clientActivitySectorLinks as casl inner join casl.activitySector as asec ";
        query += "group by casl ";
        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            ActivitySector activitySector = (ActivitySector)tuple[1];
            Row row = getRow(client);
            row.getClientActivitySectors().add(activitySector);
        }    
    }    
    public void buildSubdepartmentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select c, s ";
        query += "from Client as c ";
        query += "inner join c.subdepartmentClientLinks as scl ";
        query += "inner join scl.subdepartment as s ";

        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {     
            Client client = (Client)tuple[0];
            Subdepartment subdepartment = (Subdepartment)tuple[1];
            Row row = getRow(client);
            row.setClient(client);
            row.getClientSubdepartments().add(subdepartment);
        }
    }    
    private Row getRow(Client client) {
        for(Row row : rows) {
            if(row.getClient().getId().equals(client.getId())) {
                return row;
            }
        }
        return null;
    }
}
