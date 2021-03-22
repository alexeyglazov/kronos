/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
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
public class ManagerReportExcelBuilder {
    private ManagerReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;

    public ManagerReportExcelBuilder(ManagerReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Report Currency", headingFormat));
        columnNumber++;
        for(Currency currency : report.getCurrencies()) {
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + currency.getCode() + "/" + report.getFormReportCurrency().getCode(), headingFormat));
            columnNumber++;
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Financial Year", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        
        columnNumber = 0;
        rowNumber++;
        String formOfficeName = "All";
        String formDepartmentName = "All";
        String formReportCurrency = "";
        String formFinancialYear = "All";
        if(this.report.getFormOffice() != null) {
            formOfficeName = this.report.getFormOffice().getName();
        }
        if(this.report.getFormDepartment() != null) {
            formDepartmentName = this.report.getFormDepartment().getName();
        }
        if(this.report.getFormReportCurrency() != null) {
            formReportCurrency = this.report.getFormReportCurrency().getCode();
        }
        if(this.report.getFormFinancialYear() != null) {
            formFinancialYear = this.report.getFormFinancialYear() + "-" + (this.report.getFormFinancialYear() + 1);
        }

        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formOfficeName));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formDepartmentName));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formReportCurrency));
        columnNumber++;
        for(Currency currency : report.getCurrencies()) {
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, report.getFormCurrencyRates().get(currency.getId()).doubleValue()));
            columnNumber++;
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formFinancialYear));
        columnNumber++;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        columnNumber++;

        rowNumber++;
        columnNumber = 0;
    }
    public void makeContent(List<ManagerReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Person in Charge", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Fees", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Cost", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Expected gross margin", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Budget type", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Budget", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "% Budget", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Invoices", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Payments", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "OOP Invoices", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "OOP Payments", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Closed", headingFormat));
        columnNumber++;

        rowNumber++;
        columnNumber = 0;


        int firstRowToSumNumber = rowNumber;

        for(ManagerReport.Row row : rows) {           
            columnNumber = 0;
            if(row.getOffice() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getOffice().getName()));
            }
            columnNumber++;
            if(row.getDepartment() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getDepartment().getName()));
            }
            columnNumber++;
            if(row.getInChargePerson() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getInChargePerson().getFullName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "No person in charge"));            
            }
            columnNumber++;
            if(row.getClient() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClient().getName()));
            }
            columnNumber++;
            if(row.getProjectCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
            }

            columnNumber++;
            if(row.getFeesAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesAmount().doubleValue(), numberFormat));
            }
            Integer feesAmountColumnNumber = columnNumber;
            columnNumber++;
            if(row.getCostAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getCostAmount().doubleValue(), numberFormat));
            }
            Integer costAmountColumnNumber = columnNumber;
            columnNumber++;

            if(row.getFeesAmount() != null && row.getCostAmount() != null) {
                String formula = "(" + ExcelUtils.getColumnName(feesAmountColumnNumber) + (rowNumber + 1) + "-" + ExcelUtils.getColumnName(costAmountColumnNumber) + (rowNumber + 1) + ")/" + ExcelUtils.getColumnName(feesAmountColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
            }
            columnNumber++;

            if(row.getType() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + row.getType()));
            }
            columnNumber++;
            if(row.getBudgetAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getBudgetAmount().doubleValue(), numberFormat));
            }
            Integer budgetAmountColumnNumber = columnNumber;
            columnNumber++;
            if(row.getBudgetAmount() != null) {
                String formula = "" + ExcelUtils.getColumnName(feesAmountColumnNumber) + (rowNumber + 1) + "/" + ExcelUtils.getColumnName(budgetAmountColumnNumber) + (rowNumber + 1);
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
            }
            columnNumber++;            
            if(row.getFeesInvoiceAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesInvoiceAmount().doubleValue(), numberFormat));
            }
            columnNumber++;
            if(row.getFeesPaymentAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesPaymentAmount().doubleValue(), numberFormat));
            }
            columnNumber++;
            if(row.getOutOfPocketInvoiceAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketInvoiceAmount().doubleValue(), numberFormat));
            }
            columnNumber++;
            if(row.getOutOfPocketPaymentAmount() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketPaymentAmount().doubleValue(), numberFormat));
            }
            columnNumber++;     
            if(row.getProjectCode() != null && row.getProjectCode().getIsClosed() != null) {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, row.getProjectCode().getIsClosed()));
            }
            columnNumber++;     

            rowNumber++;
        }
    }

    public void createReport(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        createWorkbook(outputStream);
    }
    public void createWorkbook(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        this.headingFormat = ExcelUtils.getHeadingFormat();
        this.numberFormat = ExcelUtils.getNumberFormat();
        this.integerFormat = ExcelUtils.getIntegerFormat();
        this.percentFormat = ExcelUtils.getPercentFormat();
        this.timespentFormat = ExcelUtils.getTimespentFormat();
        this.dateFormat = ExcelUtils.getDateFormat();
        this.fullDateFormat = ExcelUtils.getFullDateFormat();

        WorkbookSettings ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        WritableWorkbook workbook = Workbook.createWorkbook(outputStream, ws);
        fillWorkbook(workbook);
        workbook.write();
        workbook.close();
    }
    public void fillWorkbook(WritableWorkbook workbook) throws RowsExceededException, WriteException {
        WritableSheet sheet = workbook.createSheet("Manager Report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }
}
