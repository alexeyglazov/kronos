/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.math.BigDecimal;
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
public class InvoiceDocumentReportExcelBuilder {
    private InvoiceDocumentReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;

    public InvoiceDocumentReportExcelBuilder(InvoiceDocumentReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project code filter used", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Invoice request filter used", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        rowNumber++;
        columnNumber = 0;
        String isFilterUsed = "No";
        if(this.report.getFilter() != null && this.report.getFilter().isUsed()) {
            isFilterUsed = "Yes";
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, isFilterUsed));
        columnNumber++;
        String isInvoiceRequestsFilterUsed = "No";
        if(this.report.getInvoiceRequestsFilter()!= null && this.report.getInvoiceRequestsFilter().isUsed()) {
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
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Description", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Type", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Reference", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "With VAT", headingFormat));
        columnNumber++;
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new Label(columnNumber, rowNumber, "Payment", headingFormat));
        columnNumber ++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Status", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Internal comment", headingFormat));
        columnNumber++;
        
        rowNumber++;
        columnNumber = 0;
        for(InvoiceDocumentReport.Row row : this.report.getRows()) {
            ProjectCode projectCode = row.getProjectCode();
            Client client = row.getClient();
            String projectCodeCode = projectCode.getCode();
            String projectCodeDescription = projectCode.getDescription();
            String clientName = client.getName();

            InvoiceRequestPacket.Status status = null;
            String withVAT = "";
            String internalComment = "";
            if(row.getInvoiceRequestPacket() != null) {
                status = row.getInvoiceRequestPacket().getStatus();
                if(Boolean.TRUE.equals(row.getInvoiceRequestPacket().getWithVAT())) {
                    withVAT = "Yes";
                } else if(Boolean.FALSE.equals(row.getInvoiceRequestPacket().getWithVAT())) {
                    withVAT = "No";
                }
                if(row.getInvoiceRequestPacket().getComment() != null) {
                    internalComment = row.getInvoiceRequestPacket().getComment().trim();
                }
            }
            InvoiceDocumentReport.Type type = row.getType();
            BigDecimal invoiceTotalAmount = null;
            Currency invoiceCurrency = null;
            Currency paymentCurrency = null;
            String reference = null;
            String comment = null;
            Calendar date = null;
            if(InvoiceDocumentReport.Type.INVOICE.equals(type)) {
                invoiceTotalAmount = row.getInvoiceRequestTotalAmount();
                invoiceCurrency = row.getInvoiceInvoiceCurrency();
                paymentCurrency = row.getInvoicePaymentCurrency();
                date = row.getInvoiceRequest().getDate();
                reference = row.getInvoiceRequest().getReference();
                comment = row.getInvoiceComment();
            } else if(InvoiceDocumentReport.Type.ACT.equals(type)) {
                invoiceTotalAmount = row.getActRequestTotalAmount();
                invoiceCurrency = row.getActInvoiceCurrency();
                paymentCurrency = row.getActPaymentCurrency();
                date = row.getActRequest().getDate();
                reference = row.getActRequest().getReference();
                comment = row.getActComment();
            } else if(InvoiceDocumentReport.Type.TAX_INVOICE.equals(type)) {
                reference = row.getTaxInvoiceRequest().getReference();
                continue;
            }
            String parsedReference = null;
            if(reference != null) {
                try {
                    parsedReference = "" + Long.parseLong(reference);
                } catch (NumberFormatException e) {
                    parsedReference = reference;
                }
            }
            columnNumber = 0;
            if(row.getTime() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getTime(), dateFormat));
            }
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeCode));
            columnNumber++;
            if(comment != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, comment));
            }
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + type));
            columnNumber++;
            if(parsedReference != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, parsedReference));
            }
            columnNumber++;
            if(date != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, date.getTime(), dateFormat));
            }
            columnNumber++;            
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, withVAT));
            columnNumber++;
            for(Currency currency : this.report.getCurrencies()) {
                if(invoiceCurrency != null && currency.getId().equals(invoiceCurrency.getId()) && invoiceTotalAmount != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, invoiceTotalAmount.doubleValue(), numberFormat));
                }                    
                columnNumber++;
            }
            if(paymentCurrency != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, paymentCurrency.getCode()));
            }
            columnNumber++;

            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + status));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, internalComment));
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
        WritableSheet sheet = workbook.createSheet("Invoice Document Report", 0);
        makeHeader(sheet);
        makeContent(sheet);
    }
}
