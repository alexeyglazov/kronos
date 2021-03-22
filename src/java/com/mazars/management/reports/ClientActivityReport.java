/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.ClientListUtil;
import com.mazars.management.db.util.ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.ClientActivityFilter;
import com.mazars.management.web.forms.ClientActivityReportForm;
import com.mazars.management.web.forms.ClientListFilter;
import com.mazars.management.web.forms.ClientListSorter;
import com.mazars.management.web.forms.CredentialsReportForm;
import com.mazars.management.web.forms.ProjectCodeListLimiter;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
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
public class ClientActivityReport {
    private List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> rows = new LinkedList<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem>();
    private Employee currentUser;
    private Module module;
    private ClientActivityReportForm form;
    private Date createdAt;
    Country country;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<Currency> currencies = new LinkedList<Currency>();

    public ClientActivityReport(ClientActivityReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        this.country = currentUser.getCountry();
 
        subdepartments = this.country.getSubdepartments();  
        currencies = CountryCurrency.getCurrencies(this.country);  
    }

    public List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> getRows() {
        return rows;
    }

    public void setRows(List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> rows) {
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

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public ClientActivityReportForm getForm() {
        return form;
    }

    public void setForm(ClientActivityReportForm form) {
        this.form = form;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public List<Currency> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(List<Currency> currencies) {
        this.currencies = currencies;
    }

    public void build() {
        ClientListFilter clientFilter = this.form.getClientFilter();
        ClientActivityFilter clientActivityFilter = this.form.getClientActivityFilter();
        ClientListSorter sorter = new ClientListSorter();
        ProjectCodeListLimiter limiter = new ProjectCodeListLimiter();
        List<Client> clients = ClientListUtil.getClientFilteredList(clientFilter, clientActivityFilter, sorter, limiter, currentUser, module);
        Calendar startDate = null;
        if(clientActivityFilter.getStartDate() != null) {
            startDate = clientActivityFilter.getStartDate().getCalendar();
        }
        Calendar endDate = null;
        if(clientActivityFilter.getEndDate() != null) {
            endDate = clientActivityFilter.getEndDate().getCalendar();
        }
        ClientListUtil.mergeWithDescribedClients(rows, ClientListUtil.getDescribedClients(clients));
        ClientListUtil.joinProjectActivityInfoItems(rows, ClientListUtil.getClientProjectActivityInfoItems(clients, startDate, endDate) );
        ClientListUtil.joinFinancialActivityInfoItems(rows, ClientListUtil.getClientFinancialActivityInfoItems(clients, startDate, endDate) );
        filterByProjectsCount();
        this.createdAt = new Date();
    }
    public void filterByProjectsCount() {
        if(form.getClientActivityFilter().getProjectsCount() == null) {
            return;
        }
        List<DescribedClientWithProjectAndFinancialActivityInfoItem> tmpRows = new LinkedList<DescribedClientWithProjectAndFinancialActivityInfoItem>();
        for(DescribedClientWithProjectAndFinancialActivityInfoItem row : this.rows) {
            Long total = new Long(0);
            for(Subdepartment subdepartment : row.getSubdepartmentCounts().keySet()) {
                Long count = row.getSubdepartmentCounts().get(subdepartment);
                if(count != null) {
                    total += count;
                }
            }
            if(
                (ClientActivityFilter.ProjectsCount.ZERO.equals(form.getClientActivityFilter().getProjectsCount()) && total == 0) ||
                    (ClientActivityFilter.ProjectsCount.MORE_THAN_ZERO.equals(form.getClientActivityFilter().getProjectsCount()) && total > 0)
              ){
                tmpRows.add(row);
            }
        }
        rows = tmpRows;
    }
    private ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem getRow(Client client) {
        for(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem row : rows) {
            if(row.getClient().equals(client)) {
                return row;
            }
        }
        return null;
    }
}
