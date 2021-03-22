/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.SubdepartmentComparator;
import java.util.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Query;
/**
 *
 * @author glazov
 */
public class CRMClientPerDepartmentReport {
    public class Row {
        private Group group;
        private Client client;
        private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        private List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();

        public Row() {
        }

        public Row(Group group, Client client, List<Subdepartment> subdepartments, List<ActivitySector> activitySectors) {
            this.group = group;
            this.client = client;
            this.subdepartments = subdepartments;
            this.activitySectors = activitySectors;
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

        public List<Subdepartment> getSubdepartments() {
            return subdepartments;
        }

        public void setSubdepartments(List<Subdepartment> subdepartments) {
            this.subdepartments = subdepartments;
        }

        public List<ActivitySector> getActivitySectors() {
            return activitySectors;
        }

        public void setActivitySectors(List<ActivitySector> activitySectors) {
            this.activitySectors = activitySectors;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
    private Date createdAt = null;
    public CRMClientPerDepartmentReport() {
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<ActivitySector> getActivitySectors() {
        return activitySectors;
    }

    public void setActivitySectors(List<ActivitySector> activitySectors) {
        this.activitySectors = activitySectors;
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

    public void build() {
        buildReport();
        buildActivitySectorsReport();
        this.subdepartments = Subdepartment.getAll();
        this.activitySectors = ActivitySector.getAll();
        Collections.sort(subdepartments, new SubdepartmentComparator(SubdepartmentComparator.Type.OFFICE_DEPARTMENT_SUBDEPARTMENT));
        this.createdAt = new Date();
    }
    private void buildReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select g, c from Client as c left join c.group as g ";
        query += "order by g.name, c.name";

        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Group group = (Group)tuple[0];
            Client client = (Client)tuple[1];
            List<Subdepartment> subdeprtments = new LinkedList<Subdepartment>();
            List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
            if(client != null) {
                for(ProjectCode projectCode : client.getProjectCodes()) {
                    subdeprtments.add(projectCode.getSubdepartment());
                }
            }
            Row row = new Row(group, client, subdeprtments, activitySectors);
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
            for(Row row : rows) {
                if(row.getClient() != null && row.getClient().getId().equals(client.getId())) {
                    row.getActivitySectors().add(activitySector);
                    break;
                }
            }
        }    
    }
}
