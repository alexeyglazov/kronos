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
public class CRMClientReportExcelBuilder {
        private CRMClientReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public CRMClientReportExcelBuilder(CRMClientReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public CRMClientReportExcelBuilder(CRMClientReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group Id");
            columnNames.add("Group Name");
            columnNames.add("Group Country Name");
            columnNames.add("Group is Listed");
            columnNames.add("Group is referred");
            columnNames.add("Group is Mazars audit");
            
            columnNames.add("Client Id");
            columnNames.add("Name");
            columnNames.add("Code name");
            columnNames.add("Subdepartments");
            columnNames.add("Client group");
            columnNames.add("Country of origin");
            
            columnNames.add("Postal street");
            columnNames.add("Postal ZipCode");
            columnNames.add("Postal city");
            columnNames.add("Postal country");
            columnNames.add("Postal address equals to legal");
            columnNames.add("Legal street");
            columnNames.add("Legal ZipCode");
            columnNames.add("Legal city");
            columnNames.add("Legal country");
            
            columnNames.add("Phone");
            columnNames.add("Email");
            columnNames.add("Tax number");
            columnNames.add("Activity Sectors");
            
            columnNames.add("Listed");
            columnNames.add("Listing country");
            columnNames.add("Customer type");
            columnNames.add("Transnational");
            columnNames.add("Referred");
            columnNames.add("Channel type");
            columnNames.add("Potential");
            columnNames.add("External/Networking");
            columnNames.add("Active");
                
            WritableSheet sheet = workbook.createSheet("CRM Client Report", 0);

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new jxl.write.Label(0, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            rowNumber++;
            
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            for(CRMClientReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                if(row.getGroup() != null) {
                    Group group = row.getGroup();
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, group.getId()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, group.getName()));
                    columnNumber++;
                    if(row.getGroupCountry() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroupCountry().getName()));
                    }
                    columnNumber++;
                    if(group.getIsListed() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, group.getIsListed()));
                    }
                    columnNumber++;
                    if(row.getGroupListingCountry() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroupListingCountry().getName()));
                    }
                    columnNumber++;
                    if(group.getIsReferred()!= null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, group.getIsReferred()));
                    }
                    columnNumber++;
                    if(group.getIsMazarsAudit()!= null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, group.getIsMazarsAudit()));
                    }
                    columnNumber++;
                }
                columnNumber = 6;
                if(row.getClient() != null) {
                    Client client = row.getClient();
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, client.getId()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getCodeName()));
                    columnNumber++;

                    if(row.getClientSubdepartments() != null) {
                        String subdepartmentNames = "";
                        for(Subdepartment subdepartment : row.getClientSubdepartments()) {
                            Department department = subdepartment.getDepartment();
                            Office office = department.getOffice();
                            subdepartmentNames += office.getName() + " / " + department.getName() + " / " + subdepartment.getName() + "; ";
                        }
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, subdepartmentNames));
                    }
                    columnNumber++;
                    if(client.getClientGroup() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + client.getClientGroup()));
                    }
                    columnNumber++;
                    if(row.getClientCountry() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientCountry().getName()));
                    }              
                    columnNumber++;
                    
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalStreet()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalZipCode()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalCity()));
                    columnNumber++;
                    if(row.getClientPostalCountry() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientPostalCountry().getName()));
                    }
                    columnNumber++;
                    if(client.getIsPostalAddressEqualToLegal() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsPostalAddressEqualToLegal()));
                    }
                    columnNumber++;
                    if(Boolean.TRUE.equals(client.getIsPostalAddressEqualToLegal())) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalStreet()));
                        columnNumber++;
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalZipCode()));
                        columnNumber++;
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalCity()));
                        columnNumber++;
                        if(row.getClientPostalCountry() != null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientPostalCountry().getName()));
                        }
                        columnNumber++;                    
                    } else {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalStreet()));
                        columnNumber++;
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalZipCode()));
                        columnNumber++;
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalCity()));
                        columnNumber++;
                        if(row.getClientLegalCountry() != null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientLegalCountry().getName()));
                        }
                        columnNumber++;                    
                    }
                    
                    if(client.getPhone() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPhone()));
                    }
                    columnNumber++;
                    if(client.getEmail() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getEmail()));
                    }
                    columnNumber++;
                    if(client.getTaxNumber() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getTaxNumber()));
                    }
                    columnNumber++;
                    String activitySectorNames = "";
                    for(ActivitySector activitySector : row.getClientActivitySectors()) {
                        activitySectorNames += activitySector.getName() + "; ";
                    }
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + activitySectorNames));
                    columnNumber++;
                    
                    if(client.getIsListed() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsListed()));
                    }
                    columnNumber++;
                    if(row.getClientListingCountry() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientListingCountry().getName()));
                    }
                    columnNumber++;
                    if(client.getCustomerType() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + client.getCustomerType()));
                    }
                    columnNumber++;
                    if(client.getIsTransnational() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsTransnational()));
                    }
                    columnNumber++;
                    if(client.getIsReferred() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsReferred()));
                    }
                    columnNumber++;
                   
                    if(client.getChannelType() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + client.getChannelType()));
                    }
                    columnNumber++;                   
                    
                    if(client.getIsFuture() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsFuture()));
                    }
                    columnNumber++;                    
                    if(client.getIsExternal() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsExternal()));
                    }
                    columnNumber++;                    
                    if(client.getIsActive() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsActive()));
                    }
                    columnNumber++;

                }
                
                rowNumber++;
            }
	}
}
