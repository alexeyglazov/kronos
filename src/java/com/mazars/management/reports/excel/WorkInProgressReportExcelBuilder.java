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
import java.math.BigDecimal;
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class WorkInProgressReportExcelBuilder {
        private WorkInProgressReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        Integer rowNumber = 0;
        Integer columnNumber = 0;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public WorkInProgressReportExcelBuilder(WorkInProgressReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public WorkInProgressReportExcelBuilder(WorkInProgressReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            WritableSheet sheet = workbook.createSheet("Work In Progress", 0);
            fillSheet(sheet, this.report);
	}
        private void fillSheet(WritableSheet sheet, WorkInProgressReport report) throws RowsExceededException, WriteException {           
            fillSheetWithDescription(sheet);
            rowNumber++;
            fillSheetWithTableHeader(sheet);
            rowNumber++;
            for(WorkInProgressReport.Subreport subreport : report.getSubreports() ) {
                FeesItem feesItem = subreport.getProjectCode().getFeesItem();
                FeesItem.Type type = feesItem != null ? feesItem.getType() : null;
                if(type == null) {
                    fillSheetWithNoBudgetSubreport(sheet, subreport);                    
                } else if(FeesItem.Type.QUOTATION.equals(type)) {
                    fillSheetWithQuotationSubreport(sheet, subreport);
                } else if(FeesItem.Type.FLAT_FEE.equals(type)) {
                    fillSheetWithFlatFeeSubreport(sheet, subreport);
                } else if(FeesItem.Type.TIMESPENT.equals(type)) {
                    fillSheetWithTimeSpentSubreport(sheet, subreport);
                }
            }
        }
        private void fillSheetWithDescription(WritableSheet sheet) throws RowsExceededException, WriteException {
            Currency mainCurrency = this.report.getMainCurrency();
            WritableCellFormat headingFormat = ExcelUtils.getHeadingFormat();
            WritableCellFormat dateFormat = ExcelUtils.getDateFormat();
            WritableCellFormat fullDateFormat = ExcelUtils.getFullDateFormat();

            columnNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, "End date", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(1, rowNumber, "Created at", headingFormat));
            columnNumber++;
            for(Currency currency : this.report.getCurrencies()) {
                if(currency.getId().equals(mainCurrency.getId())) {
                    continue;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode() + "/" + mainCurrency.getCode(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            columnNumber = 0;
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, report.getEndDate().getTime(), dateFormat));
            columnNumber++;
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, report.getCreatedAt(), fullDateFormat));
            columnNumber++;
            for(Currency currency : this.report.getCurrencies()) {
                if(currency.getId().equals(mainCurrency.getId())) {
                    continue;
                }
                BigDecimal rate = this.report.getCurrencyRates().get(currency.getId());
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, rate != null ? rate.doubleValue() : 1));
                columnNumber++;
            }
        }
        private void fillSheetWithTableHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
            Currency mainCurrency = this.report.getMainCurrency();
            WritableCellFormat headingFormat = ExcelUtils.getHeadingFormat();
            columnNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, "Group", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Code", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Start date", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "End date", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Budget Type", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Position", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Position", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Budget Time", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Rate", headingFormat));
            columnNumber++;
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Ccy Rate", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Cv " + mainCurrency.getCode(), headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Spent Time", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Prorata", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Limited To Budget", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Rate", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "WIP " + mainCurrency.getCode(), headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Achieved", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Remaining Time", headingFormat));
            columnNumber++;
        }
        private void fillSheetWithNoBudgetSubreport(WritableSheet sheet, WorkInProgressReport.Subreport subreport) throws RowsExceededException, WriteException {
            int firstRowToSum = rowNumber;
            columnNumber = 0;
            ProjectCode projectCode = subreport.getProjectCode();
            Client client = projectCode.getClient();
            Group group = client.getGroup();

            int positionColumnNumber = 6;
            int standardPositionColumnNumber = positionColumnNumber + 1;
            int spentimeColumnNumber = 12 + this.report.getCurrencies().size();
            int sellingRateColumnNumber = spentimeColumnNumber + 3;
            int wipCVColumnNumber = sellingRateColumnNumber + 1;

            for(WorkInProgressReport.Row row : subreport.getRows()) {
                Long spentTime = new Long(0);
                BigDecimal standardRate = new BigDecimal(0);

                sheet.addCell(new Label(positionColumnNumber, rowNumber, row.getPosition().getName()));
                sheet.addCell(new Label(standardPositionColumnNumber, rowNumber, row.getStandardPosition().getName()));
                
                spentTime = row.getSpentTime();

                sheet.addCell(new jxl.write.Number(spentimeColumnNumber, rowNumber, spentTime / 60.0, timespentFormat));
                sheet.addCell(new jxl.write.Number(sellingRateColumnNumber, rowNumber, standardRate.doubleValue(), timespentFormat));
                String formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingRateColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
                rowNumber++;
            }
            columnNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, group.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, client.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode()));
            columnNumber++;
            if(projectCode.getStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(projectCode.getEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getEndDate().getTime(), dateFormat));
            }
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "No Budget"));

            String formula = "SUM(" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(spentimeColumnNumber, rowNumber, formula));
            formula = ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber, rowNumber, formula, numberFormat));
            formula = "SUM(" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
            rowNumber++;
        }

        private void fillSheetWithQuotationSubreport(WritableSheet sheet, WorkInProgressReport.Subreport subreport) throws RowsExceededException, WriteException {
            Currency mainCurrency = this.report.getMainCurrency();

            Double invoiceCurrencyRate = new Double(1.0);
            if(! mainCurrency.getId().equals(subreport.getProjectCode().getFeesItem().getFeesInvoiceCurrency().getId())) {
                invoiceCurrencyRate = getRateToMainCurrency(subreport.getProjectCode().getFeesItem().getFeesInvoiceCurrency().getId());
            }
            Double quotationCurrencyRate = new Double(1.0);
            //todo
            //if(! mainCurrency.getId().equals(subreport.getProjectCode().getFeesItem().getQuotationSellingRateCurrency().getId())) {
            //    quotationCurrencyRate = getRateToMainCurrency(subreport.getProjectCode().getFeesItem().getQuotationSellingRateCurrency().getId());
            //}

            int firstRowToSum = rowNumber;
            columnNumber = 0;
            ProjectCode projectCode = subreport.getProjectCode();
            Client client = projectCode.getClient();
            Group group = client.getGroup();

            int budgetTimeColumnNumber = 8;
            int sellingRateColumnNumber1 = 9;
            int sellingValueColumnNumber = 10;
            int negociatedValueColumnNumber = 10;
            int sellingAmountToMainCurrencyRateColumnNumber = 10 + this.report.getCurrencies().size();
            int subtotalCVColumnNumber = sellingAmountToMainCurrencyRateColumnNumber + 1;
            int spentimeColumnNumber = 12 + this.report.getCurrencies().size();
            int prorataColumnNumber = spentimeColumnNumber + 1;
            int limitedToBudgetColumnNumber = prorataColumnNumber + 1;
            int sellingRateColumnNumber2 = spentimeColumnNumber + 3;
            int wipCVColumnNumber = sellingRateColumnNumber2 + 1;
            int achievedColumnNumber = wipCVColumnNumber + 1;
            int remainingTimeColumnNumber = achievedColumnNumber + 1;

            for(WorkInProgressReport.Row row : subreport.getRows()) {
                Integer budgetTime = new Integer(0);
                Long spentTime = new Long(0);
                BigDecimal standardRate = new BigDecimal(0);

                columnNumber = 6;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPosition().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getStandardPosition().getName()));
                
                WorkInProgressReport.QuotationRow budgetRow = (WorkInProgressReport.QuotationRow)row;

                if(budgetRow.getAverageCvStandardSellingRate() != null) {
                    standardRate = budgetRow.getAverageCvStandardSellingRate();
                }
                if(budgetRow.getPositionQuotation() != null && budgetRow.getPositionQuotation().getTime() != null) {
                    budgetTime = budgetRow.getPositionQuotation().getTime();
                }
                spentTime = budgetRow.getSpentTime();
                    
                sheet.addCell(new jxl.write.Number(budgetTimeColumnNumber, rowNumber, budgetTime / 60.0, timespentFormat));
                sheet.addCell(new jxl.write.Number(sellingRateColumnNumber1, rowNumber, standardRate.doubleValue(), numberFormat));
                for(Currency currency : this.report.getCurrencies()) {
                    //todo
                    //if(currency.getId().equals(subreport.getProjectCode().getFeesItem().getQuotationSellingRateCurrency().getId())) {
                    //    String formula = "" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingRateColumnNumber1) + (rowNumber + 1);
                    //    sheet.addCell(new jxl.write.Formula(sellingValueColumnNumber, rowNumber, formula));
                    //    break;
                    //}
                    sellingValueColumnNumber++;
                }
                sheet.addCell(new jxl.write.Number(sellingAmountToMainCurrencyRateColumnNumber, rowNumber, invoiceCurrencyRate, numberFormat));
                String formula = "" + ExcelUtils.getColumnName(sellingValueColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingAmountToMainCurrencyRateColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(subtotalCVColumnNumber, rowNumber, formula));
                sheet.addCell(new jxl.write.Number(spentimeColumnNumber, rowNumber, spentTime / 60.0, timespentFormat));
                formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(prorataColumnNumber, rowNumber, formula, percentFormat));

                formula = "IF(" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "<" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1) + "," + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "," + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1) + ")";
                sheet.addCell(new jxl.write.Formula(limitedToBudgetColumnNumber, rowNumber, formula));

                sheet.addCell(new jxl.write.Number(sellingRateColumnNumber2, rowNumber, standardRate.doubleValue(), numberFormat));
                formula = "" + ExcelUtils.getColumnName(limitedToBudgetColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingRateColumnNumber2) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
                formula = "" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1) + "-" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(remainingTimeColumnNumber, rowNumber, formula));
                rowNumber++;
            }
            columnNumber = 0;

            String formula = "SUM(" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(budgetTimeColumnNumber, rowNumber, formula));
            formula = "" + ExcelUtils.getColumnName(sellingValueColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1) + "";
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber1, rowNumber, formula));
            formula = "SUM(" + ExcelUtils.getColumnName(sellingValueColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(sellingValueColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(sellingValueColumnNumber, rowNumber, formula));
            sheet.addCell(new jxl.write.Number(sellingAmountToMainCurrencyRateColumnNumber, rowNumber, invoiceCurrencyRate, numberFormat));
            formula = "SUM(" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(subtotalCVColumnNumber, rowNumber, formula));

            formula = "SUM(" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(spentimeColumnNumber, rowNumber, formula));
            formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(prorataColumnNumber, rowNumber, formula, percentFormat));
            formula = "SUM(" + ExcelUtils.getColumnName(limitedToBudgetColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(limitedToBudgetColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(limitedToBudgetColumnNumber, rowNumber, formula));
                       
            formula = ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber2, rowNumber, formula, numberFormat));
            
            formula = "SUM(" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1) + "";
            sheet.addCell(new jxl.write.Formula(achievedColumnNumber, rowNumber, formula, percentFormat));
            formula = "SUM(" + ExcelUtils.getColumnName(remainingTimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(remainingTimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(remainingTimeColumnNumber, rowNumber, formula));
            rowNumber++;

            sheet.addCell(new Label(subtotalCVColumnNumber - 1, rowNumber, "Discount", headingFormat));
            formula = "1 - " + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1 + 1) + "/" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1 - 1) + "";
            sheet.addCell(new jxl.write.Formula(subtotalCVColumnNumber, rowNumber, formula, percentFormat));
            sheet.addCell(new Label(wipCVColumnNumber - 1, rowNumber, "Discount", headingFormat));
            formula = "" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1) + "";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula, percentFormat));

            rowNumber++;

            sheet.addCell(new Label(columnNumber, rowNumber, group.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, client.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode()));
            columnNumber++;
            if(projectCode.getStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(projectCode.getEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getEndDate().getTime(), dateFormat));
            }
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Quotation"));
            
            formula = "" + ExcelUtils.getColumnName(budgetTimeColumnNumber) + (rowNumber - 1) + "";
            sheet.addCell(new jxl.write.Formula(budgetTimeColumnNumber, rowNumber, formula));

            for(Currency currency : this.report.getCurrencies()) {
                //if(currency.getId().equals(subreport.getProjectCode().getFeesItem().getQuotationInvoicingCurrency().getId())) {
                //    sheet.addCell(new jxl.write.Number(negociatedValueColumnNumber, rowNumber, subreport.getProjectCode().getFeesItem().getQuotationNegociated().doubleValue()));
                //    break;
                //}
                negociatedValueColumnNumber++;
            }
            sheet.addCell(new jxl.write.Number(sellingAmountToMainCurrencyRateColumnNumber, rowNumber,invoiceCurrencyRate, numberFormat));

            formula = "" + ExcelUtils.getColumnName(negociatedValueColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingAmountToMainCurrencyRateColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(subtotalCVColumnNumber, rowNumber, formula));

            formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber - 1) + "";
            sheet.addCell(new jxl.write.Formula(spentimeColumnNumber, rowNumber, formula));

            formula = "" + ExcelUtils.getColumnName(prorataColumnNumber) + (rowNumber - 1) + "";
            sheet.addCell(new jxl.write.Formula(prorataColumnNumber, rowNumber, formula, percentFormat));

            formula = "" + ExcelUtils.getColumnName(limitedToBudgetColumnNumber) + (rowNumber - 1) + "";
            sheet.addCell(new jxl.write.Formula(limitedToBudgetColumnNumber, rowNumber, formula));

            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(limitedToBudgetColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber2, rowNumber, formula, numberFormat));

            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber - 1) + "*" + "(1-" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));

            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(achievedColumnNumber, rowNumber, formula, percentFormat));

            formula = "" + ExcelUtils.getColumnName(remainingTimeColumnNumber) + (rowNumber - 1) + "";
            sheet.addCell(new jxl.write.Formula(remainingTimeColumnNumber, rowNumber, formula));
            rowNumber++;
        }

        private void fillSheetWithFlatFeeSubreport(WritableSheet sheet, WorkInProgressReport.Subreport subreport) throws RowsExceededException, WriteException {
            int firstRowToSum = rowNumber;
            columnNumber = 0;
            ProjectCode projectCode = subreport.getProjectCode();
            Client client = projectCode.getClient();
            Group group = client.getGroup();
            FeesItem budget = projectCode.getFeesItem();

            int subtotalCVColumnNumber = 12 + this.report.getCurrencies().size();
            int spentimeColumnNumber = 12 + this.report.getCurrencies().size();
            int prorataColumnNumber = spentimeColumnNumber + 1;
            int sellingRateColumnNumber = spentimeColumnNumber + 3;
            int wipCVColumnNumber = sellingRateColumnNumber + 1;
            int achievedColumnNumber = wipCVColumnNumber + 1;


            for(WorkInProgressReport.Row row : subreport.getRows()) {
                Long spentTime = new Long(0);
                BigDecimal standardRate = new BigDecimal(0);

                columnNumber = 6;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPosition().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getStandardPosition().getName()));

                if(row.getAverageCvStandardSellingRate() != null) {
                    standardRate = row.getAverageCvStandardSellingRate();
                }
                spentTime = row.getSpentTime();

                sheet.addCell(new jxl.write.Number(spentimeColumnNumber, rowNumber, spentTime / 60.0, timespentFormat));
                sheet.addCell(new jxl.write.Number(sellingRateColumnNumber, rowNumber, standardRate.doubleValue(), timespentFormat));
                String formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingRateColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
               rowNumber++;
            }
            columnNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, group.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, client.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode()));
            columnNumber++;
            if(projectCode.getStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(projectCode.getEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getEndDate().getTime(), dateFormat));
            }
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Flat Fee"));

            String formula = "SUM(" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(spentimeColumnNumber, rowNumber, formula));
            
            formula = "(" + ExcelUtils.getColumnName(0) + 2 + "-" + ExcelUtils.getColumnName(3) + (rowNumber + 1) + ")/(" + ExcelUtils.getColumnName(4) + (rowNumber + 1) + "-" + ExcelUtils.getColumnName(3) + (rowNumber + 1) + ")";
            sheet.addCell(new jxl.write.Formula(prorataColumnNumber, rowNumber, formula, percentFormat));
                      
            formula = ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber, rowNumber, formula, numberFormat));
            
            formula = "SUM(" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
            
            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1) + "";
            sheet.addCell(new jxl.write.Formula(achievedColumnNumber, rowNumber, formula, percentFormat));
            rowNumber++;
        }

        private void fillSheetWithTimeSpentSubreport(WritableSheet sheet, WorkInProgressReport.Subreport subreport) throws RowsExceededException, WriteException {
            int firstRowToSum = rowNumber;
            columnNumber = 0;
            ProjectCode projectCode = subreport.getProjectCode();
            Client client = projectCode.getClient();
            Group group = client.getGroup();
            FeesItem budget = projectCode.getFeesItem();
            
            BigDecimal invoiceCurrencyRate = new BigDecimal(1.0);
            // todo calculate currency rate

            int subtotalColumnNumber = 10;
            int invoiceCurrencyRateColumnNumber = 10 + this.report.getCurrencies().size();
            int subtotalCVColumnNumber = invoiceCurrencyRateColumnNumber + 1;
            int spentimeColumnNumber = 12 + this.report.getCurrencies().size();
            int sellingRateColumnNumber = spentimeColumnNumber + 3;
            int wipCVColumnNumber = sellingRateColumnNumber + 1;
            int achievedColumnNumber = wipCVColumnNumber + 1;

            for(WorkInProgressReport.Row row : subreport.getRows()) {
                Long spentTime = new Long(0);
                BigDecimal standardRate = new BigDecimal(0);

                columnNumber = 6;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getPosition().getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, row.getStandardPosition().getName()));

                if(row.getAverageCvStandardSellingRate() != null) {
                    standardRate = row.getAverageCvStandardSellingRate();
                }
                spentTime = row.getSpentTime();

                sheet.addCell(new jxl.write.Number(spentimeColumnNumber, rowNumber, spentTime / 60.0, timespentFormat));
                sheet.addCell(new jxl.write.Number(sellingRateColumnNumber, rowNumber, standardRate.doubleValue(), timespentFormat));
                String formula = "" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(sellingRateColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
                rowNumber++;
            }
            columnNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, group.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, client.getName()));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode()));
            columnNumber++;
            if(projectCode.getStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(projectCode.getEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCode.getEndDate().getTime(), dateFormat));
            }
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Time spent"));

            for(Currency currency : this.report.getCurrencies()) {
                subtotalColumnNumber++;
            }
            sheet.addCell(new jxl.write.Number(invoiceCurrencyRateColumnNumber, rowNumber, invoiceCurrencyRate.doubleValue(), numberFormat));

            String formula = "IF(";
            formula += ExcelUtils.getColumnName(subtotalColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(invoiceCurrencyRateColumnNumber) + (rowNumber + 1) + ">" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + ",";
            formula += ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + ",";
            formula += ExcelUtils.getColumnName(subtotalColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(invoiceCurrencyRateColumnNumber) + (rowNumber + 1);
            formula += ")";
            sheet.addCell(new jxl.write.Formula(subtotalCVColumnNumber, rowNumber, formula));
            formula = "SUM(" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(spentimeColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(spentimeColumnNumber, rowNumber, formula));
            formula = ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(spentimeColumnNumber) + (rowNumber + 1);
            sheet.addCell(new jxl.write.Formula(sellingRateColumnNumber, rowNumber, formula, numberFormat));
            formula = "SUM(" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(wipCVColumnNumber) + (firstRowToSum + subreport.getRows().size() - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(wipCVColumnNumber, rowNumber, formula));
            formula = "" + ExcelUtils.getColumnName(wipCVColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(subtotalCVColumnNumber) + (rowNumber + 1) + "";
            sheet.addCell(new jxl.write.Formula(achievedColumnNumber, rowNumber, formula, percentFormat));
            rowNumber++;
        }
        private Double getRateToMainCurrency(Long currencyId) {
            Double rate = null;
            Currency mainCurrency = this.report.getMainCurrency();
            if(currencyId == null) {
                rate = null;
            } else if(mainCurrency.getId().equals(currencyId) || this.report.getCurrencyRates().get(currencyId) == null) {
                rate = 1.0;
            } else {
                rate = this.report.getCurrencyRates().get(currencyId).doubleValue();
            }
            return rate;
        }
}
