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
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesAdvance;
import com.mazars.management.db.domain.FeesInvoice;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesPayment;
import com.mazars.management.db.domain.Group;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.Subdepartment;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.ProjectCodeListUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.InvoiceRequestsFilter;
import com.mazars.management.web.forms.InvoicingProcessReportForm;
import com.mazars.management.web.forms.ProjectCodeListLimiter;
import com.mazars.management.web.forms.ProjectCodeListSorter;
import java.util.Collections;
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
public class InvoicingProcessReport {
    public class ProjectCodeBlock {
        private Group group;
        private Client client;
        private ProjectCode projectCode;
        private FeesItem feesItem;
        private List<FeesAdvance> feesAdvances = new LinkedList<FeesAdvance>();
        private List<FeesInvoice> feesInvoices = new LinkedList<FeesInvoice>();
        private List<FeesPayment> feesPayments = new LinkedList<FeesPayment>();

        public FeesItem getFeesItem() {
            return feesItem;
        }

        public void setFeesItem(FeesItem feesItem) {
            this.feesItem = feesItem;
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public List<FeesAdvance> getFeesAdvances() {
            return feesAdvances;
        }

        public void setFeesAdvances(List<FeesAdvance> feesAdvances) {
            this.feesAdvances = feesAdvances;
        }

        public List<FeesInvoice> getFeesInvoices() {
            return feesInvoices;
        }

        public void setFeesInvoices(List<FeesInvoice> feesInvoices) {
            this.feesInvoices = feesInvoices;
        }

        public List<FeesPayment> getFeesPayments() {
            return feesPayments;
        }

        public void setFeesPayments(List<FeesPayment> feesPayments) {
            this.feesPayments = feesPayments;
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
    }
    private List<ProjectCodeBlock> projectCodeBlocks = new LinkedList<ProjectCodeBlock>();
    private Set<FeesItem> feesItems = new HashSet<FeesItem>();
   
    private Employee currentUser;
    private Module module;
    private InvoicingProcessReportForm form;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private InvoicingProcessReportForm.DocumentType formDocumentTypeToSearch;
    private InvoicingProcessReportForm.DocumentType formDocumentTypeToShow;
    private InvoicingProcessReportForm.View formView;

    private Date createdAt;

    private List<Currency> currencies = new LinkedList<Currency>();
    private Currency mainCurrency;

    public List<ProjectCodeBlock> getProjectCodeBlocks() {
        return projectCodeBlocks;
    }

    public void setProjectCodeBlocks(List<ProjectCodeBlock> projectCodeBlocks) {
        this.projectCodeBlocks = projectCodeBlocks;
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

    public InvoicingProcessReportForm getForm() {
        return form;
    }

    public void setForm(InvoicingProcessReportForm form) {
        this.form = form;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public InvoicingProcessReportForm.DocumentType getFormDocumentTypeToSearch() {
        return formDocumentTypeToSearch;
    }

    public void setFormDocumentTypeToSearch(InvoicingProcessReportForm.DocumentType formDocumentTypeToSearch) {
        this.formDocumentTypeToSearch = formDocumentTypeToSearch;
    }

    public InvoicingProcessReportForm.DocumentType getFormDocumentTypeToShow() {
        return formDocumentTypeToShow;
    }

    public void setFormDocumentTypeToShow(InvoicingProcessReportForm.DocumentType formDocumentTypeToShow) {
        this.formDocumentTypeToShow = formDocumentTypeToShow;
    }

    public InvoicingProcessReportForm.View getFormView() {
        return formView;
    }

    public void setFormView(InvoicingProcessReportForm.View formView) {
        this.formView = formView;
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

    public InvoicingProcessReport (InvoicingProcessReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        
        Country country = currentUser.getCountry();
        currencies.addAll(CountryCurrency.getCurrencies(country));
        Collections.sort(currencies, new CurrencyComparator());
        mainCurrency = CountryCurrency.getMainCurrency(country);
        
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        this.formDocumentTypeToSearch = form.getDocumentTypeToSearch();
        this.formDocumentTypeToShow = form.getDocumentTypeToShow();
        this.formView = form.getView();
    }
    public void build() {
        buildFeesItemReport();
        if(! projectCodeBlocks.isEmpty()) {
            buildFeesAdvanceReport();
            buildFeesInvoiceReport();
            buildFeesPaymentReport();
        }
        this.createdAt = new Date();
    }
    private void buildFeesItemReport() {
        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        InvoiceRequestsFilter invoiceRequestsFilter = new InvoiceRequestsFilter();
        ProjectCodeListSorter sorter = new ProjectCodeListSorter();
        ProjectCodeListLimiter limiter = new ProjectCodeListLimiter();
        List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        projectCodes = ProjectCodeListUtil.getProjectCodeFilteredList(this.form.getProjectCodeListFilter(), invoiceRequestsFilter, sorter, limiter, allowedSubdepartments);
        if(projectCodes.isEmpty()) {
            return;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select g, c, pc, fi from ProjectCode as pc ";
        query += "inner join pc.client as c ";
        query += "inner join pc.feesItem as fi ";
        query += "left join c.group as g ";
        if(this.form.getStartDate() != null && this.form.getEndDate() != null) {
            query += "left join fi.feesAdvances as fa ";
            query += "left join fi.feesInvoices as fin ";
            query += "left join fi.feesPayments as fp ";
        }
        query += "where pc in (:projectCodes) ";
        if(this.form.getStartDate() != null && this.form.getEndDate() != null) {
            if(InvoicingProcessReportForm.DocumentType.ALL.equals(this.form.getDocumentTypeToSearch())) {
                query += "and ( ";
                query += "(fa.date>=:startDate and fa.date<=:endDate) ";
                query += "or (fin.date>=:startDate and fin.date<=:endDate) ";
                query += "or (fp.date>=:startDate and fp.date<=:endDate) ";
                query += ") ";            
            } else if(InvoicingProcessReportForm.DocumentType.INVOICE_TO_ISSUE.equals(this.form.getDocumentTypeToSearch())) {
                query += "and (fa.date>=:startDate and fa.date<=:endDate)  ";                           
            }  else if(InvoicingProcessReportForm.DocumentType.INVOICE_ISSUED.equals(this.form.getDocumentTypeToSearch())) {
                query += "and (fin.date>=:startDate and fin.date<=:endDate) ";                           
            } else if(InvoicingProcessReportForm.DocumentType.PAYMENT.equals(this.form.getDocumentTypeToSearch())) {
                query += "and (fp.date>=:startDate and fp.date<=:endDate) ";                          
            }
        }
        query += "group by pc ";
      
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", projectCodes);
        if(this.form.getStartDate() != null && this.form.getEndDate() != null) {
            hq.setParameter("startDate", this.getForm().getStartDate().getCalendar());
            hq.setParameter("endDate", this.getForm().getEndDate().getCalendar());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            Group group = (Group)tuple[0];
            Client client = (Client)tuple[1];
            ProjectCode projectCode = (ProjectCode)tuple[2];
            FeesItem feesItem = (FeesItem)tuple[3];
            this.feesItems.add(feesItem);
            ProjectCodeBlock projectCodeBlock = new ProjectCodeBlock();
            projectCodeBlock.setClient(client);
            projectCodeBlock.setGroup(group);
            projectCodeBlock.setProjectCode(projectCode);
            projectCodeBlock.setFeesItem(feesItem);
            this.projectCodeBlocks.add(projectCodeBlock);
        }
    }
    private void buildFeesAdvanceReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select fi, fa from FeesItem as fi inner join fi.feesAdvances as fa ";
        query += "where fi in (:feesItems) ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("feesItems", this.feesItems);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            FeesItem feesItem = (FeesItem)tuple[0];
            FeesAdvance feesAdvance  = (FeesAdvance)tuple[1];

            ProjectCodeBlock projectCodeBlock = getProjectCodeBlock(feesItem);
            projectCodeBlock.getFeesAdvances().add(feesAdvance);
        }
    }
    private void buildFeesInvoiceReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select fi, fin from FeesItem as fi inner join fi.feesInvoices as fin ";
        query += "where fi in (:feesItems) ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("feesItems", this.feesItems);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            FeesItem feesItem = (FeesItem)tuple[0];
            FeesInvoice feesInvoice  = (FeesInvoice)tuple[1];

            ProjectCodeBlock projectCodeBlock = getProjectCodeBlock(feesItem);
            projectCodeBlock.getFeesInvoices().add(feesInvoice);
        }
    }
    private void buildFeesPaymentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select fi, fp from FeesItem as fi inner join fi.feesPayments as fp ";
        query += "where fi in (:feesItems) ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("feesItems", this.feesItems);
        List<Object[]> selection = (List<Object[]>)hq.list();
        
        for(Object[] tuple : selection) {
            FeesItem feesItem = (FeesItem)tuple[0];
            FeesPayment feesPayment  = (FeesPayment)tuple[1];

            ProjectCodeBlock projectCodeBlock = getProjectCodeBlock(feesItem);
            projectCodeBlock.getFeesPayments().add(feesPayment);
        }
    }
    private ProjectCodeBlock getProjectCodeBlock(FeesItem feesItem) {
        for(ProjectCodeBlock projectCodeBlock : this.projectCodeBlocks) {
            if(projectCodeBlock.getFeesItem().equals(feesItem)) {
                return projectCodeBlock;
            }
        }
        return null;
    }
}
