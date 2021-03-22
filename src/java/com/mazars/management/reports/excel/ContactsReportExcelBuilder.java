/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import com.mazars.management.service.ConfigUtils;
import com.mazars.management.service.StringUtils;
import java.io.*;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.format.CellFormat;
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
public class ContactsReportExcelBuilder {
        private ContactsReport report;
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

        public ContactsReportExcelBuilder(ContactsReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public ContactsReportExcelBuilder(ContactsReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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

        private void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Subdepartment", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Activity", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Normal Position", headingFormat));
            columnNumber++;

            rowNumber++;
            columnNumber = 0;
            if(this.report.getFormOffice() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormOffice().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormDepartment() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormDepartment().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormSubdepartment() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormSubdepartment().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormActivity() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormActivity().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormNormalPosition()!= null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + this.report.getFormNormalPosition()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;

            rowNumber++;
            columnNumber = 0;
        }
        private void makeContent(List<ContactsReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {     
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group");
            columnNames.add("Client");
            columnNames.add("Leading subdepartments");
            columnNames.add("Gender");
            columnNames.add("First name");
            columnNames.add("Last name");
            columnNames.add("First name (local language)");
            columnNames.add("Last name (local language)");
            columnNames.add("Direct phone");
            columnNames.add("Mobile phone");
            columnNames.add("Email");
            columnNames.add("Client's postal address");
            columnNames.add("Postal address, street");
            columnNames.add("Postal address, ZIP code");
            columnNames.add("Postal address, city");
            columnNames.add("Postal address, country");
            columnNames.add("Residential country");
            columnNames.add("Language");
            columnNames.add("Personal contacts");
            columnNames.add("Classified position");
            columnNames.add("Other classified position");
            columnNames.add("Present type");
            columnNames.add("Newsletters");
            columnNames.add("Reminder");
            columnNames.add("Active");
            columnNames.add("Comment");
            
            for(String columnName : columnNames) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            for(ContactsReport.Row row : this.report.getRows()) {
                Client client = row.getClient();
                columnNumber = 0;
                if(row.getGroup() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroup().getName()));
                }
                columnNumber++;
                if(client != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
                }
                columnNumber++;
                
                if(row.getSubdepartments() != null && row.getSubdepartments().size() > 0) {
                    String subdepartmentTxt = "";
                    int count = 0;
                    for(Subdepartment subdepartment : row.getSubdepartments()) {
                        Department department = subdepartment.getDepartment();
                        Office office = department.getOffice();
                        subdepartmentTxt += office.getName() + " / " + department.getName() + " / " + subdepartment.getName();
                        if(count < row.getSubdepartments().size() - 1) {
                            subdepartmentTxt += "; ";
                        }
                        count++;
                    }
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, subdepartmentTxt));
                }    
                columnNumber++;
                
                Contact contact = row.getContact();
                if(contact.getGender()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getGender()));
                }    
                columnNumber++;                
                if(contact.getFirstName()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getFirstName()));
                }    
                columnNumber++;
                if(contact.getLastName()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getLastName()));
                }    
                columnNumber++;
                if(contact.getFirstNameLocalLanguage()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getFirstNameLocalLanguage()));
                }    
                columnNumber++;
                if(contact.getLastNameLocalLanguage()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getLastNameLocalLanguage()));
                }    
                columnNumber++;

                if(contact.getDirectPhone()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getDirectPhone()));
                }    
                columnNumber++;
                if(contact.getMobilePhone()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getMobilePhone()));
                }    
                columnNumber++;
                if(contact.getEmail()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getEmail()));
                }    
                columnNumber++;
                if(contact.getIsClientsAddressUsed() != null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, contact.getIsClientsAddressUsed()));
                }    
                columnNumber++;
                if(Boolean.TRUE.equals(contact.getIsClientsAddressUsed())) {
                    if(client.getPostalStreet()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalStreet()));
                    }    
                    columnNumber++;
                    if(client.getPostalZipCode()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalZipCode()));
                    }    
                    columnNumber++;
                    if(client.getPostalCity()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getPostalCity()));
                    }    
                    columnNumber++;
                    if(row.getClientPostalCountry()!= null && row.getClientPostalCountry().getName() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientPostalCountry().getName()));
                    }    
                    columnNumber++;
                } else {
                    if(contact.getStreet()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getStreet()));
                    }    
                    columnNumber++;
                    if(contact.getZipCode()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getZipCode()));
                    }    
                    columnNumber++;
                    if(contact.getCity()!= null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getCity()));
                    }    
                    columnNumber++;
                    if(row.getContactCountry()!= null && row.getContactCountry().getName() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getContactCountry().getName()));
                    }    
                    columnNumber++;                
                }
                if(row.getContactResidencialCountry() != null && row.getContactResidencialCountry().getName() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getContactResidencialCountry().getName()));
                }  
                columnNumber++;
                if(contact.getLanguage()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getLanguage()));
                }    
                columnNumber++;
                if(row.getResponsiblePersons() != null && row.getResponsiblePersons().size() > 0) {
                    String responsiblePersonsTxt = "";
                    int count = 0;
                    for(Employee employee : row.getResponsiblePersons()) {
                        responsiblePersonsTxt += employee.getFullName();
                        if(count < row.getResponsiblePersons().size() - 1) {
                            responsiblePersonsTxt += "; ";
                        }
                        count++;
                    }
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, responsiblePersonsTxt));
                }    
                columnNumber++;
                if(contact.getNormalPosition()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getNormalPosition()));
                }    
                columnNumber++;
                if(Contact.NormalPosition.OTHER.equals(contact.getNormalPosition()) && contact.getOtherNormalPosition() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getOtherNormalPosition()));
                }    
                columnNumber++;
                if(contact.getPresentType()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getPresentType()));
                }    
                columnNumber++;
                if(contact.getIsNewsletters()!= null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, contact.getIsNewsletters()));
                }    
                columnNumber++;
                if(contact.getIsReminder()!= null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, contact.getIsReminder()));
                }    
                columnNumber++;
                if(contact.getIsActive()!= null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, contact.getIsActive()));
                }    
                columnNumber++;
                if(contact.getComment()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getComment()));
                }    
                columnNumber++;
                
                rowNumber++;
            }
            rowNumber++;
            columnNumber = 0; 
        }
        
    public void createStandardReport(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
        createStandardWorkbook(outputStream);
    }
    public void createStandardWorkbook(OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
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
        fillStandardWorkbook(workbook);
        workbook.write();
        workbook.close();
    }
    public void fillStandardWorkbook(WritableWorkbook workbook) throws RowsExceededException, WriteException {
        WritableSheet sheet = workbook.createSheet("Contacts report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }        
}
