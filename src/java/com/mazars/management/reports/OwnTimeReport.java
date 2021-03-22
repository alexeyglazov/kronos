/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports;
import com.mazars.management.db.comparators.StandardPositionComparator;
import java.util.*;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.db.vo.YearMonthDate;
import com.mazars.management.web.forms.OwnTimeReportForm;
import org.hibernate.Session;
import org.hibernate.Query;
import java.util.Calendar;
/**
 *
 * @author glazov
 */
public class OwnTimeReport {
    public enum View {
        TIME,
        PERCENT
    }

    public class Subreport {
        private Map<Subdepartment, Map<StandardPosition, Long>> info = new HashMap<Subdepartment, Map<StandardPosition, Long>>();
        private Boolean isInternal = null;
        private Task task;
        private Boolean isIdle;

        public Subreport(Boolean isInternal, Task task, Boolean isIdle) {
            this.isInternal = isInternal;
            this.task = task;
            this.isIdle = isIdle;
        }

        public Boolean getIsIdle() {
            return isIdle;
        }

        public void setIsIdle(Boolean isIdle) {
            this.isIdle = isIdle;
        }

        public Boolean getIsInternal() {
            return isInternal;
        }

        public void setIsInternal(Boolean isInternal) {
            this.isInternal = isInternal;
        }

        public Map<Subdepartment, Map<StandardPosition, Long>> getInfo() {
            return info;
        }

        public void setInfo(Map<Subdepartment, Map<StandardPosition, Long>> info) {
            this.info = info;
        }

        public Task getTask() {
            return task;
        }

        public void setTask(Task task) {
            this.task = task;
        }
        public void build() {
            process(getSelection());
        }
        public List<Object[]> getSelection() {
            Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
            String query = "";
            query += "select sum(tsi.timeSpent), s, sp from TimeSpentItem as tsi inner join tsi.employee as e inner join e.employeePositionHistoryItems as ephi inner join ephi.position as p inner join p.subdepartment as s inner join p.standardPosition as sp ";
            if(isInternal != null) {
                query += "inner join tsi.task as t inner join t.taskType as tt ";
            } else if(task != null || isIdle != null) {
                query += "inner join tsi.task as t ";
            }
            query += "where tsi.day >= :startDate and tsi.day <= :endDate and ((ephi.start <= tsi.day and ephi.end >= tsi.day) or (ephi.start <= tsi.day and ephi.end is null)) ";
            if(isInternal != null) {
                query += "and tt.isInternal=:isInternal ";
            }
            if(task != null) {
                query += "and t=:task ";
            }
            if(isIdle != null) {
                query += "and t.isIdle=:isIdle ";
            }
            if(subdepartments != null) {
                query += "and s in (:subdepartments) ";
            }
            query += "and e.isAdministrator!=true ";
            query += "group by s, sp ";

            Query hq = hs.createQuery(query);
            hq.setParameter("startDate", startDate).setParameter("endDate", endDate);
            if(isInternal != null) {
                hq.setBoolean("isInternal", isInternal);
            }
            if(task != null) {
                hq.setParameter("task", task);
            }
            if(isIdle != null) {
                hq.setBoolean("isIdle", isIdle);
            }
            if(subdepartments != null) {
                hq.setParameterList("subdepartments", subdepartments);
            }
            return (List<Object[]>)hq.list();
        }
        public void process(List<Object[]> selection) {
            for(Object[] tuple : selection) {
                Long timeSpent = (Long)tuple[0];
                Subdepartment subdepartment = (Subdepartment)tuple[1];
                StandardPosition standardPosition = (StandardPosition)tuple[2];
                if(info.containsKey(subdepartment)) {
                    Map<StandardPosition, Long> subInfo = info.get(subdepartment);
                    subInfo.put(standardPosition, timeSpent);
                } else {
                    Map<StandardPosition, Long> subInfo = new HashMap<StandardPosition, Long>();
                    subInfo.put(standardPosition, timeSpent);
                    info.put(subdepartment, subInfo);
                }
            }
        }
        public Long getTotalTimeSpentBySubdepartment(Subdepartment subdepartment) {
            Long totalTimeSpent = new Long(0);
            if(info.containsKey(subdepartment)) {
                for(StandardPosition standardPosition : info.get(subdepartment).keySet()) {
                    totalTimeSpent += info.get(subdepartment).get(standardPosition);
                }
            }
            return totalTimeSpent;
        }

        public Long getTotalTimeSpentByStandardPosition(StandardPosition standardPosition) {
            Long totalTimeSpent = new Long(0);
            for(Subdepartment subdepartment : info.keySet()) {
                Long timeSpent = info.get(subdepartment).get(standardPosition);
                if(timeSpent != null) {
                    totalTimeSpent += timeSpent;
                }
            }            
            return totalTimeSpent;
        }
        public Long getTotalTimeSpent() {
            Long totalTimeSpent = new Long(0);
            for(Subdepartment subdepartment : info.keySet()) {
                for(StandardPosition standardPosition : info.get(subdepartment).keySet()) {
                    totalTimeSpent += info.get(subdepartment).get(standardPosition);
                }
            }
            return totalTimeSpent;
        }
        public Long getTimeSpent(Subdepartment subdepartment, StandardPosition standardPosition) {
            if(info.containsKey(subdepartment)) {
                return info.get(subdepartment).get(standardPosition);
            }
            return null;
        }
    }

    private Calendar startDate;
    private Calendar endDate;
    private List<Subdepartment> subdepartments = new LinkedList<Subdepartment>();
    private List<StandardPosition> standardPositions = new LinkedList<StandardPosition>();

    private OwnTimeReportForm form;
    private Date createdAt;

    private Office formOffice;
    private Department formDepartment;
    private Subdepartment formSubdepartment;
    private YearMonthDate formStartDate;
    private YearMonthDate formEndDate;
    private View view;
    
    private List<Subreport> subreports = new LinkedList<Subreport>();
    
    public OwnTimeReport (OwnTimeReportForm form, Module module, Employee currentUser) {
        this.form = form;
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        if(this.form.getOfficeId() != null) {
            this.formOffice = (Office)hs.get(Office.class, new Long(form.getOfficeId()));
        }
        if(this.form.getDepartmentId() != null) {
            this.formDepartment = (Department)hs.get(Department.class, new Long(form.getDepartmentId()));
        }
        if(this.form.getSubdepartmentId() != null) {
            this.formSubdepartment = (Subdepartment)hs.get(Subdepartment.class, new Long(form.getSubdepartmentId()));
        }
        this.formStartDate = form.getStartDate();
        this.formEndDate = form.getEndDate();
        this.view = form.getView();
        Country country = currentUser.getCountry();
        subdepartments = Subdepartment.getAllowedSubdepartments(formOffice, formDepartment, formSubdepartment, currentUser, module);
        startDate = form.getStartDate().getCalendar();
        endDate = form.getEndDate().getCalendar();
        
        standardPositions = StandardPosition.getAll();
        Collections.sort(standardPositions, new StandardPositionComparator());
    }

    public View getView() {
        return view;
    }

    public void setView(View view) {
        this.view = view;
    }

    public List<StandardPosition> getStandardPositions() {
        return standardPositions;
    }

    public void setStandardPositions(List<StandardPosition> standardPositions) {
        this.standardPositions = standardPositions;
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

    public Department getFormDepartment() {
        return formDepartment;
    }

    public void setFormDepartment(Department formDepartment) {
        this.formDepartment = formDepartment;
    }

    public YearMonthDate getFormEndDate() {
        return formEndDate;
    }

    public void setFormEndDate(YearMonthDate formEndDate) {
        this.formEndDate = formEndDate;
    }

    public Office getFormOffice() {
        return formOffice;
    }

    public void setFormOffice(Office formOffice) {
        this.formOffice = formOffice;
    }

    public YearMonthDate getFormStartDate() {
        return formStartDate;
    }

    public void setFormStartDate(YearMonthDate formStartDate) {
        this.formStartDate = formStartDate;
    }

    public Subdepartment getFormSubdepartment() {
        return formSubdepartment;
    }

    public void setFormSubdepartment(Subdepartment formSubdepartment) {
        this.formSubdepartment = formSubdepartment;
    }

    public List<Subreport> getSubreports() {
        return subreports;
    }

    public void setSubreports(List<Subreport> subreports) {
        this.subreports = subreports;
    }
    
    public void build() {
        buildSubreportFull();
        buildSubreportNonInternal();
        buildSubreportInternal();
        buildSubreportInternalSpecific();
        this.createdAt = new Date();
    }
    public void buildSubreportFull() {
        Subreport subreportFull = new Subreport(null, null, null);
        subreportFull.build();
        subreports.add(subreportFull);        
    }    
    public void buildSubreportNonInternal() {
        Subreport subreportNonInternal = new Subreport(false, null, null);
        subreportNonInternal.build();
        subreports.add(subreportNonInternal);        
    }
    public void buildSubreportInternal() {
        Subreport subreportInternal = new Subreport(true, null, false);
        subreportInternal.build();
        subreports.add(subreportInternal);        
    }
    public void buildSubreportInternalSpecific() {
        for(Task internalTask : TaskType.getCommonInternalTasks()) {
            Subreport subreportInternalSpecific = new Subreport( null, internalTask, null);
            subreportInternalSpecific.build();
            subreports.add(subreportInternalSpecific);
        }        
    }
}
