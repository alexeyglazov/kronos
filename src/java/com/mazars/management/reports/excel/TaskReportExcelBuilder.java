/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
/**
 *
 * @author Glazov
 */
public class TaskReportExcelBuilder {
        private TaskReport report;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;
        
        private int columnNumber = 0;
        private int rowNumber = 0;


        public TaskReportExcelBuilder(TaskReport report) throws RowsExceededException, WriteException {
            this.report = report;
            this.headingFormat = ExcelUtils.getHeadingFormat();
            this.numberFormat = ExcelUtils.getNumberFormat();
            this.integerFormat = ExcelUtils.getIntegerFormat();
            this.percentFormat = ExcelUtils.getPercentFormat();
            this.timespentFormat = ExcelUtils.getTimespentFormat();
            this.dateFormat = ExcelUtils.getDateFormat();
            this.fullDateFormat = ExcelUtils.getFullDateFormat();
        }
        public void createReport(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
            createWorkbook(outputStream);
        }

        public void createWorkbook(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
            WorkbookSettings ws = new WorkbookSettings();
            ws.setLocale(new Locale("ru", "RU"));
            WritableWorkbook workbook = Workbook.createWorkbook(outputStream, ws);
            fillWorkbook(workbook);
            workbook.write();
            workbook.close();
	}

        public void fillWorkbook(WritableWorkbook workbook) throws RowsExceededException, WriteException {
            WritableSheet sheet = workbook.createSheet("Task Report", 0);
            makeHeader(sheet);
            makeContent(this.report.getRows(), sheet);
        }
        
        public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
            sheet.addCell(new Label(0, rowNumber, "Task", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "End date", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.Label(0, rowNumber, this.report.getFormTask().getName()));
            if(this.report.getFormStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(1, rowNumber, this.report.getFormStartDate().getTime(), dateFormat));
            }
            if(this.report.getFormEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(2, rowNumber, this.report.getFormEndDate().getTime(), dateFormat));
            }
            sheet.addCell(new jxl.write.DateTime(3, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            
            rowNumber++;
            columnNumber = 0;
	}
        public void makeContent(List<TaskReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Office");
            columnNames.add("Department");
            columnNames.add("Subdepartment");
            columnNames.add("Position");
            columnNames.add("Employee first name");
            columnNames.add("Employee last name");
            columnNames.add("Project code");
            columnNames.add("Client");
            columnNames.add("Group");
            columnNames.add("Time spent");
            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;

            int firstRowToSum = rowNumber;
            for(TaskReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getOffice().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getDepartment().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getSubdepartment().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPosition().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployee().getFirstName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployee().getLastName()));
                columnNumber++;
                if(row.getProjectCode() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
                }
                columnNumber++;
                if(row.getClient() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getClient().getName()));
                }
                columnNumber++;
                if(row.getGroup() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getGroup().getName()));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpent() / 60.0, timespentFormat));
                columnNumber++;
                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
        }
}
