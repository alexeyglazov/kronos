/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
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

import java.util.Date;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.*;
import java.util.Map;
import java.util.HashMap;
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class EmployeesForProjectsReportExcelBuilder {
        private EmployeesForProjectsReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public EmployeesForProjectsReportExcelBuilder(EmployeesForProjectsReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
            this.report = report;
            this.outputStream = outputStream;

            this.headingFormat = ExcelUtils.getHeadingFormat();
            this.numberFormat = ExcelUtils.getNumberFormat();
            this.integerFormat = ExcelUtils.getIntegerFormat();
            this.percentFormat = ExcelUtils.getPercentFormat();
            this.timespentFormat = ExcelUtils.getTimespentFormat();
            this.dateFormat = ExcelUtils.getDateFormat();
            this.fullDateFormat = ExcelUtils.getFullDateFormat();
        }
        public EmployeesForProjectsReportExcelBuilder(EmployeesForProjectsReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
            this.report = report;
            this.outputStream = outputStream;
            this.workbook = workbook;

            this.headingFormat = ExcelUtils.getHeadingFormat();
            this.numberFormat = ExcelUtils.getNumberFormat();
            this.integerFormat = ExcelUtils.getIntegerFormat();
            this.percentFormat = ExcelUtils.getPercentFormat();
            this.timespentFormat = ExcelUtils.getTimespentFormat();
            this.dateFormat = ExcelUtils.getDateFormat();
            this.fullDateFormat = ExcelUtils.getFullDateFormat();
        }
        public void createWorkbook() throws IOException {
            WorkbookSettings ws = new WorkbookSettings();
            ws.setLocale(new Locale("ru", "RU"));
            workbook = Workbook.createWorkbook(outputStream, ws);
	}
        public void writeWorkbook() throws IOException, WriteException {
            workbook.write();
            workbook.close();
        }


	public void fillWorkbook() throws RowsExceededException, WriteException {
            int count = 0;
            WritableSheet sheet = workbook.createSheet("Report", count);
            fillSheet(sheet, report);
            count++;
	}
        private void fillSheet(WritableSheet sheet, EmployeesForProjectsReport report) throws RowsExceededException, WriteException {
            int feesActDatesMaxCount = 0;
            for(EmployeesForProjectsReport.Row row : report.getRows()) {
                if(row.getFeesActs() != null && row.getFeesActs().size() > feesActDatesMaxCount) {
                    feesActDatesMaxCount = row.getFeesActs().size();
                }
            }
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Office");
            columnNames.add("Department");
            columnNames.add("Subdepartment");
            columnNames.add("ID");
            columnNames.add("User Name");
            columnNames.add("First Name");
            columnNames.add("Last Name");
            columnNames.add("Full Name (Local Language)");
            columnNames.add("Project Code");
            columnNames.add("PC Dead");
            columnNames.add("Time Spent");
            columnNames.add("Percentage");
            for(int i = 0; i < feesActDatesMaxCount; i++) {
                columnNames.add("Act Date");
            }

            String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Year", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "Month", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Office", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Department", headingFormat));
            sheet.addCell(new Label(4, rowNumber, "Subdepartment", headingFormat));
            sheet.addCell(new Label(5, rowNumber, "Created At", headingFormat));
            rowNumber++;
            sheet.addCell(new Label(0, rowNumber, "" + report.getFormYear()));
            sheet.addCell(new Label(1, rowNumber, months[report.getFormMonth()]));
            if(report.getFormOffice() != null) {
                sheet.addCell(new Label(2, rowNumber, report.getFormOffice().getName()));
            }
            if(report.getFormDepartment() != null) {
                sheet.addCell(new Label(3, rowNumber, report.getFormDepartment().getName()));
            }
            if(report.getFormSubdepartment() != null) {
                sheet.addCell(new Label(4, rowNumber, report.getFormSubdepartment().getName()));
            }
            sheet.addCell(new jxl.write.DateTime(5, rowNumber, report.getCreatedAt(), fullDateFormat));

            rowNumber++;

            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;

            Map<Long, Integer> startRowNumbers = new HashMap<Long, Integer>();
            Map<Long, Integer> endRowNumbers = new HashMap<Long, Integer>();
            Long currentEmployeeId = null;
            int rowNumberTmp = rowNumber;
            for(EmployeesForProjectsReport.Row row : report.getRows()) {
                Long employeeId = row.getEmployee().getId();
                if(employeeId.equals(currentEmployeeId)) {
                    endRowNumbers.put(employeeId, rowNumberTmp);
                } else {
                    currentEmployeeId = employeeId;
                    startRowNumbers.put(employeeId, rowNumberTmp);
                    endRowNumbers.put(employeeId, rowNumberTmp);
                }
                rowNumberTmp++;
            }

            int firstRowToSum = rowNumber;
            for(EmployeesForProjectsReport.Row row : report.getRows()) {
                columnNumber = 0;

                String fullNameLocalLanguage = "";
                if(row.getEmployee().getLastNameLocalLanguage() != null) {
                    fullNameLocalLanguage += row.getEmployee().getLastNameLocalLanguage();
                }
                if(row.getEmployee().getFirstNameLocalLanguage() != null) {
                    if(row.getEmployee().getLastNameLocalLanguage() != null) {
                        fullNameLocalLanguage += " ";
                    }
                    fullNameLocalLanguage += row.getEmployee().getFirstNameLocalLanguage();
                }
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getOffice().getName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getDepartment().getName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getSubdepartment().getName()));
                columnNumber++;

                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getEmployee().getId(), integerFormat));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployee().getUserName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployee().getFirstName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployee().getLastName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, fullNameLocalLanguage));
                columnNumber++;
                if(row.getProjectCode() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
                    columnNumber++;
                    if(row.getProjectCode().getIsDead() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, row.getProjectCode().getIsDead()));
                    }
                    columnNumber++;
                } else {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Internal"));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "-"));
                    columnNumber++;                
                }
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpent()/60.0, timespentFormat));
                columnNumber++;
                String formula = "" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + "/SUM(" + ExcelUtils.getColumnName(columnNumber - 1) + (startRowNumbers.get(row.getEmployee().getId()) + 1) + ":" + ExcelUtils.getColumnName(columnNumber - 1) + (endRowNumbers.get(row.getEmployee().getId()) + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
                columnNumber++;
                for(FeesAct feesAct : row.getFeesActs()) {
                    if(feesAct.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesAct.getDate().getTime(), dateFormat));
                        columnNumber++;                    
                    }
                }
                rowNumber++;
            }
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Total", headingFormat));
            columnNumber = 10;
            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
        }
}
