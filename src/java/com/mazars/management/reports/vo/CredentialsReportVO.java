/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.vo;

import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.vo.*;
import com.mazars.management.reports.*;
import com.mazars.management.reports.CodeDetailReport.View;
import java.math.BigDecimal;
import java.util.List;
import java.util.LinkedList;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
/**
 *
 * @author glazov
 */
public class CredentialsReportVO {
    public class Row {
        private String groupName;
        private Long clientId;
        private String clientName;
        private String officeName;
        private String departmentName;
        private String subdepartmentName;
        private String activityName;
        private String activitySectorGroupName;
        private String activitySectorName;
        private String projectCodeCode;
        private String projectCodeDescription;
        private String inChargePersonUserName;
        private String inChargePersonFirstName;
        private String inChargePersonLastName;

        public Row(CredentialsReport.Row row) {
            if(row.getGroup() != null) {
                groupName = row.getGroup().getName() ;
            }
            if(row.getClient() != null) {
                clientId = row.getClient().getId();
                clientName = row.getClient().getName();
            }
            if(row.getOffice() != null) {
                officeName = row.getOffice().getName();
            }
            if(row.getDepartment() != null) {
                departmentName = row.getDepartment().getName();
            }
            if(row.getSubdepartment() != null) {
                subdepartmentName = row.getSubdepartment().getName();
            }
            if(row.getActivity() != null) {
                activityName = row.getActivity().getName();
            }
            if(row.getActivitySectorGroup() != null) {
                activitySectorGroupName = row.getActivitySectorGroup().getName();
            }
            if(row.getActivitySector() != null) {
                activitySectorName = row.getActivitySector().getName();
            }
            if(row.getProjectCode() != null) {
                projectCodeCode = row.getProjectCode().getCode();
                projectCodeDescription = row.getProjectCode().getDescription();                
            }
            if(row.getInChargePerson() != null) {
                inChargePersonUserName = row.getInChargePerson().getUserName();
                inChargePersonFirstName = row.getInChargePerson().getFirstName();
                inChargePersonLastName = row.getInChargePerson().getLastName();
            }            
        }

        public String getGroupName() {
            return groupName;
        }

        public void setGroupName(String groupName) {
            this.groupName = groupName;
        }

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getClientName() {
            return clientName;
        }

        public void setClientName(String clientName) {
            this.clientName = clientName;
        }

        public String getOfficeName() {
            return officeName;
        }

        public void setOfficeName(String officeName) {
            this.officeName = officeName;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
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

        public String getActivitySectorGroupName() {
            return activitySectorGroupName;
        }

        public void setActivitySectorGroupName(String activitySectorGroupName) {
            this.activitySectorGroupName = activitySectorGroupName;
        }

        public String getActivitySectorName() {
            return activitySectorName;
        }

        public void setActivitySectorName(String activitySectorName) {
            this.activitySectorName = activitySectorName;
        }

        public String getProjectCodeCode() {
            return projectCodeCode;
        }

        public void setProjectCodeCode(String projectCodeCode) {
            this.projectCodeCode = projectCodeCode;
        }

        public String getProjectCodeDescription() {
            return projectCodeDescription;
        }

        public void setProjectCodeDescription(String projectCodeDescription) {
            this.projectCodeDescription = projectCodeDescription;
        }

        public String getInChargePersonUserName() {
            return inChargePersonUserName;
        }

        public void setInChargePersonUserName(String inChargePersonUserName) {
            this.inChargePersonUserName = inChargePersonUserName;
        }

        public String getInChargePersonFirstName() {
            return inChargePersonFirstName;
        }

        public void setInChargePersonFirstName(String inChargePersonFirstName) {
            this.inChargePersonFirstName = inChargePersonFirstName;
        }

        public String getInChargePersonLastName() {
            return inChargePersonLastName;
        }

        public void setInChargePersonLastName(String inChargePersonLastName) {
            this.inChargePersonLastName = inChargePersonLastName;
        }
    }

    List<Row> rows = new LinkedList<Row>();
    YearMonthDateTime createdAt;
    private String formOfficeName;
    private String formDepartmentName;
    private String formSubdepartmentName;
    private String formActivityName;
    private String formGroupName;
    private String formClientName;
    private String formActivitySectorGroupName;
    private String formActivitySectorName;
    private String formCountryName;

    public CredentialsReportVO(CredentialsReport credentialsReport) {
        for(CredentialsReport.Row row : credentialsReport.getRows()) {
            this.rows.add(new CredentialsReportVO.Row(row));
        }
        this.createdAt = new YearMonthDateTime(credentialsReport.getCreatedAt());
        if(credentialsReport.getFormOffice() != null) {
            this.formOfficeName = credentialsReport.getFormOffice().getName();
        }
        if(credentialsReport.getFormDepartment() != null) {
            this.formDepartmentName = credentialsReport.getFormDepartment().getName();
        }
        if(credentialsReport.getFormSubdepartment() != null) {
            this.formSubdepartmentName = credentialsReport.getFormSubdepartment().getName();
        }
        if(credentialsReport.getFormActivity() != null) {
            this.formActivityName = credentialsReport.getFormActivity().getName();
        }
        if(credentialsReport.getFormGroup() != null) {
            this.formGroupName = credentialsReport.getFormGroup().getName();
        }
        if(credentialsReport.getFormClient() != null) {
            this.formClientName = credentialsReport.getFormClient().getName();
        }
        if(credentialsReport.getFormActivitySectorGroup() != null) {
            this.formActivitySectorGroupName = credentialsReport.getFormActivitySectorGroup().getName();
        }
        if(credentialsReport.getFormActivitySector() != null) {
            this.formActivitySectorName = credentialsReport.getFormActivitySector().getName();
        }
        if(credentialsReport.getFormCountry() != null) {
            this.formCountryName = credentialsReport.getFormCountry().getName();
        }
    }

    public YearMonthDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(YearMonthDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public String getFormOfficeName() {
        return formOfficeName;
    }

    public void setFormOfficeName(String formOfficeName) {
        this.formOfficeName = formOfficeName;
    }

    public String getFormDepartmentName() {
        return formDepartmentName;
    }

    public void setFormDepartmentName(String formDepartmentName) {
        this.formDepartmentName = formDepartmentName;
    }

    public String getFormSubdepartmentName() {
        return formSubdepartmentName;
    }

    public void setFormSubdepartmentName(String formSubdepartmentName) {
        this.formSubdepartmentName = formSubdepartmentName;
    }

    public String getFormActivityName() {
        return formActivityName;
    }

    public void setFormActivityName(String formActivityName) {
        this.formActivityName = formActivityName;
    }

    public String getFormGroupName() {
        return formGroupName;
    }

    public void setFormGroupName(String formGroupName) {
        this.formGroupName = formGroupName;
    }

    public String getFormClientName() {
        return formClientName;
    }

    public void setFormClientName(String formClientName) {
        this.formClientName = formClientName;
    }

    public String getFormActivitySectorGroupName() {
        return formActivitySectorGroupName;
    }

    public void setFormActivitySectorGroupName(String formActivitySectorGroupName) {
        this.formActivitySectorGroupName = formActivitySectorGroupName;
    }

    public String getFormActivitySectorName() {
        return formActivitySectorName;
    }

    public void setFormActivitySectorName(String formActivitySectorName) {
        this.formActivitySectorName = formActivitySectorName;
    }

    public String getFormCountryName() {
        return formCountryName;
    }

    public void setFormCountryName(String formCountryName) {
        this.formCountryName = formCountryName;
    }

}
