/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.web.comparators.StringWithNumbersComparator;
import com.mazars.management.web.forms.WorkInProgressReportFilter;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.GregorianCalendar;
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
public class WorkInProgressReport {
    public class Subreport {
        private ProjectCode projectCode;
        public ProjectCode getProjectCode() {
            return projectCode;
        }
        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }
        private List<Row> rows = new LinkedList<Row>();
        public List<Row> getRows() {
            return rows;
        }
        public void setRows(List<Row> rows) {
            this.rows = rows;
        }
    }
    public class Row {
        private Position position;
        private StandardPosition standardPosition;
        private Long spentTime;
        private BigDecimal averageCvStandardSellingRate;

        public BigDecimal getAverageCvStandardSellingRate() {
            return averageCvStandardSellingRate;
        }

        public void setAverageCvStandardSellingRate(BigDecimal averageCvStandardSellingRate) {
            this.averageCvStandardSellingRate = averageCvStandardSellingRate;
        }

        public Position getPosition() {
            return position;
        }

        public void setPosition(Position position) {
            this.position = position;
        }

        public StandardPosition getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(StandardPosition standardPosition) {
            this.standardPosition = standardPosition;
        }

        public Long getSpentTime() {
            return spentTime;
        }
        public void setSpentTime(Long spentTime) {
            this.spentTime = spentTime;
        }
    }

    public class QuotationRow extends Row  {
        private PositionQuotation positionQuotation;
        public PositionQuotation getPositionQuotation() {
            return positionQuotation;
        }
        public void setPositionQuotation(PositionQuotation positionQuotation) {
            this.positionQuotation = positionQuotation;
        }
    }
    public class FlatFeeRow extends Row {
        private PositionQuotation positionQuotation;
        public PositionQuotation getPositionQuotation() {
            return positionQuotation;
        }
        public void setPositionQuotation(PositionQuotation positionQuotation) {
            this.positionQuotation = positionQuotation;
        }
    }
    public class TimeSpentRow extends Row  {
        private PositionQuotation positionQuotation;
        public PositionQuotation getPositionQuotation() {
            return positionQuotation;
        }
        public void setPositionQuotation(PositionQuotation positionQuotation) {
            this.positionQuotation = positionQuotation;
        }
    }
    public class NoBudgetRow extends Row  {
    }

    public class RowComparator implements Comparator<Row> {
        private StringWithNumbersComparator stringWithNumbersComparator = new StringWithNumbersComparator();
        @Override
        public int compare(Row o1, Row o2) {
            if(o1.getStandardPosition().getSortValue() != o2.getStandardPosition().getSortValue()) {
                return o1.getStandardPosition().getSortValue().compareTo(o2.getStandardPosition().getSortValue());
            }
            return stringWithNumbersComparator.compare(o1.getPosition().getName(), o2.getPosition().getName());
        }
    }
    private Calendar endDate;
    private Map<Long, BigDecimal> currencyRates;
    private WorkInProgressReportFilter filter;
    private List<Subdepartment> subdepartments;
    private List<Subdepartment> displaySubdepartments = new LinkedList<Subdepartment>();
    private List<Subreport> subreports = new LinkedList<Subreport>();
    private Date createdAt;
    private List<Currency> currencies = new LinkedList<Currency>();
    private Currency mainCurrency;
    public WorkInProgressReport(Calendar endDate, Map<Long, BigDecimal> currencyRates, WorkInProgressReportFilter filter, List<Subdepartment> subdepartments) {
        this.endDate = endDate;
        this.currencyRates = currencyRates;
        this.filter = filter;
        this.subdepartments = subdepartments;
    }

    public WorkInProgressReportFilter getFilter() {
        return filter;
    }
    public void setFilter(WorkInProgressReportFilter filter) {
        this.filter = filter;
    }
    public List<Subreport> getSubreports() {
        return subreports;
    }
    public Date getCreatedAt() {
        return createdAt;
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
    public Currency getMainCurrency() {
        return mainCurrency;
    }
    public void setMainCurrency(Currency mainCurrency) {
        this.mainCurrency = mainCurrency;
    }
    public Calendar getEndDate() {
        return endDate;
    }
    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }
    public Map<Long, BigDecimal> getCurrencyRates() {
        return currencyRates;
    }
    public void setCurrencyRates(Map<Long, BigDecimal> currencyRates) {
        this.currencyRates = currencyRates;
    }
    
    public void build() {
        Calendar standardSellingRatesDay = new GregorianCalendar();
        CalendarUtil.truncateTime(standardSellingRatesDay);
        List<Subdepartment> filterSubdepartments = new LinkedList<Subdepartment>();
        if(filter != null) {
            Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
            if(filter.getSubdepartmentId() != null) {
                Subdepartment subdepartment = (Subdepartment)hs.get(Subdepartment.class, filter.getSubdepartmentId());
                filterSubdepartments.add(subdepartment);
            } else if(filter.getDepartmentId() != null) {
                Department department = (Department)hs.get(Department.class, filter.getDepartmentId());
                filterSubdepartments.addAll(department.getSubdepartments());
            } else if(filter.getOfficeId() != null) {
                Office office = (Office)hs.get(Office.class, filter.getOfficeId());
                filterSubdepartments.addAll(office.getSubdepartments());
            }
        }
        if(filterSubdepartments.size() > 0) {
            for(Subdepartment subdepartment : this.subdepartments) {
                for(Subdepartment filterSubdepartment : filterSubdepartments) {
                    if(subdepartment.getId().equals(filterSubdepartment.getId())) {
                        displaySubdepartments.add(subdepartment);
                        break;
                    }
                }
            }
        }  else {
            displaySubdepartments.addAll(this.subdepartments);
        }
        buildSpentTimeReport();
        buildNoBudgetReport();
        buildQuotationReport();
        sortRows();
        this.createdAt = new Date();
    }
    public void buildSpentTimeReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, p, sp, sum(tsi.timeSpent) from StandardPosition as sp inner join sp.positions as p inner join p.employeePositionHistoryItems as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.projectCode as pc inner join pc.subdepartment as s ";
        if(filter != null && filter.getActivityId() != null) {
            query += "inner join pc.activity as a ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "inner join pc.client as c  ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "inner join pc.client as c inner join c.group as g ";
        }
        query += "where (tsi.day<=:endDate) and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) and (pc.startDate<=:endDate or pc.startDate=null) and (pc.endDate>=:endDate or pc.endDate=null) ";
        query += "and s in (:subdepartments) ";
        if(filter != null && filter.getActivityId() != null) {
            query += "and a.id=:activityId ";
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            query += "and pc.periodType=:projectCodePeriodType ";
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            query += "and pc.year=:projectCodeYear ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "and c.id=:clientId ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "and g.id=:groupId ";
        }
        query += "and e.isAdministrator!=true ";
        query += "group by pc, p ";
        Query hq = hs.createQuery(query);
        hq.setParameter("endDate", endDate);
        hq.setParameterList("subdepartments", displaySubdepartments);
        if(filter != null && filter.getActivityId() != null) {
            hq.setParameter("activityId", filter.getActivityId());
        }
        if(filter != null && filter.getClientId() != null) {
            hq.setParameter("clientId", filter.getClientId());
        } else if(filter != null && filter.getGroupId() != null) {
            hq.setParameter("groupId", filter.getGroupId());
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            hq.setParameter("projectCodePeriodType", filter.getProjectCodePeriodType());
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            hq.setParameter("projectCodeYear", filter.getProjectCodeYear());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            Position position = (Position)tuple[1];
            StandardPosition standardPosition = (StandardPosition)tuple[2];
            Long spentTime = (Long)tuple[3];
            Subreport subreport = getSubreport(projectCode);

            FeesItem.Type type = null;
            FeesItem budget = projectCode.getFeesItem();
            if(budget != null) {
                type = budget.getType();
            }
            
            if(filter != null && filter.getBudgetType() != null) {
                if(type == null) {
                    if(! WorkInProgressReportFilter.BudgetType.NO_BUDGET.equals(filter.getBudgetType())) {
                        continue;
                    }
                } else {
                    if(! type.toString().equals(filter.getBudgetType().toString())) {
                        continue;
                    }
                }
            }

            if(subreport == null) {
                subreport = new Subreport();
                subreport.setProjectCode(projectCode);
                this.subreports.add(subreport);
            }
            Row row = getRow(subreport.getRows(), position);
            if(row == null) {
                if(type == null) {
                    row = new NoBudgetRow();
                } else if(FeesItem.Type.QUOTATION.equals(type)) {
                    row = new QuotationRow();
                } else if(FeesItem.Type.FLAT_FEE.equals(type)) {
                    row = new FlatFeeRow();
                } else if(FeesItem.Type.TIMESPENT.equals(type)) {
                    row = new TimeSpentRow();
                }
                row.setPosition(position);
                row.setStandardPosition(standardPosition);
                row.setSpentTime(spentTime);
                subreport.getRows().add(row);
            }
        }
    }
    public void buildNoBudgetReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "";
        query += "select pc, ssrg, ssr, p, sum(tsi.timeSpent) from StandardSellingRate as ssr inner join ssr.standardSellingRateGroup as ssrg inner join ssrg.subdepartment as s inner join s.projectCodes as pc ";
        query += "inner join pc.timeSpentItems as tsi inner join tsi.employee as e inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p ";
        if(filter != null && filter.getActivityId() != null) {
            query += "inner join pc.activity as a ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "inner join pc.client as c  ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "inner join pc.client as c inner join c.group as g ";
        }
        query += "where (pc.startDate<=:day or pc.startDate=null) and (pc.endDate>=:day or pc.endDate=null) ";
        query += "and p=ssr.position ";
        query += "and (tsi.day<=:day) and (tsi.day>=ephi.start and (tsi.day<=ephi.end or ephi.end=null)) ";
        query += "and (tsi.day>=ssrg.start and (tsi.day<=ssrg.end or ssrg.end=null)) ";
        query += "and s in (:subdepartments) ";
        if(filter != null && filter.getActivityId() != null) {
            query += "and a.id=:activityId ";
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            query += "and pc.periodType=:projectCodePeriodType ";
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            query += "and pc.year=:projectCodeYear ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "and c.id=:clientId ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "and g.id=:groupId ";
        }
        query += "group by ssr ";

        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", displaySubdepartments);
        hq.setParameter("day", endDate);
        if(filter != null && filter.getActivityId() != null) {
            hq.setParameter("activityId", filter.getActivityId());
        }
        if(filter != null && filter.getClientId() != null) {
            hq.setParameter("clientId", filter.getClientId());
        } else if(filter != null && filter.getGroupId() != null) {
            hq.setParameter("groupId", filter.getGroupId());
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            hq.setParameter("projectCodePeriodType", filter.getProjectCodePeriodType());
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            hq.setParameter("projectCodeYear", filter.getProjectCodeYear());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();

        List<ProjectCode> projectCodes = new LinkedList<ProjectCode>();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            boolean exists = false;
            for(ProjectCode projectCode1 : projectCodes) {
                if(projectCode1.getId().equals(projectCode.getId())) {
                    exists = true;
                    break;
                }
            }
            if(! exists) {
                projectCodes.add(projectCode);
            }
        }
        for(ProjectCode projectCode : projectCodes) {
            List<Object[]> selection1 = new LinkedList<Object[]>();
            for(Object[] tuple : selection) {
                ProjectCode projectCode1 = (ProjectCode)tuple[0];
                if(projectCode.getId().equals(projectCode1.getId())) {
                    selection1.add(tuple);
                }
            }    
            Map<Long, Long> perPositionTimeSpents = new HashMap<Long, Long>();
            Map<Long, BigDecimal> perPositionAmounts = new HashMap<Long, BigDecimal>();            
            for(Object[] tuple : selection1) {
                StandardSellingRateGroup standardSellingRateGroup = (StandardSellingRateGroup)tuple[1];
                StandardSellingRate standardSellingRate = (StandardSellingRate)tuple[2];
                Position position = (Position)tuple[3];
                Long timeSpent = (Long)tuple[4];
                BigDecimal timeSpentHours = new BigDecimal(0);
                if(timeSpent != null) {
                    timeSpentHours = new BigDecimal(timeSpent / 60);
                }
                BigDecimal amount = standardSellingRate.getAmount().multiply(timeSpentHours);
                BigDecimal amountCv = null;
                if(standardSellingRateGroup.getCurrency().getId().equals(mainCurrency.getId())) {
                    amountCv = amount.multiply(new BigDecimal(1));
                } else {
                    amountCv = amount.multiply(currencyRates.get(standardSellingRateGroup.getCurrency().getId()));
                }
                
                Long perPositionTimeSpent = perPositionTimeSpents.get(position.getId());
                if(perPositionTimeSpent == null) {
                    perPositionTimeSpent = new Long(0);
                }
                perPositionTimeSpent += timeSpent;
                perPositionTimeSpents.put(position.getId(), perPositionTimeSpent);
                
                BigDecimal perPositionAmount = perPositionAmounts.get(position.getId());
                if(perPositionAmount == null) {
                    perPositionAmount = new BigDecimal(0.0);
                }
                perPositionAmount = perPositionAmount.add(amountCv);
                perPositionAmounts.put(position.getId(), perPositionAmount);
            }
            Subreport subreport = getSubreport(projectCode);
            for(Row row : subreport.getRows()) {
                Long perPositionTimeSpent = perPositionTimeSpents.get(row.getPosition().getId());
                BigDecimal perPositionAmount = perPositionAmounts.get(row.getPosition().getId());
                if(perPositionAmount != null && perPositionTimeSpent != null && perPositionTimeSpent != 0 ) {
                    BigDecimal averageCvStandardSellingRate = perPositionAmount.divide(new BigDecimal(perPositionTimeSpent), 2, RoundingMode.HALF_UP);
                    row.setAverageCvStandardSellingRate(averageCvStandardSellingRate);
                }
            }
        }
    }
    public void buildQuotationReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        // budget != null because of join
        String query = "";
        query += "select distinct pc, pq from PositionQuotation as pq inner join pq.feesItem as fi inner join fi.projectCode as pc inner join pc.subdepartment as s ";
        if(filter != null && filter.getActivityId() != null) {
            query += "inner join pc.activity as a ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "inner join pc.client as c  ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "inner join pc.client as c inner join c.group as g ";
        }
        query += "where (pc.startDate<=:day or pc.startDate=null) and (pc.endDate>=:day or pc.endDate=null) ";
        query += "and s in (:subdepartments) ";
        if(filter != null && filter.getActivityId() != null) {
            query += "and a.id=:activityId ";
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            query += "and pc.periodType=:projectCodePeriodType ";
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            query += "and pc.year=:projectCodeYear ";
        }
        if(filter != null && filter.getClientId() != null) {
            query += "and c.id=:clientId ";
        } else if(filter != null && filter.getGroupId() != null) {
            query += "and g.id=:groupId ";
        }
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", displaySubdepartments);
        hq.setParameter("day", endDate);
        if(filter != null && filter.getActivityId() != null) {
            hq.setParameter("activityId", filter.getActivityId());
        }
        if(filter != null && filter.getClientId() != null) {
            hq.setParameter("clientId", filter.getClientId());
        } else if(filter != null && filter.getGroupId() != null) {
            hq.setParameter("groupId", filter.getGroupId());
        }
        if(filter != null && filter.getProjectCodePeriodType() != null) {
            hq.setParameter("projectCodePeriodType", filter.getProjectCodePeriodType());
        }
        if(filter != null && filter.getProjectCodeYear() != null) {
            hq.setParameter("projectCodeYear", filter.getProjectCodeYear());
        }
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            ProjectCode projectCode = (ProjectCode)tuple[0];
            PositionQuotation positionQuotation = (PositionQuotation)tuple[1];
            Subreport subreport = getSubreport(projectCode);
            if(subreport != null) {
                FeesItem.Type type = projectCode.getFeesItem().getType();
                for(Row row : subreport.getRows()) {
                    if(row.getPosition().getId().equals(positionQuotation.getPosition().getId())) {
                        if(FeesItem.Type.QUOTATION.equals(type)) {
                            QuotationRow quotationRow = (QuotationRow)row;
                            quotationRow.setPositionQuotation(positionQuotation);
                        } else if(FeesItem.Type.FLAT_FEE.equals(type)) {
                            FlatFeeRow flatFeeRow = (FlatFeeRow)row;
                            flatFeeRow.setPositionQuotation(positionQuotation);
                        } else if(FeesItem.Type.TIMESPENT.equals(type)) {
                            TimeSpentRow timeSpentRow = (TimeSpentRow)row;
                            timeSpentRow.setPositionQuotation(positionQuotation);
                        }
                    }
                }
            }
        }
    }

    private void sortRows() {
        for(Subreport subreport : subreports) {
            List<Row> rows = subreport.getRows();
            Collections.sort(rows, new RowComparator());
        }
    }
    private Subreport getSubreport(ProjectCode projectCode) {
        for(Subreport subreport : this.subreports) {
            if(subreport.getProjectCode().getId().equals(projectCode.getId())) {
                return subreport;
            }
        }
        return null;
    }
    private Row getRow(List<Row> rows, Position position) {
        for(Row row : rows) {
            if(row.getPosition().getId().equals(position.getId())) {
                return row;
            }
        }
        return null;
    }
}
