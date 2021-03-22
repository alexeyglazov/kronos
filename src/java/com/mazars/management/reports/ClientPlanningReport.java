/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.EmployeePositionHistoryItemUtils;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.util.PlanningItemUtil;
import com.mazars.management.db.vo.ClientVO;
import com.mazars.management.db.vo.CurrencyVO;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import com.mazars.management.web.forms.ClientPlanningReportForm;
import com.mazars.management.web.vo.PlanningToolInfo;
import com.mazars.management.web.vo.PlanningToolInfo.PlanningTypeVO;
import com.mazars.management.web.vo.PlanningToolInfo.PositionVO;
import java.math.BigDecimal;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ClientPlanningReport {
    public class RowComparator implements Comparator<ClientPlanningReport.Row> {
        @Override
        public int compare(ClientPlanningReport.Row o1, ClientPlanningReport.Row o2) {
            int result = 0;
            Integer standardPositionSortValue1 = 0;
            Integer standardPositionSortValue2 = 0;
            if(o1.getStandardPosition() != null) {
                standardPositionSortValue1 = o1.getStandardPosition().getSortValue();
            }
            if(o2.getStandardPosition() != null) {
                standardPositionSortValue2 = o2.getStandardPosition().getSortValue();
            }
            result = standardPositionSortValue1.compareTo(standardPositionSortValue2);
            if(result != 0) {
                return result;
            }
            
            
            Integer positionSortValue1 = 0;
            Integer positionSortValue2 = 0;
            if(o1.getPosition() != null) {
                positionSortValue1 = o1.getPosition().getSortValue();
            }
            if(o2.getStandardPosition() != null) {
                positionSortValue2 = o2.getPosition().getSortValue();
            }
            result = positionSortValue1.compareTo(positionSortValue2);
            if(result != 0) {
                return result;
            }
            
            BigDecimal standardSellingRateAmount1 = new BigDecimal(0);
            BigDecimal standardSellingRateAmount2 = new BigDecimal(0);
            if(o1.getStandardSellingRateAmount() != null) {
                standardSellingRateAmount1 = o1.getStandardSellingRateAmount();
            }
            if(o2.getStandardSellingRateAmount() != null) {
                standardSellingRateAmount2 = o2.getStandardSellingRateAmount();
            }
            result = standardSellingRateAmount1.compareTo(standardSellingRateAmount2);
            if(result != 0) {
                return result;
            }
           
            return 0;
        }
    }
    public class Row {
        PlanningToolInfo.PositionVO position;
        PlanningToolInfo.StandardPositionVO standardPosition;
        YearMonthDate startDate;
        YearMonthDate endDate;
        private BigDecimal standardSellingRateAmount;
        private Long currencyId;
        private Map<Long, BigDecimal> timeItems = new HashMap<Long, BigDecimal>();

        public PlanningToolInfo.PositionVO getPosition() {
            return position;
        }

        public void setPosition(PlanningToolInfo.PositionVO position) {
            this.position = position;
        }

        public Map<Long, BigDecimal> getTimeItems() {
            return timeItems;
        }

        public void setTimeItems(Map<Long, BigDecimal> timeItems) {
            this.timeItems = timeItems;
        }

        public PlanningToolInfo.StandardPositionVO getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(PlanningToolInfo.StandardPositionVO standardPosition) {
            this.standardPosition = standardPosition;
        }

        public YearMonthDate getStartDate() {
            return startDate;
        }

        public void setStartDate(YearMonthDate startDate) {
            this.startDate = startDate;
        }

        public YearMonthDate getEndDate() {
            return endDate;
        }

        public void setEndDate(YearMonthDate endDate) {
            this.endDate = endDate;
        }

        public BigDecimal getStandardSellingRateAmount() {
            return standardSellingRateAmount;
        }

        public void setStandardSellingRateAmount(BigDecimal standardSellingRateAmount) {
            this.standardSellingRateAmount = standardSellingRateAmount;
        }

        public Long getCurrencyId() {
            return currencyId;
        }

        public void setCurrencyId(Long currencyId) {
            this.currencyId = currencyId;
        }

    }
    public class Subreport {
        private PlanningToolInfo.ClientVO client;
        private List<Row> rows = new LinkedList<Row>();
        private Set<PlanningToolInfo.PlanningTypeVO> planningTypes = new HashSet<PlanningToolInfo.PlanningTypeVO>();
        private Set<CurrencyVO> currencies = new HashSet<CurrencyVO>();

        public Subreport() {
        }

        public Set<PlanningTypeVO> getPlanningTypes() {
            return planningTypes;
        }

        public void setPlanningTypes(Set<PlanningTypeVO> planningTypes) {
            this.planningTypes = planningTypes;
        }

        public Set<CurrencyVO> getCurrencies() {
            return currencies;
        }

        public void setCurrencies(Set<CurrencyVO> currencies) {
            this.currencies = currencies;
        }

        public PlanningToolInfo.ClientVO getClient() {
            return client;
        }

        public void setClient(PlanningToolInfo.ClientVO client) {
            this.client = client;
        }

        public List<Row> getRows() {
            return rows;
        }
        public void setRows(List<Row> rows) {
            this.rows = rows;
        }
        public Row getRow(PlanningToolInfo.PositionVO position, YearMonthDate day) {
            for(Row row : rows) {
                if(row.getPosition() != null && row.getPosition().getId().equals(position.getId())) {
                    if(row.getStartDate() != null && 
                            day.compareTo(row.getStartDate()) >= 0 && 
                            row.getEndDate() != null &&
                            day.compareTo(row.getEndDate()) <= 0) {
                        return row;
                    }
                }
            }
            for(Row row : rows) {
                if(row.getPosition() != null && row.getPosition().getId().equals(position.getId())) {
                    if(row.getStartDate() == null && row.getEndDate() == null) {
                        return row;
                    }
                }
            }            
            return null;        
        }
        public Row getNoPositionRow() {
            for(Row row : rows) {
                if(row.getPosition() == null) {
                    return row;
                }
            }
            return null;
        }
        public CurrencyVO getCurrency(Long currencyId) {
            for(CurrencyVO currency : currencies) {
                if(currency.getId().equals(currencyId)) {
                    return currency;
                }
            }          
            return null;        
        }
    }
    
    private List<Subreport> subreports = new LinkedList<Subreport>();
    private Group formGroup;
    private Client formClient;
    private Subdepartment formSubdepartment;
    private Calendar formStartDate;
    private Calendar formEndDate;    
    private Date createdAt;
    private Employee currentUser;
    private Module module;
    private ClientPlanningReportForm form;
    

    public ClientPlanningReport(ClientPlanningReportForm form, Module module, Employee currentUser) {
        this.form = form;
        this.module = module;
        this.currentUser = currentUser;        
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getGroupId() != null) {
            this.formGroup = (Group)hs.get(Group.class, new Long(form.getGroupId()));
        }
        if(this.form.getClientId() != null) {
            this.formClient = (Client)hs.get(Client.class, new Long(form.getClientId()));
        }
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        this.formStartDate = form.getStartDate().getCalendar();
        this.formEndDate = form.getEndDate().getCalendar();
    }

    public Group getFormGroup() {
        return formGroup;
    }
    public void setFormGroup(Group formGroup) {
        this.formGroup = formGroup;
    }
    public Client getFormClient() {
        return formClient;
    }
    public void setFormClient(Client formClient) {
        this.formClient = formClient;
    }
    public List<Subreport> getSubreports() {
        return subreports;
    }
    public void setSubreports(List<Subreport> subreports) {
        this.subreports = subreports;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public Calendar getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(Calendar formStartDate) {
        this.formStartDate = formStartDate;
    }

    public Calendar getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(Calendar formEndDate) {
        this.formEndDate = formEndDate;
    }


    public Date getCreatedAt() {
        return createdAt;
    }

    public void build() {
        List<PlanningItemUtil.DescribedPlanningItem> totalDescribedPlanningItems = PlanningItemUtil.getDescribedPlanningItems(formSubdepartment, formStartDate, formEndDate); 
        PlanningToolInfo totalPlanningToolInfo = new PlanningToolInfo();
        totalPlanningToolInfo.addDescribedPlanningItems(totalDescribedPlanningItems);
        totalPlanningToolInfo.assignTime();
        List<StandardSellingRateGroup> standardSellingRateGroups = StandardSellingRateGroup.get(formSubdepartment, formStartDate, formEndDate);
        List<Client> clients = createClientsList();
        for(Client client : clients) {
            PlanningToolInfo planningToolInfo = getPlanningToolInfo(client);

            copyTimeInfo(totalPlanningToolInfo, planningToolInfo);
            Subreport subreport = new Subreport();
            subreport.setClient(new PlanningToolInfo.ClientVO(client));
            distributeTime(subreport, planningToolInfo, standardSellingRateGroups);
            subreports.add(subreport);
        }
        this.createdAt = new Date();
    }
    public List<Client> createClientsList() {
        List<Client> clients = new LinkedList<Client>();
        if(formClient != null) {
            clients.add(formClient);
        } else if(formGroup != null) {
            clients.addAll(formGroup.getClients());
        }    
        return clients;
    }
    public PlanningToolInfo getPlanningToolInfo(Client client) {
        List<PlanningItemUtil.DescribedPlanningItem> describedPlanningItems = PlanningItemUtil.getDescribedPlanningItems(client, formStartDate, formEndDate); 
        List<Long> employeeIds = PlanningItemUtil.getEmployeeIds(describedPlanningItems);
        List<EmployeePositionHistoryItemUtils.DescribedCarreerItem> describedCarreerItems = EmployeePositionHistoryItemUtils.getDescribedCarreerItemsWithCarreer(employeeIds, formStartDate, formEndDate);
        PlanningToolInfo planningToolInfo = new PlanningToolInfo(describedCarreerItems, describedPlanningItems, formStartDate, formEndDate);
        return planningToolInfo;
    }
    public void copyTimeInfo(PlanningToolInfo fromPlanningToolInfo, PlanningToolInfo toPlanningToolInfo) {
        for(PlanningToolInfo.PlanningItemVO toPlanningItem : toPlanningToolInfo.getPlanningItems() ) {
            PlanningToolInfo.PlanningItemVO fromPlanningItem = fromPlanningToolInfo.getPlanningItem(toPlanningItem.getId());
            if(fromPlanningItem != null) {
                toPlanningItem.setTimes(fromPlanningItem.getTimes());
            }
        }
    }
    public void distributeTime(Subreport subreport, PlanningToolInfo planningToolInfo, List<StandardSellingRateGroup> standardSellingRateGroups) {
        YearMonthDate reportStartDate = new YearMonthDate(formStartDate);
        YearMonthDate reportEndDate = new YearMonthDate(formEndDate);
        for(PlanningToolInfo.PlanningItemVO planningItem : planningToolInfo.getPlanningItems()) {
            PlanningToolInfo.PlanningGroupVO planningGroup = planningToolInfo.getPlanningGroup(planningItem.getPlanningGroupId());
            PlanningTypeVO planningType = planningToolInfo.getPlanningType(planningGroup.getPlanningTypeId());
            if(planningType.getIsInternal()) {
                continue;
            }
            Long employeeId = planningItem.getEmployeeId();
            for(YearMonthDate date : planningItem.getTimes().keySet()) {
                BigDecimal time = planningItem.getTimes().get(date);
                if(time == null) {
                    continue;
                }    
                if(date.compareTo(reportStartDate) < 0 || date.compareTo(reportEndDate) > 0) {
                    continue;
                }             
                PlanningToolInfo.PositionVO position = planningToolInfo.getPosition(employeeId, date);
                Row row = null;
                if(position == null) {
                    row = subreport.getNoPositionRow();
                } else {
                    row = subreport.getRow(position, date);
                }
                if(row == null) {
                    row = new Row();
                    if(position != null) {
                        row.setPosition(position);
                        row.setStandardPosition(planningToolInfo.getStandardPosition(position.getStandardPositionId()));
                        StandardSellingRateGroup standardSellingRateGroup = getStandardSellingRateGroup(standardSellingRateGroups, date);
                        if(standardSellingRateGroup != null) {
                            if(subreport.getCurrency(standardSellingRateGroup.getCurrency().getId()) == null) {
                                subreport.getCurrencies().add(new CurrencyVO(standardSellingRateGroup.getCurrency()));
                            }
                            row.setCurrencyId(standardSellingRateGroup.getCurrency().getId());
                            if(standardSellingRateGroup.getStart() != null) {
                                row.setStartDate(new YearMonthDate(standardSellingRateGroup.getStart()));
                            } else {
                                row.setStartDate(new YearMonthDate(formStartDate));
                            }
                            if(standardSellingRateGroup.getEnd() != null) {
                                row.setEndDate(new YearMonthDate(standardSellingRateGroup.getEnd()));
                            } else {
                                row.setEndDate(new YearMonthDate(formEndDate));
                            }
                            for(StandardSellingRate standardSellingRate : standardSellingRateGroup.getStandardSellingRates()) {
                                if(position.getId().equals(standardSellingRate.getPosition().getId())) {
                                    row.setStandardSellingRateAmount(standardSellingRate.getAmount());
                                }
                            }                        
                        }
                    }
                    subreport.getRows().add(row);
                }
                
                Map<Long, BigDecimal> timeItems = row.getTimeItems();
                BigDecimal tmpTime = timeItems.get(planningType.getId());
                if(tmpTime == null) {
                    timeItems.put(planningType.getId(), time);
                    subreport.getPlanningTypes().add(planningType);
                } else {
                    timeItems.put(planningType.getId(), tmpTime.add(time));
                }
            }
        }    
        Collections.sort(subreport.getRows(), new RowComparator());
    }
    public StandardSellingRateGroup getStandardSellingRateGroup(List<StandardSellingRateGroup> standardSellingRateGroups, YearMonthDate date) {
        for(StandardSellingRateGroup standardSellingRateGroup : standardSellingRateGroups) {
            if(
                    (standardSellingRateGroup.getStart() == null ||
                    date.compareTo(new YearMonthDate(standardSellingRateGroup.getStart())) >= 0)
                    &&
                    (standardSellingRateGroup.getEnd() == null ||
                    date.compareTo(new YearMonthDate(standardSellingRateGroup.getEnd())) <= 0)
                    ) {
                return standardSellingRateGroup;
            }
        }
        return null;
    }
}
