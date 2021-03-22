/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import com.mazars.management.service.ConfigUtils;
import java.io.*;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
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
public class CodeDetailReportExcelBuilder {
        private CodeDetailReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;
        private WritableCellFormat strongFormat;
        private WritableCellFormat wrapFormat;
        
        private int columnNumber = 0;
        private int rowNumber = 0;
        private Map<Long, Integer> currencyRateColumnNumbers = new HashMap<Long, Integer>();
        private Integer currencyRateRowNumber = null;

        public CodeDetailReportExcelBuilder(CodeDetailReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
            this.report = report;
            this.outputStream = outputStream;

            this.headingFormat = ExcelUtils.getHeadingFormat();
            this.numberFormat = ExcelUtils.getNumberFormat();
            this.integerFormat = ExcelUtils.getIntegerFormat();
            this.percentFormat = ExcelUtils.getPercentFormat();
            this.timespentFormat = ExcelUtils.getTimespentFormat();
            this.dateFormat = ExcelUtils.getDateFormat();
            this.fullDateFormat = ExcelUtils.getFullDateFormat();
            this.strongFormat = ExcelUtils.getStrongFormat();
            this.wrapFormat = ExcelUtils.getWrapFormat();
        }
        public CodeDetailReportExcelBuilder(CodeDetailReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            this.strongFormat = ExcelUtils.getStrongFormat();
            this.wrapFormat = ExcelUtils.getWrapFormat();
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

        private void makeRequisitesHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
            if(CodeDetailReport.View.EXCEL_WITH_REQUISITES.equals(report.getView())) {
                if(ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.header1") != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.header1"), strongFormat));
                    sheet.mergeCells(0, rowNumber, 10, rowNumber);
                    int heightInPoints = 40*20;
                    sheet.setRowView(rowNumber, heightInPoints);
                    rowNumber++;
                }
                if(ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.header2") != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.header2"), wrapFormat));
                    sheet.mergeCells(0, rowNumber, 10, rowNumber);
                    int heightInPoints = 50*20;
                    sheet.setRowView(rowNumber, heightInPoints);
                    rowNumber++;
                }
            }            
        }
        private void makeRequisitesFooter(WritableSheet sheet) throws RowsExceededException, WriteException {
            if(CodeDetailReport.View.EXCEL_WITH_REQUISITES.equals(report.getView())) {
                if(ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.footer") != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, ConfigUtils.getProperties().getProperty("reports.codeDetail.requisites.footer"), wrapFormat));
                    sheet.mergeCells(0, rowNumber, 10, rowNumber);
                    int heightInPoints = 50*20;
                    sheet.setRowView(rowNumber, heightInPoints);
                    rowNumber++;
                }
            }              
        }
        private void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
            sheet.addCell(new Label(columnNumber, rowNumber, "Report on Code", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Code Description", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Person in charge", headingFormat));
            columnNumber++;
            if(CodeDetailReport.View.EXCEL_SIMPLE.equals(report.getView())) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Closed", headingFormat));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, "Dead", headingFormat));
                columnNumber++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Subdepartment", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Created at", headingFormat));
            columnNumber++;
            if(Boolean.TRUE.equals(this.report.getFormIsRateInfoVisible())) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Report Currency", headingFormat));
                columnNumber++;
                for(Currency currency : report.getCurrencies()) {
                    if(! currency.getId().equals(report.getFormReportCurrency().getId())) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + currency.getCode() + "/" + report.getFormReportCurrency().getCode(), headingFormat));
                        columnNumber++;
                    }
                }
            }
            rowNumber++;
            columnNumber = 0;
            currencyRateRowNumber = rowNumber;
            
            String formReportCurrency = "";
            if(this.report.getFormReportCurrency() != null) {
                formReportCurrency = this.report.getFormReportCurrency().getCode();
            }
            int count = 0;
            for(ProjectCode projectCode : this.report.getFormProjectCodes()) {
                columnNumber = 0;
                String inChargePerson = "";
                if(projectCode.getInChargePerson() != null) {
                    inChargePerson = projectCode.getInChargePerson().getFullName();
                }
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCode.getCode()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCode.getDescription()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, inChargePerson));
                columnNumber++;
                if(CodeDetailReport.View.EXCEL_SIMPLE.equals(report.getView())) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, projectCode.getIsClosed() != null ? projectCode.getIsClosed() : false));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, projectCode.getIsDead() != null ? projectCode.getIsDead() : false));
                    columnNumber++;
                }
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCode.getSubdepartment().getName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCode.getClient().getName()));
                columnNumber++;
                if(count == 0) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
                    columnNumber++;
                    if(Boolean.TRUE.equals(this.report.getFormIsRateInfoVisible())) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formReportCurrency));
                        columnNumber++;
                        for(Currency currency : report.getCurrencies()) {
                            if(! currency.getId().equals(report.getFormReportCurrency().getId())) {
                                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, report.getFormCurrencyRates().get(currency.getId()).doubleValue()));
                                currencyRateColumnNumbers.put(currency.getId(), columnNumber);
                                columnNumber++;
                            }
                        }
                    }
                }
                rowNumber++;
                count++;
            }
            columnNumber = 0;
        }
        private void makeContent(WritableSheet sheet) throws RowsExceededException, WriteException {                 
            List<String> columnNames = new LinkedList<String>();
            if(this.report.getFormProjectCodes().size() > 1) {
                columnNames.add("Project code");
            }
            columnNames.add("First Name");
            columnNames.add("Last Name");
            columnNames.add("Position");
            columnNames.add("Standard position");
            columnNames.add("Task Type");
            columnNames.add("Task");
            columnNames.add("Time Spent");
            if(Boolean.TRUE.equals(this.report.getFormIsRateInfoVisible())) {              
                for(Currency currency : report.getCurrencies()) {
                    columnNames.add("Rate (" + currency.getCode() + ")");
                }
                columnNames.add("CvRate (" + report.getFormReportCurrency().getCode() + ")");
                columnNames.add("Amount (" + report.getFormReportCurrency().getCode() + ")");
            }
            columnNames.add("Description");
            columnNames.add("Record Date");
            if(CodeDetailReport.View.EXCEL_SIMPLE.equals(report.getView())) {
                columnNames.add("Modified At");
            }
            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            int timeSpentColumnNumber = 6;
            int cvRateAmountColumnNumber = 7 + report.getCurrencies().size();
            int amountColumnNumber = cvRateAmountColumnNumber + 1;
            if(this.report.getFormProjectCodes().size() > 1) {
                timeSpentColumnNumber++;
                cvRateAmountColumnNumber++;
                amountColumnNumber++;
            }
            for(CodeDetailReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                if(this.report.getFormProjectCodes().size() > 1) {
                    sheet.addCell(new Label(columnNumber, rowNumber, row.getProjectCodeCode()));
                    columnNumber++;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployeeFirstName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getEmployeeLastName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPositionName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getStandardPositionName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTaskTypeName() ));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getTaskName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getTimeSpent() / 60.0, timespentFormat));
                columnNumber++;
                if(Boolean.TRUE.equals(this.report.getFormIsRateInfoVisible())) {
                    Integer rateAmountColumn = null;
                    for(Currency currency : report.getCurrencies()) {
                        if(currency.getId().equals(row.getStandardSellingRateGroupCurrencyId()) && row.getStandardSellingRateAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getStandardSellingRateAmount().doubleValue(), numberFormat));
                            rateAmountColumn = columnNumber;
                        }
                        columnNumber++;
                    }
                    if(row.getStandardSellingRateGroupCurrencyId() != null && rateAmountColumn != null) {
                        String formula = "";
                        if(row.getStandardSellingRateGroupCurrencyId().equals(report.getFormReportCurrency().getId())) {
                            formula = "" + ExcelUtils.getColumnName(rateAmountColumn) + (rowNumber + 1) + "";
                        } else {
                            formula = "" + ExcelUtils.getColumnName(rateAmountColumn) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(currencyRateColumnNumbers.get(row.getStandardSellingRateGroupCurrencyId())) + (currencyRateRowNumber + 1) + "";
                        }
                        sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                    }
                    columnNumber++;
                    
                    String formula = "" + ExcelUtils.getColumnName(columnNumber - 1) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                    columnNumber++;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, row.getDescription()));
                columnNumber++;
                if(row.getDay() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getDay().getTime(), dateFormat));
                }
                columnNumber++;
                if(CodeDetailReport.View.EXCEL_SIMPLE.equals(report.getView())) {
                    if(row.getModifiedAt() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getModifiedAt(), fullDateFormat));
                    }
                    columnNumber++;
                }

                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = timeSpentColumnNumber;
                String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                columnNumber++;
            }
            if(Boolean.TRUE.equals(this.report.getFormIsRateInfoVisible()) && lastRowToSum >= firstRowToSum) {
                columnNumber = amountColumnNumber;
                String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + this.report.getFormReportCurrency().getCode() + " without VAT"));
                

                columnNumber = cvRateAmountColumnNumber;
                formula = "" + ExcelUtils.getColumnName(amountColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber + 1) + "";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                
            }
            rowNumber++;
            columnNumber = 0; 
        }
	public void fillWorkbook() throws RowsExceededException, WriteException {
            WritableSheet sheet = workbook.createSheet("Code Detail Report", 0);
            makeRequisitesHeader(sheet);
            makeHeader(sheet);
            makeContent(sheet);
            makeRequisitesFooter(sheet);
	}
}
