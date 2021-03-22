/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.ContactUtil;
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
public class ContactsListExcelBuilder {
        private List<ContactUtil.DescribedContact> describedContacts = new LinkedList<ContactUtil.DescribedContact>();
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

        public ContactsListExcelBuilder(List<ContactUtil.DescribedContact> describedContacts, OutputStream outputStream) throws RowsExceededException, WriteException {
            this.describedContacts = describedContacts;
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
        public ContactsListExcelBuilder(List<ContactUtil.DescribedContact> describedContacts, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
            this.describedContacts = describedContacts;
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

        private void makeContent(List<ContactUtil.DescribedContact> describedContacts, WritableSheet sheet) throws RowsExceededException, WriteException {     
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Gender");
            columnNames.add("Name");
            columnNames.add("Name (local language)");
            columnNames.add("Client");
            columnNames.add("Group");           
            columnNames.add("Classified position");
            columnNames.add("Direct phone");
            columnNames.add("Mobile phone");
            columnNames.add("Email");
            columnNames.add("Language");           
            columnNames.add("Residential country");
            columnNames.add("Client's postal address");
            columnNames.add("Postal address, street");
            columnNames.add("Postal address, ZIP code");
            columnNames.add("Postal address, city");
            columnNames.add("Postal address, country");
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
            for(ContactUtil.DescribedContact describedContact : this.describedContacts) {
                Contact contact = describedContact.getContact();
                Client client = describedContact.getClient();
                Group group = describedContact.getGroup();
                ISOCountry clientLegalCountry = describedContact.getClientLegalCountry();
                ISOCountry clientPostalCountry = describedContact.getClientPostalCountry();
                ISOCountry country = describedContact.getCountry();
                ISOCountry residencialCountry = describedContact.getResidencialCountry();
                
                columnNumber = 0;
                if(contact.getGender() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getGender()));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getFirstName() + " " + contact.getLastName()));
                columnNumber++;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getFirstNameLocalLanguage()+ " " + contact.getLastNameLocalLanguage()));
                columnNumber++;
                if(client != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
                }
                columnNumber++;
                if(group != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, group.getName()));
                }
                columnNumber++;
                if(Contact.NormalPosition.OTHER.equals(contact.getNormalPosition()) && contact.getOtherNormalPosition() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getNormalPosition() + "/" + contact.getOtherNormalPosition()));
                } else if(contact.getNormalPosition() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + contact.getNormalPosition()));
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
                if(contact.getLanguage()!= null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, contact.getLanguage()));
                }    
                columnNumber++;
                if(residencialCountry != null && residencialCountry.getName() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, residencialCountry.getName()));
                }  
                columnNumber++;
                if(contact.getIsClientsAddressUsed() != null) {
                    sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, contact.getIsClientsAddressUsed()));
                }    
                columnNumber++;

	
                if(Boolean.TRUE.equals(contact.getIsClientsAddressUsed())) {
                    if(Boolean.TRUE.equals(client.getIsPostalAddressEqualToLegal())) {
                        if(client.getLegalStreet()!= null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalStreet()));
                        }    
                        columnNumber++;
                        if(client.getLegalZipCode()!= null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalZipCode()));
                        }    
                        columnNumber++;
                        if(client.getLegalCity()!= null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getLegalCity()));
                        }    
                        columnNumber++;
                        if(clientLegalCountry != null && clientLegalCountry.getName() != null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientLegalCountry.getName()));
                        }    
                        columnNumber++;                        
                    } else {
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
                        if(clientPostalCountry != null && clientPostalCountry.getName() != null) {
                            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientPostalCountry.getName()));
                        }    
                        columnNumber++;
                    }
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
                    if(country != null && country.getName() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, country.getName()));
                    }    
                    columnNumber++;                
                }	

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
                if(contact.getComment() != null) {
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
        WritableSheet sheet = workbook.createSheet("Contacts", 0);
        makeContent(this.describedContacts, sheet);
    }        
}
