/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.reports;

import com.mazars.management.db.comparators.CurrencyComparator;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.ProjectCodeListUtil;
import com.mazars.management.web.forms.InvoicingReportForm;
import com.mazars.management.web.forms.ProjectCodeListLimiter;
import com.mazars.management.web.forms.ProjectCodeListSorter;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class InvoicingReport {
    public enum Signed {
        YES,
        NO,
        MIXED
    }
    public class Row {
        private Office office;
        private Department department;
        private Subdepartment subdepartment;
        private Group group;
        private Client client;
        private ProjectCode projectCode;
        private Calendar lastFillingDay;
        private Long timeSpent;
        private FeesItem feesItem;
        private OutOfPocketItem outOfPocketItem;
        private BigDecimal feesAdvanceTotalAmount;
        private BigDecimal feesInvoiceTotalAmount;
        private BigDecimal feesInvoiceTotalVatIncludedAmount;
        private BigDecimal feesPaymentTotalAmount;
        private BigDecimal feesPaymentTotalCvAmount;
        private BigDecimal feesActTotalAmount;
        private BigDecimal feesActTotalCvAmount;
        private Signed feesActIsSigned;
        private BigDecimal outOfPocketInvoiceTotalAmount;
        private BigDecimal outOfPocketInvoiceTotalVatIncludedAmount;
        private BigDecimal outOfPocketPaymentTotalAmount;
        private BigDecimal outOfPocketPaymentTotalCvAmount;
        private BigDecimal outOfPocketActTotalAmount;
        private BigDecimal outOfPocketActTotalCvAmount;
        private Signed outOfPocketActIsSigned;
        
        public Office getOffice() {
            return office;
        }

        public void setOffice(Office office) {
            this.office = office;
        }

        public Department getDepartment() {
            return department;
        }

        public void setDepartment(Department department) {
            this.department = department;
        }

        public Subdepartment getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(Subdepartment subdepartment) {
            this.subdepartment = subdepartment;
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

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public Calendar getLastFillingDay() {
            return lastFillingDay;
        }

        public void setLastFillingDay(Calendar lastFillingDay) {
            this.lastFillingDay = lastFillingDay;
        }

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public FeesItem getFeesItem() {
            return feesItem;
        }

        public void setFeesItem(FeesItem feesItem) {
            this.feesItem = feesItem;
        }

        public OutOfPocketItem getOutOfPocketItem() {
            return outOfPocketItem;
        }

        public void setOutOfPocketItem(OutOfPocketItem outOfPocketItem) {
            this.outOfPocketItem = outOfPocketItem;
        }

        public BigDecimal getFeesAdvanceTotalAmount() {
            return feesAdvanceTotalAmount;
        }

        public void setFeesAdvanceTotalAmount(BigDecimal feesAdvanceTotalAmount) {
            this.feesAdvanceTotalAmount = feesAdvanceTotalAmount;
        }

        public BigDecimal getFeesInvoiceTotalAmount() {
            return feesInvoiceTotalAmount;
        }

        public void setFeesInvoiceTotalAmount(BigDecimal feesInvoiceTotalAmount) {
            this.feesInvoiceTotalAmount = feesInvoiceTotalAmount;
        }

        public BigDecimal getFeesPaymentTotalAmount() {
            return feesPaymentTotalAmount;
        }

        public void setFeesPaymentTotalAmount(BigDecimal feesPaymentTotalAmount) {
            this.feesPaymentTotalAmount = feesPaymentTotalAmount;
        }

        public BigDecimal getOutOfPocketInvoiceTotalAmount() {
            return outOfPocketInvoiceTotalAmount;
        }

        public void setOutOfPocketInvoiceTotalAmount(BigDecimal outOfPocketInvoiceTotalAmount) {
            this.outOfPocketInvoiceTotalAmount = outOfPocketInvoiceTotalAmount;
        }

        public BigDecimal getOutOfPocketPaymentTotalAmount() {
            return outOfPocketPaymentTotalAmount;
        }

        public void setOutOfPocketPaymentTotalAmount(BigDecimal outOfPocketPaymentTotalAmount) {
            this.outOfPocketPaymentTotalAmount = outOfPocketPaymentTotalAmount;
        }

        public BigDecimal getFeesPaymentTotalCvAmount() {
            return feesPaymentTotalCvAmount;
        }

        public void setFeesPaymentTotalCvAmount(BigDecimal feesPaymentTotalCvAmount) {
            this.feesPaymentTotalCvAmount = feesPaymentTotalCvAmount;
        }

        public BigDecimal getFeesActTotalAmount() {
            return feesActTotalAmount;
        }

        public void setFeesActTotalAmount(BigDecimal feesActTotalAmount) {
            this.feesActTotalAmount = feesActTotalAmount;
        }

        public BigDecimal getFeesActTotalCvAmount() {
            return feesActTotalCvAmount;
        }

        public void setFeesActTotalCvAmount(BigDecimal feesActTotalCvAmount) {
            this.feesActTotalCvAmount = feesActTotalCvAmount;
        }

        public Signed getFeesActIsSigned() {
            return feesActIsSigned;
        }

        public void setFeesActIsSigned(Signed feesActIsSigned) {
            this.feesActIsSigned = feesActIsSigned;
        }

        public BigDecimal getOutOfPocketPaymentTotalCvAmount() {
            return outOfPocketPaymentTotalCvAmount;
        }

        public void setOutOfPocketPaymentTotalCvAmount(BigDecimal outOfPocketPaymentTotalCvAmount) {
            this.outOfPocketPaymentTotalCvAmount = outOfPocketPaymentTotalCvAmount;
        }

        public BigDecimal getOutOfPocketActTotalAmount() {
            return outOfPocketActTotalAmount;
        }

        public void setOutOfPocketActTotalAmount(BigDecimal outOfPocketActTotalAmount) {
            this.outOfPocketActTotalAmount = outOfPocketActTotalAmount;
        }

        public BigDecimal getOutOfPocketActTotalCvAmount() {
            return outOfPocketActTotalCvAmount;
        }

        public void setOutOfPocketActTotalCvAmount(BigDecimal outOfPocketActTotalCvAmount) {
            this.outOfPocketActTotalCvAmount = outOfPocketActTotalCvAmount;
        }

        public Signed getOutOfPocketActIsSigned() {
            return outOfPocketActIsSigned;
        }

        public void setOutOfPocketActIsSigned(Signed outOfPocketActIsSigned) {
            this.outOfPocketActIsSigned = outOfPocketActIsSigned;
        }

        public BigDecimal getFeesInvoiceTotalVatIncludedAmount() {
            return feesInvoiceTotalVatIncludedAmount;
        }

        public void setFeesInvoiceTotalVatIncludedAmount(BigDecimal feesInvoiceTotalVatIncludedAmount) {
            this.feesInvoiceTotalVatIncludedAmount = feesInvoiceTotalVatIncludedAmount;
        }

        public BigDecimal getOutOfPocketInvoiceTotalVatIncludedAmount() {
            return outOfPocketInvoiceTotalVatIncludedAmount;
        }

        public void setOutOfPocketInvoiceTotalVatIncludedAmount(BigDecimal outOfPocketInvoiceTotalVatIncludedAmount) {
            this.outOfPocketInvoiceTotalVatIncludedAmount = outOfPocketInvoiceTotalVatIncludedAmount;
        }

    }
    private List<Row> rows = new LinkedList<Row>();
    private Employee currentUser;
    private Module module;
    private InvoicingReportForm form;
    List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    private Date createdAt;

    private List<Currency> currencies = new LinkedList<Currency>();
    private Currency mainCurrency;

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
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

    public InvoicingReportForm getForm() {
        return form;
    }

    public void setForm(InvoicingReportForm form) {
        this.form = form;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
    }

    public Currency getMainCurrency() {
        return mainCurrency;
    }

    public void setMainCurrency(Currency mainCurrency) {
        this.mainCurrency = mainCurrency;
    }

    public InvoicingReport (InvoicingReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        
        Country country = currentUser.getCountry();
        currencies.addAll(CountryCurrency.getCurrencies(country));
        Collections.sort(currencies, new CurrencyComparator());
        mainCurrency = CountryCurrency.getMainCurrency(country);
    }
    public void build() {
        buildProjectCodeList();
        if(! this.projectCodes.isEmpty()) {
            prepareRows();
            buildTimeSpentReport();
            buildFeesItemAndOutOfPocketItemReport();
            buildFeesAdvanceAmountsReport();
            buildFeesInvoiceAmountsReport();
            buildFeesPaymentAmountsReport();
            buildFeesActAmountsReport();
            buildOutOfPocketInvoiceAmountsReport();
            buildOutOfPocketPaymentAmountsReport();
            buildOutOfPocketActAmountsReport();
            buildFeesActSignedReport();
            buildOutOfPocketActSignedReport();
        }
        this.createdAt = new Date();
    }
    private void buildProjectCodeList() {
        ProjectCodeListSorter sorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter limiter = new ProjectCodeListLimiter();
        List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        this.projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(this.form.getFilter(), this.form.getInvoiceRequestsFilter(), sorter, limiter, allowedSubdepartments);
    }
    private void prepareRows() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, c, g, s, d, o from ProjectCode as pc ";
        query += "inner join pc.client as c ";
        query += "left join c.group as g ";
        query += "inner join pc.subdepartment as s ";
        query += "inner join s.department as d ";
        query += "inner join d.office as o ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";
      
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Group group = (Group)tuple[2];
            Subdepartment subdepartment = (Subdepartment)tuple[3];
            Department department = (Department)tuple[4];
            Office office = (Office)tuple[5];
            Row row = new Row();
            row.setProjectCode(projectCode);
            row.setClient(client);
            row.setGroup(group);
            row.setSubdepartment(subdepartment);
            row.setDepartment(department);
            row.setOffice(office);
            this.rows.add(row);
        }
    }
    private void buildTimeSpentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(tsi.timeSpent), max(tsi.day) from ProjectCode as pc inner join pc.timeSpentItems as tsi ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Long timeSpent = (Long)tuple[1];
            Calendar lastFillingDay = (Calendar)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setLastFillingDay(lastFillingDay);
                row.setTimeSpent(timeSpent);
            }
        }
    }
    private void buildFeesItemAndOutOfPocketItemReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, fit, oopit from ProjectCode as pc left join pc.feesItem as fit left join pc.outOfPocketItem as oopit ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            OutOfPocketItem outOfPocketItem = (OutOfPocketItem)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesItem(feesItem);
                row.setOutOfPocketItem(outOfPocketItem);
            }
        }
    }
    private void buildFeesAdvanceAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(fa.amount) from ProjectCode as pc inner join pc.feesItem as fit inner join fit.feesAdvances as fa ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal feesAdvanceTotalAmount = (BigDecimal)tuple[1];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesAdvanceTotalAmount(feesAdvanceTotalAmount);
            }
        }
    }
    private void buildFeesInvoiceAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(fi.amount), sum(fi.vatIncludedAmount) from ProjectCode as pc inner join pc.feesItem as fit inner join fit.feesInvoices as fi ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal feesInvoiceTotalAmount = (BigDecimal)tuple[1];
            BigDecimal feesInvoiceTotalVatIncludedAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesInvoiceTotalAmount(feesInvoiceTotalAmount);
                row.setFeesInvoiceTotalVatIncludedAmount(feesInvoiceTotalVatIncludedAmount);
            }
        }
    }
    private void buildFeesPaymentAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(fp.amount), sum(fp.cvAmount) from ProjectCode as pc inner join pc.feesItem as fit left join fit.feesPayments as fp ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal feesPaymentTotalAmount = (BigDecimal)tuple[1];
            BigDecimal feesPaymentTotalCvAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesPaymentTotalAmount(feesPaymentTotalAmount);
                row.setFeesPaymentTotalCvAmount(feesPaymentTotalCvAmount);
            }
        }
    }
    private void buildFeesActAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(fa.amount), sum(fa.cvAmount) from ProjectCode as pc inner join pc.feesItem as fit inner join fit.feesActs as fa ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal feesActTotalAmount = (BigDecimal)tuple[1];
            BigDecimal feesActTotalCvAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesActTotalAmount(feesActTotalAmount);
                row.setFeesActTotalCvAmount(feesActTotalCvAmount);
            }
        }
    }
    private void buildOutOfPocketInvoiceAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(oopi.amount), sum(oopi.vatIncludedAmount) from ProjectCode as pc inner join pc.outOfPocketItem as oopit inner join oopit.outOfPocketInvoices as oopi ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal outOfPocketInvoiceTotalAmount = (BigDecimal)tuple[1];
            BigDecimal outOfPocketInvoiceTotalVatIncludedAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setOutOfPocketInvoiceTotalAmount(outOfPocketInvoiceTotalAmount);
                row.setOutOfPocketInvoiceTotalVatIncludedAmount(outOfPocketInvoiceTotalVatIncludedAmount);
            }
        }
    }
    private void buildOutOfPocketPaymentAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(oopp.amount), sum(oopp.cvAmount) from ProjectCode as pc inner join pc.outOfPocketItem as oopit inner join oopit.outOfPocketPayments as oopp ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal outOfPocketPaymentTotalAmount = (BigDecimal)tuple[1];
            BigDecimal outOfPocketPaymentTotalCvAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setOutOfPocketPaymentTotalAmount(outOfPocketPaymentTotalAmount);
                row.setOutOfPocketPaymentTotalCvAmount(outOfPocketPaymentTotalCvAmount);
            }
        }
    }
    private void buildOutOfPocketActAmountsReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, sum(oopa.amount), sum(oopa.cvAmount) from ProjectCode as pc inner join pc.outOfPocketItem as oopit inner join oopit.outOfPocketActs as oopa ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            BigDecimal outOfPocketActTotalAmount = (BigDecimal)tuple[1];
            BigDecimal outOfPocketActTotalCvAmount = (BigDecimal)tuple[2];

            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setOutOfPocketActTotalAmount(outOfPocketActTotalAmount);
                row.setOutOfPocketActTotalCvAmount(outOfPocketActTotalCvAmount);
            }
        }
    }
    private void buildFeesActSignedReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, fact.isSigned from ProjectCode as pc inner join pc.feesItem as fit inner join fit.feesActs as fact ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        Map<ProjectCode, Signed> signedItems = new HashMap<ProjectCode, Signed>();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Boolean isSigned = (Boolean)tuple[1];
            if(isSigned == null) {
                isSigned = Boolean.FALSE;
            }
            Signed signedItem = signedItems.get(projectCode);
            if(signedItem == null) {
                if(isSigned) {
                    signedItems.put(projectCode, Signed.YES);
                } else {
                    signedItems.put(projectCode, Signed.NO);
                }
            } else {
                if((Signed.YES.equals(signedItem) && ! isSigned) || (Signed.NO.equals(signedItem) && isSigned)) {
                    signedItems.put(projectCode, Signed.MIXED);
                }
            }
        }
        for(ProjectCode projectCode : signedItems.keySet()) {
            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setFeesActIsSigned(signedItems.get(projectCode));
            }
        }
    }
    private void buildOutOfPocketActSignedReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, oopact.isSigned from ProjectCode as pc inner join pc.outOfPocketItem as oopit inner join oopit.outOfPocketActs as oopact ";
        query += "where pc in (:projectCodes) ";
        query += "group by pc ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        Map<ProjectCode, Signed> signedItems = new HashMap<ProjectCode, Signed>();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Boolean isSigned = (Boolean)tuple[1];
            if(isSigned == null) {
                isSigned = Boolean.FALSE;
            }
            Signed signedItem = signedItems.get(projectCode);
            if(signedItem == null) {
                if(isSigned) {
                    signedItems.put(projectCode, Signed.YES);
                } else {
                    signedItems.put(projectCode, Signed.NO);
                }
            } else {
                if((Signed.YES.equals(signedItem) && ! isSigned) || (Signed.NO.equals(signedItem) && isSigned)) {
                    signedItems.put(projectCode, Signed.MIXED);
                }
            }
        }
        for(ProjectCode projectCode : signedItems.keySet()) {
            Row row = getRowByProjectCode(projectCode);
            if(row != null) {
                row.setOutOfPocketActIsSigned(signedItems.get(projectCode));
            }
        }
    }
    private Row getRowByProjectCode(ProjectCode projectCode) {
        for(Row row : this.rows) {
            if(row.getProjectCode().getId().equals(projectCode.getId())) {
                return row;
            }
        }
        return null;
    }
}
