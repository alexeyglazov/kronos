/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
public class InvoicingReportExcelBuilder {
    private InvoicingReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;
    private int currencyRatesRowNumber = 0;
    private Map<Long, Integer> currencyRatesColumnNumbers = new HashMap<Long, Integer>();


    public InvoicingReportExcelBuilder(InvoicingReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        for(Currency currency : this.report.getCurrencies()) {
            if(currency.getId().equals(this.report.getMainCurrency().getId())) {
                continue;
            }
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getMainCurrency().getCode() + " for 1 " + currency.getCode(), headingFormat));
            columnNumber++;
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project code filter used", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Invoice request filter used", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        rowNumber++;
        columnNumber = 0;
        currencyRatesRowNumber = rowNumber;
        for(Currency currency : this.report.getCurrencies()) {
            if(currency.getId().equals(this.report.getMainCurrency().getId())) {
                continue;
            }
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, this.report.getForm().getCurrencyRates().get(currency.getId()).doubleValue(), numberFormat));
            currencyRatesColumnNumbers.put(currency.getId(), columnNumber);
            columnNumber++;
        }
        String isFilterUsed = "No";
        if(this.report.getForm().getFilter() != null && this.report.getForm().getFilter().isUsed()) {
            isFilterUsed = "Yes";
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, isFilterUsed));
        columnNumber++;
        String isInvoiceRequestsFilterUsed = "No";
        if(this.report.getForm().getInvoiceRequestsFilter()!= null && this.report.getForm().getInvoiceRequestsFilter().isUsed()) {
            isInvoiceRequestsFilterUsed = "Yes";
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, isInvoiceRequestsFilterUsed));
        columnNumber++;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        columnNumber++;
        rowNumber++;
        columnNumber = 0;
    }
    public void makeContent(WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Subdepartment", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code description", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Person in charge", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Partner in charge", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Financial Year", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Last filling day", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code created at", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Closed", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Closed at", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Dead", headingFormat));
        columnNumber++;
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Budget " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "Budget Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;
        
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "Invoice Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "VAT Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "VAT Invoice Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;
        
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Payment " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "Payment Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Act " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "Act Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        sheet.addCell(new Label(columnNumber, rowNumber, "Fees Act Signed", headingFormat));
        columnNumber ++;
        
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "OOP Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "OOP Invoice Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "OOP VAT Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "OOP VAT Invoice Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;
        
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "OOP Payment " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "OOP Payment Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "OOP Act " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "OOP Act Cv" + this.report.getMainCurrency().getCode(), headingFormat));
        columnNumber ++;

        sheet.addCell(new Label(columnNumber, rowNumber, "OOP Act Signed", headingFormat));
        columnNumber ++;
        
        rowNumber++;
        columnNumber = 0;

        int firstRowToSumNumber = rowNumber;
        for(InvoicingReport.Row row : this.report.getRows()) {
            ProjectCode projectCode = row.getProjectCode();
            Subdepartment subdepartment = row.getSubdepartment();
            Department department = row.getDepartment();
            Office office = row.getOffice();
            Group group = row.getGroup();
            Client client = row.getClient();
            
            String officeName = office.getName();
            String departmentName = department.getName();
            String subdepartmentName = subdepartment.getName();
            String projectCodeCode = projectCode.getCode();
            String projectCodeDescription = projectCode.getDescription();
            String projectCodeInChargePerson = "";
            if(projectCode.getInChargePerson() != null) {
                projectCodeInChargePerson = projectCode.getInChargePerson().getFullName();
            }
            String projectCodeInChargePartner = "";
            if(projectCode.getInChargePartner() != null) {
                projectCodeInChargePartner = projectCode.getInChargePartner().getFullName();
            }
            String groupName = "";
            if(group != null) {
                groupName = group.getName();
            }
            String clientName = client.getName();
            Calendar lastFillingDay = row.getLastFillingDay();
            Long timeSpent = row.getTimeSpent();
            Date projectCodeCreatedAt = projectCode.getCreatedAt();
            String financialYear = projectCode.getFinancialYear() != null ? "" + projectCode.getFinancialYear() + "-" + (projectCode.getFinancialYear() + 1) : "";
            Boolean isClosed = projectCode.getIsClosed();
            Date closedAt = projectCode.getClosedAt();
            Boolean isDead = projectCode.getIsDead();
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, officeName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, departmentName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, subdepartmentName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, groupName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeCode));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeDescription));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeInChargePerson));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeInChargePartner));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, financialYear));
            columnNumber++;            
            if(lastFillingDay != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, lastFillingDay.getTime(), dateFormat));
            }
            columnNumber++;
            if(timeSpent != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, timeSpent / 60.0, timespentFormat));
            }
            columnNumber++;
            if(projectCodeCreatedAt != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCodeCreatedAt, fullDateFormat));
            }
            columnNumber++;
            if(isClosed != null) {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, isClosed));
            }
            columnNumber++;
            if(Boolean.TRUE.equals(isClosed) && closedAt != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, closedAt, fullDateFormat));
            }
            columnNumber++;
            if(isDead != null) {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, isDead));
            }
            columnNumber++;
            if(row.getFeesAdvanceTotalAmount() != null && row.getFeesItem() != null && row.getFeesItem().getFeesAdvanceCurrency() != null) {
                Integer feesAdvanceColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getFeesItem().getFeesAdvanceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesAdvanceTotalAmount().doubleValue(), numberFormat));
                        feesAdvanceColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getFeesItem().getFeesAdvanceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(feesAdvanceColumnNumber) + (rowNumber + 1) + "";
                } else {
                    formula = "" + ExcelUtils.getColumnName(currencyRatesColumnNumbers.get(row.getFeesItem().getFeesAdvanceCurrency().getId())) + (currencyRatesRowNumber + 1) + "*" + ExcelUtils.getColumnName(feesAdvanceColumnNumber) + (rowNumber + 1) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
            if(row.getFeesInvoiceTotalAmount() != null && row.getFeesItem() != null && row.getFeesItem().getFeesInvoiceCurrency() != null) {
                Integer feesInvoiceColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesInvoiceTotalAmount().doubleValue(), numberFormat));
                        feesInvoiceColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(feesInvoiceColumnNumber) + (rowNumber + 1) + "";
                } else {
                    formula = "" + ExcelUtils.getColumnName(currencyRatesColumnNumbers.get(row.getFeesItem().getFeesInvoiceCurrency().getId())) + (currencyRatesRowNumber + 1) + "*" + ExcelUtils.getColumnName(feesInvoiceColumnNumber) + (rowNumber + 1) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
            if(row.getFeesInvoiceTotalVatIncludedAmount() != null && row.getFeesItem() != null && row.getFeesItem().getFeesInvoiceCurrency() != null) {
                Integer feesInvoiceVatIncludedColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesInvoiceTotalVatIncludedAmount().doubleValue(), numberFormat));
                        feesInvoiceVatIncludedColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(feesInvoiceVatIncludedColumnNumber) + (rowNumber + 1) + "";
                } else {
                    formula = "" + ExcelUtils.getColumnName(currencyRatesColumnNumbers.get(row.getFeesItem().getFeesInvoiceCurrency().getId())) + (currencyRatesRowNumber + 1) + "*" + ExcelUtils.getColumnName(feesInvoiceVatIncludedColumnNumber) + (rowNumber + 1) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
            if(row.getFeesPaymentTotalAmount() != null && row.getFeesItem() != null && row.getFeesItem().getFeesInvoiceCurrency() != null) {
                Integer feesPaymentColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesPaymentTotalAmount().doubleValue(), numberFormat));
                        feesPaymentColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getFeesItem().getFeesInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(feesPaymentColumnNumber) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                } else {
                    if(row.getFeesPaymentTotalCvAmount() != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesPaymentTotalCvAmount().doubleValue(), numberFormat));
                    }
                }
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
           
            if(row.getFeesActTotalAmount() != null && row.getFeesItem() != null && row.getFeesItem().getFeesActCurrency() != null) {
                Integer feesActColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getFeesItem().getFeesActCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesActTotalAmount().doubleValue(), numberFormat));
                        feesActColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getFeesItem().getFeesActCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(feesActColumnNumber) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                } else {
                    if(row.getFeesActTotalCvAmount() != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesActTotalCvAmount().doubleValue(), numberFormat));
                    }
                }
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }

            if(row.getFeesActIsSigned() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + row.getFeesActIsSigned()));            
            }
            columnNumber++;

            if(row.getOutOfPocketInvoiceTotalAmount() != null && row.getOutOfPocketItem() != null && row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency() != null) {
                Integer outOfPocketInvoiceColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketInvoiceTotalAmount().doubleValue(), numberFormat));
                        outOfPocketInvoiceColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(outOfPocketInvoiceColumnNumber) + (rowNumber + 1) + "";
                } else {
                    formula = "" + ExcelUtils.getColumnName(currencyRatesColumnNumbers.get(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency().getId())) + (currencyRatesRowNumber + 1) + "*" + ExcelUtils.getColumnName(outOfPocketInvoiceColumnNumber) + (rowNumber + 1) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }

            if(row.getOutOfPocketInvoiceTotalVatIncludedAmount() != null && row.getOutOfPocketItem() != null && row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency() != null) {
                Integer outOfPocketInvoiceVatIncludedColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketInvoiceTotalVatIncludedAmount().doubleValue(), numberFormat));
                        outOfPocketInvoiceVatIncludedColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(outOfPocketInvoiceVatIncludedColumnNumber) + (rowNumber + 1) + "";
                } else {
                    formula = "" + ExcelUtils.getColumnName(currencyRatesColumnNumbers.get(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency().getId())) + (currencyRatesRowNumber + 1) + "*" + ExcelUtils.getColumnName(outOfPocketInvoiceVatIncludedColumnNumber) + (rowNumber + 1) + "";
                }
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }

            if(row.getOutOfPocketPaymentTotalAmount() != null && row.getOutOfPocketItem() != null && row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency() != null) {
                Integer outOfPocketPaymentColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketPaymentTotalAmount().doubleValue(), numberFormat));
                        outOfPocketPaymentColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getOutOfPocketItem().getOutOfPocketInvoiceCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(outOfPocketPaymentColumnNumber) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                } else {
                    if(row.getOutOfPocketPaymentTotalCvAmount() != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketPaymentTotalCvAmount().doubleValue(), numberFormat));
                    }
                }
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
            if(row.getOutOfPocketActTotalAmount() != null && row.getOutOfPocketItem() != null && row.getOutOfPocketItem().getOutOfPocketActCurrency() != null) {
                Integer outOfPocketActColumnNumber = null;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.equals(row.getOutOfPocketItem().getOutOfPocketActCurrency())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketActTotalAmount().doubleValue(), numberFormat));
                        outOfPocketActColumnNumber = columnNumber;
                    }                    
                    columnNumber++;
                }
                String formula = null;
                if(this.report.getMainCurrency().equals(row.getOutOfPocketItem().getOutOfPocketActCurrency())) {
                    formula = "" + ExcelUtils.getColumnName(outOfPocketActColumnNumber) + (rowNumber + 1) + "";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                } else {
                    if(row.getOutOfPocketActTotalCvAmount() != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getOutOfPocketActTotalCvAmount().doubleValue(), numberFormat));
                    }
                }
                columnNumber++;
            } else {
                columnNumber += this.report.getCurrencies().size() + 1;
            }
            
            if(row.getOutOfPocketActIsSigned() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + row.getOutOfPocketActIsSigned()));            
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
        WritableSheet sheet = workbook.createSheet("Invoicing Report", 0);
        makeHeader(sheet);
        makeContent(sheet);
    }
}
