/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import com.mazars.management.service.LeavesBalanceCalculator;
import java.io.*;
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
public class LeavesReportExcelBuilder {
        private LeavesReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public LeavesReportExcelBuilder(LeavesReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public LeavesReportExcelBuilder(LeavesReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
                WritableSheet sheet = workbook.createSheet("Leaves", 0);
                fillSheet(sheet, this.report);
	}
        private void fillSheet(WritableSheet sheet, LeavesReport report) throws RowsExceededException, WriteException {
            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "Active", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getFormDate().getTime(), dateFormat));
            if(report.getFormIsActive() != null) {
                sheet.addCell(new jxl.write.Boolean(1, rowNumber, report.getFormIsActive()));
            }
            sheet.addCell(new jxl.write.DateTime(2, rowNumber, report.getCreatedAt(), fullDateFormat));
            rowNumber++;

            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Sub department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Position", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "First Name", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Last Name", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Full Name (Local Language)", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Email", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Active", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Days", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Spent", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Balance", headingFormat));
            columnNumber++;
            rowNumber++;
            for(LeavesReport.Row row : report.getRows()) {
                Employee employee = row.getEmployee();
                Position position = row.getPosition();
                StandardPosition standardPosition = position.getStandardPosition();
                Subdepartment subdepartment = position.getSubdepartment();
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                LeavesBalanceCalculator leavesBalanceCalculator = row.getLeavesBalanceCalculator();
               
                columnNumber = 0;

                sheet.addCell(new Label(columnNumber, rowNumber, office.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, position.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, standardPosition.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, employee.getFirstName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, employee.getLastName()));
                columnNumber++;
                if(employee.getFullNameLocalLanguage(Boolean.TRUE) != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, employee.getFullNameLocalLanguage(Boolean.TRUE)));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employee.getEmail()));
                columnNumber++;
                if(employee.getIsActive() != null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, employee.getIsActive()));
                }
                columnNumber++;
                if(leavesBalanceCalculator != null) {
                    Double totalDays = 0.0;
                    Integer totalSpentDays = 0;
                    for(LeavesBalanceCalculator.Stage stage : leavesBalanceCalculator.getStages()) {
                        if(stage.getDays() != null) {
                            totalDays += stage.getDays();
                        }
                    }
                    for(LeavesBalanceCalculator.SpentLeaveItem spentLeaveItem : leavesBalanceCalculator.getSpentLeaveItems()) {
                        if(spentLeaveItem.getDays() != null) {
                            totalSpentDays += spentLeaveItem.getDays();
                        }
                    }
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, totalDays, numberFormat));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, totalSpentDays, integerFormat));
                    columnNumber++;
                    String formula = "" + ExcelUtils.getColumnName(columnNumber - 2) + (rowNumber + 1) + "-" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula));
                    columnNumber++;
                
                } else {
                    columnNumber += 3;
                }
                
                rowNumber++;
            }
        }
}
