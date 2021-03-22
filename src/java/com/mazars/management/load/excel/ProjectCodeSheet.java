/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import com.mazars.management.db.util.CalendarUtil;
import java.util.*;
import java.io.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Locale;
import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import jxl.DateCell;
import java.text.SimpleDateFormat;
import com.mazars.management.db.domain.*;

/**
 *
 * @author Glazov
 */
public class ProjectCodeSheet {
    public class Row {
        Long codeId;
        String code;
        String description;
        Date creationDate;
        Date closingDate;
        String period;
        Calendar start;
        Calendar end;
        String internalComments;
        Boolean closed;
        Boolean deadCode;
        String departmentName;
        String departmentCodeName;
        String companiesName;
        String companiesCodeName;
        String subDepartmentName;
        String subDepartmentCodeName;
        String createdByFirstName;
        String createdByLastName;
        String closedByFirstName;
        String closedByLastName;
        String activity;
        String activityCodeName;

        public Long getCodeId() {
            return codeId;
        }

        public void setCodeId(Long codeId) {
            this.codeId = codeId;
        }

        public String getCompaniesCodeName() {
            return companiesCodeName;
        }

        public void setCompaniesCodeName(String companiesCodeName) {
            this.companiesCodeName = companiesCodeName;
        }

        public String getActivity() {
            return activity;
        }

        public void setActivity(String activity) {
            this.activity = activity;
        }

        public String getActivityCodeName() {
            return activityCodeName;
        }

        public void setActivityCodeName(String activityCodeName) {
            this.activityCodeName = activityCodeName;
        }

         public String getClosedByFirstName() {
            return closedByFirstName;
        }

        public void setClosedByFirstName(String closedByFirstName) {
            this.closedByFirstName = closedByFirstName;
        }

        public String getClosedByLastName() {
            return closedByLastName;
        }

        public void setClosedByLastName(String closedByLastName) {
            this.closedByLastName = closedByLastName;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getCompaniesName() {
            return companiesName;
        }

        public void setCompaniesName(String companiesName) {
            this.companiesName = companiesName;
        }

        public String getCreatedByFirstName() {
            return createdByFirstName;
        }

        public void setCreatedByFirstName(String createdByFirstName) {
            this.createdByFirstName = createdByFirstName;
        }

        public String getCreatedByLastName() {
            return createdByLastName;
        }

        public void setCreatedByLastName(String createdByLastName) {
            this.createdByLastName = createdByLastName;
        }

        public String getDepartmentCodeName() {
            return departmentCodeName;
        }

        public void setDepartmentCodeName(String departmentCodeName) {
            this.departmentCodeName = departmentCodeName;
        }

        public String getDepartmentName() {
            return departmentName;
        }

        public void setDepartmentName(String departmentName) {
            this.departmentName = departmentName;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

         public String getInternalComments() {
            return internalComments;
        }

        public void setInternalComments(String internalComments) {
            this.internalComments = internalComments;
        }

        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        public String getSubDepartmentCodeName() {
            return subDepartmentCodeName;
        }

        public void setSubDepartmentCodeName(String subDepartmentCodeName) {
            this.subDepartmentCodeName = subDepartmentCodeName;
        }

        public String getSubDepartmentName() {
            return subDepartmentName;
        }

        public void setSubDepartmentName(String subDepartmentName) {
            this.subDepartmentName = subDepartmentName;
        }

        public Boolean getClosed() {
            return closed;
        }

        public void setClosed(Boolean closed) {
            this.closed = closed;
        }

        public Date getClosingDate() {
            return closingDate;
        }

        public void setClosingDate(Date closingDate) {
            this.closingDate = closingDate;
        }

        public Date getCreationDate() {
            return creationDate;
        }

        public void setCreationDate(Date creationDate) {
            this.creationDate = creationDate;
        }

        public Boolean getDeadCode() {
            return deadCode;
        }

        public void setDeadCode(Boolean deadCode) {
            this.deadCode = deadCode;
        }

        public Calendar getEnd() {
            return end;
        }

        public void setEnd(Calendar end) {
            this.end = end;
        }

        public Calendar getStart() {
            return start;
        }

        public void setStart(Calendar start) {
            this.start = start;
        }
 
    }

    private List<Row> rows = new LinkedList<Row>();

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }
    public List<String> read(InputStream inputStream, String sheetName) throws IOException, BiffException {
        WorkbookSettings ws = null;
        Workbook workbook = null;
        Sheet sheet = null;
        Cell rowData[] = null;
        int rowCount = '0';

        ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.getWorkbook(inputStream, ws);
        sheet = workbook.getSheet(sheetName);
        rowCount = sheet.getRows();
        List<String> errors = new LinkedList<String>();
        for (int i = 0; i < rowCount; i++) {
            if(i == 0) {
                continue;
            }
            rowData = sheet.getRow(i);
            Row row = new Row();
            Cell codeIdCell = null;
            Cell codeCell = null;
            Cell descriptionCell = null;
            Cell creationDateCell = null;
            Cell closingDateCell = null;
            Cell periodCell = null;
            Cell startCell = null;
            Cell endCell = null;
            Cell internalCommentsCell = null;
            Cell closedCell = null;
            Cell deadCodeCell = null;
            Cell departmentNameCell = null;
            Cell departmentCodeNameCell = null;
            Cell companiesNameCell = null;
            Cell companiesCodeNameCell = null;
            Cell subDepartmentNameCell = null;
            Cell subDepartmentCodeNameCell = null;
            Cell createdByFirstNameCell = null;
            Cell createdByLastNameCell = null;
            Cell closedByFirstNameCell = null;
            Cell closedByLastNameCell = null;
            Cell activityCell = null;
            Cell activityCodeNameCell = null;

            try {
                codeIdCell = rowData[0];
                codeCell = rowData[1];
                descriptionCell = rowData[2];
                creationDateCell = rowData[3];
                closingDateCell = rowData[4];
                periodCell = rowData[5];
                startCell = rowData[6];
                endCell = rowData[7];
                internalCommentsCell = rowData[8];
                closedCell = rowData[9];
                deadCodeCell = rowData[10];
                departmentNameCell = rowData[11];
                departmentCodeNameCell = rowData[12];
                companiesNameCell = rowData[13];
                companiesCodeNameCell = rowData[14];
                subDepartmentNameCell = rowData[15];
                subDepartmentCodeNameCell = rowData[16];
                createdByFirstNameCell = rowData[17];
                createdByLastNameCell = rowData[18];
                closedByFirstNameCell = rowData[19];
                closedByLastNameCell = rowData[20];
                activityCell = rowData[21];
                activityCodeNameCell = rowData[22];
            } catch (Exception e) {
                errors.add("Exception of " + e + " at row "+ (i + 1));
                continue;
            }
            row.setCodeId(Long.parseLong(codeIdCell.getContents()));
            row.setCode(codeCell.getContents().trim());
            row.setDescription(descriptionCell.getContents());

            SimpleDateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy HH:mm");
            if(creationDateCell.getContents() == null || creationDateCell.getContents().trim().equals("") || creationDateCell.getContents().trim().equalsIgnoreCase("NULL")) {
                row.setCreationDate(null);
            } else {
                try {
                    Date creationDate = dateFormatter.parse(creationDateCell.getContents());
                    row.setCreationDate(creationDate);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at creation date at row "+ (i + 1));
                    continue;
                }
            }
            if(closingDateCell.getContents() == null || closingDateCell.getContents().trim().equals("") || closingDateCell.getContents().trim().equalsIgnoreCase("NULL")) {
                row.setClosingDate(null);
            } else {
                try {
                    Date closingDate = dateFormatter.parse(closingDateCell.getContents());
                    row.setClosingDate(closingDate);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at closing date at row "+ (i + 1));
                    continue;
                }
            }
            
            row.setPeriod(periodCell.getContents());

            if(startCell.getContents() == null || startCell.getContents().trim().equals("") || startCell.getContents().trim().equalsIgnoreCase("NULL")) {
                row.setStart(null);
            } else {
                try {
                    Calendar start = new GregorianCalendar();
                    start.setTime(dateFormatter.parse(startCell.getContents()));
                    CalendarUtil.truncateTime(start);
                    row.setStart(start);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at start at row "+ (i + 1));
                    continue;
                }
            }
            if(endCell.getContents() == null || endCell.getContents().trim().equals("") || endCell.getContents().trim().equalsIgnoreCase("NULL")) {
                row.setEnd(null);
            } else {
                try {
                    Calendar end = new GregorianCalendar();
                    end.setTime(dateFormatter.parse(endCell.getContents()));
                    CalendarUtil.truncateTime(end);
                    row.setEnd(end);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at end at row "+ (i + 1));
                    continue;
                }
            }

            row.setInternalComments(internalCommentsCell.getContents());
            if("1".equals(closedCell.getContents()) || "TRUE".equalsIgnoreCase(closedCell.getContents()) || "ИСТИНА".equalsIgnoreCase(closedCell.getContents())) {
                row.setClosed(Boolean.TRUE);
            } else {
                row.setClosed(Boolean.FALSE);
            }
            if("1".equals(deadCodeCell.getContents()) || "TRUE".equalsIgnoreCase(deadCodeCell.getContents()) || "ИСТИНА".equalsIgnoreCase(deadCodeCell.getContents())) {
                row.setDeadCode(Boolean.TRUE);
            } else {
                row.setDeadCode(Boolean.FALSE);
            }

            if(departmentNameCell.getContents().equalsIgnoreCase("Tax and Legal")) {
                row.setDepartmentName("Tax & Legal");
            } else {
                row.setDepartmentName(departmentNameCell.getContents());
            }
            row.setDepartmentCodeName(departmentCodeNameCell.getContents());
            row.setCompaniesName(companiesNameCell.getContents());
            row.setCompaniesCodeName(companiesCodeNameCell.getContents());
            if(subDepartmentNameCell.getContents().equalsIgnoreCase("NULL") || subDepartmentCodeNameCell.getContents().equalsIgnoreCase("NULL")) {
                if(row.getDepartmentName().equalsIgnoreCase("Tax & Legal")) {
                    row.setSubDepartmentName("Tax & Legal (commun project)");
                    row.setSubDepartmentCodeName("TAXANDLEGAL");
                } else {
                    row.setSubDepartmentName(row.getDepartmentName());
                    row.setSubDepartmentCodeName(row.getDepartmentCodeName());
                }
            } else {
                if(row.getDepartmentName().equalsIgnoreCase("Tax & Legal") && subDepartmentNameCell.getContents().equalsIgnoreCase("Tax and Legal")) {
                    row.setSubDepartmentName("Tax & Legal (commun project)");
                } else {
                   row.setSubDepartmentName(subDepartmentNameCell.getContents());
                }
                row.setSubDepartmentCodeName(subDepartmentCodeNameCell.getContents());
            }
            row.setCreatedByFirstName(createdByFirstNameCell.getContents());
            row.setCreatedByLastName(createdByLastNameCell.getContents());
            if(row.getCreatedByFirstName().equalsIgnoreCase("Evgeniey") && row.getCreatedByLastName().equalsIgnoreCase("Kortkikh")) {
                row.setCreatedByFirstName("Evgeni");
                row.setCreatedByLastName("Korotkikh");
            }
            if(row.getCreatedByFirstName().equalsIgnoreCase("Maurice") && row.getCreatedByLastName().equalsIgnoreCase("Dupond")) {
                row.setCreatedByFirstName("Pierre");
                row.setCreatedByLastName("Lemperiere");
            }
            row.setClosedByFirstName(closedByFirstNameCell.getContents());
            row.setClosedByLastName(closedByLastNameCell.getContents());
            if(row.getClosedByFirstName().equalsIgnoreCase("Evgeniey") && row.getClosedByLastName().equalsIgnoreCase("Kortkikh")) {
                row.setClosedByFirstName("Evgeni");
                row.setClosedByLastName("Korotkikh");
            }
            if(row.getClosedByFirstName().equalsIgnoreCase("Maurice") && row.getClosedByLastName().equalsIgnoreCase("Dupond")) {
                row.setClosedByFirstName("Pierre");
                row.setClosedByLastName("Lemperiere");
            }
            row.setActivity(activityCell.getContents());
            row.setActivityCodeName(activityCodeNameCell.getContents());
            
            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }
    public List<Activity> getActivities() throws Exception {
        List<Activity> activities = new LinkedList<Activity>();
        int i = 0;
        for(Row row : rows) {
            boolean exists = false;
            List<Subdepartment> subdepartments = Subdepartment.getByNameAndDepartmentName(row.getSubDepartmentName(), row.getDepartmentName());
            if(subdepartments.size() != 1) {
                throw new Exception("Bad subdepartment info at row " + (i + 1) + " " + row.getSubDepartmentName() + " " + row.getDepartmentName());
            }
            Subdepartment subdepartment = subdepartments.get(0);
            for(Activity activity : activities) {
                  if(row.getActivityCodeName().trim().equals(activity.getCodeName()) && subdepartment.getId().equals(activity.getSubdepartment().getId())) {
                    exists = true;
                    break;
                  }
            }
            if(! exists) {
                Activity activity = new Activity();
                activity.setCodeName(row.getActivityCodeName());
                activity.setIsActive(true);
                activity.setName(row.getActivity());
                activity.setSubdepartment(subdepartment);
                activities.add(activity);
            }
            i++;
        }
        return activities;
    }
    public static ProjectCode.PeriodType getPeriodType(String code) {
        String[] parts = code.split("_");
        if(code.contains("_MAZARS_UK_")) {
            return ProjectCode.PeriodType.DATE;
        }
       if(parts.length == 5 || parts.length == 6) {
            return ProjectCode.PeriodType.COUNTER;
       } else {
            String type = parts[6];
            if(type.startsWith("Q")) {
                return ProjectCode.PeriodType.QUARTER;
            } else if(type.startsWith("M")) {
                return ProjectCode.PeriodType.MONTH;
            } else if(type.length() == 4) {
                return ProjectCode.PeriodType.DATE;
            } else {
                return ProjectCode.PeriodType.COUNTER;
            }
        }
    }
    public static ProjectCode.PeriodQuarter getQuarter(String code) {
        ProjectCode.PeriodType periodType = ProjectCodeSheet.getPeriodType(code);
        if(! ProjectCode.PeriodType.QUARTER.equals(code)) {
            return null;
        }
        String[] parts = code.split("_");
        String type = parts[6];
        String type1 = type.replaceFirst("Q", "");
        if("1".equals(type1)) {
            return ProjectCode.PeriodQuarter.FIRST;
        } else if("2".equals(type1)) {
            return ProjectCode.PeriodQuarter.SECOND;
        } else if("3".equals(type1)) {
            return ProjectCode.PeriodQuarter.THIRD;
        } else {
            return ProjectCode.PeriodQuarter.FOURTH;
        }
    }
    public static ProjectCode.PeriodMonth getMonth(String code) {
        ProjectCode.PeriodType periodType = ProjectCodeSheet.getPeriodType(code);
        if(! ProjectCode.PeriodType.MONTH.equals(periodType)) {
            return null;
        }
        String[] parts = code.split("_");
        String type = parts[6];
        String type1 = type.replaceFirst("M", "");
        if("1".equals(type1)) {
            return ProjectCode.PeriodMonth.JANUARY;
        } else if("2".equals(type1)) {
            return ProjectCode.PeriodMonth.FEBRUARY;
        } else if("3".equals(type1)) {
            return ProjectCode.PeriodMonth.MARCH;
        } else if("4".equals(type1)) {
            return ProjectCode.PeriodMonth.APRIL;
        } else if("5".equals(type1)) {
            return ProjectCode.PeriodMonth.MAY;
        } else if("6".equals(type1)) {
            return ProjectCode.PeriodMonth.JUNE;
        } else if("7".equals(type1)) {
            return ProjectCode.PeriodMonth.JULY;
        } else if("8".equals(type1)) {
            return ProjectCode.PeriodMonth.AUGUST;
        } else if("9".equals(type1)) {
            return ProjectCode.PeriodMonth.SEPTEMBER;
        } else if("10".equals(type1)) {
            return ProjectCode.PeriodMonth.OCTOBER;
        } else if ("11".equals(type1)) {
            return ProjectCode.PeriodMonth.NOVEMBER;
        } else {
            return ProjectCode.PeriodMonth.DECEMBER;
        }
    }
    public static ProjectCode.PeriodDate getDate(String code) {
        ProjectCode.PeriodType periodType = ProjectCodeSheet.getPeriodType(code);
        if(! ProjectCode.PeriodType.DATE.equals(periodType)) {
            return null;
        }
        String[] parts = code.split("_");
        String type;
        if(code.contains("_MAZARS_UK_")) {
            type = parts[7];
        } else {
            type = parts[6];
        }
        return ProjectCode.PeriodDate.valueOf("D" + type);
    }
    public static Integer getCounter(String code) {
        ProjectCode.PeriodType periodType = ProjectCodeSheet.getPeriodType(code);
        if(! ProjectCode.PeriodType.COUNTER.equals(periodType)) {
            return null;
        }
        String[] parts = code.split("_");
        if(parts.length == 5 || parts.length == 6) {
            return 1;
        } else {
            String type = parts[parts.length - 1];
            return Integer.parseInt(type);
        }
    }
    public static Integer getYear(String code) {
        String[] parts = code.split("_");
        if(code.contains("_MAZARS_UK_")) {
            return Integer.parseInt(parts[5]);
        } else {
            return Integer.parseInt(parts[4]);
        }
    }
}
