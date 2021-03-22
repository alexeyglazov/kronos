/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.comparators.EmployeePositionHistoryItemComparator;
import com.mazars.management.reports.*;
import java.util.Locale;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.Orientation;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
import jxl.write.NumberFormats;
import jxl.write.DateFormat;
import java.io.*;

import java.util.Collections;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class IndividualPerformanceReportExcelBuilder {
    private IndividualPerformanceReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;
    
    public IndividualPerformanceReportExcelBuilder(IndividualPerformanceReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new Label(0, rowNumber, "Office", headingFormat));
        sheet.addCell(new Label(1, rowNumber, "Department", headingFormat));
        sheet.addCell(new Label(2, rowNumber, "Subdepartment", headingFormat));
        sheet.addCell(new Label(3, rowNumber, "Employee", headingFormat));
        sheet.addCell(new Label(4, rowNumber, "Start date", headingFormat));
        sheet.addCell(new Label(5, rowNumber, "End date", headingFormat));
        sheet.addCell(new Label(6, rowNumber, "Created at", headingFormat));
        rowNumber++;
        String formOfficeName = "All";
        String formDepartmentName = "All";
        String formSubdepartmentName = "All";
        String formEmployeeUserName = "All";
        if(this.report.getFormOffice() != null) {
            formOfficeName = this.report.getFormOffice().getName();
        }
        if(this.report.getFormDepartment() != null) {
            formDepartmentName = this.report.getFormDepartment().getName();
        }
        if(this.report.getFormSubdepartment() != null) {
            formSubdepartmentName = this.report.getFormSubdepartment().getName();
        }
        if(this.report.getFormEmployee() != null) {
            formEmployeeUserName = this.report.getFormEmployee().getUserName();
        }
        sheet.addCell(new jxl.write.Label(0, rowNumber, formOfficeName));
        sheet.addCell(new jxl.write.Label(1, rowNumber, formDepartmentName));
        sheet.addCell(new jxl.write.Label(2, rowNumber, formSubdepartmentName));
        sheet.addCell(new jxl.write.Label(3, rowNumber, formEmployeeUserName));
        sheet.addCell(new jxl.write.DateTime(4, rowNumber, this.report.getStartDate().getTime(), dateFormat));
        sheet.addCell(new jxl.write.DateTime(5, rowNumber, this.report.getEndDate().getTime(), dateFormat));
        sheet.addCell(new jxl.write.DateTime(6, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        int count = 0;
    }
    public void makeContent(IndividualPerformanceReport.EmployeeReport employeeReport, WritableSheet sheet) throws RowsExceededException, WriteException {
        Employee employee = employeeReport.getEmployee();
        List<EmployeePositionHistoryItem> employeePositionHistoryItems = new LinkedList<EmployeePositionHistoryItem>(employee.getEmployeePositionHistoryItems());
        Collections.sort(employeePositionHistoryItems, new EmployeePositionHistoryItemComparator());
        
        columnNumber = 0;
        rowNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "First name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Last name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "User name", headingFormat));
        rowNumber++;
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employee.getFirstName()));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employee.getLastName()));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employee.getUserName()));
        columnNumber = 0;
        rowNumber++;
        
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Subdepartment", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Position", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Standard position", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Start", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "End", headingFormat));
        rowNumber++;
        columnNumber = 0;
        
        for(EmployeePositionHistoryItem employeePositionHistoryItem : employeePositionHistoryItems) {
            Position position = employeePositionHistoryItem.getPosition();
            StandardPosition standardPosition = position.getStandardPosition();
            Subdepartment subdepartment = position.getSubdepartment();
            Department department = subdepartment.getDepartment();
            Office office = department.getOffice();
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, office.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, department.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, subdepartment.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, position.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, standardPosition.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, employeePositionHistoryItem.getStart().getTime(), dateFormat));
            columnNumber++;
            if(employeePositionHistoryItem.getEnd() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, employeePositionHistoryItem.getEnd().getTime(), dateFormat));
                columnNumber++;
            }
            rowNumber++;
            columnNumber = 0;
        }
        
        
        rowNumber++;
        makeClientContent(employeeReport, sheet);
        rowNumber++;
        makeNotInternalTaskContent(employeeReport, sheet);
        rowNumber++;
        makeInternalTaskContent(employeeReport, sheet);
    }
    public void makeClientContent(IndividualPerformanceReport.EmployeeReport employeeReport, WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent on client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "", headingFormat));
       columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "", headingFormat));
        rowNumber++;
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent", headingFormat));
        rowNumber++;
        
        int firstRowToSum = rowNumber;
        for(Client client : employeeReport.getClientTimespentItems().keySet()) {
            Group group = client.getGroup();
            columnNumber = 0;
            if(group != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, group.getName()));
            }
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, employeeReport.getClientTimespentItems().get(client)/60.0, timespentFormat));
            rowNumber++;
        }
        columnNumber = 2;
        if(employeeReport.getClientTimespentItems().size() > 0) {
            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
            rowNumber++;
        }
    }
    public void makeNotInternalTaskContent(IndividualPerformanceReport.EmployeeReport employeeReport, WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent per task", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "", headingFormat));
        rowNumber++;
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Task Type", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Task", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent", headingFormat));
        rowNumber++;
        
        int firstRowToSum = rowNumber;
        for(Task task : employeeReport.getNotInternalTaskTimespentItems().keySet()) {
            TaskType taskType = task.getTaskType();
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, taskType.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, task.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, employeeReport.getNotInternalTaskTimespentItems().get(task)/60.0, timespentFormat));
            rowNumber++;
        }
        columnNumber = 2;
        if(employeeReport.getNotInternalTaskTimespentItems().size() > 0) {
            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
            rowNumber++;
        }
    }
    public void makeInternalTaskContent(IndividualPerformanceReport.EmployeeReport employeeReport, WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent internal", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "", headingFormat));
        rowNumber++;
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Task", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent", headingFormat));
        rowNumber++;
        
        int firstRowToSum = rowNumber;
        for(Task task : employeeReport.getInternalTaskTimespentItems().keySet()) {
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, task.getName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, employeeReport.getInternalTaskTimespentItems().get(task)/60.0, timespentFormat));
            rowNumber++;
        }
        columnNumber = 1;
        if(employeeReport.getInternalTaskTimespentItems().size() > 0) {
            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
            rowNumber++;
        }
    }

    public void createStandardReport(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        createStandardWorkbook(outputStream);
    }
    public void createStandardWorkbook(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        this.headingFormat = ExcelUtils.getHeadingFormat();
        this.numberFormat = ExcelUtils.getNumberFormat();
        this.integerFormat = ExcelUtils.getIntegerFormat();
        this.percentFormat = ExcelUtils.getPercentFormat();
        this.timespentFormat = ExcelUtils.getTimespentFormat();
        this.dateFormat = ExcelUtils.getDateFormat();
        this.fullDateFormat = ExcelUtils.getFullDateFormat();

        WorkbookSettings ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        WritableWorkbook workbook = Workbook.createWorkbook(outputStream, ws);
        fillStandardWorkbook(workbook);
        workbook.write();
        workbook.close();
    }
    public void fillStandardWorkbook(WritableWorkbook workbook) throws RowsExceededException, WriteException {
        int sheetIndex = 0;
        WritableSheet sheet = workbook.createSheet("Properties", sheetIndex);
        columnNumber = 0;
        rowNumber = 0;
        makeHeader(sheet);
        for(IndividualPerformanceReport.EmployeeReport employeeReport : report.getEmployeeReports()) {
            sheetIndex++;
            Employee employee = employeeReport.getEmployee();
            sheet = workbook.createSheet(employee.getUserName(), sheetIndex);
            columnNumber = 0;
            rowNumber = 0;
            makeContent(employeeReport, sheet);
        }
    }


}
