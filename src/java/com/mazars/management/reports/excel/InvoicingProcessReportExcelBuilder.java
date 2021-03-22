/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import com.mazars.management.web.forms.InvoicingProcessReportForm;
import java.io.*;
import java.util.Calendar;
import java.util.Date;
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
public class InvoicingProcessReportExcelBuilder {
    private InvoicingProcessReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat numberHeadingFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;
    private int currencyRatesRowNumber = 0;
    private Map<Long, Integer> currencyRatesColumnNumbers = new HashMap<Long, Integer>();


    public InvoicingProcessReportExcelBuilder(InvoicingProcessReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project code filter used", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Start date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "End date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Document to search", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Document to show", headingFormat));
        columnNumber++;
        
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        rowNumber++;
        columnNumber = 0;
        String isProjectCodeListFilterUsed = "No";
        if(this.report.getForm().getProjectCodeListFilter() != null && this.report.getForm().getProjectCodeListFilter().isUsed()) {
            isProjectCodeListFilterUsed = "Yes";
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, isProjectCodeListFilterUsed));
        columnNumber++;
        if(this.report.getFormStartDate() != null) {
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getFormStartDate().getCalendar().getTime(), dateFormat));
        }
        columnNumber++;
        if(this.report.getFormEndDate() != null) {
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getFormEndDate().getCalendar().getTime(), dateFormat));
        }
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + this.report.getFormDocumentTypeToSearch()));
        columnNumber++;
        
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + this.report.getFormDocumentTypeToShow()));
        columnNumber++;

        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        columnNumber++;
        rowNumber++;
        rowNumber++;
        columnNumber = 0;
    }
    public void makeFullContent(WritableSheet sheet) throws RowsExceededException, WriteException {
        boolean showFeesAdvances = false;
        boolean showFeesInvoices = false;
        boolean showFeesPayments = false;
        if(InvoicingProcessReportForm.DocumentType.ALL.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesAdvances = true;
            showFeesInvoices = true;
            showFeesPayments = true;
        } else if(InvoicingProcessReportForm.DocumentType.INVOICE_TO_ISSUE.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesAdvances = true;
        } else if(InvoicingProcessReportForm.DocumentType.INVOICE_ISSUED.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesInvoices = true;       
        } else if(InvoicingProcessReportForm.DocumentType.PAYMENT.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesPayments = true;        
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        if(showFeesAdvances) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice to issue", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice to issue", headingFormat));
            columnNumber ++;
        }
        if(showFeesInvoices) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued", headingFormat));
                columnNumber ++;
            }
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued with VAT", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued", headingFormat));
            columnNumber ++;
        }
        if(showFeesPayments) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Payment", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Payment", headingFormat));
            columnNumber ++;
        }
        
        rowNumber++;
        columnNumber = 3;

        if(showFeesAdvances) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        
        if(showFeesInvoices) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        
        if(showFeesPayments) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        rowNumber++;
        columnNumber = 0;
        
        for(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock : this.report.getProjectCodeBlocks()) {
            int firstRowToSumNumber = rowNumber;
            Integer maxDocumentCount = 0;
            if(showFeesAdvances && projectCodeBlock.getFeesAdvances().size() > maxDocumentCount) {
                maxDocumentCount = projectCodeBlock.getFeesAdvances().size();
            }
            if(showFeesInvoices && projectCodeBlock.getFeesInvoices().size() > maxDocumentCount) {
                maxDocumentCount = projectCodeBlock.getFeesInvoices().size();
            }
            if(showFeesPayments && projectCodeBlock.getFeesPayments().size() > maxDocumentCount) {
                maxDocumentCount = projectCodeBlock.getFeesPayments().size();
            }
            for(int i = 0; i < maxDocumentCount; i++) {
                columnNumber = 3;
                if(showFeesAdvances) {
                    FeesAdvance feesAdvance = i < projectCodeBlock.getFeesAdvances().size() ? projectCodeBlock.getFeesAdvances().get(i): null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(projectCodeBlock.getFeesItem().getFeesAdvanceCurrency()) && feesAdvance != null && feesAdvance.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesAdvance.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesAdvance != null && feesAdvance.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesAdvance.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }
                
                if(showFeesInvoices) {
                    FeesInvoice feesInvoice = i < projectCodeBlock.getFeesInvoices().size() ? projectCodeBlock.getFeesInvoices().get(i) : null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(projectCodeBlock.getFeesItem().getFeesInvoiceCurrency()) && feesInvoice != null && feesInvoice.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesInvoice.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(projectCodeBlock.getFeesItem().getFeesInvoiceCurrency()) && feesInvoice != null && feesInvoice.getVatIncludedAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesInvoice.getVatIncludedAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesInvoice != null && feesInvoice.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesInvoice.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }
                
                if(showFeesPayments) {
                    FeesPayment feesPayment = i < projectCodeBlock.getFeesPayments().size() ? projectCodeBlock.getFeesPayments().get(i) : null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(projectCodeBlock.getFeesItem().getFeesPaymentCurrency()) && feesPayment != null && feesPayment.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesPayment.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesPayment != null && feesPayment.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesPayment.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }                
                rowNumber++;
            }
            columnNumber = 0;
            ProjectCode projectCode = projectCodeBlock.getProjectCode();
            FeesItem feesItem = projectCodeBlock.getFeesItem();
            Group group = projectCodeBlock.getGroup();
            Client client = projectCodeBlock.getClient();
            
            if(group != null) {
                sheet.addCell(new Label(columnNumber, rowNumber, group.getName(), headingFormat));
            } else {
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
            }
            columnNumber ++;
            if(client != null) {
                sheet.addCell(new Label(columnNumber, rowNumber, client.getName(), headingFormat));
            } else {
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
            }
            columnNumber ++;
            if(projectCode != null) {
                sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode(), headingFormat));
            } else {
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
            }
            columnNumber ++;
            if(showFeesAdvances) {
                for(Currency currency : this.report.getCurrencies()) {
                    if(feesItem != null && currency.equals(feesItem.getFeesAdvanceCurrency())) {
                        if(projectCodeBlock.getFeesAdvances().isEmpty()) {
                            sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                        } else if(projectCodeBlock.getFeesAdvances().size() == 1) {
                            String formula = "" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1);
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        } else if(projectCodeBlock.getFeesAdvances().size() > 1) {
                            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + projectCodeBlock.getFeesAdvances().size())  + ")";
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        }                       
                    } else {
                        sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                    }
                    columnNumber ++;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                columnNumber ++;
            }
            if(showFeesInvoices) {
                for(Currency currency : this.report.getCurrencies()) {
                    if(feesItem != null && currency.equals(feesItem.getFeesInvoiceCurrency())) {
                        if(projectCodeBlock.getFeesInvoices().isEmpty()) {
                            sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                        } else if(projectCodeBlock.getFeesInvoices().size() == 1) {
                            String formula = "" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1);
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        } else if(projectCodeBlock.getFeesInvoices().size() > 1) {
                            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + projectCodeBlock.getFeesInvoices().size())  + ")";
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        }                        
                    } else {
                        sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                    }
                    columnNumber ++;
                }
                for(Currency currency : this.report.getCurrencies()) {
                    if(feesItem != null && currency.equals(feesItem.getFeesInvoiceCurrency())) {
                        if(projectCodeBlock.getFeesInvoices().isEmpty()) {
                            sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                        } else if(projectCodeBlock.getFeesInvoices().size() == 1) {
                            String formula = "" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1);
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        } else if(projectCodeBlock.getFeesInvoices().size() > 1) {
                            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + projectCodeBlock.getFeesInvoices().size())  + ")";
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        }                        
                    } else {
                        sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                    }
                    columnNumber ++;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                columnNumber ++;
            }
            if(showFeesPayments) {
                for(Currency currency : this.report.getCurrencies()) {
                    if(feesItem != null && currency.equals(feesItem.getFeesPaymentCurrency())) {
                        if(projectCodeBlock.getFeesPayments().isEmpty()) {
                            sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                        } else if(projectCodeBlock.getFeesPayments().size() == 1) {
                            String formula = "" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1);
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        } else if(projectCodeBlock.getFeesPayments().size() > 1) {
                            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSumNumber + projectCodeBlock.getFeesPayments().size())  + ")";
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberHeadingFormat));
                        }                        
                    } else {
                        sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                    }
                    columnNumber ++;
                }
                sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
                columnNumber ++;
            }
            rowNumber++;
        }
    }
    public void makeRestrictedContent(WritableSheet sheet) throws RowsExceededException, WriteException {
        boolean showFeesAdvances = false;
        boolean showFeesInvoices = false;
        boolean showFeesPayments = false;
        if(InvoicingProcessReportForm.DocumentType.ALL.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesAdvances = true;
            showFeesInvoices = true;
            showFeesPayments = true;
        } else if(InvoicingProcessReportForm.DocumentType.INVOICE_TO_ISSUE.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesAdvances = true;
        } else if(InvoicingProcessReportForm.DocumentType.INVOICE_ISSUED.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesInvoices = true;       
        } else if(InvoicingProcessReportForm.DocumentType.PAYMENT.equals(this.report.getFormDocumentTypeToShow())) {
            showFeesPayments = true;        
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        if(showFeesAdvances) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice to issue", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice to issue", headingFormat));
            columnNumber ++;
        }
        if(showFeesInvoices) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued", headingFormat));
                columnNumber ++;
            }
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued with VAT", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice issued", headingFormat));
            columnNumber ++;
        }
        if(showFeesPayments) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, "Payment", headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Payment", headingFormat));
            columnNumber ++;
        }
        
        rowNumber++;
        columnNumber = 3;

        if(showFeesAdvances) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        
        if(showFeesInvoices) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        
        if(showFeesPayments) {
            for(Currency currency : this.report.getCurrencies()) {
                sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
                columnNumber ++;
            }
            sheet.addCell(new Label(columnNumber, rowNumber, "Date", headingFormat));
            columnNumber ++;
        }
        rowNumber++;
        columnNumber = 0;
        
        for(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock : this.report.getProjectCodeBlocks()) {
            List<FeesAdvance> feesAdvances = this.getFilteredFeesAdvances(projectCodeBlock, this.report.getFormStartDate().getCalendar(), this.report.getFormEndDate().getCalendar());
            List<FeesInvoice> feesInvoices = this.getFilteredFeesInvoices(projectCodeBlock, this.report.getFormStartDate().getCalendar(), this.report.getFormEndDate().getCalendar());
            List<FeesPayment> feesPayments = this.getFilteredFeesPayments(projectCodeBlock, this.report.getFormStartDate().getCalendar(), this.report.getFormEndDate().getCalendar());
            Integer maxDocumentCount = 0;
            if(showFeesAdvances && feesAdvances.size() > maxDocumentCount) {
                maxDocumentCount = feesAdvances.size();
            }
            if(showFeesInvoices && feesInvoices.size() > maxDocumentCount) {
                maxDocumentCount = feesInvoices.size();
            }
            if(showFeesPayments && feesPayments.size() > maxDocumentCount) {
                maxDocumentCount = feesPayments.size();
            }

            ProjectCode projectCode = projectCodeBlock.getProjectCode();
            FeesItem feesItem = projectCodeBlock.getFeesItem();
            Group group = projectCodeBlock.getGroup();
            Client client = projectCodeBlock.getClient();
            for(int i = 0; i < maxDocumentCount; i++) {
                columnNumber = 0;

                if(group != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, group.getName()));
                } else {
                    sheet.addCell(new Label(columnNumber, rowNumber, ""));
                }
                columnNumber ++;
                if(client != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, client.getName()));
                } else {
                    sheet.addCell(new Label(columnNumber, rowNumber, ""));
                }
                columnNumber ++;
                if(projectCode != null) {
                    sheet.addCell(new Label(columnNumber, rowNumber, projectCode.getCode()));
                } else {
                    sheet.addCell(new Label(columnNumber, rowNumber, ""));
                }
                columnNumber ++;

                if(showFeesAdvances) {
                    FeesAdvance feesAdvance = i < feesAdvances.size() ? feesAdvances.get(i): null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(feesItem.getFeesAdvanceCurrency()) && feesAdvance != null && feesAdvance.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesAdvance.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesAdvance != null && feesAdvance.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesAdvance.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }
                
                if(showFeesInvoices) {
                    FeesInvoice feesInvoice = i < feesInvoices.size() ? feesInvoices.get(i) : null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(feesItem.getFeesInvoiceCurrency()) && feesInvoice != null && feesInvoice.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesInvoice.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(feesItem.getFeesInvoiceCurrency()) && feesInvoice != null && feesInvoice.getVatIncludedAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesInvoice.getVatIncludedAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesInvoice != null && feesInvoice.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesInvoice.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }
                
                if(showFeesPayments) {
                    FeesPayment feesPayment = i < feesPayments.size() ? feesPayments.get(i) : null; 
                    for(Currency currency : this.report.getCurrencies()) {
                        if(currency.equals(feesItem.getFeesPaymentCurrency()) && feesPayment != null && feesPayment.getAmount() != null) {
                            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, feesPayment.getAmount().doubleValue(), numberFormat));
                        }
                        columnNumber++;
                    }
                    if(feesPayment != null && feesPayment.getDate() != null) {
                        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, feesPayment.getDate().getTime(), dateFormat));
                    }
                    columnNumber++;
                }                
                rowNumber++;
            }
        }
    }
    public void createReport(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        createWorkbook(outputStream);
    }
    public void createWorkbook(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        this.headingFormat = ExcelUtils.getHeadingFormat();
        this.numberFormat = ExcelUtils.getNumberFormat();
        this.numberHeadingFormat = ExcelUtils.getNumberHeadingFormat();
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
        if(InvoicingProcessReportForm.View.FULL.equals(this.report.getFormView())) {
            makeFullContent(sheet);
        } else if(InvoicingProcessReportForm.View.RESTRICTED.equals(this.report.getFormView())) {
            makeRestrictedContent(sheet);
        }
    }
    private List<FeesAdvance> getFilteredFeesAdvances(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock, Calendar startDate, Calendar endDate) {
        List<FeesAdvance> feesAdvances = new LinkedList<FeesAdvance>();
        for(FeesAdvance feesAdvance : projectCodeBlock.getFeesAdvances()) {
            if(! feesAdvance.getDate().before(startDate) && ! feesAdvance.getDate().after(endDate)) {
                feesAdvances.add(feesAdvance);
            }
        }
        return feesAdvances;
    }
    private List<FeesInvoice> getFilteredFeesInvoices(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock, Calendar startDate, Calendar endDate) {
        List<FeesInvoice> feesInvoices = new LinkedList<FeesInvoice>();
        for(FeesInvoice feesInvoice : projectCodeBlock.getFeesInvoices()) {
            if(! feesInvoice.getDate().before(startDate) && ! feesInvoice.getDate().after(endDate)) {
                feesInvoices.add(feesInvoice);
            }
        }
        return feesInvoices;
    }
    private List<FeesPayment> getFilteredFeesPayments(InvoicingProcessReport.ProjectCodeBlock projectCodeBlock, Calendar startDate, Calendar endDate) {
        List<FeesPayment> feesPayments = new LinkedList<FeesPayment>();
        for(FeesPayment feesPayment : projectCodeBlock.getFeesPayments()) {
            if(! feesPayment.getDate().before(startDate) && ! feesPayment.getDate().after(endDate)) {
                feesPayments.add(feesPayment);
            }
        }
        return feesPayments;
    }

}
