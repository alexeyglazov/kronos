/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.CurrencyComparator;
import com.mazars.management.db.comparators.ProjectCodeComparator;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.CodeDetailReportForm;
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
public class CodeDetailReport {
    public enum View {
        SITE,
        EXCEL_SIMPLE,
        EXCEL_WITH_REQUISITES
    }
    public class RowComparator implements Comparator<Row> {
        @Override
        public int compare(Row o1, Row o2) {
            int result = 0;
            result = o1.getProjectCodeCode().compareTo(o2.getProjectCodeCode());
            if(result != 0) {
                return result;
            }
            result = o1.getDay().compareTo(o2.getDay());
            if(result != 0) {
                return result;
            }
            result = o1.getEmployeeLastName().compareTo(o2.getEmployeeLastName());
            if(result != 0) {
                return result;
            }
            result = o1.getEmployeeFirstName().compareTo(o2.getEmployeeFirstName());;
            if(result != 0) {
                return result;
            }
            return result;
        }
    }    
    public class Row {
        private Long projectCodeId;
        private String projectCodeCode;
        private Long timeSpentItemId;
        private String employeeFirstName;
        private String employeeLastName;
        private String positionName;
        private String standardPositionName;
        private String taskTypeName;
        private String taskName;
        private Integer timeSpent;
        private String description;
        private Long standardSellingRateGroupCurrencyId;
        private BigDecimal standardSellingRateAmount;
        private Calendar day;
        private Date modifiedAt;

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

        public Long getTimeSpentItemId() {
            return timeSpentItemId;
        }

        public void setTimeSpentItemId(Long timeSpentItemId) {
            this.timeSpentItemId = timeSpentItemId;
        }

        public Calendar getDay() {
            return day;
        }

        public void setDay(Calendar day) {
            this.day = day;
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

        public String getPositionName() {
            return positionName;
        }

        public void setPositionName(String positionName) {
            this.positionName = positionName;
        }

        public String getStandardPositionName() {
            return standardPositionName;
        }

        public void setStandardPositionName(String standardPositionName) {
            this.standardPositionName = standardPositionName;
        }

        public Date getModifiedAt() {
            return modifiedAt;
        }

        public void setModifiedAt(Date modifiedAt) {
            this.modifiedAt = modifiedAt;
        }

        public String getTaskName() {
            return taskName;
        }

        public void setTaskName(String taskName) {
            this.taskName = taskName;
        }

        public String getTaskTypeName() {
            return taskTypeName;
        }

        public void setTaskTypeName(String taskTypeName) {
            this.taskTypeName = taskTypeName;
        }

        public Integer getTimeSpent() {
            return timeSpent;
        }

        public void setTimeSpent(Integer timeSpent) {
            this.timeSpent = timeSpent;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Long getStandardSellingRateGroupCurrencyId() {
            return standardSellingRateGroupCurrencyId;
        }

        public void setStandardSellingRateGroupCurrencyId(Long standardSellingRateGroupCurrencyId) {
            this.standardSellingRateGroupCurrencyId = standardSellingRateGroupCurrencyId;
        }

        public BigDecimal getStandardSellingRateAmount() {
            return standardSellingRateAmount;
        }

        public void setStandardSellingRateAmount(BigDecimal standardSellingRateAmount) {
            this.standardSellingRateAmount = standardSellingRateAmount;
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private Employee currentUser;
    private Module module;
    private CodeDetailReportForm form;
    private Date createdAt;
    private List<ProjectCode> formProjectCodes = new LinkedList<ProjectCode>();
    private YearMonthDate formStart;
    private YearMonthDate formEnd;
    private Boolean formIsRateInfoVisible;
    private Currency formReportCurrency;
    private Map<Long, BigDecimal> formCurrencyRates = new HashMap<Long, BigDecimal>();
    private List<Currency> currencies = new LinkedList<Currency>();
    private Currency mainCurrency;
    private View view;
    public CodeDetailReport(CodeDetailReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        for(Long projectCodeId : this.form.getProjectCodeIds()) {
            this.formProjectCodes.add((ProjectCode)hs.get(ProjectCode.class, projectCodeId));
        }
        Collections.sort(this.formProjectCodes, new ProjectCodeComparator());
        
        this.formIsRateInfoVisible = form.getIsRateInfoVisible();
        if(this.form.getReportCurrencyId() != null) {
            this.formReportCurrency = (Currency)hs.get(Currency.class, new Long(form.getReportCurrencyId()));
        }
        this.formStart = form.getStart();
        this.formEnd = form.getEnd();
        this.formCurrencyRates = form.getCurrencyRates();
        this.view = form.getView();
        
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

    public CodeDetailReportForm getForm() {
        return form;
    }

    public void setForm(CodeDetailReportForm form) {
        this.form = form;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public YearMonthDate getFormStart() {
        return formStart;
    }

    public void setFormStart(YearMonthDate formStart) {
        this.formStart = formStart;
    }

    public YearMonthDate getFormEnd() {
        return formEnd;
    }

    public void setFormEnd(YearMonthDate formEnd) {
        this.formEnd = formEnd;
    }

    public List<ProjectCode> getFormProjectCodes() {
        return formProjectCodes;
    }

    public void setFormProjectCodes(List<ProjectCode> formProjectCodes) {
        this.formProjectCodes = formProjectCodes;
    }

    public Boolean getFormIsRateInfoVisible() {
        return formIsRateInfoVisible;
    }

    public void setFormIsRateInfoVisible(Boolean formIsRateInfoVisible) {
        this.formIsRateInfoVisible = formIsRateInfoVisible;
    }

    public Currency getFormReportCurrency() {
        return formReportCurrency;
    }

    public void setFormReportCurrency(Currency formReportCurrency) {
        this.formReportCurrency = formReportCurrency;
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

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }


    public void build() {
        boolean allowed = false;
        List<Subdepartment> allowedSubdepartments = Subdepartment.getAllowedSubdepartments(null, null, null, currentUser, module);
        List<Subdepartment> projectCodeSubdepartments = new LinkedList<Subdepartment>();
        for(ProjectCode projectCode : this.formProjectCodes) {
            projectCodeSubdepartments.add(projectCode.getSubdepartment());
        }
        for(Subdepartment projectCodeSubdepartment : projectCodeSubdepartments) {
            allowed = false;
            for(Subdepartment allowedSubdepartment : allowedSubdepartments) {
                if(allowedSubdepartment.equals(projectCodeSubdepartment)) {
                    allowed = true;
                    break;
                }
            }
            if(! allowed) {
                break;
            }
        }
        if(allowed) {
            buildPositionTimeReport();
            buildNoPositionTimeReport();
            if(Boolean.TRUE.equals(formIsRateInfoVisible)) {
                buildRateReport();
            }
            Collections.sort(rows, new RowComparator());
        }
        this.createdAt = new Date();
    }
    public void buildPositionTimeReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select tsi, e, p, sp, t, tt, pc from TimeSpentItem as tsi ";
        query += "inner join tsi.employee as e ";
        query += "inner join e.employeePositionHistoryItems as ephi ";
        query += "inner join ephi.position as p ";
        query += "inner join p.standardPosition as sp ";
        query += "inner join tsi.projectCode as pc ";
        query += "inner join tsi.task as t ";
        query += "inner join t.taskType as tt ";
        query += "where pc in (:projectCodes) ";
        query += "and tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null) ";
        if(formStart != null) {
            query += "and tsi.day>=:start ";
        }
        if(formEnd != null) {
            query += "and tsi.day<=:end ";
        }
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", formProjectCodes);
        if(formStart != null) {
            hq.setParameter("start", formStart.getCalendar());
        }
        if(formEnd != null) {
            hq.setParameter("end", formEnd.getCalendar());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[0];
            Employee employee = (Employee)tuple[1];
            Position position = (Position)tuple[2];
            StandardPosition standardPosition = (StandardPosition)tuple[3];
            Task task = (Task)tuple[4];
            TaskType taskType = (TaskType)tuple[5];
            ProjectCode projectCode = (ProjectCode)tuple[6];
            String employeeFirstName = employee.getFirstName();
            String employeeLastName = employee.getLastName();
            String positionName = position.getName();
            String standardPositionName = standardPosition.getName();
            String taskTypeName = taskType.getName();
            String taskName = task.getName();
            Long projectCodeId = projectCode.getId();
            String projectCodeCode = projectCode.getCode();
            Long timeSpentItemId = timeSpentItem.getId();
            Integer timeSpent = timeSpentItem.getTimeSpent();
            String description = timeSpentItem.getDescription();
            Calendar day = timeSpentItem.getDay();
            Date modifiedAt = timeSpentItem.getModifiedAt();
            Row row = new Row();
            row.setProjectCodeId(projectCodeId);
            row.setProjectCodeCode(projectCodeCode);
            row.setTimeSpentItemId(timeSpentItemId);
            row.setEmployeeFirstName(employeeFirstName);
            row.setEmployeeLastName(employeeLastName);
            row.setPositionName(positionName);
            row.setStandardPositionName(standardPositionName);
            row.setTaskTypeName(taskTypeName);
            row.setTaskName(taskName);
            row.setTimeSpent(timeSpent);
            row.setDescription(description);
            row.setDay(day);
            row.setModifiedAt(modifiedAt);
            this.rows.add(row);
        }
    }
    public void buildNoPositionTimeReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select tsi, e, t, tt, pc from TimeSpentItem as tsi ";
        query += "inner join tsi.employee as e ";
        query += "inner join tsi.projectCode as pc ";
        query += "inner join tsi.task as t ";
        query += "inner join t.taskType as tt ";
        query += "where pc in (:projectCodes) ";
        if(formStart != null) {
            query += "and tsi.day>=:start ";
        }
        if(formEnd != null) {
            query += "and tsi.day<=:end ";
        }
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", formProjectCodes);
        if(formStart != null) {
            hq.setParameter("start", formStart.getCalendar());
        }
        if(formEnd != null) {
            hq.setParameter("end", formEnd.getCalendar());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[0];
            Employee employee = (Employee)tuple[1];
            Task task = (Task)tuple[2];
            TaskType taskType = (TaskType)tuple[3];
            ProjectCode projectCode = (ProjectCode)tuple[4];
            String employeeFirstName = employee.getFirstName();
            String employeeLastName = employee.getLastName();
            String taskTypeName = taskType.getName();
            String taskName = task.getName();
            Long projectCodeId = projectCode.getId();
            String projectCodeCode = projectCode.getCode();
            Long timeSpentItemId = timeSpentItem.getId();
            Integer timeSpent = timeSpentItem.getTimeSpent();
            String description = timeSpentItem.getDescription();
            Calendar day = timeSpentItem.getDay();
            Date modifiedAt = timeSpentItem.getModifiedAt();

            if(getRow(timeSpentItem) != null) {
                continue;
            }
            
            Row row = new Row();
            row.setProjectCodeId(projectCodeId);
            row.setProjectCodeCode(projectCodeCode);
            row.setTimeSpentItemId(timeSpentItemId);
            row.setEmployeeFirstName(employeeFirstName);
            row.setEmployeeLastName(employeeLastName);
            row.setPositionName(null);
            row.setStandardPositionName(null);
            row.setTaskTypeName(taskTypeName);
            row.setTaskName(taskName);
            row.setTimeSpent(timeSpent);
            row.setDescription(description);
            row.setDay(day);
            row.setModifiedAt(modifiedAt);
            this.rows.add(row);
        }
    }    
    public void buildRateReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select tsi, ssrg, ssr from ProjectCode as pc inner join pc.timeSpentItems as tsi inner join tsi.employee as e inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s inner join s.standardSellingRateGroups as ssrg inner join ssrg.standardSellingRates as ssr inner join ssr.position as ssrp ";
        query += "where pc in (:projectCodes) ";
        query += "and tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null) ";
        query += "and tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null) ";
        query += "and ssrp=p ";
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("projectCodes", this.formProjectCodes);
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            TimeSpentItem timeSpentItem = (TimeSpentItem)tuple[0];
            StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)tuple[1];
            StandardSellingRate standardSellingRate = (StandardSellingRate)tuple[2];
            Long standardSellingRateGroupCurrencyId = standardSellingRateGroup.getCurrency().getId();
            BigDecimal standardSellingRateAmount = standardSellingRate.getAmount();
            Row row = getRow(timeSpentItem);
            if(row != null) {
                row.setStandardSellingRateAmount(standardSellingRateAmount);
                row.setStandardSellingRateGroupCurrencyId(standardSellingRateGroupCurrencyId);
            }
        }
    }
    Row getRow(TimeSpentItem timeSpentItem) {
        for(Row row : rows) {
            if(row.getTimeSpentItemId().equals(timeSpentItem.getId())) {
                return row;
            }
        }
        return null;
    }
    
}
