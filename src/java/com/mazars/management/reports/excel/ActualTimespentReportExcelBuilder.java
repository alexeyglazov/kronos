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
public class ActualTimespentReportExcelBuilder {
        private ActualTimespentReport report;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;
        
        private int columnNumber = 0;
        private int rowNumber = 0;


        public ActualTimespentReportExcelBuilder(ActualTimespentReport report) throws RowsExceededException, WriteException {
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
            sheet.addCell(new Label(0, rowNumber, "Group", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "Client", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Project code", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Year", headingFormat));
            sheet.addCell(new Label(4, rowNumber, "Created at", headingFormat));
            rowNumber++;
            if(this.report.getFormGroup() != null) {
                sheet.addCell(new jxl.write.Label(0, rowNumber, this.report.getFormGroup().getName()));
            }
            if(this.report.getFormClient() != null) {
                sheet.addCell(new jxl.write.Label(1, rowNumber, this.report.getFormClient().getName()));
            }
            if(this.report.getFormProjectCode() != null) {
                sheet.addCell(new jxl.write.Label(2, rowNumber, this.report.getFormProjectCode().getCode()));
            }
            sheet.addCell(new jxl.write.Number(3, rowNumber, this.report.getFormYear()));
            sheet.addCell(new jxl.write.DateTime(4, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            
            rowNumber++;
            columnNumber = 0;
	}
        public void makeContent(List<ActualTimespentReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group");
            columnNames.add("Client");
            columnNames.add("Project code");
            columnNames.add("Employee first name");
            columnNames.add("Employee last name");
            columnNames.add("Time spent");

            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;

            for(ActualTimespentReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                if(row.getGroup() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getGroup().getName()));
                }
                columnNumber++;
                if(row.getClient() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getClient().getName()));
                }
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployee().getFirstName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployee().getLastName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimespent() / 60.0, timespentFormat));
                columnNumber++;
                rowNumber++;
            }
        }
}
