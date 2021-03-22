/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.domain.EmployeePositionHistoryItem.ContractType;
import com.mazars.management.db.domain.LeavesItem.Type;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.db.vo.YearMonthDateRange;
import java.util.*;
import org.hibernate.Query;
import org.hibernate.Session;
/**
 *
 * @author glazov
 */
public class ProductivityAndCompletionReport {
    public class RowComparator implements Comparator<Row> {
        public int compare(Row o1, Row o2) {
            int a = o1.getEmployeeUserName().compareTo(o2.getEmployeeUserName());
            if(a != 0) {
                return a;
            } else {
                return o1.getEntryDate().compareTo(o2.getEntryDate());
            }
        }
    }
    public class Row {
        private Long employeePositionHistoryItemId;
        private Long employeeId;
        private String employeeUserName;
        private String employeeFirstName;
        private String employeeLastName;
        private Long positionId;
        private String positionName;
        private String standardPositionName;
        private String subdepartmentName;
        private Long notIdleDaysCount;
        private Long projectTimespent;
        private Map<Long, Long> idleTimespentItems = new HashMap<Long, Long>();
        private Long notIdleInternalTimespent;
        private LeavesItem.Type leavesItemType;
        private Calendar entryDate;
        private Calendar exitDate;
        private Integer workingDaysCount;
        private EmployeePositionHistoryItem.ContractType contractType;
        private Integer partTimePercentage;

        public Row() {
        }

        public ContractType getContractType() {
            return contractType;
        }

        public void setContractType(ContractType contractType) {
            this.contractType = contractType;
        }

        public Integer getPartTimePercentage() {
            return partTimePercentage;
        }

        public void setPartTimePercentage(Integer partTimePercentage) {
            this.partTimePercentage = partTimePercentage;
        }

        public Long getNotIdleDaysCount() {
            return notIdleDaysCount;
        }

        public void setNotIdleDaysCount(Long notIdleDaysCount) {
            this.notIdleDaysCount = notIdleDaysCount;
        }

        public Long getEmployeePositionHistoryItemId() {
            return employeePositionHistoryItemId;
        }

        public void setEmployeePositionHistoryItemId(Long employeePositionHistoryItemId) {
            this.employeePositionHistoryItemId = employeePositionHistoryItemId;
        }

        public Integer getWorkingDaysCount() {
            return workingDaysCount;
        }

        public void setWorkingDaysCount(Integer workingDaysCount) {
            this.workingDaysCount = workingDaysCount;
        }

        public String getEmployeeUserName() {
            return employeeUserName;
        }

        public void setEmployeeUserName(String employeeUserName) {
            this.employeeUserName = employeeUserName;
        }

        public Long getEmployeeId() {
            return employeeId;
        }

        public void setEmployeeId(Long employeeId) {
            this.employeeId = employeeId;
        }

        public Map<Long, Long> getIdleTimespentItems() {
            return idleTimespentItems;
        }

        public void setIdleTimespentItems(Map<Long, Long> idleTimespentItems) {
            this.idleTimespentItems = idleTimespentItems;
        }

        public Long getNotIdleInternalTimespent() {
            return notIdleInternalTimespent;
        }

        public void setNotIdleInternalTimespent(Long notIdleInternalTimespent) {
            this.notIdleInternalTimespent = notIdleInternalTimespent;
        }

        public Long getProjectTimespent() {
            return projectTimespent;
        }

        public void setProjectTimespent(Long projectTimespent) {
            this.projectTimespent = projectTimespent;
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

        public Long getPositionId() {
            return positionId;
        }

        public void setPositionId(Long positionId) {
            this.positionId = positionId;
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

        public String getSubdepartmentName() {
            return subdepartmentName;
        }

        public void setSubdepartmentName(String subdepartmentName) {
            this.subdepartmentName = subdepartmentName;
        }

        public Calendar getEntryDate() {
            return entryDate;
        }

        public void setEntryDate(Calendar entryDate) {
            this.entryDate = entryDate;
        }

        public Calendar getExitDate() {
            return exitDate;
        }

        public void setExitDate(Calendar exitDate) {
            this.exitDate = exitDate;
        }

        public Type getLeavesItemType() {
            return leavesItemType;
        }

        public void setLeavesItemType(Type leavesItemType) {
            this.leavesItemType = leavesItemType;
        }
        public Long getTotalTimeSpent() {
            Long total = new Long(0);
            total += projectTimespent;
            for(Long idleKey : idleTimespentItems.keySet()) {
                total += idleTimespentItems.get(idleKey);
            }
            total += notIdleInternalTimespent;
            return total;        
        }
        public Double getCompletion() {
            Double completion = null;
            Long total = getTotalTimeSpent();
            if(workingDaysCount != null && workingDaysCount != 0) {
                completion = ((double)total) / (workingDaysCount * 8 * 60);
                if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(contractType)) {
                    if(partTimePercentage != null && partTimePercentage != 0) {
                        completion = 100.0 * completion / partTimePercentage;
                    } else {
                        completion = 0.0;
                    }
                }
            }
            return completion;        
        }
    }
    private List<Row> rows = new LinkedList<Row>();
    private List<Task> idleTasks = new LinkedList<Task>();
    private Calendar startDate;
    private Calendar endDate;
    private Employee currentUser;
    private List<Subdepartment> subdepartments;
    private List<YearMonthDate> simpleFreedays = new LinkedList<YearMonthDate>();   
    private Date createdAt;

    public ProductivityAndCompletionReport(Calendar startDate, Calendar endDate, List<Subdepartment> subdepartments, Employee currentUser) {
        this.currentUser = currentUser;
        
        this.startDate = startDate;
        this.endDate = endDate;
        this.subdepartments = subdepartments;
    }

    public List<Task> getIdleTasks() {
        return idleTasks;
    }

    public void setIdleTasks(List<Task> idleTasks) {
        this.idleTasks = idleTasks;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public Calendar getEndDate() {
        return endDate;
    }

    public void setEndDate(Calendar endDate) {
        this.endDate = endDate;
    }

    public Calendar getStartDate() {
        return startDate;
    }

    public void setStartDate(Calendar startDate) {
        this.startDate = startDate;
    }

    public List<Subdepartment> getSubdepartments() {
        return subdepartments;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setSubdepartments(List<Subdepartment> subdepartments) {
        this.subdepartments = subdepartments;
    }

    public void build() {
        List<Freeday> freedays = Freeday.getAllByCountryAndRange(this.currentUser.getCountry(), this.startDate, this.endDate);
        for(Freeday freeday : freedays) {
            simpleFreedays.add(new YearMonthDate(freeday.getDate()));
        }
        
        idleTasks = Task.getIdleTasks();
        buildEmployeePositionReport();
        buildTimespentReport();
        buildLeaveReport();
        buildNotIdleDaysReport();
        Collections.sort(rows, new RowComparator());
        this.createdAt = new Date();
    }
    public void buildEmployeePositionReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        // NON_USER and Administrator should be excluded
        String query = "";
        query += "select distinct ephi from Employee as e inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s inner join p.standardPosition as sp ";
        query += "where ("
                + "(ephi.start>=:startDate and ephi.start<=:endDate) or "
                + "(ephi.end!=null and ephi.end>=:startDate and ephi.end<=:endDate) or "
                + "(ephi.start<:startDate and (ephi.end=null or ephi.end>:endDate)) "
                + ") "
                + "and s in (:subdepartments) ";
        query += "and e.isAdministrator!=true ";
        Query hq = hs.createQuery(query);
        hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq.setParameterList("subdepartments", subdepartments);
        List<EmployeePositionHistoryItem> selection = (List<EmployeePositionHistoryItem>)hq.list();
        for(EmployeePositionHistoryItem employeePositionHistoryItem : selection) {
            Employee employee = employeePositionHistoryItem.getEmployee();
            if(Employee.Profile.NON_USER.equals(employee.getProfile()) || employee.getIsAdministrator()) {
                continue;
            }
            Position position = employeePositionHistoryItem.getPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            StandardPosition standardPosition = position.getStandardPosition();
            Row row = new Row();
            row.setEmployeePositionHistoryItemId(employeePositionHistoryItem.getId());
            row.setEmployeeId(employee.getId());
            row.setEmployeeUserName(employee.getUserName());
            row.setEmployeeFirstName(employee.getFirstName());
            row.setEmployeeLastName(employee.getLastName());
            row.setEntryDate(employeePositionHistoryItem.getStart());
            row.setExitDate(employeePositionHistoryItem.getEnd());
            row.setPositionId(position.getId());
            row.setPositionName(position.getName());
            row.setStandardPositionName(standardPosition.getName());
            row.setSubdepartmentName(subdepartment.getName());
            row.setContractType(employeePositionHistoryItem.getContractType());
            row.setPartTimePercentage(employeePositionHistoryItem.getPartTimePercentage());

            row.setProjectTimespent(new Long(0));
            row.setNotIdleInternalTimespent(new Long(0));
            for(Task task : idleTasks) {
                row.getIdleTimespentItems().put(task.getId(), new Long(0));
            }
            
            YearMonthDateRange reportRange = new YearMonthDateRange(new YearMonthDate(startDate), new YearMonthDate(endDate));
            Calendar positionStartCalendar = row.getEntryDate();
            Calendar positionEndCalendar = row.getExitDate();
            YearMonthDate positionStart = null;
            YearMonthDate positionEnd = null;
            if(positionStartCalendar != null) {
                positionStart = new YearMonthDate(positionStartCalendar);
            }
            if(positionEndCalendar != null) {
                positionEnd = new YearMonthDate(positionEndCalendar);
            }
            YearMonthDateRange positionRange = new YearMonthDateRange(positionStart, positionEnd);
            YearMonthDateRange realPositionRange = YearMonthDateRange.getIntersection(reportRange, positionRange);
            int workingDaysCount = 0;
            if(realPositionRange != null) {
                workingDaysCount = YearMonthDate.getDaysCountInRangeWithoutDays(realPositionRange.getStart(), realPositionRange.getEnd(), simpleFreedays);

            }
            row.setWorkingDaysCount(workingDaysCount);
            rows.add(row);
        }
    }
    public void buildTimespentReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        // NON_USER and Administrator should be excluded
        List<Long> employeePositionHistoryItemIds = new LinkedList<Long>();
        for(Row row : rows) {
            employeePositionHistoryItemIds.add(row.getEmployeePositionHistoryItemId());
        }

        String query1 = "";
        query1 += "select ephi, sum(tsi.timeSpent) from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query1 += "where tsi.day>=:startDate and tsi.day<=:endDate and ephi.id in (:employeePositionHistoryItemIds) ";
        query1 += "and tsi.day>=ephi.start and (ephi.end=null or tsi.day<=ephi.end) ";
        query1 += "and tt.isInternal=false ";
        //query1 += "and e.isAdministrator!=true ";
        query1 += "group by ephi ";
        Query hq1 = hs.createQuery(query1);
        hq1.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq1.setParameterList("employeePositionHistoryItemIds", employeePositionHistoryItemIds);
        List<Object[]> selection1 = (List<Object[]>)hq1.list();
        for(Object[] tuple : selection1) {
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[0];
            Long projectTimeSpent = (Long)tuple[1];
            Row row = getRowByEmployeePositionHistoryItemId(employeePositionHistoryItem.getId());
            row.setProjectTimespent(projectTimeSpent);
        }


        String query2 = "";
        query2 += "select ephi, sum(tsi.timeSpent) from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query2 += "where tsi.day>=:startDate and tsi.day<=:endDate and ephi.id in (:employeePositionHistoryItemIds) ";
        query2 += "and tsi.day>=ephi.start and (ephi.end=null or tsi.day<=ephi.end) ";
        query2 += "and t.isIdle=false and tt.isInternal=true ";
        //query2 += "and e.isAdministrator!=true ";
        query2 += "group by ephi ";
        Query hq2 = hs.createQuery(query2);
        hq2.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq2.setParameterList("employeePositionHistoryItemIds", employeePositionHistoryItemIds);
        List<Object[]> selection2 = (List<Object[]>)hq2.list();
        for(Object[] tuple : selection2) {
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[0];
            Long notIdleInternalTimespent = (Long)tuple[1];
            Row row = getRowByEmployeePositionHistoryItemId(employeePositionHistoryItem.getId());
            row.setNotIdleInternalTimespent(notIdleInternalTimespent);
        }


        String query3 = "";
        query3 += "select ephi, sum(tsi.timeSpent), t from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t inner join t.taskType as tt ";
        query3 += "where tsi.day>=:startDate and tsi.day<=:endDate and ephi.id in (:employeePositionHistoryItemIds) ";
        query3 += "and tsi.day>=ephi.start and (ephi.end=null or tsi.day<=ephi.end) ";
        query3 += "and t.isIdle=true and tt.isInternal=true ";
        //query3 += "and e.isAdministrator!=true ";
        query3 += "group by ephi, t ";
        Query hq3 = hs.createQuery(query3);
        hq3.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq3.setParameterList("employeePositionHistoryItemIds", employeePositionHistoryItemIds);
        List<Object[]> selection3 = (List<Object[]>)hq3.list();
        for(Object[] tuple : selection3) {
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[0];
            Long idleTimespent = (Long)tuple[1];
            Task task = (Task)tuple[2];
            Row row = getRowByEmployeePositionHistoryItemId(employeePositionHistoryItem.getId());
            row.getIdleTimespentItems().put(task.getId(), idleTimespent);
        }
    }
    public void buildNotIdleDaysReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        // NON_USER and Administrator should be excluded
        List<Long> employeePositionHistoryItemIds = new LinkedList<Long>();
        for(Row row : rows) {
            employeePositionHistoryItemIds.add(row.getEmployeePositionHistoryItemId());
        }

        String query1 = "";
        query1 += "select ephi, tsi.day from EmployeePositionHistoryItem as ephi inner join ephi.employee as e inner join e.timeSpentItems as tsi inner join tsi.task as t ";
        query1 += "where tsi.day>=:startDate and tsi.day<=:endDate and ephi.id in (:employeePositionHistoryItemIds) ";
        query1 += "and tsi.day>=ephi.start and (ephi.end=null or tsi.day<=ephi.end) ";
        query1 += "and t.isIdle=false ";
        //query1 += "and e.isAdministrator!=true ";
        query1 += "group by ephi, tsi.day ";
        Query hq1 = hs.createQuery(query1);
        hq1.setParameter("startDate", startDate).setParameter("endDate", endDate);
        hq1.setParameterList("employeePositionHistoryItemIds", employeePositionHistoryItemIds);
        List<Object[]> selection1 = (List<Object[]>)hq1.list();

        // tsi.day can be different even for the same day and thus the groupping is not perfect
        Map<EmployeePositionHistoryItem, List<YearMonthDate>> notIdleDays = new HashMap<EmployeePositionHistoryItem, List<YearMonthDate>>();
        for(Object[] tuple : selection1) {
            EmployeePositionHistoryItem employeePositionHistoryItem = (EmployeePositionHistoryItem)tuple[0];
            YearMonthDate day = new YearMonthDate((Calendar)tuple[1]);
            List<YearMonthDate> ephiDays = notIdleDays.get(employeePositionHistoryItem);
            if(ephiDays == null ) {
                ephiDays = new LinkedList<YearMonthDate>();
                ephiDays.add(day);
                notIdleDays.put(employeePositionHistoryItem, ephiDays);
            } else {
                Boolean found = false;
                for(YearMonthDate ephiDay : ephiDays) {
                    if(ephiDay.equals(day)) {
                        found = true;
                        break;
                    }
                }
                if(! found) {
                    ephiDays.add(day);
                }
            }
        }

        for(EmployeePositionHistoryItem employeePositionHistoryItem : notIdleDays.keySet()) {
            Row row = getRowByEmployeePositionHistoryItemId(employeePositionHistoryItem.getId());
            if(row != null) {
                row.setNotIdleDaysCount(new Long(notIdleDays.get(employeePositionHistoryItem).size()));
            }
        }
    }
    public void buildLeaveReport() {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        String query = "select e, li from LeavesItem as li inner join li.employee as e inner join e.position as p inner join p.subdepartment as s ";
        query += "where s in (:subdepartments) and ((li.start<=:date and li.end>=:date) or (li.start<=:date and li.end is null)) ";
        query += "and e.isAdministrator!=true ";
        query += "group by e ";
        Query hq = hs.createQuery(query);
        hq.setParameterList("subdepartments", subdepartments);
        hq.setParameter("date", CalendarUtil.getToday());
        List<Object[]> selection = (List<Object[]>)hq.list();
        for(Object[] tuple : selection) {
            Employee employee = (Employee)tuple[0];
            LeavesItem leavesItem = (LeavesItem)tuple[1];
            for(Row row : getRowsByEmployeeId(employee.getId())) {
                row.setLeavesItemType(leavesItem.getType());
            }
        }
    }
    private List<Row> getRowsByEmployeeId(Long employeeId) {
        List<Row> employeeRows = new LinkedList<Row>();
        for(Row row : rows) {
            if(row.getEmployeeId().equals(employeeId)) {
                employeeRows.add(row);
            }
        }
        return employeeRows;
    }
    private Row getRowByEmployeeIdAndPositionId(Long employeeId, Long positionId) {
        for(Row row : rows) {
            if(row.getEmployeeId().equals(employeeId) && row.getPositionId().equals(positionId)) {
                return row;
            }
        }
        return null;
    }
    private Row getRowByEmployeePositionHistoryItemId(Long employeePositionHistoryItemId) {
        for(Row row : rows) {
            if(row.getEmployeePositionHistoryItemId().equals(employeePositionHistoryItemId)) {
                return row;
            }
        }
        return null;
    }
    private List<Long> getEmployeeIds() {
        List<Long> employeeIds = new LinkedList<Long>();
        for(Row row : rows) {
            employeeIds.add(row.getEmployeeId());
        }
        return employeeIds;
    }
}
