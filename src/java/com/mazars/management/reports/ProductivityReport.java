/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.EmployeePositionHistoryItem;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.Position;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.StandardCost;
import com.mazars.management.db.domain.StandardCostGroup;
import com.mazars.management.db.domain.StandardPosition;
import com.mazars.management.db.domain.StandardSellingRate;
import com.mazars.management.db.domain.StandardSellingRateGroup;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.Task;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.ProductivityReportForm;
import java.math.BigDecimal;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ProductivityReport {
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            String groupName1 = "NO GROUP";
            if(o1.getGroupName() != null) {
                groupName1 = o1.getGroupName();
            }
            String groupName2 = "NO GROUP";
            if(o2.getGroupName() != null) {
                groupName2 = o2.getGroupName();
            }
            int result = groupName1.compareTo(groupName2);
            if(result != 0) {
                return result;
            }
            result = o1.getProjectCodeCode().compareTo(o2.getProjectCodeCode());
            return result;
        }
    }
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private Boolean projectCodeIsClosed;
        private Date projectCodeCreatedAt;
        private Date projectCodeClosedAt;
        
        private Long groupId;
        private String groupName;
        private Long clientId;
        private String clientName;
        
        private FeesItem.Type feesItemType;
        private BigDecimal feesValue;
        private Long feesCurrencyId;
        private String feesCurrencyCode;
        private Long timeSpent;
        
        public Row() {
        }

        public Date getProjectCodeCreatedAt() {
            return projectCodeCreatedAt;
        }

        public void setProjectCodeCreatedAt(Date projectCodeCreatedAt) {
            this.projectCodeCreatedAt = projectCodeCreatedAt;
        }

        public Date getProjectCodeClosedAt() {
            return projectCodeClosedAt;
        }

        public void setProjectCodeClosedAt(Date projectCodeClosedAt) {
            this.projectCodeClosedAt = projectCodeClosedAt;
        }

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

        public Boolean getProjectCodeIsClosed() {
            return projectCodeIsClosed;
        }

        public void setProjectCodeIsClosed(Boolean projectCodeIsClosed) {
            this.projectCodeIsClosed = projectCodeIsClosed;
        }

        public Long getGroupId() {
            return groupId;
        }

        public void setGroupId(Long groupId) {
            this.groupId = groupId;
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public Type getFeesItemType() {
            return feesItemType;
        }

        public void setFeesItemType(Type feesItemType) {
            this.feesItemType = feesItemType;
        }

        public BigDecimal getFeesValue() {
            return feesValue;
        }

        public void setFeesValue(BigDecimal feesValue) {
            this.feesValue = feesValue;
        }

        public Long getFeesCurrencyId() {
            return feesCurrencyId;
        }

        public void setFeesCurrencyId(Long feesCurrencyId) {
            this.feesCurrencyId = feesCurrencyId;
        }

        public String getFeesCurrencyCode() {
            return feesCurrencyCode;
        }

        public void setFeesCurrencyCode(String feesCurrencyCode) {
            this.feesCurrencyCode = feesCurrencyCode;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<Currency> currencies = new LinkedList<Currency>();
    private ProductivityReportForm form;
    
    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;

    private Calendar startDate;
    private Calendar endDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private Date createdAt;

    public ProductivityReport(ProductivityReportForm form, Module module, Employee currentUser) {
        this.form = form;
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
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        Country country = currentUser.getCountry();
        if(this.formSubdepartment != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile()) && formSubdepartment.getDepartment().getOffice().getCountry().equals(country)) {
                subdepartments.add(this.formSubdepartment);
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile()) && RightsItem.isAvailable(formSubdepartment, currentUser, module)) {
                subdepartments.add(this.formSubdepartment);
            }
        } else if(this.formDepartment != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile()) && formDepartment.getOffice().getCountry().equals(country)) {
                subdepartments.addAll(this.formDepartment.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, formDepartment) );
            }        
        } else if(this.formOffice != null) {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile()) && formOffice.getCountry().equals(country)) {
                subdepartments.addAll(this.formOffice.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module, formOffice) );
            }        
        } else  {
            if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(currentUser.getProfile())) {
                subdepartments.addAll(country.getSubdepartments());
            } else if(Employee.Profile.SUPER_USER.equals(currentUser.getProfile())) {
                subdepartments.addAll(RightsItem.getSubdepartments(currentUser, module));
            }
        }
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();

        currencies = CountryCurrency.getCurrencies(country);
    }

    public ProductivityReportForm getForm() {
        return form;
    }

    public void setForm(ProductivityReportForm form) {
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

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }


    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }


    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public void build() {
        buildProjectCodesReport();
        buildTimeSpentReport();
        buildBudgetReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    private void buildProjectCodesReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, c, g from ";
        query += "ProjectCode as pc inner join pc.subdepartment as s inner join pc.client as c left join c.group as g ";
        query += "where ";
        query += "((pc.startDate>=:startDate1 and pc.startDate<=:endDate1) or (pc.endDate>=:startDate2 and pc.endDate<=:endDate2) or (pc.startDate<=:startDate3 and pc.endDate>=:endDate3)) ";
        query += "and s in (:subdepartments) ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate1", startDate);
        hq.setParameter("endDate1", endDate);
        hq.setParameter("startDate2", startDate);
        hq.setParameter("endDate2", endDate);
        hq.setParameter("startDate3", startDate);
        hq.setParameter("endDate3", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Group group = (Group)tuple[2];
            Row row = new Row();
            row.setProjectCodeId(projectCode.getId());
            row.setProjectCodeCode(projectCode.getCode());
            row.setProjectCodeIsClosed(projectCode.getIsClosed());
            row.setProjectCodeCreatedAt(projectCode.getCreatedAt());
            row.setProjectCodeClosedAt(projectCode.getClosedAt());
            row.setClientId(client.getId());
            row.setClientName(client.getName());
            if(group != null) {
                row.setGroupId(group.getId());
                row.setGroupName(group.getName());
            }
            rows.add(row);
        }
    }
    private void buildTimeSpentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, sum(tsi.timeSpent) from ";
        query += "ProjectCode as pc inner join pc.subdepartment as s inner join pc.timeSpentItems as tsi ";
        query += "where ";
        query += "((pc.startDate>=:startDate1 and pc.startDate<=:endDate1) or (pc.endDate>=:startDate2 and pc.endDate<=:endDate2) or (pc.startDate<=:startDate3 and pc.endDate>=:endDate3)) ";
        query += "and s in (:subdepartments) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate1", startDate);
        hq.setParameter("endDate1", endDate);
        hq.setParameter("startDate2", startDate);
        hq.setParameter("endDate2", endDate);
        hq.setParameter("startDate3", startDate);
        hq.setParameter("endDate3", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Long timeSpent = (Long)tuple[1];
            Row row = getRow(projectCode.getId());
            if(row != null) {
                row.setTimeSpent(timeSpent);
            }
        }
    }
    private void buildBudgetReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, fi, sum(fa.amount) from ";
        query += "FeesItem as fi inner join fi.projectCode as pc inner join pc.subdepartment as s left join fi.feesAdvances as fa ";
        query += "where ";
        query += "((pc.startDate>=:startDate1 and pc.startDate<=:endDate1) or (pc.endDate>=:startDate2 and pc.endDate<=:endDate2) or (pc.startDate<=:startDate3 and pc.endDate>=:endDate3)) ";
        query += "and s in (:subdepartments) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameter("startDate1", startDate);
        hq.setParameter("endDate1", endDate);
        hq.setParameter("startDate2", startDate);
        hq.setParameter("endDate2", endDate);
        hq.setParameter("startDate3", startDate);
        hq.setParameter("endDate3", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal feesAmount = (BigDecimal)tuple[2];
            Row row = getRow(projectCode.getId());
            if(row != null) {
                if(feesItem != null) {
                    row.setFeesItemType(feesItem.getType());
                    if(FeesItem.Type.QUOTATION.equals(feesItem.getType())) {
                        row.setFeesValue(feesItem.getQuotationNegociated());
                    } else {
                        row.setFeesValue(feesAmount);
                    }
                    if(feesItem.getFeesAdvanceCurrency() != null) {
                        row.setFeesCurrencyId(feesItem.getFeesAdvanceCurrency().getId());
                        row.setFeesCurrencyCode(feesItem.getFeesAdvanceCurrency().getCode());
                    }
                }
            }
        }        
    }

    private Row getRow(Long projectCodeId) {
        for(Row row : rows) {
            if(row.getProjectCodeId().equals(projectCodeId)) {
                return row;
            }
        }
        return null;
    }
}
