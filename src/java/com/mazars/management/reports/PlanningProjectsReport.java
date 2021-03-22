/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.service.ConfigUtils;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class PlanningProjectsReport {
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private String projectCodeComment;
        private Boolean projectCodeIsClosed;
        private Calendar projectCodeStartDate;
        private Calendar projectCodeEndDate;
        private String clientName;
        private String countryCode;

        public Long getProjectCodeId() {
            return projectCodeId;
        }

        public void setProjectCodeId(Long projectCodeId) {
            this.projectCodeId = projectCodeId;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public String getProjectCodeComment() {
            return projectCodeComment;
        }

        public void setProjectCodeComment(String projectCodeComment) {
            this.projectCodeComment = projectCodeComment;
        }

        public Boolean getProjectCodeIsClosed() {
            return projectCodeIsClosed;
        }

        public void setProjectCodeIsClosed(Boolean projectCodeIsClosed) {
            this.projectCodeIsClosed = projectCodeIsClosed;
        }

        public Calendar getProjectCodeStartDate() {
            return projectCodeStartDate;
        }

        public void setProjectCodeStartDate(Calendar projectCodeStartDate) {
            this.projectCodeStartDate = projectCodeStartDate;
        }

        public Calendar getProjectCodeEndDate() {
            return projectCodeEndDate;
        }

        public void setProjectCodeEndDate(Calendar projectCodeEndDate) {
            this.projectCodeEndDate = projectCodeEndDate;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }
    }
    
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
      
    public PlanningProjectsReport () {
        
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void build() {
        buildReport();
        this.createdAt = new Date();
    }
    public void buildReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        
        
        String query = "";
        query += "select pc, c from ProjectCode as pc inner join pc.client as c ";

        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Row row = new Row();
            row.setProjectCodeId(projectCode.getId());
            row.setProjectCodeCode(projectCode.getCode());
            row.setProjectCodeComment(projectCode.getComment());
            row.setProjectCodeIsClosed(projectCode.getIsClosed());
            row.setProjectCodeStartDate(projectCode.getStartDate());
            row.setProjectCodeEndDate(projectCode.getEndDate());
            row.setClientName(client.getName());
            row.setCountryCode((String)ConfigUtils.getProperties().get("retain.country"));
            this.rows.add(row);
        }
    }

}
