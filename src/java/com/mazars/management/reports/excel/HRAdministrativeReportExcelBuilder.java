/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.vo.YearMonthDateTime;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.Calendar;
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
public class HRAdministrativeReportExcelBuilder {
        private HRAdministrativeReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public HRAdministrativeReportExcelBuilder(HRAdministrativeReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public HRAdministrativeReportExcelBuilder(HRAdministrativeReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
                WritableSheet sheet = workbook.createSheet("HR Administrative", 0);
                fillSheet(sheet, this.report);
	}
        private void fillSheet(WritableSheet sheet, HRAdministrativeReport report) throws RowsExceededException, WriteException {
            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start Date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End Date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getFormStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getFormEndDate().getTime(), dateFormat));
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
            sheet.addCell(new Label(columnNumber, rowNumber, "Position Start", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position End", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Email", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Active", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Career Status", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Time Status", headingFormat));
            columnNumber++;
            rowNumber++;
            Calendar day = new YearMonthDateTime(report.getCreatedAt()).getCalendar();
            CalendarUtil.truncateTime(day);
            for(HRAdministrativeReport.Row row : report.getRows()) {
                Office office = row.getOffice();
                Department department = row.getDepartment();
                Subdepartment subdepartment = row.getSubdepartment();
                StandardPosition standardPosition = row.getStandardPosition();
                Position position = row.getPosition();
                Employee employee = row.getEmployee();
                EmployeePositionHistoryItem employeePositionHistoryItem = row.getEmployeePositionHistoryItem();

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
                if(employeePositionHistoryItem.getStart() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, employeePositionHistoryItem.getStart().getTime(), dateFormat));
                }
                columnNumber++;
                if(employeePositionHistoryItem.getEnd() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, employeePositionHistoryItem.getEnd().getTime(), dateFormat));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employee.getEmail()));
                columnNumber++;
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, employee.getIsActive()));
                columnNumber++;
                if(employeePositionHistoryItem.getCareerStatus() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + employeePositionHistoryItem.getCareerStatus()));
                }
                columnNumber++;
                if(employeePositionHistoryItem.getTimeStatus(day) != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + employeePositionHistoryItem.getTimeStatus(day)));
                }
                columnNumber++;
                rowNumber++;
            }
        }
}
