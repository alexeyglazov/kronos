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
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAdvance;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.InvoiceRequest;
import com.mazars.management.db.domain.InvoiceRequestPacket;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.RightsItem;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.domain.TaxInvoiceRequest;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.ProjectCodeListUtil;
import com.mazars.management.web.forms.InvoiceRequestsFilter;
import com.mazars.management.web.forms.ProjectCodeListFilter;
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
public class InvoiceRequestReport {
    public class Block {       
        private InvoiceRequestPacket invoiceRequestPacket;
        private ProjectCode projectCode;
        private Long timeSpent;
        private Calendar lastFillingDay;
        private Client client;
        private Map<InvoiceRequest, BigDecimal> invoiceRequestInfo = new HashMap<InvoiceRequest, BigDecimal>();
        private ActRequest actRequest;
        private BigDecimal actRequestTotalAmount;
        private TaxInvoiceRequest taxInvoiceRequest;
        private FeesItem feesItem;
        private BigDecimal feesAdvanceTotalAmount;
        
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

        public Long getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Long timeSpent) {
            this.timeSpent = timeSpent;
        }

        public Calendar getLastFillingDay() {
            return lastFillingDay;
        }

        public void setLastFillingDay(Calendar lastFillingDay) {
            this.lastFillingDay = lastFillingDay;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Map<InvoiceRequest, BigDecimal> getInvoiceRequestInfo() {
            return invoiceRequestInfo;
        }

        public void setInvoiceRequestInfo(Map<InvoiceRequest, BigDecimal> invoiceRequestInfo) {
            this.invoiceRequestInfo = invoiceRequestInfo;
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

        public FeesItem getFeesItem() {
            return feesItem;
        }

        public void setFeesItem(FeesItem feesItem) {
            this.feesItem = feesItem;
        }

        public BigDecimal getFeesAdvanceTotalAmount() {
            return feesAdvanceTotalAmount;
        }

        public void setFeesAdvanceTotalAmount(BigDecimal feesAdvanceTotalAmount) {
            this.feesAdvanceTotalAmount = feesAdvanceTotalAmount;
        }
    }
    private List<Block> blocks = new LinkedList<Block>();
    private Employee currentUser;
    private Module module;
    private ProjectCodeListFilter filter;
    private InvoiceRequestsFilter invoiceRequestsFilter;
    List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
    private Date createdAt;
 
    private List<Currency> currencies = new LinkedList<Currency>();

    public List<Block> getBlocks() {
        return blocks;
    }

    public void setBlocks(List<Block> blocks) {
        this.blocks = blocks;
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

    public InvoiceRequestReport (ProjectCodeListFilter filter, InvoiceRequestsFilter invoiceRequestsFilter, Module module, Employee currentUser) {
        this.filter = filter;
        this.invoiceRequestsFilter = invoiceRequestsFilter;
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
            buildInvoiceRequestPacketReport();
            buildTimeSpentReport();
            buildFeesAdvanceReport();
            buildInvoiceRequestReport();
            buildActRequestReport();
            buildTaxInvoiceRequestReport();            
        }
        this.createdAt = new Date();
    }
    private void buildProjectCodeList() {
        ProjectCodeListSorter sorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter limiter = new ProjectCodeListLimiter();
        List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        this.projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(filter, invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
    }
    
    private void buildInvoiceRequestPacketReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, irp, c from ProjectCode as pc left join pc.invoiceRequestPackets as irp inner join pc.client as c ";
        query += "where pc in (:projectCodes) ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[1];
            Client client = (Client)tuple[2];

            Block block = new Block();
            block.setProjectCode(projectCode);
            block.setInvoiceRequestPacket(invoiceRequestPacket);
            block.setClient(client);
            this.blocks.add(block);
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

            for(Block block : getBlocksByProjectCode(projectCode)) {
                block.setLastFillingDay(lastFillingDay);
                block.setTimeSpent(timeSpent);
            }
        }
    }
    private void buildFeesAdvanceReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select pc, fi, sum(fa.amount) from FeesAdvance as fa inner join fa.feesItem as fi inner join fi.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        query += "group by fi ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal feesAdvanceTotalAmount = (BigDecimal)tuple[2];
            
            List<Block> blocks = getBlocksByProjectCode(projectCode);
            for(Block block : blocks) {
                block.setFeesItem(feesItem);
                block.setFeesAdvanceTotalAmount(feesAdvanceTotalAmount);
            }
        }
    }    
    private void buildInvoiceRequestReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select irp, ir, sum(iri.amount) from InvoiceRequestItem as iri inner join iri.invoiceRequest as ir inner join ir.invoiceRequestPacket as irp inner join irp.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        query += "group by ir ";        
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[0];
            InvoiceRequest invoiceRequest = (InvoiceRequest)tuple[1];
            BigDecimal invoiceRequestTotalAmount = (BigDecimal)tuple[2];

            Block block = getBlockByInvoiceRequestPacket(invoiceRequestPacket) ;
            block.getInvoiceRequestInfo().put(invoiceRequest, invoiceRequestTotalAmount);
        }
    }
    private void buildActRequestReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select irp, ar, sum(ari.amount) from ActRequestItem as ari inner join ari.actRequest as ar inner join ar.invoiceRequestPacket as irp inner join irp.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        query += "group by ar ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[0];
            ActRequest actRequest = (ActRequest)tuple[1];
            BigDecimal actRequestTotalAmount = (BigDecimal)tuple[2];

            Block block = getBlockByInvoiceRequestPacket(invoiceRequestPacket) ;
            block.setActRequest(actRequest);
            block.setActRequestTotalAmount(actRequestTotalAmount);
        }
    }
    private void buildTaxInvoiceRequestReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select irp, tir from TaxInvoiceRequest as tir inner join tir.invoiceRequestPacket as irp inner join irp.projectCode as pc ";
        query += "where pc in (:projectCodes) ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.projectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();        
        for(Object[] tuple : selection) {
            InvoiceRequestPacket invoiceRequestPacket = (InvoiceRequestPacket)tuple[0];
            TaxInvoiceRequest taxInvoiceRequest = (TaxInvoiceRequest)tuple[1];

            Block block = getBlockByInvoiceRequestPacket(invoiceRequestPacket) ;
            block.setTaxInvoiceRequest(taxInvoiceRequest);
        }
    }

    private Block getBlockByInvoiceRequestPacket(InvoiceRequestPacket invoiceRequestPacket) {
        for(Block block : this.blocks) {
            if(block.getInvoiceRequestPacket() != null && block.getInvoiceRequestPacket().getId().equals(invoiceRequestPacket.getId())) {
                return block;
            }
        }
        return null;
    }
    private List<Block> getBlocksByProjectCode(ProjectCode projectCode) {
        List<Block> blocks = new LinkedList<Block>();
        for(Block block : this.blocks) {
            if(block.getProjectCode().getId().equals(projectCode.getId())) {
                blocks.add(block);
            }
        }
        return blocks;
    }
}
