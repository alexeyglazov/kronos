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
public class InvoiceRequestReportExcelBuilder {
    private InvoiceRequestReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;

    public InvoiceRequestReportExcelBuilder(InvoiceRequestReport report) throws RowsExceededException, WriteException {
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
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code description", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code created at", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Code closed at", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Time spent", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Last filling day", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Status", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "With VAT", headingFormat));
        columnNumber++;
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice to issue " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Invoice " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Invoice date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Invoice reference", headingFormat));
        columnNumber++;
        
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Act exists", headingFormat));
        columnNumber++;
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Act " + currency.getCode(), headingFormat));
            columnNumber ++;
        }
        
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Act date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Act reference", headingFormat));
        columnNumber++;


        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Tax Invoice exists", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Tax Invoice reference", headingFormat));
        columnNumber++;


        rowNumber++;
        columnNumber = 0;
        for(InvoiceRequestReport.Block block : this.report.getBlocks()) {
            ProjectCode projectCode = block.getProjectCode();
            Client client = block.getClient();
            String projectCodeCode = projectCode.getCode();
            String projectCodeDescription = projectCode.getDescription();
            String clientName = client.getName();
            Calendar lastFillingDay = block.getLastFillingDay();
            Long timeSpent = block.getTimeSpent();
            Date projectCodeCreatedAt = projectCode.getCreatedAt();
            Date projectCodeClosedAt = projectCode.getClosedAt();
            InvoiceRequestPacket.Status status = null;
            Boolean withVAT = null;
            if(block.getInvoiceRequestPacket() != null) {
                status = block.getInvoiceRequestPacket().getStatus();
                withVAT = block.getInvoiceRequestPacket().getWithVAT();
            }
            
            int firstRowToSum = rowNumber;
            for(InvoiceRequest invoiceRequest : block.getInvoiceRequestInfo().keySet()) {
                BigDecimal invoiceRequestTotalAmount = block.getInvoiceRequestInfo().get(invoiceRequest);
                columnNumber = 0;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientName));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeCode));
                columnNumber = 9 + this.report.getCurrencies().size();
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.getId().equals(invoiceRequest.getInvoiceCurrency().getId()) && invoiceRequestTotalAmount != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, invoiceRequestTotalAmount.doubleValue(), numberFormat));
                    }                    
                    columnNumber++;
                }
                if(invoiceRequest.getDate() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, invoiceRequest.getDate().getTime(), dateFormat));
                }
                columnNumber++;
                if(invoiceRequest.getReference() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, invoiceRequest.getReference()));
                }
                columnNumber++;                
                rowNumber++;
            }
            
            
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeCode));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeDescription));
            columnNumber++;           
            if(projectCodeCreatedAt != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCodeCreatedAt, fullDateFormat));
            }
            columnNumber++;
            if(projectCodeClosedAt != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, projectCodeClosedAt, fullDateFormat));
            }
            columnNumber++;
            if(timeSpent != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, timeSpent / 60.0, timespentFormat));
            }
            columnNumber++;
            if(lastFillingDay != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, lastFillingDay.getTime(), dateFormat));
            }
            columnNumber++;
            if(status != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + status));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "NO PACKET"));
            }
            columnNumber++;
            if(withVAT != null) {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, withVAT));
            }
            columnNumber++;

            if(block.getFeesItem() != null) {
                FeesItem feesItem = block.getFeesItem();
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.getId().equals(feesItem.getFeesAdvanceCurrency().getId())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, block.getFeesAdvanceTotalAmount().doubleValue(), numberFormat));
                    }                    
                    columnNumber++;
                }
            } else {
                columnNumber += this.report.getCurrencies().size();
            }
            
            
            for(Currency currency : this.report.getCurrencies()) {
                if(block.getInvoiceRequestPacket() != null && block.getInvoiceRequestInfo().size() > 0) {
                    String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber + 1 - 1) + ")";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, numberFormat));
                }
                columnNumber++;
            }
            columnNumber++;
            columnNumber++;
            if(block.getActRequest() != null) {
                ActRequest actRequest = block.getActRequest();
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, Boolean.TRUE));
                columnNumber++;
                for(Currency currency : this.report.getCurrencies()) {
                    if(currency.getId().equals(actRequest.getInvoiceCurrency().getId())) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, block.getActRequestTotalAmount().doubleValue(), numberFormat));
                    }                    
                    columnNumber++;
                }
                if(actRequest.getDate() != null) {
                    sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, block.getActRequest().getDate().getTime(), dateFormat));
                }
                columnNumber++;
                if(actRequest.getReference() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, block.getActRequest().getReference()));
                }
                columnNumber++;
            } else {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, Boolean.FALSE));
                columnNumber++;
                columnNumber += (this.report.getCurrencies().size() + 2);
            }
                   
            if(block.getTaxInvoiceRequest() != null) {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, Boolean.TRUE));
                columnNumber++;
                if(block.getTaxInvoiceRequest().getReference() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, block.getTaxInvoiceRequest().getReference()));
                }
                columnNumber++;
            } else {
                sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, Boolean.FALSE));
                columnNumber++;
                columnNumber++;
            }                      
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
        WritableSheet sheet = workbook.createSheet("Invoice Request Report", 0);
        makeHeader(sheet);
        makeContent(sheet);
    }
}
