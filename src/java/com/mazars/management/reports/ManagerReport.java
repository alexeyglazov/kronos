/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.ClientComparator;
import com.mazars.management.db.comparators.CurrencyComparator;
import com.mazars.management.db.comparators.DepartmentComparator;
import com.mazars.management.db.comparators.EmployeeComparator;
import com.mazars.management.db.comparators.OfficeComparator;
import com.mazars.management.db.domain.Client;
import com.mazars.management.db.domain.Country;
import com.mazars.management.db.domain.CountryCurrency;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.Department;
import com.mazars.management.db.domain.Employee;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesItem.Type;
import com.mazars.management.db.domain.Module;
import com.mazars.management.db.domain.Office;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.domain.StandardSellingRateGroup;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.forms.ManagerReportForm;
import java.math.BigDecimal;
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
public class ManagerReport {
    public class Row {
        private Office office;
        private Department department;
        private Employee inChargePerson;
        private Client client;
        private ProjectCode projectCode;
        private BigDecimal feesAmount;
        private BigDecimal costAmount;
        private BigDecimal budgetAmount;
        private FeesItem.Type type;
        private BigDecimal feesInvoiceAmount;
        private BigDecimal feesPaymentAmount;
        private BigDecimal outOfPocketInvoiceAmount;
        private BigDecimal outOfPocketPaymentAmount;
        public Row() {
        }

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

        public Employee getInChargePerson() {
            return inChargePerson;
        }

        public void setInChargePerson(Employee inChargePerson) {
            this.inChargePerson = inChargePerson;
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

        public BigDecimal getFeesAmount() {
            return feesAmount;
        }

        public void setFeesAmount(BigDecimal feesAmount) {
            this.feesAmount = feesAmount;
        }

        public BigDecimal getCostAmount() {
            return costAmount;
        }

        public void setCostAmount(BigDecimal costAmount) {
            this.costAmount = costAmount;
        }

        public BigDecimal getBudgetAmount() {
            return budgetAmount;
        }

        public void setBudgetAmount(BigDecimal budgetAmount) {
            this.budgetAmount = budgetAmount;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }

        public BigDecimal getFeesInvoiceAmount() {
            return feesInvoiceAmount;
        }

        public void setFeesInvoiceAmount(BigDecimal feesInvoiceAmount) {
            this.feesInvoiceAmount = feesInvoiceAmount;
        }

        public BigDecimal getFeesPaymentAmount() {
            return feesPaymentAmount;
        }

        public void setFeesPaymentAmount(BigDecimal feesPaymentAmount) {
            this.feesPaymentAmount = feesPaymentAmount;
        }

        public BigDecimal getOutOfPocketInvoiceAmount() {
            return outOfPocketInvoiceAmount;
        }

        public void setOutOfPocketInvoiceAmount(BigDecimal outOfPocketInvoiceAmount) {
            this.outOfPocketInvoiceAmount = outOfPocketInvoiceAmount;
        }

        public BigDecimal getOutOfPocketPaymentAmount() {
            return outOfPocketPaymentAmount;
        }

        public void setOutOfPocketPaymentAmount(BigDecimal outOfPocketPaymentAmount) {
            this.outOfPocketPaymentAmount = outOfPocketPaymentAmount;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    
    private List<Office> offices = new LinkedList<Office>();
    private List<Department> departments = new LinkedList<Department>();
    private List<Employee> inChargePersons = new LinkedList<Employee>();
    private List<Client> clients = new LinkedList<Client>();
    
    private Employee currentUser;
    private Module module;
    private ManagerReportForm form;
    
    private Office formOffice;
    private Department formDepartment;
    private Currency formReportCurrency;
    private Integer formFinancialYear;
    private Integer formGrossMargin;
    private Map<Long, BigDecimal> formCurrencyRates = new HashMap<Long, BigDecimal>();
    private List<Currency> currencies = new LinkedList<Currency>();
    private Currency mainCurrency;
    private Date createdAt;

    public ManagerReport(ManagerReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getReportCurrencyId() != null) {
            this.formReportCurrency = (Currency)hs.get(Currency.class, new Long(form.getReportCurrencyId()));
        }
        this.formFinancialYear = form.getFinancialYear();
        this.formGrossMargin = form.getGrossMargin();
        this.formCurrencyRates = form.getCurrencyRates();
        
        Country country = currentUser.getCountry();
        currencies.addAll(CountryCurrency.getCurrencies(country));
        Collections.sort(currencies, new CurrencyComparator());
        mainCurrency = CountryCurrency.getMainCurrency(country);
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<Office> getOffices() {
        return offices;
    }

    public void setOffices(List<Office> offices) {
        this.offices = offices;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public List<Employee> getInChargePersons() {
        return inChargePersons;
    }

    public void setInChargePersons(List<Employee> inChargePersons) {
        this.inChargePersons = inChargePersons;
    }

    public List<Client> getClients() {
        return clients;
    }

    public void setClients(List<Client> clients) {
        this.clients = clients;
    }

    public ManagerReportForm getForm() {
        return form;
    }

    public void setForm(ManagerReportForm form) {
        this.form = form;
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

    public Currency getFormReportCurrency() {
        return formReportCurrency;
    }

    public void setFormReportCurrency(Currency formReportCurrency) {
        this.formReportCurrency = formReportCurrency;
    }

    public Integer getFormFinancialYear() {
        return formFinancialYear;
    }

    public void setFormFinancialYear(Integer formFinancialYear) {
        this.formFinancialYear = formFinancialYear;
    }

    public Integer getFormGrossMargin() {
        return formGrossMargin;
    }

    public void setFormGrossMargin(Integer formGrossMargin) {
        this.formGrossMargin = formGrossMargin;
    }

    public Map<Long, BigDecimal> getFormCurrencyRates() {
        return formCurrencyRates;
    }

    public void setFormCurrencyRates(Map<Long, BigDecimal> formCurrencyRates) {
        this.formCurrencyRates = formCurrencyRates;
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



    public Date getCreatedAt() {
        return createdAt;
    }

    public void build() {
        buildCodeReport();
        buildFeesReport();
        buildCostReport();
        buildFlatFeeBudgetReport();
        buildTimespentBudgetReport(); // copy of fees
        buildQuotationBudgetReport();
        buildFeesInvoiceReport();
        buildFeesPaymentReport();
        buildOutOfPocketInvoiceReport();
        buildOutOfPocketPaymentReport();
        
        findOfficesDepartmentsInChargePersonsClients();
        
        this.createdAt = new Date();
    }
    public void buildCodeReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, pc.client, icp, d, o from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e left join pc.inChargePerson as icp ";
            query += "inner join s.department as d inner join d.office as o ";
            query += "where ";
            boolean conditionUsed = false;
            if(formDepartment != null) {
                query += "d=:department ";
                conditionUsed = true;
            } else if(formOffice != null) {
                query += "o=:office ";
                conditionUsed = true;
            }
            if(conditionUsed) {
                query += "and ";
            }
            if(formFinancialYear != null) {
                query += "pc.financialYear=:financialYear ";
                query += "and ";
            }
            query += "e=:employee and m=:module ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, pc.client, icp, d, o from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c left join pc.inChargePerson as icp ";
            query += "where ";
            boolean conditionUsed = false;
            if(formDepartment != null) {
                query += "d=:department ";
            } else if(formOffice != null) {
                query += "o=:office ";
            }
            if(formDepartment != null || formOffice != null) {
                conditionUsed = true;
            }
            if(conditionUsed) {
                query += "and ";
            }
            if(formFinancialYear != null) {
                query += "pc.financialYear=:financialYear ";
                query += "and ";
            }
            query += "c=:country ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Client client = (Client)tuple[1];
            Employee inChargePerson = (Employee)tuple[2];
            Department department = (Department)tuple[3];
            Office office = (Office)tuple[4];
            Row row = new Row();
            row.setProjectCode(projectCode);
            row.setClient(client);
            row.setInChargePerson(inChargePerson);
            row.setDepartment(department);
            row.setOffice(office);
            rows.add(row);
        }
    }
    public void buildFeesReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, ssrg.currency, sum(tsi.timeSpent * ssr.amount)/60 from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            query += "inner join pc.timeSpentItems as tsi inner join tsi.employee as tsi_e inner join tsi_e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as p_s ";
            query += "inner join p_s.standardSellingRateGroups as ssrg inner join ssrg.standardSellingRates as ssr ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "(tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null)) ";
            query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
            query += "and p=ssr.position ";
           
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and e=:employee and m=:module ";
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, ssrg.currency, sum(tsi.timeSpent * ssr.amount)/60 from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "inner join pc.timeSpentItems as tsi inner join tsi.employee as tsi_e inner join tsi_e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as p_s ";
            query += "inner join p_s.standardSellingRateGroups as ssrg inner join ssrg.standardSellingRates as ssr ";
            query += "where ";
            query += "(tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null)) ";
            query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
            query += "and p=ssr.position ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and c=:country ";
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Currency currency = (Currency)tuple[1];
            BigDecimal feesAmount = (BigDecimal)tuple[2];
            BigDecimal feesCvAmount = feesAmount;
            if(! formReportCurrency.getId().equals(currency.getId())) {
                BigDecimal rate = formCurrencyRates.get(currency.getId());
                feesCvAmount = feesAmount.multiply(rate);
            }
            Row row = getRow(projectCode);
            if(row.getFeesAmount() == null) {
                row.setFeesAmount(feesCvAmount);
            } else {
                row.setFeesAmount(row.getFeesAmount().add(feesCvAmount));
            }
        }
    }
    public void buildCostReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, scg.currency, sum(tsi.timeSpent * sc.amount)/60 from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            query += "inner join pc.timeSpentItems as tsi inner join tsi.employee as tsi_e inner join tsi_e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as p_s ";
            query += "inner join p_s.standardCostGroups as scg inner join scg.standardCosts as sc ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "(tsi.day>=scg.start and (tsi.day<=scg.end or scg.end=null)) ";
            query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
            query += "and p=sc.position ";           
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and e=:employee and m=:module ";
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, scg.currency, sum(tsi.timeSpent * sc.amount)/60 from ProjectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "inner join pc.timeSpentItems as tsi inner join tsi.employee as tsi_e inner join tsi_e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as p_s ";
            query += "inner join p_s.standardCostGroups as scg inner join scg.standardCosts as sc ";
            query += "where ";
            query += "(tsi.day>=scg.start and (tsi.day<=scg.end or scg.end=null)) ";
            query += "and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
            query += "and p=sc.position "; 
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and c=:country ";
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Currency currency = (Currency)tuple[1];
            BigDecimal costAmount = (BigDecimal)tuple[2];
            BigDecimal costCvAmount = costAmount;
            if(! formReportCurrency.getId().equals(currency.getId())) {
                BigDecimal rate = formCurrencyRates.get(currency.getId());
                costCvAmount = costAmount.multiply(rate);
            }
            Row row = getRow(projectCode);
            if(row.getCostAmount() == null) {
                row.setCostAmount(costCvAmount);
            } else {
                row.setCostAmount(row.getCostAmount().add(costCvAmount));
            }
        }
    }
    public void buildFlatFeeBudgetReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, fi, sum(fa.amount) from FeesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            query += "left join fi.feesAdvances as fa ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "fi.type=:type ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }        
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and e=:employee and m=:module ";
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            hq.setParameter("type", FeesItem.Type.FLAT_FEE);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, fi, sum(fa.amount) from FeesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "left join fi.feesAdvances as fa ";
            query += "where ";
            query += "fi.type=:type ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }        
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "and c=:country ";
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            hq.setParameter("type", FeesItem.Type.FLAT_FEE);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal advanceAmount = (BigDecimal)tuple[2];
            if(advanceAmount != null && (! formReportCurrency.getId().equals(feesItem.getFeesAdvanceCurrency().getId()))) {
                BigDecimal rate = formCurrencyRates.get(feesItem.getFeesAdvanceCurrency().getId());
                advanceAmount = advanceAmount.multiply(rate);
            }
            Row row = getRow(projectCode);
            if(row != null) {
                row.setType(FeesItem.Type.FLAT_FEE);
                row.setBudgetAmount(advanceAmount);
            }
        }        
    }
    public void buildTimespentBudgetReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, fi from FeesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            query += "and fi.type=:type ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }         
            Query hq = hs.createQuery(query);
            hq.setParameter("type", FeesItem.Type.TIMESPENT);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, fi from FeesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            query += "and fi.type=:type ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            Query hq = hs.createQuery(query);
            hq.setParameter("type", FeesItem.Type.TIMESPENT);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            Row row = getRow(projectCode);
            if(feesItem != null && FeesItem.Type.TIMESPENT.equals(feesItem.getType())) {
                row.setType(FeesItem.Type.TIMESPENT);
                row.setBudgetAmount(row.getFeesAmount());
            }
        }        
    }
    public void buildQuotationBudgetReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, fi, sum(ssr.amount * pq.time)/60, ssrg  from PositionQuotation as pq ";
            query += "inner join pq.feesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            query += "inner join s.standardSellingRateGroups as ssrg inner join ssrg.standardSellingRates as ssr ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            query += "and fi.type=:type ";
            query += "and ssr.position=pq.position ";
            query += "and (fi.date>=ssrg.start and (fi.date<=ssrg.end or ssrg.end=null)) ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }      
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("type", FeesItem.Type.QUOTATION);
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, fi, sum(ssr.amount * pq.time)/60, ssrg from PositionQuotation as pq ";
            query += "inner join pq.feesItem as fi inner join fi.projectCode as pc ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "inner join s.standardSellingRateGroups as ssrg inner join ssrg.standardSellingRates as ssr ";
            query += "where ";
            query += "c=:country ";
            query += "and fi.type=:type ";
            query += "and ssr.position=pq.position ";
            query += "and (fi.date>=ssrg.start and (fi.date<=ssrg.end or ssrg.end=null)) ";            
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }        
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("type", FeesItem.Type.QUOTATION);
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal quotationAmount = (BigDecimal)tuple[2];
            StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)tuple[3];

            if(! standardSellingRateGroup.getCurrency().getId().equals(feesItem.getFeesInvoiceCurrency().getId())) {
                quotationAmount = quotationAmount.multiply(feesItem.getQuotationCurrencyRate());
                if(! feesItem.getFeesInvoiceCurrency().getId().equals(formReportCurrency.getId())) {
                    quotationAmount = quotationAmount.multiply(formCurrencyRates.get(feesItem.getFeesInvoiceCurrency().getId()));
                }
            }
            Row row = getRow(projectCode);
            if(row != null) {
                row.setType(FeesItem.Type.QUOTATION);
                row.setBudgetAmount(quotationAmount);
            }
        }        
    }
    public void buildFeesInvoiceReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, fi, sum(fin.amount) from FeesItem as fi ";
            query += "inner join fi.projectCode as pc left join fi.feesInvoices as fin ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }       
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, fi, sum(fin.amount) from FeesItem as fi ";
            query += "inner join fi.projectCode as pc left join fi.feesInvoices as fin ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }         
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal invoiceAmount = (BigDecimal)tuple[2];
            if(! feesItem.getFeesInvoiceCurrency().getId().equals(formReportCurrency.getId()) ) {
                BigDecimal rate = formCurrencyRates.get(feesItem.getFeesInvoiceCurrency().getId());
                if(invoiceAmount != null) {
                    invoiceAmount = invoiceAmount.multiply(rate);
                }
            }
            Row row = getRow(projectCode);
            row.setFeesInvoiceAmount(invoiceAmount);
        }
    }
    public void buildFeesPaymentReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, fi, sum(fp.amount) from FeesItem as fi ";
            query += "inner join fi.projectCode as pc left join fi.feesPayments as fp ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }       
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, fi, sum(fp.amount) from FeesItem as fi ";
            query += "inner join fi.projectCode as pc left join fi.feesPayments as fp ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }         
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            FeesItem feesItem = (FeesItem)tuple[1];
            BigDecimal paymentAmount = (BigDecimal)tuple[2];
            if(! feesItem.getFeesInvoiceCurrency().getId().equals(formReportCurrency.getId()) ) {
                BigDecimal rate = formCurrencyRates.get(feesItem.getFeesInvoiceCurrency().getId());
                if(paymentAmount != null) {
                    paymentAmount = paymentAmount.multiply(rate);
                }
            }
            Row row = getRow(projectCode);
            row.setFeesPaymentAmount(paymentAmount);
        }
    }
    public void buildOutOfPocketInvoiceReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, oopi, sum(oopin.amount) from OutOfPocketItem as oopi ";
            query += "inner join oopi.projectCode as pc left join oopi.outOfPocketInvoices as oopin ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }       
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, oopi, sum(oopin.amount) from OutOfPocketItem as oopi ";
            query += "inner join oopi.projectCode as pc left join oopi.outOfPocketInvoices as oopin ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }         
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            OutOfPocketItem outOfPocketItem = (OutOfPocketItem)tuple[1];
            BigDecimal invoiceAmount = (BigDecimal)tuple[2];
            if(! outOfPocketItem.getOutOfPocketInvoiceCurrency().getId().equals(formReportCurrency.getId()) ) {
                BigDecimal rate = formCurrencyRates.get(outOfPocketItem.getOutOfPocketInvoiceCurrency().getId());
                if(invoiceAmount != null) {
                    invoiceAmount = invoiceAmount.multiply(rate);
                }
            }
            Row row = getRow(projectCode);
            row.setOutOfPocketInvoiceAmount(invoiceAmount);
        }
    }
    public void buildOutOfPocketPaymentReport() {
        List<Object[]> tuples = new LinkedList<Object[]>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc, oopi, sum(oopp.amount) from OutOfPocketItem as oopi ";
            query += "inner join oopi.projectCode as pc left join oopi.outOfPocketPayments as oopp ";
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            if(formDepartment != null) {
                query += "inner join s.department as d ";
            } else if(formOffice != null) {
                query += "inner join s.department as d inner join d.office as o ";
            }
            query += "where ";
            query += "e=:employee and m=:module ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }       
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            query += "group by pc ";            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            tuples = (List<Object[]>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc, oopi, sum(oopp.amount) from OutOfPocketItem as oopi ";
            query += "inner join oopi.projectCode as pc left join oopi.outOfPocketPayments as oopp ";
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }         
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            
            query += "group by pc ";
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            tuples = (List<Object[]>)hq.list();
        }   

        for(Object[] tuple : tuples) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            OutOfPocketItem outOfPocketItem = (OutOfPocketItem)tuple[1];
            BigDecimal paymentAmount = (BigDecimal)tuple[2];
            if(! outOfPocketItem.getOutOfPocketInvoiceCurrency().getId().equals(formReportCurrency.getId()) ) {
                BigDecimal rate = formCurrencyRates.get(outOfPocketItem.getOutOfPocketInvoiceCurrency().getId());
                if(paymentAmount != null) {
                    paymentAmount = paymentAmount.multiply(rate);
                }
            }
            Row row = getRow(projectCode);
            row.setOutOfPocketPaymentAmount(paymentAmount);
        }
    }
    public List<ProjectCode> getNoFinancialYearProjectCodes() {
        return getSpecialProjectCodes(true, null, null);
    }
    public List<ProjectCode> getNoBudgetProjectCodes() {
        return getSpecialProjectCodes(null, true, null);
    }    
    public List<ProjectCode> getNoInChargePersonProjectCodes() {
        return getSpecialProjectCodes(null, null, true);
    }    
    public List<ProjectCode> getSpecialProjectCodes(Boolean noFinancialYear, Boolean noBudget, Boolean noInChargePerson) {
        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(Employee.Profile.SUPER_USER.equals(this.currentUser.getProfile())) {
            String query = "select pc from ProjectCode as pc ";
            if(noBudget != null) {
                query += "left join pc.feesItem as fi ";
            }
            if(noInChargePerson != null) {
                query += "left join pc.inChargePerson as icp ";
            }            
            query += "inner join pc.subdepartment as s inner join s.rightsItems as ri inner join ri.module as m inner join ri.employee as e ";
            query += "inner join s.department as d inner join d.office as o ";
            query += "where ";
            query += "e=:employee and m=:module ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            if(Boolean.TRUE.equals(noFinancialYear)) {
                query += "and pc.financialYear=null ";
            } else if(Boolean.FALSE.equals(noFinancialYear)) {
                query += "and pc.financialYear!=null ";
            }
            if(Boolean.TRUE.equals(noBudget)) {
                query += "and fi=null ";
            } else if(Boolean.FALSE.equals(noBudget)) {
                query += "and fi!=null ";
            }
            if(Boolean.TRUE.equals(noInChargePerson)) {
                query += "and icp=null ";
            } else if(Boolean.FALSE.equals(noInChargePerson)) {
                query += "and icp!=null ";
            }
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("employee", currentUser).setParameter("module", module);
            projectCodes = (List<ProjectCode>)hq.list();
        } else if(Employee.Profile.COUNTRY_ADMINISTRATOR.equals(this.currentUser.getProfile())) {
            Country country = currentUser.getCountry();
            String query = "select pc from ProjectCode as pc ";
            if(noBudget != null) {
                query += "left join pc.feesItem as fi ";
            }
            if(noInChargePerson != null) {
                query += "left join pc.inChargePerson as icp ";
            }
            query += "inner join pc.subdepartment as s inner join s.department as d inner join d.office as o inner join o.country as c ";
            query += "where ";
            query += "c=:country ";
            if(formDepartment != null) {
                query += "and d=:department ";
            } else if(formOffice != null) {
                query += "and o=:office ";
            }
            if(formFinancialYear != null) {
                query += "and pc.financialYear=:financialYear ";
            }
            if(Boolean.TRUE.equals(noFinancialYear)) {
                query += "and pc.financialYear=null ";
            } else if(Boolean.FALSE.equals(noFinancialYear)) {
                query += "and pc.financialYear!=null ";
            }
            if(Boolean.TRUE.equals(noBudget)) {
                query += "and fi=null ";
            } else if(Boolean.FALSE.equals(noBudget)) {
                query += "and fi!=null ";
            }
            if(Boolean.TRUE.equals(noInChargePerson)) {
                query += "and icp=null ";
            } else if(Boolean.FALSE.equals(noInChargePerson)) {
                query += "and icp!=null ";
            }
            
            Query hq = hs.createQuery(query);
            if(formDepartment != null) {
                hq.setParameter("department", formDepartment);
            } else if(formOffice != null) {
                hq.setParameter("office", formOffice);
            }
            if(formFinancialYear != null) {
                hq.setParameter("financialYear", formFinancialYear);
            }
            hq.setParameter("country", country);
            projectCodes = (List<ProjectCode>)hq.list();
        }
        return projectCodes;        
    }
    public void findOfficesDepartmentsInChargePersonsClients() {
        for(Row row : rows) {
            Office office = row.getOffice();
            Department department = row.getDepartment();
            Employee inChargePerson = row.getInChargePerson();
            Client client = row.getClient();
            if(! offices.contains(office)) {
                offices.add(office);
            }
            if(! departments.contains(department)) {
                departments.add(department);
            }
            if(inChargePerson != null && ! inChargePersons.contains(inChargePerson)) {
                inChargePersons.add(inChargePerson);
            }
            if(! clients.contains(client)) {
                clients.add(client);
            }
        }
        Collections.sort(offices, new OfficeComparator());
        Collections.sort(departments, new DepartmentComparator());
        Collections.sort(inChargePersons, new EmployeeComparator());
        Collections.sort(clients, new ClientComparator());
    }

    private Row getRow(ProjectCode projectCode) {
        for(Row row : rows) {
            if(row.getProjectCode().getId().equals(projectCode.getId())) {
                return row;
            }
        }
        return null;
    }
}
