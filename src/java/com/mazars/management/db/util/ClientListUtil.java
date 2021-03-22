/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.util;
import com.mazars.management.db.domain.*;
import com.mazars.management.web.forms.*;
import java.math.BigDecimal;
import java.util.Calendar;
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
public class ClientListUtil {
    private static BigDecimal BigDecimal;
    public static class DescribedClient {
        private Client client;
        private Group group;
        private ISOCountry country;
        private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
        private ISOCountry legalCountry;
        private ISOCountry postalCountry;
        private List<ActivitySector> activitySectors = new LinkedList<ActivitySector>();
        private ISOCountry listingCountry;

        public DescribedClient() {
        }

        public DescribedClient(Client client, Group group, ISOCountry country, ISOCountry legalCountry, ISOCountry postalCountry, ISOCountry listingCountry) {
            this.client = client;
            this.group = group;
            this.country = country;
            this.legalCountry = legalCountry;
            this.postalCountry = postalCountry;
            this.listingCountry = listingCountry;
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Group getGroup() {
            return group;
        }

        public void setGroup(Group group) {
            this.group = group;
        }

        public ISOCountry getCountry() {
            return country;
        }

        public void setCountry(ISOCountry country) {
            this.country = country;
        }

        public List<Subdepartment> getSubdepartments() {
            return subdepartments;
        }

        public void setSubepartments(List<Subdepartment> subdepartments) {
            this.subdepartments = subdepartments;
        }

        public ISOCountry getLegalCountry() {
            return legalCountry;
        }

        public void setLegalCountry(ISOCountry legalCountry) {
            this.legalCountry = legalCountry;
        }

        public ISOCountry getPostalCountry() {
            return postalCountry;
        }

        public void setPostalCountry(ISOCountry postalCountry) {
            this.postalCountry = postalCountry;
        }

        public List<ActivitySector> getActivitySectors() {
            return activitySectors;
        }

        public void setActivitySectors(List<ActivitySector> activitySectors) {
            this.activitySectors = activitySectors;
        }

        public ISOCountry getListingCountry() {
            return listingCountry;
        }

        public void setListingCountry(ISOCountry listingCountry) {
            this.listingCountry = listingCountry;
        }       
    }
    public static class ClientProjectActivityInfoItem {
        private Client client;
        private Map<Subdepartment, Long> subdepartmentCounts = new HashMap<Subdepartment, Long>();

        public ClientProjectActivityInfoItem() {
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Map<Subdepartment, Long> getSubdepartmentCounts() {
            return subdepartmentCounts;
        }

        public void setSubdepartmentCounts(Map<Subdepartment, Long> subdepartmentCounts) {
            this.subdepartmentCounts = subdepartmentCounts;
        }
    }
    public static class ClientFinancialActivityInfoItem {
        private Client client;
        private Map<Currency, BigDecimal> currencyAmounts = new HashMap<Currency, BigDecimal>();
        
        public ClientFinancialActivityInfoItem() {
        }

        public Client getClient() {
            return client;
        }

        public void setClient(Client client) {
            this.client = client;
        }

        public Map<Currency, BigDecimal> getCurrencyAmounts() {
            return currencyAmounts;
        }

        public void setCurrencyAmounts(Map<Currency, BigDecimal> currencyAmounts) {
            this.currencyAmounts = currencyAmounts;
        }
    } 
    public static class DescribedClientWithProjectAndFinancialActivityInfoItem extends DescribedClient {
        private Map<Subdepartment, Long> subdepartmentCounts = new HashMap<Subdepartment, Long>();
        private Map<Currency, BigDecimal> currencyAmounts = new HashMap<Currency, BigDecimal>();

        public Map<Subdepartment, Long> getSubdepartmentCounts() {
            return subdepartmentCounts;
        }

        public void setSubdepartmentCounts(Map<Subdepartment, Long> subdepartmentCounts) {
            this.subdepartmentCounts = subdepartmentCounts;
        }

        public Map<Currency, BigDecimal> getCurrencyAmounts() {
            return currencyAmounts;
        }

        public void setCurrencyAmounts(Map<Currency, BigDecimal> currencyAmounts) {
            this.currencyAmounts = currencyAmounts;
        }

    }
    public static List<DescribedClient> getDescribedClients(List<Client> clients) {
        List<DescribedClient> describedClients = new LinkedList<DescribedClient>();
        if(clients.isEmpty()) {
            return describedClients;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query1 = "";
        query1 += "select c, g, cntr, lglc, pstlc, lstc from Client as c ";
        query1 += "left join c.group as g ";
        query1 += "left join c.country as cntr ";
        query1 += "left join c.legalCountry as lglc ";
        query1 += "left join c.postalCountry as pstlc ";
        query1 += "left join c.listingCountry as lstc ";
        query1 += "where c in :clients ";       
        org.hibernate.Query hq1 = hs.createQuery(query1);
        hq1.setParameterList("clients", clients);
        List<Object[]> selection1 = hq1.list();
        for(Object[] tuple : selection1) {
            DescribedClient describedClient = new DescribedClient();
            Client client = (Client)tuple[0];
            Group group = (Group)tuple[1];
            ISOCountry country = (ISOCountry)tuple[2];
            ISOCountry legalCountry = (ISOCountry)tuple[3];
            ISOCountry postalCountry = (ISOCountry)tuple[4];
            ISOCountry listingCountry = (ISOCountry)tuple[5];
            describedClient.setClient(client);
            describedClient.setGroup(group);
            describedClient.setCountry(country);
            describedClient.setLegalCountry(legalCountry);
            describedClient.setPostalCountry(postalCountry);
            describedClient.setListingCountry(listingCountry);
            describedClients.add(describedClient);
        }
        
        String query2 = "";
        query2 += "select c, s from Client as c ";
        query2 += "inner join c.subdepartmentClientLinks as scl ";
        query2 += "inner join scl.subdepartment as s ";
        query2 += "where c in :clients ";
        org.hibernate.Query hq2 = hs.createQuery(query2);
        hq2.setParameterList("clients", clients);
        List<Object[]> selection2 = hq2.list();
        Map<Long, List<Subdepartment>> subdepartments = new HashMap<Long, List<Subdepartment>>();
        for(Object[] tuple : selection2) {
            Client client = (Client)tuple[0];
            Subdepartment subdepartment = (Subdepartment)tuple[1];
            if(subdepartments.get(client.getId()) == null) {
                subdepartments.put(client.getId(), new LinkedList<Subdepartment>());
            }
            List<Subdepartment> clientSubdepartments = subdepartments.get(client.getId());
            clientSubdepartments.add(subdepartment);
            subdepartments.put(client.getId(), clientSubdepartments);
        }
        for(Long clientId : subdepartments.keySet()) {
            for(DescribedClient describedClient : describedClients) {
                if(describedClient.getClient().getId().equals(clientId)) {
                    List<Subdepartment> clientSubdepartments = subdepartments.get(clientId);
                    describedClient.setSubepartments(clientSubdepartments);
                    break;
                }
            }
        }
        
        String query3 = "";
        query3 += "select c, asec from Client as c ";
        query3 += "inner join c.clientActivitySectorLinks as casl ";
        query3 += "inner join casl.activitySector as asec ";
        query3 += "where c in :clients ";
        org.hibernate.Query hq3 = hs.createQuery(query3);
        hq3.setParameterList("clients", clients);
        List<Object[]> selection3 = hq3.list();
        Map<Long, List<ActivitySector>> activitySectors = new HashMap<Long, List<ActivitySector>>();
        for(Object[] tuple : selection3) {
            Client client = (Client)tuple[0];
            ActivitySector activitySector = (ActivitySector)tuple[1];
            if(activitySectors.get(client.getId()) == null) {
                activitySectors.put(client.getId(), new LinkedList<ActivitySector>());
            }
            List<ActivitySector> clientActivitySectors = activitySectors.get(client.getId());
            clientActivitySectors.add(activitySector);
            activitySectors.put(client.getId(), clientActivitySectors);
        }
        for(Long clientId : activitySectors.keySet()) {
            for(DescribedClient describedClient : describedClients) {
                if(describedClient.getClient().getId().equals(clientId)) {
                    List<ActivitySector> clientActivitySectors = activitySectors.get(clientId);
                    describedClient.setActivitySectors(clientActivitySectors);
                    break;
                }
            }
        }
        
        return describedClients;
    }
    public static List<ClientProjectActivityInfoItem> getClientProjectActivityInfoItems(List<Client> clients, Calendar startDate,  Calendar endDate) {
        List<ClientProjectActivityInfoItem> clientProjectActivityInfoItems = new LinkedList<ClientProjectActivityInfoItem>();
        if(clients.isEmpty()) {
            return clientProjectActivityInfoItems;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
       
        String query = "";
        query += "select c, s, count(*) from Client as c ";      
        query += "inner join c.projectCodes as pc ";
        query += "inner join pc.subdepartment as s ";
        query += "where c in :clients ";
        query += "and (";
        query += "(pc.endDate=null or pc.endDate>:startDate) and ";
        query += "(pc.startDate=null or pc.startDate<:endDate) ";
        query += ") ";
        query += "group by c, s ";
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("clients", clients);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        List<Object[]> selection = hq.list();
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            Subdepartment subdepartment = (Subdepartment)tuple[1];
            Long count = (Long)tuple[2];
            ClientProjectActivityInfoItem clientProjectActivityInfoItem = null;
            for(ClientProjectActivityInfoItem tmpClientProjectActivityInfoItem : clientProjectActivityInfoItems) {
                if(tmpClientProjectActivityInfoItem.getClient().equals(client)) {
                    clientProjectActivityInfoItem = tmpClientProjectActivityInfoItem;
                    break;
                }
            }
            if(clientProjectActivityInfoItem == null) {
                clientProjectActivityInfoItem = new ClientProjectActivityInfoItem();
                clientProjectActivityInfoItem.setClient(client);
                clientProjectActivityInfoItems.add(clientProjectActivityInfoItem);
            }        
            clientProjectActivityInfoItem.getSubdepartmentCounts().put(subdepartment, count);
        }
        return clientProjectActivityInfoItems;
    }    
    public static List<ClientFinancialActivityInfoItem> getClientFinancialActivityInfoItems(List<Client> clients, Calendar startDate,  Calendar endDate) {
        List<ClientFinancialActivityInfoItem> clientFinancialActivityInfoItems = new LinkedList<ClientFinancialActivityInfoItem>();
        if(clients.isEmpty()) {
            return clientFinancialActivityInfoItems;
        }
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
       
        String query = "";
        query += "select c, cur, sum(fin.amount) from Client as c ";      
        query += "inner join c.projectCodes as pc ";
        query += "inner join pc.feesItem as fi ";
        query += "inner join fi.feesInvoiceCurrency as cur ";
        query += "inner join fi.feesInvoices as fin ";
        query += "where c in :clients ";
        query += "and (";
        query += "(pc.endDate=null or pc.endDate>:startDate) and ";
        query += "(pc.startDate=null or pc.startDate<:endDate) ";
        query += ") ";
        query += "group by c, cur ";
        org.hibernate.Query hq = hs.createQuery(query);
        hq.setParameterList("clients", clients);
        hq.setParameter("startDate", startDate);
        hq.setParameter("endDate", endDate);
        List<Object[]> selection = hq.list();
        for(Object[] tuple : selection) {
            Client client = (Client)tuple[0];
            Currency currency = (Currency)tuple[1];
            BigDecimal amount = (BigDecimal)tuple[2];
            ClientFinancialActivityInfoItem clientFinancialActivityInfoItem = null;
            for(ClientFinancialActivityInfoItem tmpClientFinancialActivityInfoItem : clientFinancialActivityInfoItems) {
                if(tmpClientFinancialActivityInfoItem.getClient().equals(client)) {
                    clientFinancialActivityInfoItem = tmpClientFinancialActivityInfoItem;
                    break;
                }
            }
            if(clientFinancialActivityInfoItem == null) {
                clientFinancialActivityInfoItem = new ClientFinancialActivityInfoItem();
                clientFinancialActivityInfoItem.setClient(client);
                clientFinancialActivityInfoItems.add(clientFinancialActivityInfoItem);
            }        
            clientFinancialActivityInfoItem.getCurrencyAmounts().put(currency, amount);
        }
        return clientFinancialActivityInfoItems;
    }        
    public static List<Client> getClientFilteredList(ClientListFilter filter, ClientListSorter sorter, ProjectCodeListLimiter limiter, Employee employee, Module module) {
        return getClientFilteredList(filter, null, sorter, limiter, employee, module);
    }
    public static Long getCountOfClientFilteredList(ClientListFilter filter, ClientListSorter sorter, ProjectCodeListLimiter limiter, Employee employee, Module module) {
        return getCountOfClientFilteredList(filter, null, sorter, limiter, employee, module);       
    }
    protected static String getHQLForClientFilteredList(ClientListFilter filter, ClientActivityFilter clientActivityFilter, ClientListSorter sorter) {
        String query = "";
        query += "select c from Client as c ";
        if(filter.isGroupIdUsed() || sorter.isGroupUsed()) {
            query += "left join c.group as g ";
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            query += "inner join c.subdepartmentClientLinks as scl ";
            query += "inner join scl.subdepartment as s ";
        }
        if(filter.isActivitySectorGroupIdUsed() || filter.isActivitySectorIdUsed()) {
            query += "inner join c.clientActivitySectorLinks as casl ";
            query += "inner join casl.activitySector as asec ";
            query += "inner join asec.activitySectorGroup as asg ";
        }
        if(filter.isCountryDefinedUsed() || filter.isCountryIdUsed() || sorter.isCountryUsed()) {
            query += "left join c.country as cntr ";
        }
        if(clientActivityFilter != null && clientActivityFilter.isUsed()) {
            query += "left join c.projectCodes as pc ";
        }
        
        query += "where ";
        query += "c.workCountry=:workCountry ";
        if(filter.isGroupIdUsed()) {
            query += "and g=:group ";
        }
        if(filter.isNameUsed()) {
            query += "and c.name like :name ";
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            query += "and s in :subdepartments ";
        }
        if(filter.isActivitySectorIdUsed()) {
            query += "and asec=:activitySector ";
        } else if(filter.isActivitySectorGroupIdUsed()) {
            query += "and asg=:activitySectorGroup ";
        }
        if(Boolean.TRUE.equals(filter.getIsCountryDefined())) {
            query += "and cntr!=null ";
        } else if(Boolean.FALSE.equals(filter.getIsCountryDefined())) {
            query += "and cntr=null ";
        }
        if(filter.isCountryIdUsed()) {
            query += "and cntr=:country ";
        }
        if(filter.isListedUsed()) {
            query += "and c.isListed=:isListed ";
        }
        if(filter.isReferredUsed()) {
            query += "and c.isReferred=:isReferred ";
        }
        if(filter.isActiveUsed()) {
            query += "and c.isActive=:isActive ";
        }
        if(filter.isFutureUsed()) {
            query += "and c.isFuture=:isFuture ";
        }
        if(filter.isExternalUsed()) {
            query += "and c.isExternal=:isExternal ";
        }
        if(filter.isTransnationalUsed()) {
            query += "and c.isTransnational=:isTransnational ";
        }
        
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isStartDateUsed()) {
            query += "and (pc.endDate=null or pc.endDate>=:startDate) ";
        }
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isEndDateUsed()) {
            query += "and (pc.startDate=null or pc.startDate<=:endDate) ";
        }
        
        query += "group by c ";
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed()) {
            if(ClientActivityFilter.ProjectsCount.ZERO.equals(clientActivityFilter.getProjectsCount())) {
                query += "having count(pc)=0";
            }
            if(ClientActivityFilter.ProjectsCount.MORE_THAN_ZERO.equals(clientActivityFilter.getProjectsCount())) {
                query += "having count(pc)>0 ";
            }
        }
        if(sorter.isUsed()) {
            query += "order by ";
            if(sorter.isNameUsed()) {
                query += "c.name ";
            }
            if(sorter.isGroupUsed()) {
                query += "g.name ";
            }
            if(sorter.isCountryUsed()) {
                query += "cntr.name ";
            }
            if(sorter.getOrder() != null) {
                query += "" + sorter.getOrder() + " ";
            }
        }
        return query;
    }
    protected static String getHQLForCountOfClientFilteredList(ClientListFilter filter, ClientActivityFilter clientActivityFilter) {
        String query = "";
        query += "select count(c2) from Client as c2 where c2.id in ( ";
        
        query += "select c.id from Client as c ";
        if(filter.isGroupIdUsed()) {
            query += "left join c.group as g ";
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            query += "inner join c.subdepartmentClientLinks as scl ";
            query += "inner join scl.subdepartment as s ";
        }
        if(filter.isActivitySectorGroupIdUsed() || filter.isActivitySectorIdUsed()) {
            query += "inner join c.clientActivitySectorLinks as casl ";
            query += "inner join casl.activitySector as asec ";
            query += "inner join asec.activitySectorGroup as asg ";
        }
        if(filter.isCountryDefinedUsed() || filter.isCountryIdUsed()) {
            query += "left join c.country as cntr ";
        }
        if(clientActivityFilter != null && clientActivityFilter.isUsed()) {
            query += "left join c.projectCodes as pc ";
        }
        
        query += "where ";
        query += "c.workCountry=:workCountry ";
        if(filter.isGroupIdUsed()) {
            query += "and g=:group ";
        }
        if(filter.isNameUsed()) {
            query += "and c.name like :name ";
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            query += "and s in :subdepartments ";
        }
        if(filter.isActivitySectorIdUsed()) {
            query += "and asec=:activitySector ";
        } else if(filter.isActivitySectorGroupIdUsed()) {
            query += "and asg=:activitySectorGroup ";
        }
        if(Boolean.TRUE.equals(filter.getIsCountryDefined())) {
            query += "and cntr!=null ";
        } else if(Boolean.FALSE.equals(filter.getIsCountryDefined())) {
            query += "and cntr=null ";
        }
        if(filter.isCountryIdUsed()) {
            query += "and cntr=:country ";
        }
        if(filter.isListedUsed()) {
            query += "and c.isListed=:isListed ";
        }
        if(filter.isReferredUsed()) {
            query += "and c.isReferred=:isReferred ";
        }
        if(filter.isActiveUsed()) {
            query += "and c.isActive=:isActive ";
        }
        if(filter.isFutureUsed()) {
            query += "and c.isFuture=:isFuture ";
        }
        if(filter.isExternalUsed()) {
            query += "and c.isExternal=:isExternal ";
        }
        if(filter.isTransnationalUsed()) {
            query += "and c.isTransnational=:isTransnational ";
        }
        
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isStartDateUsed()) {
            query += "and (pc.endDate=null or pc.endDate>=:startDate) ";
        }
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isEndDateUsed()) {
            query += "and (pc.startDate=null or pc.startDate<=:endDate) ";
        }
        
        query += "group by c ";
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed()) {
            if(ClientActivityFilter.ProjectsCount.ZERO.equals(clientActivityFilter.getProjectsCount())) {
                query += "having count(pc)=0";
            }
            if(ClientActivityFilter.ProjectsCount.MORE_THAN_ZERO.equals(clientActivityFilter.getProjectsCount())) {
                query += "having count(pc)>0 ";
            }
        }       
        query += ")"; //end of subselect
        
        return query;
    }
    protected static void setParametersForClientFilteredList(Query hq, ClientListFilter filter, ClientActivityFilter clientActivityFilter, Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isGroupIdUsed()) {
            Group group = (Group)hs.get(Group.class, filter.getGroupId());
            hq.setParameter("group", group);
        }
        if(filter.isNameUsed()) {
            String namePattern = filter.getName();
            if(! namePattern.startsWith("%")) {
                namePattern = "%" + namePattern;
            }
            if(! namePattern.endsWith("%")) {
                namePattern += "%";
            }
            hq.setParameter("name", namePattern);
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            Office office = null;
            if(filter.getOfficeId() != null) {
                office = (Office)hs.get(Office.class, filter.getOfficeId());
            }
            Department department = null;
            if(filter.getDepartmentId() != null) {
                department = (Department)hs.get(Department.class, filter.getDepartmentId());
            }
            Subdepartment subdepartment = null;
            if(filter.getSubdepartmentId() != null) {
                subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            }
            List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(office, department, subdepartment, employee, module);
            hq.setParameterList("subdepartments", subdepartments);
        }
        if(filter.isActivitySectorIdUsed()) {
            ActivitySector activitySector = (ActivitySector)hs.get(ActivitySector.class, filter.getActivitySectorId());
            hq.setParameter("activitySector", activitySector);
        } else if(filter.isActivitySectorGroupIdUsed()) {
            ActivitySectorGroup activitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, filter.getActivitySectorGroupId());
            hq.setParameter("activitySectorGroup", activitySectorGroup);
        }
        if(filter.isCountryIdUsed()) {
            ISOCountry country = (ISOCountry)hs.get(ISOCountry.class, filter.getCountryId());
            hq.setParameter("country", country);
        }
        if(filter.isListedUsed()) {
            hq.setParameter("isListed", filter.getIsListed());
        }
        if(filter.isReferredUsed()) {
            hq.setParameter("isReferred", filter.getIsReferred());
        }
        if(filter.isActiveUsed()) {
            hq.setParameter("isActive", filter.getIsActive());
        }
        if(filter.isFutureUsed()) {
            hq.setParameter("isFuture", filter.getIsFuture());
        }
        if(filter.isExternalUsed()) {
            hq.setParameter("isExternal", filter.getIsExternal());
        }
        if(filter.isTransnationalUsed()) {
            hq.setParameter("isTransnational", filter.getIsTransnational());
        }
        Country workCountry = employee.getCountry();
        hq.setParameter("workCountry", workCountry);
        
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isStartDateUsed()) {
            hq.setParameter("startDate", clientActivityFilter.getStartDate().getCalendar());
        }
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isEndDateUsed()) {
            hq.setParameter("endDate", clientActivityFilter.getEndDate().getCalendar());
        }
    }
    protected static void setParametersForCountOfClientFilteredList(Query hq, ClientListFilter filter, ClientActivityFilter clientActivityFilter, Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(filter.isGroupIdUsed()) {
            Group group = (Group)hs.get(Group.class, filter.getGroupId());
            hq.setParameter("group", group);
        }
        if(filter.isCountryIdUsed()) {
            ISOCountry country = (ISOCountry)hs.get(ISOCountry.class, filter.getCountryId());
            hq.setParameter("country", country);
        }
        if(filter.isNameUsed()) {
            String namePattern = filter.getName();
            if(! namePattern.startsWith("%")) {
                namePattern = "%" + namePattern;
            }
            if(! namePattern.endsWith("%")) {
                namePattern += "%";
            }
            hq.setParameter("name", namePattern);
        }
        if(filter.isOfficeIdUsed() || filter.isDepartmentIdUsed() || filter.isSubdepartmentIdUsed()) {
            Office office = null;
            if(filter.getOfficeId() != null) {
                office = (Office)hs.get(Office.class, filter.getOfficeId());
            }
            Department department = null;
            if(filter.getDepartmentId() != null) {
                department = (Department)hs.get(Department.class, filter.getDepartmentId());
            }
            Subdepartment subdepartment = null;
            if(filter.getSubdepartmentId() != null) {
                subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
            }
            List<Subdepartment> subdepartments = Subdepartment.getAllowedSubdepartments(office, department, subdepartment, employee, module);
            hq.setParameterList("subdepartments", subdepartments);
        }
        if(filter.isActivitySectorIdUsed()) {
            ActivitySector activitySector = (ActivitySector)hs.get(ActivitySector.class, filter.getActivitySectorId());
            hq.setParameter("activitySector", activitySector);
        } else if(filter.isActivitySectorGroupIdUsed()) {
            ActivitySectorGroup activitySectorGroup = (ActivitySectorGroup)hs.get(ActivitySectorGroup.class, filter.getActivitySectorGroupId());
            hq.setParameter("activitySectorGroup", activitySectorGroup);
        }
        if(filter.isListedUsed()) {
            hq.setParameter("isListed", filter.getIsListed());
        }
        if(filter.isReferredUsed()) {
            hq.setParameter("isReferred", filter.getIsReferred());
        }
        if(filter.isActiveUsed()) {
            hq.setParameter("isActive", filter.getIsActive());
        }
        if(filter.isFutureUsed()) {
            hq.setParameter("isFuture", filter.getIsFuture());
        }
        if(filter.isExternalUsed()) {
            hq.setParameter("isExternal", filter.getIsExternal());
        }
        if(filter.isTransnationalUsed()) {
            hq.setParameter("isTransnational", filter.getIsTransnational());
        }
      
        Country workCountry = employee.getCountry();
        hq.setParameter("workCountry", workCountry);
        
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isStartDateUsed()) {
            hq.setParameter("startDate", clientActivityFilter.getStartDate().getCalendar());
        }
        if(clientActivityFilter != null && clientActivityFilter.isProjectsCountUsed() && clientActivityFilter.isEndDateUsed()) {
            hq.setParameter("endDate", clientActivityFilter.getEndDate().getCalendar());
        }

    }
    public static List<Client> getClientFilteredList(ClientListFilter filter, ClientActivityFilter clientActivityFilter, ClientListSorter sorter, ProjectCodeListLimiter limiter, Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForClientFilteredList(filter, clientActivityFilter, sorter);
       
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForClientFilteredList(hq, filter, clientActivityFilter, employee, module);
        if(limiter.getPage() != null && limiter.getItemsPerPage() != null) {
            hq.setFirstResult(limiter.getPage() * limiter.getItemsPerPage());
        }
        if(limiter.getItemsPerPage() != null) {
            hq.setMaxResults(limiter.getItemsPerPage());
        }
        return (List<Client>)hq.list();
    }
    public static Long getCountOfClientFilteredList(ClientListFilter filter, ClientActivityFilter clientActivityFilter, ClientListSorter sorter, ProjectCodeListLimiter limiter, Employee employee, Module module) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = getHQLForCountOfClientFilteredList(filter, clientActivityFilter);
        
        org.hibernate.Query hq = hs.createQuery(query);
        setParametersForCountOfClientFilteredList(hq, filter, clientActivityFilter, employee, module);
        return (Long)hq.uniqueResult();       
    }
    public static void mergeWithDescribedClients(List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems, List<ClientListUtil.DescribedClient> describedClients) {
        for(DescribedClient describedClient : describedClients) {
            boolean isFound = false;
            for(DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem : describedClientWithProjectAndFinancialActivityInfoItems) {
                if(describedClientWithProjectAndFinancialActivityInfoItem.getClient().equals(describedClient.getClient())) {
                    isFound = true;
                    break;
                }
            }
            if(! isFound) {
                DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem = new DescribedClientWithProjectAndFinancialActivityInfoItem();
                describedClientWithProjectAndFinancialActivityInfoItem.setClient(describedClient.getClient());
                describedClientWithProjectAndFinancialActivityInfoItem.setGroup(describedClient.getGroup());
                describedClientWithProjectAndFinancialActivityInfoItem.setCountry(describedClient.getCountry());
                describedClientWithProjectAndFinancialActivityInfoItem.setLegalCountry(describedClient.getLegalCountry());
                describedClientWithProjectAndFinancialActivityInfoItem.setPostalCountry(describedClient.getPostalCountry());
                describedClientWithProjectAndFinancialActivityInfoItem.setListingCountry(describedClient.getListingCountry());
                
                describedClientWithProjectAndFinancialActivityInfoItems.add(describedClientWithProjectAndFinancialActivityInfoItem);
            }
        }
    }
    public static void joinProjectActivityInfoItems(List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems, List<ClientListUtil.ClientProjectActivityInfoItem> clientProjectActivityInfoItems) {
        for(ClientProjectActivityInfoItem clientProjectActivityInfoItem : clientProjectActivityInfoItems) {
            DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem = null;
            for(DescribedClientWithProjectAndFinancialActivityInfoItem tmpDescribedClientWithProjectAndFinancialActivityInfoItem : describedClientWithProjectAndFinancialActivityInfoItems) {
                if(tmpDescribedClientWithProjectAndFinancialActivityInfoItem.getClient().equals(clientProjectActivityInfoItem.getClient())) {
                    describedClientWithProjectAndFinancialActivityInfoItem = tmpDescribedClientWithProjectAndFinancialActivityInfoItem;
                    break;
                }
            }
            if(describedClientWithProjectAndFinancialActivityInfoItem != null) {
                describedClientWithProjectAndFinancialActivityInfoItem.setSubdepartmentCounts(clientProjectActivityInfoItem.getSubdepartmentCounts()); ;
            }
        }
    }
    public static void joinFinancialActivityInfoItems(List<ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem> describedClientWithProjectAndFinancialActivityInfoItems, List<ClientListUtil.ClientFinancialActivityInfoItem> clientFinancialActivityInfoItems) {
        for(ClientFinancialActivityInfoItem clientFinancialActivityInfoItem : clientFinancialActivityInfoItems) {
            DescribedClientWithProjectAndFinancialActivityInfoItem describedClientWithProjectAndFinancialActivityInfoItem = null;
            for(DescribedClientWithProjectAndFinancialActivityInfoItem tmpDescribedClientWithProjectAndFinancialActivityInfoItem : describedClientWithProjectAndFinancialActivityInfoItems) {
                if(tmpDescribedClientWithProjectAndFinancialActivityInfoItem.getClient().equals(clientFinancialActivityInfoItem.getClient())) {
                    describedClientWithProjectAndFinancialActivityInfoItem = tmpDescribedClientWithProjectAndFinancialActivityInfoItem;
                    break;
                }
            }
            if(describedClientWithProjectAndFinancialActivityInfoItem != null) {
                describedClientWithProjectAndFinancialActivityInfoItem.setCurrencyAmounts(clientFinancialActivityInfoItem.getCurrencyAmounts()); ;
            }
        }
    }
}
