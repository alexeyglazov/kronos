/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import java.util.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.service.ConfigUtils;
import org.hibernate.Session;
import org.hibernate.Query;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class PlanningUsersReport {
    public class Row {
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private String employeeFullName;
        private String positionName;
        private String departmentName;
        private String officeName;
        private Boolean employeeIsActive;
        private Calendar careerStartDate;
        private Calendar careerEndDate;
        private String countryCode;
        private String employeeEmail;

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public String getEmployeeFirstName() {
            return employeeFirstName;
        }

        public void setEmployeeFirstName(String employeeFirstName) {
            this.employeeFirstName = employeeFirstName;
        }

        public String getEmployeeLastName() {
            return employeeLastName;
        }

        public void setEmployeeLastName(String employeeLastName) {
            this.employeeLastName = employeeLastName;
        }

        public String getEmployeeFullName() {
            return employeeFullName;
        }

        public void setEmployeeFullName(String employeeFullName) {
            this.employeeFullName = employeeFullName;
        }

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public String getOfficeName() {
            return officeName;
        }

        public void setOfficeName(String officeName) {
            this.officeName = officeName;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
        }

        public Boolean getEmployeeIsActive() {
            return employeeIsActive;
        }

        public void setEmployeeIsActive(Boolean employeeIsActive) {
            this.employeeIsActive = employeeIsActive;
        }

        public Calendar getCareerStartDate() {
            return careerStartDate;
        }

        public void setCareerStartDate(Calendar careerStartDate) {
            this.careerStartDate = careerStartDate;
        }

        public Calendar getCareerEndDate() {
            return careerEndDate;
        }

        public void setCareerEndDate(Calendar careerEndDate) {
            this.careerEndDate = careerEndDate;
        }

        public String getCountryCode() {
            return countryCode;
        }

        public void setCountryCode(String countryCode) {
            this.countryCode = countryCode;
        }

        public String getEmployeeEmail() {
            return employeeEmail;
        }

        public void setEmployeeEmail(String employeeEmail) {
            this.employeeEmail = employeeEmail;
        }
    }
    
    private List<Row> rows = new LinkedList<Row>();
    private Date createdAt;
      
    public PlanningUsersReport () {
        
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
        buildCareerReport();
        buildOpenCareerReport();
        this.createdAt = new Date();
    }
    public void buildReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        
        
        String query = "";
        query += "select e, p, d, o, c from Employee as e inner join e.position as p inner join p.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";

        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Position position = (Position)tuple[1];
            Department department = (Department)tuple[2];
            Office office = (Office)tuple[3];
            Country country = (Country)tuple[4];
            if(Boolean.TRUE.equals(employee.getIsAdministrator()) || "user".equals(employee.getUserName())) {
                continue;
            }
            Row row = new Row();
            row.setEmployeeId(employee.getId());
            row.setEmployeeUserName(employee.getUserName());
            row.setEmployeeFirstName(employee.getFirstName());
            row.setEmployeeLastName(employee.getLastName());
            row.setEmployeeFullName(employee.getFullName());
            row.setEmployeeIsActive(employee.getIsActive());
            row.setPositionName(position.getName());
            row.setDepartmentName(department.getName());
            row.setOfficeName(office.getName());
            row.setCountryCode((String)ConfigUtils.getProperties().get("retain.country"));
            row.setEmployeeEmail(employee.getEmail());
            this.rows.add(row);
        }
    }
     public void buildCareerReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e, min(ephi.start), max(ephi.end) from Employee as e inner join e.employeePositionHistoryItems as ephi ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            Calendar start = (Calendar)tuple[1];
            Calendar end = (Calendar)tuple[2];
            Row row = getRow(employee.getId());
            if(row != null) {
                row.setCareerStartDate(start);
                row.setCareerEndDate(end);
            }
        }
    }
    public void buildOpenCareerReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select e from Employee as e inner join e.employeePositionHistoryItems as ephi ";
        query += "where ephi.end=null ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        List<Employee> selection = (List<Employee>)hq.list();
        for(Employee employee : selection) {
            Row row = getRow(employee.getId());
            if(row != null) {
                row.setCareerEndDate(null);
            }
        }
    }
    private Row getRow(Long employeeId) {
        for(Row row : rows) {
            if(row.getEmployeeId().equals(employeeId)) {
                return row;
            }
        }
        return null;
    }
}
