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
public class TrainingReportExcelBuilder {
        private TrainingReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public TrainingReportExcelBuilder(TrainingReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public TrainingReportExcelBuilder(TrainingReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            ws.setLocale(new Locale("en", "US"));
            workbook = Workbook.createWorkbook(outputStream, ws);
	}
        public void writeWorkbook() throws IOException, WriteException {
                workbook.write();
                workbook.close();
        }


	public void fillWorkbook() throws RowsExceededException, WriteException {
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Employee");
            columnNames.add("Office");
            columnNames.add("Department");
            columnNames.add("Subdepartment");
            columnNames.add("Task");
            columnNames.add("Time spent");
            columnNames.add("Day");
            columnNames.add("Description");
            columnNames.add("Modified at");
                
            WritableSheet sheet = workbook.createSheet("Training Report", 0);

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Search Type", headingFormat));
            if(TrainingReport.SearchType.KEYWORD.equals(report.getFormSearchType())) {
                sheet.addCell(new Label(3, rowNumber, "Keyword", headingFormat));
                sheet.addCell(new Label(4, rowNumber, "Created at", headingFormat));
            } else {
                sheet.addCell(new Label(3, rowNumber, "Created at", headingFormat));
            }
            
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getEndDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.Label(2, rowNumber, "" + this.report.getFormSearchType()));
            if(TrainingReport.SearchType.KEYWORD.equals(report.getFormSearchType())) {
                sheet.addCell(new jxl.write.Label(3, rowNumber, this.report.getFormKeyword()));
                sheet.addCell(new jxl.write.DateTime(4, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            } else {
                sheet.addCell(new jxl.write.DateTime(3, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            }
            rowNumber++;
            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(TrainingReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployee().getFullName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getOffice().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getDepartment().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getSubdepartment().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTask().getName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpentItem().getTimeSpent() / 60.0, timespentFormat));
                columnNumber++;
                if(row.getTimeSpentItem().getDay() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getTimeSpentItem().getDay().getTime(), dateFormat));
                }
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTimeSpentItem().getDescription()));
                columnNumber++;
                if(row.getTimeSpentItem().getModifiedAt() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getTimeSpentItem().getModifiedAt(), fullDateFormat));
                }
                columnNumber++;

                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = 5;
                String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
            }
	}
}
