/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import java.io.*;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;

/**
 *
 * @author Glazov
 */
public class ActSheet {
    public class Row {
        Date date;
        String reference;
        String code;
        BigDecimal cvAmount;
        BigDecimal amount;
        String currency;
        boolean isSigned;
        boolean isOOP;

        public Row() {
        }

        public Date getDate() {
            return date;
        }

        public void setDate(Date date) {
            this.date = date;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public BigDecimal getCvAmount() {
            return cvAmount;
        }

        public void setCvAmount(BigDecimal cvAmount) {
            this.cvAmount = cvAmount;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public String getCurrency() {
            return currency;
        }

        public void setCurrency(String currency) {
            this.currency = currency;
        }

        public boolean getIsSigned() {
            return isSigned;
        }

        public void setIsSigned(boolean isSigned) {
            this.isSigned = isSigned;
        }

        public boolean getIsOOP() {
            return isOOP;
        }

        public void setIsOOP(boolean isOOP) {
            this.isOOP = isOOP;
        }
       
    }
    private List<Row> rows = new LinkedList<Row>();

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }
    public List<String> read(InputStream inputStream, String sheetName, String dateFormat, String altDateFormat) throws IOException, BiffException {
        SimpleDateFormat dateFormatter = new SimpleDateFormat(dateFormat);
        SimpleDateFormat altDateFormatter = new SimpleDateFormat(altDateFormat);
        WorkbookSettings ws = null;
        Workbook workbook = null;
        Sheet sheet = null;
        Cell rowData[] = null;
        int rowCount = '0';

        ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.getWorkbook(inputStream, ws);
        sheet = workbook.getSheet(sheetName);
        rowCount = sheet.getRows();
        List<String> errors = new LinkedList<String>();
        for (int i = 0; i < rowCount; i++) {
            if(i == 0) {
                continue;
            }
            rowData = sheet.getRow(i);
            Row row = new Row();
            
            Cell dateCell = null;
            Cell referenceCell = null;
            Cell codeCell = null;
            Cell cvAmountCell = null;
            Cell amountCell = null;
            Cell currencyCell = null;
            Cell isSignedCell = null;
            Cell isOOPCell = null;

            try {
                dateCell = rowData[0];
                referenceCell = rowData[1];
                codeCell = rowData[2];
                cvAmountCell = rowData[3];
                amountCell = rowData[4];
                currencyCell = rowData[5];
                isSignedCell = rowData[6];
                isOOPCell = rowData[7];
            } catch (Exception e) {
                errors.add("Exception of " + e + " at row "+ (i + 1));
                continue;
            }

            if(dateCell.getContents() == null || dateCell.getContents().trim().equals("")) {
                errors.add("Empty date Cell at row " + (i + 1));
                continue;
            } else {
                String a = dateCell.getContents().trim();
                try {
                    row.setDate(dateFormatter.parse(a));
                } catch (ParseException e) {
                    try {
                        row.setDate(altDateFormatter.parse(a));
                    } catch (ParseException e2) {
                        errors.add("Wrong format of date cell at row " + (i + 1) + " " + a);
                        continue;                    
                    }
                }
            }
            
            if(referenceCell.getContents() == null) {
                errors.add("Empty Reference Cell at row " + (i + 1));
                continue;
            } else if(referenceCell.getType() != CellType.LABEL) {
                errors.add("Wrong type of Reference cell at row " + (i + 1));
                continue;
            } else {
                String a = referenceCell.getContents().replaceAll(" ", "").trim();
                row.setReference(a);
            }
            
            if(codeCell.getContents() == null || codeCell.getContents().trim().equals("")) {
                errors.add("Empty Code cell at row " + (i + 1));
                continue;
            } else if(codeCell.getType() != CellType.LABEL) {
                errors.add("Wrong type of Code cell at row " + (i + 1));
                continue;
            } else {
                String a = codeCell.getContents().replaceAll(" ", "").trim();
                row.setCode(a);
            }
 

            if(cvAmountCell.getContents() == null) {
                errors.add("Empty CvAmountCell at row " + (i + 1));
                continue;
            } else if(cvAmountCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of CVAmount Cell at row " + (i + 1));
                continue;
            } else {
                String a = cvAmountCell.getContents().replaceAll(",", ".").replaceAll(" ", "").replaceAll(" ", "");
                try {
                    row.setCvAmount(new BigDecimal(Double.parseDouble(a)) );
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of CvAmount Cell at row " + (i + 1) + " " + a);
                    continue;
                }
            }
            
            if(amountCell.getContents() == null) {
                errors.add("Empty AmountCell at row " + (i + 1));
                continue;
            } else if(amountCell.getType() != CellType.NUMBER && ! "".equals(amountCell.getContents())) {
                errors.add("Wrong type of Amount Cell at row " + (i + 1));
                continue;
            } else {
                String a = amountCell.getContents().replaceAll(",", ".").replaceAll(" ", "").replaceAll(" ", "");
                try {
                    if(! "".equals(amountCell.getContents())) {
                        row.setAmount(new BigDecimal(Double.parseDouble(a)) );
                    } else {
                        row.setAmount(null);
                    }
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of Amount Cell at row " + (i + 1) + " " + a);
                    continue;
                }
            }
            if(currencyCell.getContents() == null || currencyCell.getContents().trim().equals("")) {
                errors.add("Empty Currency Cell at row " + (i + 1));
                continue;
            } else if(currencyCell.getType() != CellType.LABEL) {
                errors.add("Wrong type of Currency Cell at row " + (i + 1));
                continue;
            } else {
                if("EUR".equals(currencyCell.getContents()) || "RUR".equals(currencyCell.getContents()) || "USD".equals(currencyCell.getContents())) {
                    row.setCurrency(currencyCell.getContents());
                } else {
                    errors.add("Wrong format of currency cell at row " + (i + 1));
                    continue;
                }
            }           
                        


            if(isSignedCell.getContents() == null) {
                errors.add("Empty Signed Cell at row " + (i + 1));
                continue;
            } else {
                if("No".equalsIgnoreCase(isSignedCell.getContents().trim())) {
                    row.setIsSigned(false);
                } else if("Yes".equalsIgnoreCase(isSignedCell.getContents())) {
                    row.setIsSigned(true);
                } else {
                    errors.add("Wrong format of Signed cell at row " + (i + 1));
                    continue;
                }
            }
            
            
            if(isOOPCell.getContents() == null) {
                errors.add("Empty OOP Cell at row " + (i + 1));
                continue;
            } else {
                if("OOP".equals(isOOPCell.getContents().trim())) {
                    row.setIsOOP(true);
                } else if("".equals(isOOPCell.getContents())) {
                    row.setIsOOP(false);
                } else {
                    errors.add("Wrong format of OOP cell at row " + (i + 1));
                    continue;
                }
            }
                                    
            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }
}
