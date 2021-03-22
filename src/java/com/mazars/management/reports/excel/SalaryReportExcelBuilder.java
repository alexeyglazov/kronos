/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
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
public class SalaryReportExcelBuilder {
        private SalaryReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public SalaryReportExcelBuilder(SalaryReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public SalaryReportExcelBuilder(SalaryReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
                WritableSheet sheet = workbook.createSheet("Salary", 0);
                fillSheet(sheet, this.report);
	}
        private void fillSheet(WritableSheet sheet, SalaryReport report) throws RowsExceededException, WriteException {
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
            sheet.addCell(new Label(columnNumber, rowNumber, "Active", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Email", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Contract Type", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Leaves", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position Start", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position End", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Salary Start", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Salary End", headingFormat));
            columnNumber++;
            for(Currency currency : report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Days in Paid Leaves", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Total Days in Paid Leaves", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Days in Unpaid Leaves", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Total Days in Unpaid Leaves", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Leaves start", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Leaves end", headingFormat));
            columnNumber++;
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(SalaryReport.Row row : report.getRows()) {
                Employee employee = row.getEmployee();
                EmployeePositionHistoryItem employeePositionHistoryItem = row.getEmployeePositionHistoryItem();
                LeavesItem leavesItem = row.getLeavesItem();
                Position position = row.getPosition();
                StandardPosition standardPosition = position.getStandardPosition();
                Subdepartment subdepartment = position.getSubdepartment();
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();

                String employeeFirstNameLocalLanguage = employee.getFirstNameLocalLanguage();
                String employeeLastNameLocalLanguage = employee.getLastNameLocalLanguage();
                
                String employeePositionHistoryItemContractType = "";
                if(employeePositionHistoryItem.getContractType() != null) {
                    employeePositionHistoryItemContractType = employeePositionHistoryItem.getContractType().toString();
                }
                String leavesItemType = "";
                if(leavesItem != null && leavesItem.getType() != null) {
                    leavesItemType = leavesItem.getType().toString();
                }
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
                if(employee.getIsActive() != null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, employee.getIsActive()));
                }
                columnNumber++;
                if(employee.getEmail() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, employee.getEmail()));
                }
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, employeePositionHistoryItemContractType));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, leavesItemType));
                columnNumber++;
                if(row.getDisplayedStart() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getDisplayedStart().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getDisplayedEnd() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getDisplayedEnd().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getSalary() != null && row.getSalary().getStart() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getSalary().getStart().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getSalary() != null && row.getSalary().getEnd() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getSalary().getEnd().getTime(), dateFormat));
                }
                columnNumber++;
                for(Currency currency : report.getCurrencies()) {
                    if(row.getSalary() != null) {
                        if(currency.getId().equals(row.getSalary().getCurrency().getId())) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getSalary().getValue().doubleValue(), numberFormat));
                        }
                    }
                    columnNumber++;
                }
                if(row.getPaidLeavesWorkingDaysCount() != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getPaidLeavesWorkingDaysCount(), integerFormat));
                }
                columnNumber++;
                if(row.getPaidLeavesWorkingDaysTotalCount() != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getPaidLeavesWorkingDaysTotalCount(), integerFormat));
                }
                columnNumber++;
                if(row.getUnpaidLeavesWorkingDaysCount() != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getUnpaidLeavesWorkingDaysCount(), integerFormat));
                }
                columnNumber++;
                if(row.getUnpaidLeavesWorkingDaysTotalCount() != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getUnpaidLeavesWorkingDaysTotalCount(), integerFormat));
                }
                columnNumber++;
                if(row.getLeavesItem() != null && row.getLeavesItem().getStart() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getLeavesItem().getStart().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getLeavesItem() != null && row.getLeavesItem().getEnd() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getLeavesItem().getEnd().getTime(), dateFormat));
                }
                columnNumber++;
                rowNumber++;
            }
        }
}
