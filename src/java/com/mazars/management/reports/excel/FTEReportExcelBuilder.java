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
import java.util.Map;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.Orientation;
import jxl.write.DateFormat;
import jxl.write.Label;
import jxl.write.NumberFormats;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
/**
 *
 * @author Glazov
 */
public class FTEReportExcelBuilder {
        private FTEReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;
        
        private int columnNumber = 0;
        private int rowNumber = 0;
        
        public FTEReportExcelBuilder(FTEReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public FTEReportExcelBuilder(FTEReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            WritableSheet employeeSheet = workbook.createSheet("Employee FTE", 0);
            WritableSheet standardPositionSheet = workbook.createSheet("Standard position FTE", 1);
            WritableSheet ownTimeSheet = workbook.createSheet("On-project time spent vs FTE", 2);
            
            makeHeader(employeeSheet, this.report);
            fillEmployeeFTESheet(employeeSheet, this.report.getEmployeeFTEReport());
            
            makeHeader(standardPositionSheet, this.report);
            fillStandardPositionFTESheet(standardPositionSheet, this.report.getStandardPositionFTEReport());
            
            makeHeader(ownTimeSheet, this.report);
            fillOwnTimeFTESheet(ownTimeSheet, this.report.getOwnTimeFTEReport());
	}
        private void makeHeader(WritableSheet sheet, FTEReport report) throws RowsExceededException, WriteException {
            columnNumber = 0;
            rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Working Days", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getFormStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getFormEndDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.Number(2, rowNumber, report.getEmployeeFTEReport().getWorkingDaysCount(), integerFormat));
            sheet.addCell(new jxl.write.DateTime(3, rowNumber, report.getCreatedAt(), fullDateFormat));
            rowNumber++;            
        }
        private void fillEmployeeFTESheet(WritableSheet sheet, EmployeeFTEReport report) throws RowsExceededException, WriteException {
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
            sheet.addCell(new Label(columnNumber, rowNumber, "Contract Type", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Time Spent", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Part Time", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Working Days", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position Working Days", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "FTE", headingFormat));
            columnNumber++;

            rowNumber++;
            int firstRowToSum = rowNumber;
            for(EmployeeFTEReport.Row row : report.getRows()) {
                Employee employee = row.getEmployee();
                Position position = row.getPosition();
                Subdepartment subdepartment = position.getSubdepartment();
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                StandardPosition standardPosition = row.getStandardPosition();

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
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeePositionHistoryItem().getContractType().toString()));
                columnNumber++;
                if(EmployeePositionHistoryItem.ContractType.TIME_SPENT.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpent()/60.0, timespentFormat));
                }
                columnNumber++;
                if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getEmployeePositionHistoryItem().getPartTimePercentage()/100.0, percentFormat));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getWorkingDaysCount(), integerFormat));
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getPositionWorkingDaysCount(), integerFormat));
                columnNumber++;

                String formula = "";
                if(EmployeePositionHistoryItem.ContractType.TIME_SPENT.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    formula = "" + ExcelUtils.getColumnName(columnNumber - 4) + (rowNumber + 1) + "/(" + ExcelUtils.getColumnName(2) + (2) + "*8)";
                } else if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    formula = "" + ExcelUtils.getColumnName(columnNumber - 3) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(columnNumber - 2) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(2) + (2) + "";
                } else if(EmployeePositionHistoryItem.ContractType.FULL_TIME.equals(row.getEmployeePositionHistoryItem().getContractType())) {
                    formula = "" + ExcelUtils.getColumnName(columnNumber - 2) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(2) + (2) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                rowNumber++;
            }
        }
        private void fillOwnTimeFTESheet(WritableSheet sheet, OwnTimeFTEReport report) throws RowsExceededException, WriteException {
            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Sub department", headingFormat));
            columnNumber++;
            for(StandardPosition standardPosition : report.getStandardPositions()) {
                sheet.addCell(new Label(columnNumber, rowNumber, standardPosition.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(Subdepartment subdepartment : report.getSubdepartments()) {
                columnNumber = 0;
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                sheet.addCell(new Label(columnNumber, rowNumber, office.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName()));
                columnNumber++;
                
                for(StandardPosition standardPosition : report.getStandardPositions()) {
                    OwnTimeFTEReport.Cell cell = report.getCell(subdepartment, standardPosition);
                    if(cell != null) {
                        if(cell.getTimeSpent() == null && cell.getFte() == null) {
                        } else if(cell.getTimeSpent() == null && cell.getFte() != null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "No time/" + cell.getFte()));
                        } else if(cell.getTimeSpent() != null && cell.getFte() == null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, (cell.getTimeSpent()/60.0) + "/No FTE"));
                        } else if(cell.getTimeSpent() != null && cell.getFte() != null) {
                            Double timeSpent = cell.getTimeSpent() / 60.0;
                            String formula = "" + timeSpent + "/" + cell.getFte();
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));                
                        }
                    }
                    columnNumber++;
                }
                rowNumber++;
            }    
        }
        private void fillStandardPositionFTESheet(WritableSheet sheet, StandardPositionFTEReport report) throws RowsExceededException, WriteException {
            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Sub department", headingFormat));
            columnNumber++;
            for(StandardPosition standardPosition : report.getStandardPositions()) {
                sheet.addCell(new Label(columnNumber, rowNumber, standardPosition.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(Subdepartment subdepartment : report.getSubdepartments()) {
                columnNumber = 0;
                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                sheet.addCell(new Label(columnNumber, rowNumber, office.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName()));
                columnNumber++;
                if(report.getInfo().containsKey(subdepartment)) {
                    Map<StandardPosition, Double> subInfo = report.getInfo().get(subdepartment);
                    for(StandardPosition standardPosition : report.getStandardPositions()) {
                        Double fte = subInfo.get(standardPosition);
                        if(fte != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, fte, numberFormat));
                        }
                        columnNumber++;
                    }
                }
                rowNumber++;
            }    
        }
}
