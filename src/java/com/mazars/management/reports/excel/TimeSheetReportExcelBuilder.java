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
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class TimeSheetReportExcelBuilder {
        private TimeSheetReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public TimeSheetReportExcelBuilder(TimeSheetReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public TimeSheetReportExcelBuilder(TimeSheetReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            WritableSheet sheet = workbook.createSheet("Timesheet", 0);
            fillSheet(sheet);
	}
        private void fillSheet(WritableSheet sheet) throws RowsExceededException, WriteException {
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group");
            columnNames.add("Client");
            columnNames.add("Code");
            columnNames.add("Date");
            columnNames.add("Time Spent");
            columnNames.add("Description");
            columnNames.add("Task Type");
            columnNames.add("Task");
            columnNames.add("Modified At");

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Department", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Subdepartment", headingFormat));
            sheet.addCell(new Label(4, rowNumber, "User Name", headingFormat));
            sheet.addCell(new Label(5, rowNumber, "First Name", headingFormat));
            sheet.addCell(new Label(6, rowNumber, "Last Name", headingFormat));
            sheet.addCell(new Label(7, rowNumber, "Created At", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getFormStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getFormEndDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.Label(2, rowNumber, report.getFormEmployeeDepartment().getName()));
            sheet.addCell(new jxl.write.Label(3, rowNumber, report.getFormEmployeeSubdepartment().getName()));
            sheet.addCell(new jxl.write.Label(4, rowNumber, report.getFormEmployee().getUserName()));
            sheet.addCell(new jxl.write.Label(5, rowNumber, report.getFormEmployee().getFirstName()));
            sheet.addCell(new jxl.write.Label(6, rowNumber, report.getFormEmployee().getLastName()));
            sheet.addCell(new jxl.write.DateTime(7, rowNumber, report.getCreatedAt(), fullDateFormat));

            rowNumber++;

            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(TimeSheetReport.Row row : report.getRows()) {
                columnNumber = 0;
                String groupName = "Internal";
                String clientName = "Internal";
                String code = "Internal";
                if(row.getGroupName() != null) {
                    groupName = row.getGroupName();
                }
                if(row.getClientName() != null) {
                    clientName = row.getClientName();
                }
                if(row.getCode() != null) {
                    code = row.getCode();
                }
                sheet.addCell(new Label(columnNumber, rowNumber, groupName));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, clientName));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, code));
                columnNumber++;
                if(row.getDay() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getDay().getTime(), dateFormat));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpent() / 60.0, timespentFormat));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getDescription()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTaskTypeName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTaskName()));
                columnNumber++;
                if(row.getModifiedAt() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getModifiedAt(), fullDateFormat));
                }
                columnNumber++;

                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = 4;
                String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
            }
        }
}
