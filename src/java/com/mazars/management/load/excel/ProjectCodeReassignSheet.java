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
public class ProjectCodeReassignSheet {
    public class Row {
        String code;
        String departmentName;
        String departmentCodeName;
        String subDepartmentName;
        String subDepartmentCodeName;
        String activityCodeName;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
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

        public String getActivityCodeName() {
            return activityCodeName;
        }

        public void setActivityCodeName(String activityCodeName) {
            this.activityCodeName = activityCodeName;
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
            Cell codeCell = null;
            Cell departmentNameCell = null;
            Cell departmentCodeNameCell = null;
            Cell subDepartmentNameCell = null;
            Cell subDepartmentCodeNameCell = null;
            Cell activityCodeNameCell = null;

            try {
                codeCell = rowData[0];
                departmentNameCell = rowData[1];
                departmentCodeNameCell = rowData[2];
                subDepartmentNameCell = rowData[3];
                subDepartmentCodeNameCell = rowData[4];
                activityCodeNameCell = rowData[5];
             } catch (Exception e) {
                errors.add("Exception of " + e + " at row "+ (i + 1));
                continue;
            }
            row.setCode(codeCell.getContents().trim());
            row.setDepartmentName(departmentNameCell.getContents().trim());
            if(row.getDepartmentName().equalsIgnoreCase("Tax and Legal")) {
                row.setDepartmentName("Tax & Legal");
            }
            row.setDepartmentCodeName(departmentCodeNameCell.getContents().trim());
            row.setSubDepartmentName(subDepartmentNameCell.getContents().trim());
            row.setSubDepartmentCodeName(subDepartmentCodeNameCell.getContents().trim());
            row.setActivityCodeName(activityCodeNameCell.getContents().trim());
            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }

}
