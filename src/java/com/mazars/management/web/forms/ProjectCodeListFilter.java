/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.forms;
import com.google.gson.Gson;
import com.mazars.management.db.domain.ProjectCodeConflict;
import com.mazars.management.db.vo.*;

/**
 *
 * @author glazov
 */
public class ProjectCodeListFilter {
    public enum PeriodType {
        ALL,
        QUARTER,
        MONTH,
        DATE,
        COUNTER
    }
    public enum PeriodQuarter {
        ALL,
        FIRST,
        SECOND,
        THIRD,
        FOURTH
    }
    public enum PeriodMonth {
        ALL,
        JANUARY,
        FEBRUARY,
        MARCH,
        APRIL,
        MAY,
        JUNE,
        JULY,
        AUGUST,
        SEPTEMBER,
        OCTOBER,
        NOVEMBER,
        DECEMBER
    }
    public enum PeriodDate {
        ALL,
        D3101,
        D2802,
        D3103,
        D3004,
        D3105,
        D3006,
        D3107,
        D3108,
        D3009,
        D3110,
        D3011,
        D3112
    }
    public enum BooleanExtended {
        ALL, TRUE, FALSE
    }
    private Long id;
    private Long groupId;
    private Long clientId;
    private Long departmentId;
    private Long subdepartmentId;
    private String subdepartmentName;
    private Long activityId;
    private String activityName;
    private Long officeId;

    private PeriodType periodType;
    private PeriodQuarter periodQuarter;
    private PeriodMonth periodMonth;
    private PeriodDate periodDate;
    private Integer periodCounter;
    
    private String code;
    private Integer year;
    private Integer financialYear;
    private String description;
    private String comment;
    private DateRange createdAtRange;
    private Long createdById;
    private BooleanExtended isClosed;
    private DateRange closedAtRange;
    private Long closedById;
    private Long inChargePersonId;
    private Long inChargePartnerId;
    private DateRange startDateRange;
    private DateRange endDateRange;
    private BooleanExtended isFuture;
    private BooleanExtended isDead;
    private BooleanExtended isHidden;
    private ProjectCodeConflict.Status projectCodeConflictStatus;

    public ProjectCodeListFilter() {
    }
    public static ProjectCodeListFilter getFromJson(String json) {
        Gson gson = new Gson();
        return gson.fromJson(json, ProjectCodeListFilter.class);
    }

    public String getSubdepartmentName() {
        return subdepartmentName;
    }

    public void setSubdepartmentName(String subdepartmentName) {
        this.subdepartmentName = subdepartmentName;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public Long getInChargePersonId() {
        return inChargePersonId;
    }

    public void setInChargePersonId(Long inChargePersonId) {
        this.inChargePersonId = inChargePersonId;
    }

    public Long getInChargePartnerId() {
        return inChargePartnerId;
    }

    public void setInChargePartnerId(Long inChargePartnerId) {
        this.inChargePartnerId = inChargePartnerId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public DateRange getClosedAtRange() {
        return closedAtRange;
    }

    public void setClosedAtRange(DateRange closedAtRange) {
        this.closedAtRange = closedAtRange;
    }

    public Long getClosedById() {
        return closedById;
    }

    public void setClosedById(Long closedById) {
        this.closedById = closedById;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public DateRange getCreatedAtRange() {
        return createdAtRange;
    }

    public void setCreatedAtRange(DateRange createdAtRange) {
        this.createdAtRange = createdAtRange;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DateRange getEndDateRange() {
        return endDateRange;
    }

    public void setEndDateRange(DateRange endDateRange) {
        this.endDateRange = endDateRange;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BooleanExtended getIsClosed() {
        return isClosed;
    }

    public void setIsClosed(BooleanExtended isClosed) {
        this.isClosed = isClosed;
    }

    public BooleanExtended getIsDead() {
        return isDead;
    }

    public void setIsDead(BooleanExtended isDead) {
        this.isDead = isDead;
    }

    public BooleanExtended getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(BooleanExtended isHidden) {
        this.isHidden = isHidden;
    }

    public ProjectCodeConflict.Status getProjectCodeConflictStatus() {
        return projectCodeConflictStatus;
    }

    public void setProjectCodeConflictStatus(ProjectCodeConflict.Status projectCodeConflictStatus) {
        this.projectCodeConflictStatus = projectCodeConflictStatus;
    }

    public BooleanExtended getIsFuture() {
        return isFuture;
    }

    public void setIsFuture(BooleanExtended isFuture) {
        this.isFuture = isFuture;
    }

    public Long getOfficeId() {
        return officeId;
    }

    public void setOfficeId(Long officeId) {
        this.officeId = officeId;
    }

    public Integer getPeriodCounter() {
        return periodCounter;
    }

    public void setPeriodCounter(Integer periodCounter) {
        this.periodCounter = periodCounter;
    }

    public PeriodDate getPeriodDate() {
        return periodDate;
    }

    public void setPeriodDate(PeriodDate periodDate) {
        this.periodDate = periodDate;
    }

    public PeriodMonth getPeriodMonth() {
        return periodMonth;
    }

    public void setPeriodMonth(PeriodMonth periodMonth) {
        this.periodMonth = periodMonth;
    }

    public PeriodQuarter getPeriodQuarter() {
        return periodQuarter;
    }

    public void setPeriodQuarter(PeriodQuarter periodQuarter) {
        this.periodQuarter = periodQuarter;
    }

    public PeriodType getPeriodType() {
        return periodType;
    }

    public void setPeriodType(PeriodType periodType) {
        this.periodType = periodType;
    }

    public DateRange getStartDateRange() {
        return startDateRange;
    }

    public void setStartDateRange(DateRange startDateRange) {
        this.startDateRange = startDateRange;
    }

    public Long getSubdepartmentId() {
        return subdepartmentId;
    }

    public void setSubdepartmentId(Long subdepartmentId) {
        this.subdepartmentId = subdepartmentId;
    }

    public Integer getFinancialYear() {
        return financialYear;
    }

    public void setFinancialYear(Integer financialYear) {
        this.financialYear = financialYear;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    
    private Boolean isBooleanExtendedUsed(BooleanExtended field) {
        if(BooleanExtended.TRUE.equals(field) || BooleanExtended.FALSE.equals(field)) {
            return true;
        }
        return false;
    }
    private Boolean isStringUsed(String field) {
        if(field == null || field.trim().equals("")) {
            return false;
        }
        return true;
    }
    private Boolean isFromOfDateRangeUsed(DateRange field) {
        if(field == null || field.getFrom() == null) {
            return false;
        }
        return true;
    }
    private Boolean isToOfDateRangeUsed(DateRange field) {
        if(field == null || field.getTo() == null) {
            return false;
        }
        return true;
    }
    private Boolean isDateRangeUsed(DateRange field) {
        return isFromOfDateRangeUsed(field) || isToOfDateRangeUsed(field);
    }

    public Boolean isIdUsed() {
        if(id != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isOfficeIdUsed() {
        if(officeId !=null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isDepartmentIdUsed() {
        if(departmentId !=null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isGroupIdUsed() {
        if(groupId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClientIdUsed() {
        if(clientId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isSubdepartmentIdUsed() {
        if(subdepartmentId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isSubdepartmentNameUsed() {
        return isStringUsed(subdepartmentName);
    }
    public Boolean isActivityIdUsed() {
        if(activityId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isActivityNameUsed() {
        return isStringUsed(activityName);
    }
    public Boolean isCreatedByIdUsed() {
        if(createdById != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClosedByIdUsed() {
        if(closedById != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isInChargePersonIdUsed() {
        if(inChargePersonId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isInChargePartnerIdUsed() {
        if(inChargePartnerId != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isClosedUsed() {
        return isBooleanExtendedUsed(isClosed);
    }
    public Boolean isFutureUsed() {
        return isBooleanExtendedUsed(isFuture);
    }
    public Boolean isDeadUsed() {
        return isBooleanExtendedUsed(isDead);
    }
    public Boolean isHiddenUsed() {
        return isBooleanExtendedUsed(isHidden);
    }
    public Boolean isProjectCodeConflictStatusUsed() {
        if(projectCodeConflictStatus != null) {
            return true;
        } else {
            return false;
        }        
    }
    public Boolean isCodeUsed() {
        return isStringUsed(code);
    }
    public Boolean isDescriptionUsed() {
        return isStringUsed(description);
    }
    public Boolean isCommentUsed() {
        return isStringUsed(comment);
    }
    public Boolean isCreatedAtRangeUsed() {
        return isDateRangeUsed(createdAtRange);
    }
    public Boolean isFromOfCreatedAtRangeUsed() {
        return isFromOfDateRangeUsed(createdAtRange);
    }
    public Boolean isToOfCreatedAtRangeUsed() {
        return isToOfDateRangeUsed(createdAtRange);
    }
    public Boolean isClosedAtRangeUsed() {
        return isDateRangeUsed(closedAtRange);
    }
    public Boolean isFromOfClosedAtRangeUsed() {
        return isFromOfDateRangeUsed(closedAtRange);
    }
    public Boolean isToOfClosedAtRangeUsed() {
        return isToOfDateRangeUsed(closedAtRange);
    }
    public Boolean isStartDateRangeUsed() {
        return isDateRangeUsed(startDateRange);
    }
    public Boolean isFromOfStartDateRangeUsed() {
        return isFromOfDateRangeUsed(startDateRange);
    }
    public Boolean isToOfStartDateRangeUsed() {
        return isToOfDateRangeUsed(startDateRange);
    }
    public Boolean isEndDateRangeUsed() {
        return isDateRangeUsed(endDateRange);
    }
    public Boolean isFromOfEndDateRangeUsed() {
        return isFromOfDateRangeUsed(endDateRange);
    }
    public Boolean isToOfEndDateRangeUsed() {
        return isToOfDateRangeUsed(endDateRange);
    }
    public Boolean isPeriodTypeUsed() {
        if(periodType != null && ! PeriodType.ALL.equals(periodType)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodQuarterUsed() {
        if(periodQuarter != null && ! PeriodQuarter.ALL.equals(periodQuarter)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodMonthUsed() {
        if(periodMonth != null && ! PeriodMonth.ALL.equals(periodMonth)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodDateUsed() {
        if(periodDate != null && ! PeriodDate.ALL.equals(periodDate)) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isPeriodCounterUsed() {
        if(periodCounter != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isYearUsed() {
        if(year != null) {
            return true;
        } else {
            return false;
        }
    }
    public Boolean isFinancialYearUsed() {
        if(financialYear != null) {
            return true;
        } else {
            return false;
        }
    }


    ///////////////////
    public Boolean isUsed() {
       return isIdUsed() ||
        isGroupIdUsed() ||       
        isClientIdUsed() ||
        isOfficeIdUsed() ||
        isDepartmentIdUsed() ||
        isSubdepartmentIdUsed() ||
        isSubdepartmentNameUsed() ||
        isActivityIdUsed() ||
        isActivityNameUsed() ||               
        isCreatedByIdUsed() ||
        isClosedByIdUsed() ||
        isClosedUsed() ||
        isInChargePersonIdUsed() ||
        isInChargePartnerIdUsed() ||       
        isFutureUsed() ||
        isDeadUsed() ||
        isHiddenUsed() ||
        isProjectCodeConflictStatusUsed() ||
        isCodeUsed() ||
        isDescriptionUsed() ||
        isCommentUsed() ||
        isCreatedAtRangeUsed() ||
        isClosedAtRangeUsed() ||
        isStartDateRangeUsed() ||
        isEndDateRangeUsed() ||
        isPeriodTypeUsed() ||
        isPeriodQuarterUsed() ||
        isPeriodMonthUsed() ||
        isPeriodDateUsed() ||
        isPeriodCounterUsed() ||
        isYearUsed() ||
        isFinancialYearUsed()
        ;
    }
}
