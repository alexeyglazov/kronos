/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.reports;

import com.mazars.management.db.comparators.CurrencyComparator;
import com.mazars.management.db.domain.ActRequest;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.ProjectCodeListUtil;
import com.mazars.management.web.forms.InvoiceRequestsFilter;
import com.mazars.management.web.forms.ProjectCodeListFilter;
import com.mazars.management.web.forms.ProjectCodeListLimiter;
import com.mazars.management.web.forms.ProjectCodeListSorter;
import java.math.BigDecimal;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import org.hibernate.Query;
import org.hibernate.Session;

/**
 *
 * @author glazov
 */
public class InvoiceDocumentReport {
    public enum Type {
        INVOICE,
        ACT,
        TAX_INVOICE
    }
    public class Row {       
        private Client client;
        private ProjectCode projectCode;
        private InvoiceRequestPacket invoiceRequestPacket;
        private Type type;
        private InvoiceRequest invoiceRequest;
        private BigDecimal invoiceRequestTotalAmount;
        private Currency invoiceInvoiceCurrency;
        private Currency invoicePaymentCurrency;
        private String invoiceComment;
        private ActRequest actRequest;
        private BigDecimal actRequestTotalAmount;
        private Currency actInvoiceCurrency;
        private Currency actPaymentCurrency;
        private String actComment;
        private TaxInvoiceRequest taxInvoiceRequest;
        private Date time;
        
        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public InvoiceRequestPacket getInvoiceRequestPacket() {
            return invoiceRequestPacket;
        }

        public void setInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
            this.invoiceRequestPacket = invoiceRequestPacket;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public ActRequest getActRequest() {
            return actRequest;
        }

        public void setActRequest(ActRequest actRequest) {
            this.actRequest = actRequest;
        }

        public BigDecimal getActRequestTotalAmount() {
            return actRequestTotalAmount;
        }

        public void setActRequestTotalAmount(BigDecimal actRequestTotalAmount) {
            this.actRequestTotalAmount = actRequestTotalAmount;
        }

        public TaxInvoiceRequest getTaxInvoiceRequest() {
            return taxInvoiceRequest;
        }

        public void setTaxInvoiceRequest(TaxInvoiceRequest taxInvoiceRequest) {
            this.taxInvoiceRequest = taxInvoiceRequest;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }

        public InvoiceRequest getInvoiceRequest() {
            return invoiceRequest;
        }

        public void setInvoiceRequest(InvoiceRequest invoiceRequest) {
            this.invoiceRequest = invoiceRequest;
        }

        public BigDecimal getInvoiceRequestTotalAmount() {
            return invoiceRequestTotalAmount;
        }

        public void setInvoiceRequestTotalAmount(BigDecimal invoiceRequestTotalAmount) {
            this.invoiceRequestTotalAmount = invoiceRequestTotalAmount;
        }

        public Currency getInvoiceInvoiceCurrency() {
            return invoiceInvoiceCurrency;
        }

        public void setInvoiceInvoiceCurrency(Currency invoiceInvoiceCurrency) {
            this.invoiceInvoiceCurrency = invoiceInvoiceCurrency;
        }

        public Currency getInvoicePaymentCurrency() {
            return invoicePaymentCurrency;
        }

        public void setInvoicePaymentCurrency(Currency invoicePaymentCurrency) {
            this.invoicePaymentCurrency = invoicePaymentCurrency;
        }

        public Currency getActInvoiceCurrency() {
            return actInvoiceCurrency;
        }

        public void setActInvoiceCurrency(Currency actInvoiceCurrency) {
            this.actInvoiceCurrency = actInvoiceCurrency;
        }

        public Currency getActPaymentCurrency() {
            return actPaymentCurrency;
        }

        public void setActPaymentCurrency(Currency actPaymentCurrency) {
            this.actPaymentCurrency = actPaymentCurrency;
        }

        public Date getTime() {
            return time;
        }

        public void setTime(Date time) {
            this.time = time;
        }

        public String getInvoiceComment() {
            return invoiceComment;
        }

        public void setInvoiceComment(String invoiceComment) {
            this.invoiceComment = invoiceComment;
        }

        public String getActComment() {
            return actComment;
        }

        public void setActComment(String actComment) {
            this.actComment = actComment;
        }
    }
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int result = 0;
            result = o1.getProjectCode().getCode().compareTo(o2.getProjectCode().getCode());
            if(result != 0) {
                return result;
            }
            Integer o1Type = 0;
            Integer o2Type = 0;
            if(Type.INVOICE.equals(o1.getType())) {
                o1Type = 0;
            } else if(Type.ACT.equals(o1.getType())) {
                o1Type = 1;
            } else if(Type.TAX_INVOICE.equals(o1.getType())) {
                o1Type = 2;
            }
            if(Type.INVOICE.equals(o2.getType())) {
                o2Type = 0;
            } else if(Type.ACT.equals(o2.getType())) {
                o2Type = 1;
            } else if(Type.TAX_INVOICE.equals(o2.getType())) {
                o2Type = 2;
            }
            result = o1Type.compareTo(o2Type);
            if(result != 0) {
                return result;
            }
            return result;
        }
    }    
    private List<Row> rows = new LinkedList<Row>();
    private Employee currentUser;
    private Module module;
    private ProjectCodeListFilter filter;
    private InvoiceRequestsFilter invoiceRequestsFilter;
    Boolean showAllInDateRange;
    List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    private Date createdAt;

    private List<Currency> currencies = new LinkedList<Currency>();

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

    public ProjectCodeListFilter getFilter() {
        return filter;
    }

    public void setFilter(ProjectCodeListFilter filter) {
        this.filter = filter;
    }

    public InvoiceRequestsFilter getInvoiceRequestsFilter() {
        return invoiceRequestsFilter;
    }

    public void setInvoiceRequestsFilter(InvoiceRequestsFilter invoiceRequestsFilter) {
        this.invoiceRequestsFilter = invoiceRequestsFilter;
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

    public List<ProjectCode> getProjectCodes() {
        return projectCodes;
    }

    public void setProjectCodes(List<ProjectCode> projectCodes) {
        this.projectCodes = projectCodes;
    }

    public InvoiceDocumentReport (ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, Boolean showAllInDateRange, Module module, Employee currentUser) {
        this.filter = filter;
        this.invoiceRequestsFilter = invoiceRequestsFilter;
        this.showAllInDateRange = showAllInDateRange;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        Country country = currentUser.getCountry();
        currencies.addAll(CountryCurrency.getCurrencies(country));
        Collections.sort(currencies, new CurrencyComparator());
    }
    public void build() {
        buildProjectCodeList();
        if(! this.projectCodes.isEmpty()) {
            buildInvoiceRequestReport();
            buildActRequestReport();
            buildTaxInvoiceDocumentReport();
            buildTimeReport();
            buildInvoiceRequestCommentReport();
            buildActRequestCommentReport();
            Collections.sort(rows, new RowComparator());
        }
        this.createdAt = new Date();
    }
    private void buildProjectCodeList() {
        ProjectCodeListSorter sorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter limiter = new ProjectCodeListLimiter();
        List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        this.projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    }
    private void buildInvoiceRequestReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select c, pc, irp, ir, sum(iri.amount), icur, pcur from InvoiceRequestItem as iri inner join iri.invoiceRequest as ir inner join ir.invoiceRequestPacket as irp inner join irp.projectCode as pc inner join ir.invoiceCurrency as icur inner join ir.paymentCurrency as pcur inner join pc.client as c ";
        query += "where pc in (:projectCodes) ";
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                query += "and ir.date >= :startDate ";
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                query += "and ir.date <= :endDate ";
            }
        }
        query += "group by ir ";
      
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                hq.setParameter("startDate", this.invoiceRequestsFilter.getStartDate().getCalendar());
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                hq.setParameter("endDate", this.invoiceRequestsFilter.getEndDate().getCalendar());
            }
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            ProjectCode projectCode = (ProjectCode)tuple[1];
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[2];
            InvoiceRequest invoiceRequest = (InvoiceRequest)tuple[3];
            BigDecimal invoiceRequestTotalAmount = (BigDecimal)tuple[4];
            Currency invoiceCurrency = (Currency)tuple[5];
            Currency paymentCurrency = (Currency)tuple[6];

            Row row = new Row();
            row.setClient(client);
            row.setProjectCode(projectCode);
            row.setInvoiceRequestPacket(invoiceRequestPacket);
            row.setInvoiceRequest(invoiceRequest);
            row.setInvoiceRequestTotalAmount(invoiceRequestTotalAmount);
            row.setInvoiceInvoiceCurrency(invoiceCurrency);
            row.setInvoicePaymentCurrency(paymentCurrency);
            row.setType(Type.INVOICE);
            rows.add(row);
        }
    }
    private void buildActRequestReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select c, pc, irp, ar, sum(ari.amount), icur, pcur from ActRequestItem as ari inner join ari.actRequest as ar inner join ar.invoiceRequestPacket as irp inner join irp.projectCode as pc inner join ar.invoiceCurrency as icur inner join ar.paymentCurrency as pcur inner join pc.client as c ";        
        query += "where pc in (:projectCodes) ";
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                query += "and ar.date >= :startDate ";
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                query += "and ar.date <= :endDate ";
            }
        }
        query += "group by ar ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                hq.setParameter("startDate", this.invoiceRequestsFilter.getStartDate().getCalendar());
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                hq.setParameter("endDate", this.invoiceRequestsFilter.getEndDate().getCalendar());
            }
        }        
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            ProjectCode projectCode = (ProjectCode)tuple[1];
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[2];
            ActRequest actRequest = (ActRequest)tuple[3];
            BigDecimal actRequestTotalAmount = (BigDecimal)tuple[4];
            Currency invoiceCurrency = (Currency)tuple[5];
            Currency paymentCurrency = (Currency)tuple[6];

            Row row = new Row();
            row.setClient(client);
            row.setProjectCode(projectCode);
            row.setInvoiceRequestPacket(invoiceRequestPacket);
            row.setActRequest(actRequest);
            row.setActRequestTotalAmount(actRequestTotalAmount);
            row.setActInvoiceCurrency(invoiceCurrency);
            row.setActPaymentCurrency(paymentCurrency);
            row.setType(Type.ACT);            
            rows.add(row);
        }
    }
    private void buildTaxInvoiceDocumentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select c, pc, irp, tir from TaxInvoiceRequest as tir inner join tir.invoiceRequestPacket as irp inner join irp.actRequest as ar inner join irp.projectCode as pc inner join pc.client as c ";       
        query += "where pc in (:projectCodes) ";
        query += "group by tir ";
        
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            ProjectCode projectCode = (ProjectCode)tuple[1];
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[2];
            TaxInvoiceRequest taxInvoiceRequest = (TaxInvoiceRequest)tuple[3];

            Row row = new Row();
            row.setClient(client);
            row.setProjectCode(projectCode);
            row.setInvoiceRequestPacket(invoiceRequestPacket);
            row.setTaxInvoiceRequest(taxInvoiceRequest);
            row.setType(Type.TAX_INVOICE);
            rows.add(row);
        }
    }
    private void buildTimeReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select irp, max(irphi.time) from InvoiceRequestPacketHistoryItem as irphi inner join irphi.invoiceRequestPacket as irp inner join irp.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        query += "and irphi.status=:status ";
        query += "group by irp ";
     
        Query hq = hs.createQuery(query);
        hq.setParameter("status", InvoiceRequestPacket.Status.ACTIVE);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[0];
            Date maxTime = (Date)tuple[1];
            for(Row row : getRowsByInvoiceRequestPacket(invoiceRequestPacket)) {
                row.setTime(maxTime);
            }
        }        
    }
    private void buildInvoiceRequestCommentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select ir, iri.name from InvoiceRequestItem as iri inner join iri.invoiceRequest as ir inner join ir.invoiceRequestPacket as irp inner join irp.projectCode as pc  ";
        query += "where pc in (:projectCodes) ";
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                query += "and ir.date >= :startDate ";
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                query += "and ir.date <= :endDate ";
            }
        }
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                hq.setParameter("startDate", this.invoiceRequestsFilter.getStartDate().getCalendar());
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                hq.setParameter("endDate", this.invoiceRequestsFilter.getEndDate().getCalendar());
            }
        }        
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            InvoiceRequest invoiceRequest = (InvoiceRequest)tuple[0];
            String name = (String)tuple[1];

            Row row = getRowByInvoiceRequest(invoiceRequest);
            if(row != null) {
                if(row.getInvoiceComment() == null) {
                    row.setInvoiceComment(name);
                } else {
                    row.setInvoiceComment(row.getInvoiceComment() + "\n" + name);
                }
            }
        }
    }
    private void buildActRequestCommentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select ar, ari.name from ActRequestItem as ari inner join ari.actRequest as ar inner join ar.invoiceRequestPacket as irp inner join irp.projectCode as pc  ";
        query += "where pc in (:projectCodes) ";
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                query += "and ar.date >= :startDate ";
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                query += "and ar.date <= :endDate ";
            }
        }
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        if(invoiceRequestsFilter.isDateUsed() &&  ! Boolean.TRUE.equals(showAllInDateRange)) {
            if(invoiceRequestsFilter.isStartDateUsed()) {
                hq.setParameter("startDate", this.invoiceRequestsFilter.getStartDate().getCalendar());
            }
            if(invoiceRequestsFilter.isEndDateUsed()) {
                hq.setParameter("endDate", this.invoiceRequestsFilter.getEndDate().getCalendar());
            }
        }        
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            ActRequest actRequest = (ActRequest)tuple[0];
            String name = (String)tuple[1];

            Row row = getRowByActRequest(actRequest);
            if(row != null) {
                if(row.getActComment() == null) {
                    row.setActComment(name);
                } else {
                    row.setActComment(row.getActComment() + "\n" + name);
                }
            }
        }
    }    

    private List<Row> getRowsByInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
        List<Row> selectedRows = new LinkedList<>();
        for(Row row : rows) {
            if(row.getInvoiceRequestPacket().getId().equals(invoiceRequestPacket.getId())) {
                selectedRows.add(row);
            }
        }
        return selectedRows;
    }
    private Row getRowByInvoiceRequest(InvoiceRequest invoiceRequest) {
        for(Row row : rows) {
            if(row.getInvoiceRequest() != null && row.getInvoiceRequest().getId().equals(invoiceRequest.getId())) {
                return row;
            }
        }
        return null;    
    }
    private Row getRowByActRequest(ActRequest actRequest) {
        for(Row row : rows) {
            if(row.getActRequest() != null && row.getActRequest().getId().equals(actRequest.getId())) {
                return row;
            }
        }
        return null;    
    }
}
