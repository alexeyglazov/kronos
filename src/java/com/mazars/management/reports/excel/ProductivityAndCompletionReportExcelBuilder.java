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
public class ProductivityAndCompletionReportExcelBuilder {
        private ProductivityAndCompletionReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public ProductivityAndCompletionReportExcelBuilder(ProductivityAndCompletionReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public ProductivityAndCompletionReportExcelBuilder(ProductivityAndCompletionReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("First Name");
            columnNames.add("Last Name");
            columnNames.add("Position");
            columnNames.add("Standard Position");
            columnNames.add("Subdepartment");
            columnNames.add("Working Days");
            columnNames.add("Project Time Spent");
            for(Task task : this.report.getIdleTasks()) {
                columnNames.add(task.getName());
            }
            columnNames.add("Internal Time Spent");
            columnNames.add("Total Time Spent");
            columnNames.add("Completion, %");
            columnNames.add("Productivity, %");
            columnNames.add("Leave Status");
            columnNames.add("Entry Date");
            columnNames.add("Exit Date");
            columnNames.add("Contract Type");
            columnNames.add("Part Time Percentage");
            WritableSheet sheet = workbook.createSheet("Productivity and Completion Report", 0);

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Subdepartments", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, this.report.getStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, this.report.getEndDate().getTime(), dateFormat));
            String subdepartmentListTxt = "";
            int count = 0;
            List<Subdepartment> subdepartments = this.report.getSubdepartments();
            for(Subdepartment subdepartment : subdepartments) {
                subdepartmentListTxt += subdepartment.getName();
                if(count < subdepartments.size() - 1) {
                    subdepartmentListTxt += ", ";
                }
                count++;
            }
            sheet.addCell(new Label(2, rowNumber, subdepartmentListTxt));
            sheet.addCell(new jxl.write.DateTime(3, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            rowNumber++;
            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(ProductivityAndCompletionReport.Row row : this.report.getRows()) {
                Long notIdleDaysCount = new Long(0);
                if(row.getNotIdleDaysCount() != null) {
                    notIdleDaysCount = row.getNotIdleDaysCount();
                }
                int workingDaysCount = row.getWorkingDaysCount();
                columnNumber = 0;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployeeFirstName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployeeLastName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPositionName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getStandardPositionName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getSubdepartmentName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, notIdleDaysCount, integerFormat));
                columnNumber++;
                int firstColumnToSum = columnNumber;
                int projectColumn = columnNumber;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getProjectTimespent() / 60.0, timespentFormat));
                columnNumber++;
                for(Long idleTaskId : row.getIdleTimespentItems().keySet()) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getIdleTimespentItems().get(idleTaskId) / 60.0, timespentFormat));
                    columnNumber++;
                }
                int notIdleColumn = columnNumber;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getNotIdleInternalTimespent() / 60.0, timespentFormat));
                columnNumber++;

                String formula1 = "SUM(" + ExcelUtils.getColumnName(firstColumnToSum) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula1, timespentFormat));
                columnNumber++;

                if(workingDaysCount != 0) {
                    String formula2 = "" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + "/(" + workingDaysCount + "*8)";
                    if(EmployeePositionHistoryItem.ContractType.PART_TIME.equals(row.getContractType()) && row.getPartTimePercentage() != null) {
                        formula2 = "" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + "/(" + workingDaysCount + "*8*" + ExcelUtils.getColumnName(18) + (rowNumber + 1) + ")";
                    }
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula2, percentFormat));
                }
                columnNumber++;

                if(row.getProjectTimespent() + row.getNotIdleInternalTimespent() != 0) {
                    String formula3 = "" + ExcelUtils.getColumnName(projectColumn) + (rowNumber + 1) + "/(" + ExcelUtils.getColumnName(projectColumn) + (rowNumber + 1)+ "+" + ExcelUtils.getColumnName(notIdleColumn) + (rowNumber + 1) + ")";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula3, percentFormat));
                }
                columnNumber++;
                if(row.getLeavesItemType() != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, "" + row.getLeavesItemType()));
                }
                columnNumber++;
                if(row.getEntryDate() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getEntryDate().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getExitDate() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getExitDate().getTime(), dateFormat));
                }
                columnNumber++;
                if(row.getContractType() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + row.getContractType()));
                }
                columnNumber++;
                if(row.getPartTimePercentage() != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getPartTimePercentage() / 100.0, percentFormat));
                }
                columnNumber++;

                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = 5;
                String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, integerFormat));
                formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
                for(Task task : report.getIdleTasks() ) {
                    formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                    columnNumber++;
                }
                formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
                formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
             }
	}
}
