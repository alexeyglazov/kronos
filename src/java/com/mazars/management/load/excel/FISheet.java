/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import com.mazars.management.db.domain.Currency;
import com.mazars.management.db.domain.FeesAct;
import com.mazars.management.db.domain.FeesAdvance;
import com.mazars.management.db.domain.FeesInvoice;
import com.mazars.management.db.domain.FeesItem;
import com.mazars.management.db.domain.FeesPayment;
import com.mazars.management.db.domain.OutOfPocketAct;
import com.mazars.management.db.domain.OutOfPocketInvoice;
import com.mazars.management.db.domain.OutOfPocketItem;
import com.mazars.management.db.domain.OutOfPocketPayment;
import com.mazars.management.db.domain.ProjectCode;
import com.mazars.management.db.util.HibernateUtil;
import com.mazars.management.reports.excel.ExcelUtils;
import com.mazars.management.service.StringUtils;
import java.io.*;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import org.hibernate.Session;

/**
 *
 * @author Glazov
 */
public class FISheet {
    public class Error{

        public Error(Integer rowNumber, String description) {
            this.rowNumber = rowNumber;
            this.description = description;
        }
        private Integer rowNumber;
        private String description;

        public Integer getRowNumber() {
            return rowNumber;
        }

        public void setRowNumber(Integer rowNumber) {
            this.rowNumber = rowNumber;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
    public class Row {
        private String code;
        private String amount;
        private String date;
        private String advanceCurrency;
        private String invoiceCurrency;
        private String paymentCurrency;
        private String actCurrency;
        private String cvAmount;
        private String isAdvance;
        private String reference;	
        private String isSigned;
        private String isOOP;
        private String type;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getAmount() {
            return amount;
        }

        public void setAmount(String amount) {
            this.amount = amount;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getIsAdvance() {
            return isAdvance;
        }

        public void setIsAdvance(String isAdvance) {
            this.isAdvance = isAdvance;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public String getCvAmount() {
            return cvAmount;
        }

        public void setCvAmount(String cvAmount) {
            this.cvAmount = cvAmount;
        }

        public String getIsSigned() {
            return isSigned;
        }

        public void setIsSigned(String isSigned) {
            this.isSigned = isSigned;
        }

        public String getAdvanceCurrency() {
            return advanceCurrency;
        }

        public void setAdvanceCurrency(String advanceCurrency) {
            this.advanceCurrency = advanceCurrency;
        }

        public String getInvoiceCurrency() {
            return invoiceCurrency;
        }

        public void setInvoiceCurrency(String invoiceCurrency) {
            this.invoiceCurrency = invoiceCurrency;
        }

        public String getPaymentCurrency() {
            return paymentCurrency;
        }

        public void setPaymentCurrency(String paymentCurrency) {
            this.paymentCurrency = paymentCurrency;
        }

        public String getActCurrency() {
            return actCurrency;
        }

        public void setActCurrency(String actCurrency) {
            this.actCurrency = actCurrency;
        }

        public String getIsOOP() {
            return isOOP;
        }

        public void setIsOOP(String isOOP) {
            this.isOOP = isOOP;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }
        
    }
    public enum Type {
        INVOICE_TO_ISSUE,
        INVOICE_ISSUED,
        PAYMENT,
        ACT
    }
    public class ParsedRow {
        private ProjectCode projectCode;
        private BigDecimal amount;
        private Calendar date;
        private Currency advanceCurrency;
        private Currency invoiceCurrency;
        private Currency paymentCurrency;
        private Currency actCurrency;
        private BigDecimal cvAmount;
        private Boolean isAdvance;
        private String reference;	
        private Boolean isSigned;
        private Boolean isOOP;
        private Type type;

        public ProjectCode getProjectCode() {
            return projectCode;
        }

        public void setProjectCode(ProjectCode projectCode) {
            this.projectCode = projectCode;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }

        public Calendar getDate() {
            return date;
        }

        public void setDate(Calendar date) {
            this.date = date;
        }

        public Currency getAdvanceCurrency() {
            return advanceCurrency;
        }

        public void setAdvanceCurrency(Currency advanceCurrency) {
            this.advanceCurrency = advanceCurrency;
        }

        public Currency getInvoiceCurrency() {
            return invoiceCurrency;
        }

        public void setInvoiceCurrency(Currency invoiceCurrency) {
            this.invoiceCurrency = invoiceCurrency;
        }

        public Currency getPaymentCurrency() {
            return paymentCurrency;
        }

        public void setPaymentCurrency(Currency paymentCurrency) {
            this.paymentCurrency = paymentCurrency;
        }

        public Currency getActCurrency() {
            return actCurrency;
        }

        public void setActCurrency(Currency actCurrency) {
            this.actCurrency = actCurrency;
        }

        public BigDecimal getCvAmount() {
            return cvAmount;
        }

        public void setCvAmount(BigDecimal cvAmount) {
            this.cvAmount = cvAmount;
        }

        public Boolean getIsAdvance() {
            return isAdvance;
        }

        public void setIsAdvance(Boolean isAdvance) {
            this.isAdvance = isAdvance;
        }

        public String getReference() {
            return reference;
        }

        public void setReference(String reference) {
            this.reference = reference;
        }

        public Boolean getIsSigned() {
            return isSigned;
        }

        public void setIsSigned(Boolean isSigned) {
            this.isSigned = isSigned;
        }

        public Boolean getIsOOP() {
            return isOOP;
        }

        public void setIsOOP(Boolean isOOP) {
            this.isOOP = isOOP;
        }

        public Type getType() {
            return type;
        }

        public void setType(Type type) {
            this.type = type;
        }
    }  
    private byte[] fileContent = null;
    private List<Row> rows = new LinkedList<Row>();
    private List<ParsedRow> parsedRows = new LinkedList<ParsedRow>();
    
    private Map<Long, FeesItem> feesItems = new HashMap<Long, FeesItem>();
    private Map<Long, OutOfPocketItem> outOfPocketItems = new HashMap<Long, OutOfPocketItem>();
    private List<FeesAdvance> feesAdvances = new LinkedList<FeesAdvance>();
    private List<FeesInvoice> feesInvoices = new LinkedList<FeesInvoice>();
    private List<FeesPayment> feesPayments = new LinkedList<FeesPayment>();
    private List<FeesAct> feesActs = new LinkedList<FeesAct>();
    private List<OutOfPocketInvoice> outOfPocketInvoices = new LinkedList<OutOfPocketInvoice>();
    private List<OutOfPocketPayment> outOfPocketPayments = new LinkedList<OutOfPocketPayment>();
    private List<OutOfPocketAct> outOfPocketActs = new LinkedList<OutOfPocketAct>();
    
    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }

    public List<ParsedRow> getParsedRows() {
        return parsedRows;
    }

    public void setParsedRows(List<ParsedRow> parsedRows) {
        this.parsedRows = parsedRows;
    }

    public byte[] getFileContent() {
        return fileContent;
    }

    public void setFileContent(byte[] fileContent) {
        this.fileContent = fileContent;
    }

    public Map<Long, FeesItem> getFeesItems() {
        return feesItems;
    }

    public void setFeesItems(Map<Long, FeesItem> feesItems) {
        this.feesItems = feesItems;
    }

    public Map<Long, OutOfPocketItem> getOutOfPocketItems() {
        return outOfPocketItems;
    }

    public void setOutOfPocketItems(Map<Long, OutOfPocketItem> outOfPocketItems) {
        this.outOfPocketItems = outOfPocketItems;
    }

    public List<FeesAdvance> getFeesAdvances() {
        return feesAdvances;
    }

    public void setFeesAdvances(List<FeesAdvance> feesAdvances) {
        this.feesAdvances = feesAdvances;
    }

    public List<FeesInvoice> getFeesInvoices() {
        return feesInvoices;
    }

    public void setFeesInvoices(List<FeesInvoice> feesInvoices) {
        this.feesInvoices = feesInvoices;
    }

    public List<FeesPayment> getFeesPayments() {
        return feesPayments;
    }

    public void setFeesPayments(List<FeesPayment> feesPayments) {
        this.feesPayments = feesPayments;
    }

    public List<FeesAct> getFeesActs() {
        return feesActs;
    }

    public void setFeesActs(List<FeesAct> feesActs) {
        this.feesActs = feesActs;
    }

    public List<OutOfPocketInvoice> getOutOfPocketInvoices() {
        return outOfPocketInvoices;
    }

    public void setOutOfPocketInvoices(List<OutOfPocketInvoice> outOfPocketInvoices) {
        this.outOfPocketInvoices = outOfPocketInvoices;
    }

    public List<OutOfPocketPayment> getOutOfPocketPayments() {
        return outOfPocketPayments;
    }

    public void setOutOfPocketPayments(List<OutOfPocketPayment> outOfPocketPayments) {
        this.outOfPocketPayments = outOfPocketPayments;
    }

    public List<OutOfPocketAct> getOutOfPocketActs() {
        return outOfPocketActs;
    }

    public void setOutOfPocketActs(List<OutOfPocketAct> outOfPocketActs) {
        this.outOfPocketActs = outOfPocketActs;
    }

    public void readRawContent(InputStream inputStream) throws IOException {
        ByteArrayOutputStream buffer = null;
        BufferedInputStream bis = null;
        try {
            bis = new BufferedInputStream(inputStream);
            buffer = new ByteArrayOutputStream();
            int nRead;
            byte[] data = new byte[16384];
            while ((nRead = bis.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            buffer.flush();
            setFileContent(buffer.toByteArray());  
        } catch (IOException e) {
            throw e; 
        } finally {
            try {
                if(bis != null) {
                    bis.close();
                }
            } catch (IOException e) {
                throw e;
            } finally {
                if(buffer != null) {
                    buffer.close();
                }
            }
        }                   
    }
    public Sheet[] getSheets() throws IOException, BiffException {
        InputStream inputStream = null;
        try {
            inputStream = new ByteArrayInputStream(this.fileContent);
            WorkbookSettings ws = null;
            Workbook workbook = null;

            ws = new WorkbookSettings();
            ws.setLocale(new Locale("ru", "RU"));
            workbook = Workbook.getWorkbook(inputStream, ws);
            return workbook.getSheets();
        } catch (IOException e) {
            throw e;
        } catch (BiffException e) {
            throw e;
        } finally {
            try {
                if(inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                throw e;
            }
        }
    }
    public List<Error> read(int sheetNumber) throws IOException, BiffException {
        List<Error> errors = new LinkedList<Error>();
        InputStream inputStream = null;
        try {
            inputStream = new ByteArrayInputStream(this.fileContent);
            WorkbookSettings ws = null;
            Workbook workbook = null;
            Sheet sheet = null;
            Cell rowData[] = null;

            ws = new WorkbookSettings();
            ws.setLocale(new Locale("ru", "RU"));
            workbook = Workbook.getWorkbook(inputStream, ws);
            sheet = workbook.getSheet(sheetNumber);
            int rowCount = sheet.getRows();
            for (int i = 0; i < rowCount; i++) {
                if(i == 0) {
                    continue;
                }
                rowData = sheet.getRow(i);
                Row row = new Row();

                Cell codeCell = null;
                Cell amountCell = null;
                Cell dateCell = null;
                Cell advanceCurrencyCell = null;
                Cell invoiceCurrencyCell = null;
                Cell paymentCurrencyCell = null;
                Cell actCurrencyCell = null;
                Cell cvAmountCell = null;
                Cell isAdvanceCell = null;
                Cell referenceCell = null;	
                Cell isSignedCell = null;
                Cell isOOPCell = null;
                Cell typeCell = null;

                try {
                    codeCell = rowData[0];
                    amountCell = rowData[1];
                    dateCell = rowData[2];
                    advanceCurrencyCell = rowData[3];
                    invoiceCurrencyCell = rowData[4];
                    paymentCurrencyCell = rowData[5];
                    actCurrencyCell = rowData[6];
                    cvAmountCell = rowData[7];
                    isAdvanceCell = rowData[8];
                    referenceCell = rowData[9];	
                    isSignedCell = rowData[10];
                    isOOPCell = rowData[11];
                    typeCell = rowData[12];
                } catch (ArrayIndexOutOfBoundsException e) {
                    errors.add(new Error(i, "Cell at column " + ExcelUtils.getColumnName(rowData.length) + " has no data"));
                    continue;
                }
                if(codeCell != null && codeCell.getContents() != null) {
                    row.setCode(codeCell.getContents().trim().replaceAll(" ", ""));
                }
                if(amountCell != null && amountCell.getContents() != null) {
                    row.setAmount(amountCell.getContents().trim().replaceAll(" ", ""));
                }
                if(dateCell != null && dateCell.getContents() != null) {
                    row.setDate(dateCell.getContents().trim().replaceAll(" ", ""));
                }
                if(advanceCurrencyCell != null && advanceCurrencyCell.getContents() != null) {
                    row.setAdvanceCurrency(advanceCurrencyCell.getContents().trim().replaceAll(" ", ""));
                }
                if(invoiceCurrencyCell != null && invoiceCurrencyCell.getContents() != null) {
                    row.setInvoiceCurrency(invoiceCurrencyCell.getContents().trim().replaceAll(" ", ""));
                }
                if(paymentCurrencyCell != null && paymentCurrencyCell.getContents() != null) {
                    row.setPaymentCurrency(paymentCurrencyCell.getContents().trim().replaceAll(" ", ""));
                }
                if(actCurrencyCell != null && actCurrencyCell.getContents() != null) {
                    row.setActCurrency(actCurrencyCell.getContents().trim().replaceAll(" ", ""));
                }
                if(cvAmountCell != null && cvAmountCell.getContents() != null) {
                    row.setCvAmount(cvAmountCell.getContents().trim().replaceAll(" ", ""));
                }
                if(isAdvanceCell != null && isAdvanceCell.getContents() != null) {
                    row.setIsAdvance(isAdvanceCell.getContents().trim().replaceAll(" ", ""));
                }
                if(referenceCell != null && referenceCell.getContents() != null) {
                    row.setReference(referenceCell.getContents().trim().replaceAll(" ", ""));
                }
                if(isSignedCell != null && isSignedCell.getContents() != null) {
                    row.setIsSigned(isSignedCell.getContents().trim().replaceAll(" ", ""));
                }
                if(isOOPCell != null && isOOPCell.getContents() != null) {
                    row.setIsOOP(isOOPCell.getContents().trim().replaceAll(" ", ""));
                }
                if(typeCell != null && typeCell.getContents() != null) {
                    row.setType(typeCell.getContents().trim().replaceAll(" ", ""));
                }
                this.rows.add(row);
            }
            workbook.close();
        } catch (IOException e) {
            throw e;
        } catch (BiffException e) {
            throw e;
        } finally {
            try {
                if(inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                throw e;
            }
        }
        return errors;
    }
    public List<Error> parse(String dateFormat) {
        SimpleDateFormat dateFormatter = new SimpleDateFormat(dateFormat);
        Map<String, com.mazars.management.db.domain.Currency> currencies = new HashMap<String, com.mazars.management.db.domain.Currency>();
        for(Currency currency : Currency.getAll()) {
                currencies.put(currency.getCode(), currency);
        }
        Map<String, ProjectCode> projectCodes = new HashMap<String, ProjectCode>();

        List<Error> errors = new LinkedList<Error>();
        int rowNumber = 0;
        for(Row row : rows) {
            ParsedRow parsedRow = new ParsedRow();
            parsedRows.add(parsedRow);
            if(row.getCode() != null && ! row.getCode().equals("")) {
                ProjectCode projectCode = projectCodes.get(row.getCode());
                if(projectCode == null) {
                    projectCode = ProjectCode.getByCode(row.getCode());
                    if(projectCode != null) {
                        projectCodes.put(row.getCode(), projectCode);
                        parsedRow.setProjectCode(projectCode);
                    } else {
                        errors.add(new Error(rowNumber, "ProjectCode not found " + row.getCode()));
                    }
                } else {
                    parsedRow.setProjectCode(projectCode);
                }
            }
            
            if(row.getAmount() != null && ! row.getAmount().equals("")) {
                try {
                    parsedRow.setAmount(new BigDecimal(Math.round(Double.parseDouble(row.getAmount().replaceAll(",", ".")) * 100.0) / 100.0) );
                } catch (NumberFormatException e) {
                    errors.add(new Error(rowNumber, "Wrong format of Amount " + row.getAmount()));
                }
            }

            if(row.getDate() != null && ! row.getDate().equals("")) {
                try {
                    String dateStr = row.getDate().trim().replaceAll("\\s", "").replaceAll("/", ".");
                    Calendar date = new GregorianCalendar();
                    date.setTime(dateFormatter.parse(dateStr));
                    if(date.get(Calendar.YEAR) < 100) {
                        date.add(Calendar.YEAR, 2000);
                    }
                    parsedRow.setDate(date);
                } catch (ParseException e) {
                    errors.add(new Error(rowNumber, "Wrong format of date " + row.getDate()));
                }
            }
            
            if(row.getAdvanceCurrency() != null && ! row.getAdvanceCurrency().equals("")) {
                Currency currency = currencies.get(row.getAdvanceCurrency());
                if(currency != null) {
                    parsedRow.setAdvanceCurrency(currency);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of AdvanceCurrency " + row.getAdvanceCurrency()));
                }
            }
            if(row.getInvoiceCurrency() != null && ! row.getInvoiceCurrency().equals("")) {
                Currency currency = currencies.get(row.getInvoiceCurrency());
                if(currency != null) {
                    parsedRow.setInvoiceCurrency(currency);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of InvoiceCurrency " + row.getInvoiceCurrency()));
                }
            }
            if(row.getPaymentCurrency() != null && ! row.getPaymentCurrency().equals("")) {
                Currency currency = currencies.get(row.getPaymentCurrency());
                if(currency != null) {
                    parsedRow.setPaymentCurrency(currency);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of PaymentCurrency " + row.getPaymentCurrency()));
                }
            }
            if(row.getActCurrency() != null && ! row.getActCurrency().equals("")) {
                Currency currency = currencies.get(row.getActCurrency());
                if(currency != null) {
                    parsedRow.setActCurrency(currency);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of ActCurrency " + row.getActCurrency()));
                }
            }
            if(row.getCvAmount() != null && ! row.getCvAmount().equals("")) {
                try {
                    parsedRow.setCvAmount(new BigDecimal(Math.round(Double.parseDouble(row.getCvAmount().replaceAll(",", ".")) * 100.0) / 100.0) );
                } catch (NumberFormatException e) {
                    errors.add(new Error(rowNumber, "Wrong format of CvAmount " + row.getCvAmount()));
                }
            }
            if(row.getIsAdvance() != null && ! row.getIsAdvance().equals("")) {
                Boolean result = StringUtils.getBoolean(row.getIsAdvance());
                if(result != null) {
                    parsedRow.setIsAdvance(result);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of Is Advance " + row.getIsAdvance()));
                }
            }
            if(row.getReference() != null && ! row.getReference().equals("")) {
                parsedRow.setReference(row.getReference());
            }
            if(row.getIsSigned() != null && ! row.getIsSigned().equals("")) {
                Boolean result = StringUtils.getBoolean(row.getIsSigned());
                if(result != null) {
                    parsedRow.setIsSigned(result);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of Is Signed " + row.getIsSigned()));
                }
            }
            if(row.getIsOOP() != null && ! row.getIsOOP().equals("")) {
                Boolean result = StringUtils.getBoolean(row.getIsOOP());
                if(result != null) {
                    parsedRow.setIsOOP(result);
                } else {
                    errors.add(new Error(rowNumber, "Wrong format of Is OOP " + row.getIsOOP()));
                }
            }
            if(row.getType() != null && ! row.getType().equals("")) {
                try {
                    Type type = Type.valueOf(row.getType().toUpperCase());
                    parsedRow.setType(type);
                } catch(IllegalArgumentException e) {
                    errors.add(new Error(rowNumber, "Wrong format of Type " + row.getType() + " Exception" + e));
                }
            }         
            rowNumber++;
        }
        return errors;
    }
    
    public List<Error> analyze() {
        List<Error> errors = new LinkedList<Error>();
        int rowNumber = 0;
        for(ParsedRow row : parsedRows) {
            if(row.getProjectCode() == null) {
                errors.add(new Error(rowNumber, "ProjectCode is not set"));
            }
            if(row.getAmount() == null) {
                errors.add(new Error(rowNumber, "Amount is not set"));
            }
            if(row.getDate() == null) {
                errors.add(new Error(rowNumber, "Date is not set"));
            }
            if(row.getIsOOP() == null) {
                errors.add(new Error(rowNumber, "OOP is not set"));
            }
            if(row.getType() == null) {
                errors.add(new Error(rowNumber, "Type is not set"));
            } else {
                if(Type.INVOICE_TO_ISSUE.equals(row.getType())) {
                    if(Boolean.TRUE.equals(row.getIsOOP())) {
                        errors.add(new Error(rowNumber, "OOP can not be used with this type"));
                    }
                    if(row.getAdvanceCurrency() == null) {
                        errors.add(new Error(rowNumber, "Invoice to issue currency must be set"));
                    }
                    if(row.getInvoiceCurrency() != null) {
                        errors.add(new Error(rowNumber, "Invoice issued currency must not be set"));
                    }
                    if(row.getPaymentCurrency() != null) {
                        errors.add(new Error(rowNumber, "Payment currency must not be set"));
                    }
                    if(row.getActCurrency() != null) {
                        errors.add(new Error(rowNumber, "Act currency must not be set"));
                    }
                    if(row.getCvAmount() != null) {
                        errors.add(new Error(rowNumber, "CvAmount must not be set"));
                    }
                    if(row.getIsAdvance() == null) {
                        errors.add(new Error(rowNumber, "Advance must be set"));
                    }
                    if(row.getReference() != null) {
                        errors.add(new Error(rowNumber, "Reference must not be set"));
                    }
                    if(row.getIsSigned() != null) {
                        errors.add(new Error(rowNumber, "Signed must not be set"));
                    }
                } else if(Type.INVOICE_ISSUED.equals(row.getType())) {
                    if(row.getAdvanceCurrency() != null) {
                        errors.add(new Error(rowNumber, "Invoice to issue currency must not be set"));
                    }
                    if(row.getInvoiceCurrency() == null) {
                        errors.add(new Error(rowNumber, "Invoice issued currency must be set"));
                    }
                    if(row.getPaymentCurrency() != null) {
                        errors.add(new Error(rowNumber, "Payment currency must not be set"));
                    }
                    if(row.getActCurrency() != null) {
                        errors.add(new Error(rowNumber, "Act currency must not be set"));
                    }
                    if(row.getCvAmount() != null) {
                        errors.add(new Error(rowNumber, "CvAmount must not be set"));
                    }
                    if(row.getIsAdvance() == null && Boolean.FALSE.equals(row.getIsOOP())) {
                        errors.add(new Error(rowNumber, "Advance must be set for non-OOP entries"));
                    }
                    if(row.getIsAdvance() != null && Boolean.TRUE.equals(row.getIsOOP())) {
                        errors.add(new Error(rowNumber, "Advance must not be set for OOP entries"));
                    }
                    if(row.getReference() == null) {
                        errors.add(new Error(rowNumber, "Reference must be set"));
                    }
                    if(row.getIsSigned() != null) {
                        errors.add(new Error(rowNumber, "Signed must not be set"));
                    }                    
                } else if(Type.PAYMENT.equals(row.getType())) {
                    if(row.getAdvanceCurrency() != null) {
                        errors.add(new Error(rowNumber, "Invoice to issue currency must not be set"));
                    }
                    if(row.getInvoiceCurrency() == null) {
                        errors.add(new Error(rowNumber, "Invoice issued currency must be set"));
                    }
                    if(row.getPaymentCurrency() == null) {
                        errors.add(new Error(rowNumber, "Payment currency must be set"));
                    }
                    if(row.getActCurrency() != null) {
                        errors.add(new Error(rowNumber, "Act currency must not be set"));
                    }
                    if(row.getCvAmount() == null) {
                        errors.add(new Error(rowNumber, "CvAmount must be set"));
                    }
                    if(row.getIsAdvance() != null) {
                        errors.add(new Error(rowNumber, "Advance must not be set"));
                    }
                    if(row.getReference() != null) {
                        errors.add(new Error(rowNumber, "Reference must not be set"));
                    }
                    if(row.getIsSigned() != null) {
                        errors.add(new Error(rowNumber, "Signed must not be set"));
                    }                    
                } else if(Type.ACT.equals(row.getType())) {
                    if(row.getAdvanceCurrency() != null) {
                        errors.add(new Error(rowNumber, "Invoice to issue currency must not be set"));
                    }
                    if(row.getInvoiceCurrency() != null) {
                        errors.add(new Error(rowNumber, "Invoice issued currency must not be set"));
                    }
                    if(row.getPaymentCurrency() != null) {
                        errors.add(new Error(rowNumber, "Payment currency must not be set"));
                    }
                    if(row.getActCurrency() == null) {
                        errors.add(new Error(rowNumber, "Act currency must be set"));
                    }
                    if(row.getCvAmount() == null) {
                        errors.add(new Error(rowNumber, "CvAmount must be set"));
                    }
                    if(row.getIsAdvance() != null) {
                        errors.add(new Error(rowNumber, "Advance must not be set"));
                    }
                    if(row.getReference() == null) {
                        errors.add(new Error(rowNumber, "Reference must be set"));
                    }
                    if(row.getIsSigned() == null) {
                        errors.add(new Error(rowNumber, "Signed must be set"));
                    }                    
                }
            }
            rowNumber++;
        }
        return errors;
    }
    
    public List<Error> prepare() {
        List<Error> errors = new LinkedList<Error>();
        int rowNumber = 0;
        
        for(ParsedRow row : parsedRows) {        
            ProjectCode projectCode = row.getProjectCode();
            FeesItem feesItem = feesItems.get(projectCode.getId());
            if(feesItem == null) {
                feesItem = projectCode.getFeesItem();
            }               
            if(feesItem == null) {
                feesItem = new FeesItem();
                feesItem.setDate(row.getDate());
                feesItem.setComment("");
                feesItem.setType(FeesItem.Type.FLAT_FEE);
                feesItem.setVat(new BigDecimal(0));
                feesItem.setProjectCode(projectCode);
            }
            feesItems.put(projectCode.getId(), feesItem);
            
            OutOfPocketItem outOfPocketItem = outOfPocketItems.get(projectCode.getId());
            if(outOfPocketItem == null) {
                outOfPocketItem = projectCode.getOutOfPocketItem();
            } 
            if(outOfPocketItem == null) {
                outOfPocketItem = new OutOfPocketItem();
                outOfPocketItem.setType(OutOfPocketItem.Type.FULL);
                outOfPocketItem.setAmount(null);
                outOfPocketItem.setCurrency(null);
                outOfPocketItem.setProjectCode(projectCode);
            }
            outOfPocketItems.put(projectCode.getId(), outOfPocketItem);
            
            if(Type.INVOICE_TO_ISSUE.equals(row.getType())) {
                if(! row.getIsOOP()) {
                    feesItem.setFeesAdvanceCurrency(row.getAdvanceCurrency());
                    FeesAdvance feesAdvance = new FeesAdvance();
                    feesAdvance.setAmount(row.getAmount());
                    feesAdvance.setDate(row.getDate());
                    feesAdvance.setIsAdvance(row.getIsAdvance());
                    feesAdvance.setFeesItem(feesItem);
                    feesAdvances.add(feesAdvance);
                }
            } else if(Type.INVOICE_ISSUED.equals(row.getType())) {
                if(! row.getIsOOP()) {
                    feesItem.setFeesInvoiceCurrency(row.getInvoiceCurrency());
                    FeesInvoice feesInvoice = new FeesInvoice();
                    feesInvoice.setAmount(row.getAmount());
                    feesInvoice.setDate(row.getDate());
                    feesInvoice.setIsAdvance(row.getIsAdvance());
                    feesInvoice.setReference(row.getReference());
                    feesInvoice.setFeesItem(feesItem);
                    feesInvoices.add(feesInvoice);
                } else {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(row.getInvoiceCurrency());
                    OutOfPocketInvoice outOfPocketInvoice = new OutOfPocketInvoice();
                    outOfPocketInvoice.setAmount(row.getAmount());
                    outOfPocketInvoice.setDate(row.getDate());
                    outOfPocketInvoice.setReference(row.getReference());
                    outOfPocketInvoice.setOutOfPocketItem(outOfPocketItem);
                    outOfPocketInvoices.add(outOfPocketInvoice);
                }
            } else if(Type.PAYMENT.equals(row.getType())) {
                if(! row.getIsOOP()) {
                    feesItem.setFeesInvoiceCurrency(row.getInvoiceCurrency());
                    feesItem.setFeesPaymentCurrency(row.getPaymentCurrency());
                    FeesPayment feesPayment = new FeesPayment();
                    feesPayment.setAmount(row.getAmount());
                    feesPayment.setDate(row.getDate());
                    feesPayment.setCvAmount(row.getCvAmount());
                    feesPayment.setFeesItem(feesItem);
                    feesPayments.add(feesPayment);
                } else {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(row.getInvoiceCurrency());
                    outOfPocketItem.setOutOfPocketPaymentCurrency(row.getPaymentCurrency());
                    OutOfPocketPayment outOfPocketPayment = new OutOfPocketPayment();
                    outOfPocketPayment.setAmount(row.getAmount());
                    outOfPocketPayment.setDate(row.getDate());
                    outOfPocketPayment.setCvAmount(row.getCvAmount());
                    outOfPocketPayment.setOutOfPocketItem(outOfPocketItem);
                    outOfPocketPayments.add(outOfPocketPayment);
                }            
            } else if(Type.ACT.equals(row.getType())) {
                if(! row.getIsOOP()) {
                    feesItem.setFeesActCurrency(row.getActCurrency());
                    FeesAct feesAct = new FeesAct();
                    feesAct.setAmount(row.getAmount());
                    feesAct.setCvAmount(row.getCvAmount());
                    feesAct.setDate(row.getDate());
                    feesAct.setIsSigned(row.getIsSigned());
                    feesAct.setReference(row.getReference());
                    feesAct.setFeesItem(feesItem);
                    feesActs.add(feesAct);
                } else {
                    outOfPocketItem.setOutOfPocketActCurrency(row.getActCurrency());
                    OutOfPocketAct outOfPocketAct = new OutOfPocketAct();
                    outOfPocketAct.setAmount(row.getAmount());
                    outOfPocketAct.setCvAmount(row.getCvAmount());
                    outOfPocketAct.setDate(row.getDate());
                    outOfPocketAct.setIsSigned(row.getIsSigned());
                    outOfPocketAct.setReference(row.getReference());
                    outOfPocketAct.setOutOfPocketItem(outOfPocketItem);
                    outOfPocketActs.add(outOfPocketAct);
                }            
            }
        }
        for(Long projectCodeId : feesItems.keySet()) {
            FeesItem feesItem = feesItems.get(projectCodeId);
            OutOfPocketItem outOfPocketItem = outOfPocketItems.get(projectCodeId);
            if(feesItem.getFeesAdvanceCurrency() == null && feesItem.getFeesInvoiceCurrency() == null && feesItem.getFeesPaymentCurrency() == null && feesItem.getFeesActCurrency() == null) {
                if(outOfPocketItem.getOutOfPocketInvoiceCurrency() != null) {
                    feesItem.setFeesInvoiceCurrency(outOfPocketItem.getOutOfPocketInvoiceCurrency());
                }
                if(outOfPocketItem.getOutOfPocketPaymentCurrency() != null) {
                    feesItem.setFeesPaymentCurrency(outOfPocketItem.getOutOfPocketPaymentCurrency());
                }
                if(outOfPocketItem.getOutOfPocketActCurrency() != null) {
                    feesItem.setFeesActCurrency(outOfPocketItem.getOutOfPocketActCurrency());
                }
            } 
            if(outOfPocketItem.getOutOfPocketInvoiceCurrency() == null && outOfPocketItem.getOutOfPocketPaymentCurrency() == null && outOfPocketItem.getOutOfPocketActCurrency() == null) {
                if(feesItem.getFeesInvoiceCurrency() != null) {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(feesItem.getFeesInvoiceCurrency());
                }
                if(feesItem.getFeesPaymentCurrency() != null) {
                    outOfPocketItem.setOutOfPocketPaymentCurrency(feesItem.getFeesPaymentCurrency());
                }
                if(feesItem.getFeesActCurrency() != null) {
                    outOfPocketItem.setOutOfPocketActCurrency(feesItem.getFeesActCurrency());
                }
                if(feesItem.getFeesAdvanceCurrency() != null && feesItem.getFeesInvoiceCurrency() == null && feesItem.getFeesPaymentCurrency() == null && feesItem.getFeesActCurrency() == null) {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(feesItem.getFeesAdvanceCurrency());
                    outOfPocketItem.setOutOfPocketPaymentCurrency(feesItem.getFeesAdvanceCurrency());
                    outOfPocketItem.setOutOfPocketActCurrency(feesItem.getFeesAdvanceCurrency());
                }
            } 
            if(feesItem.getFeesAdvanceCurrency() == null) {
                if(feesItem.getFeesInvoiceCurrency() != null) {
                    feesItem.setFeesAdvanceCurrency(feesItem.getFeesInvoiceCurrency());
                } else if(feesItem.getFeesPaymentCurrency() != null) {
                    feesItem.setFeesAdvanceCurrency(feesItem.getFeesPaymentCurrency());
                } else if(feesItem.getFeesActCurrency() != null) {
                    feesItem.setFeesAdvanceCurrency(feesItem.getFeesActCurrency());
                }
            }
            if(feesItem.getFeesInvoiceCurrency() == null) {
                if(feesItem.getFeesAdvanceCurrency() != null) {
                    feesItem.setFeesInvoiceCurrency(feesItem.getFeesAdvanceCurrency());
                } else if(feesItem.getFeesPaymentCurrency() != null) {
                    feesItem.setFeesInvoiceCurrency(feesItem.getFeesPaymentCurrency());
                } else if(feesItem.getFeesActCurrency() != null) {
                    feesItem.setFeesInvoiceCurrency(feesItem.getFeesActCurrency());
                }
            }
            if(feesItem.getFeesPaymentCurrency() == null) {
                if(feesItem.getFeesAdvanceCurrency() != null) {
                    feesItem.setFeesPaymentCurrency(feesItem.getFeesAdvanceCurrency());
                } else if(feesItem.getFeesInvoiceCurrency() != null) {
                    feesItem.setFeesPaymentCurrency(feesItem.getFeesInvoiceCurrency());
                } else if(feesItem.getFeesActCurrency() != null) {
                    feesItem.setFeesPaymentCurrency(feesItem.getFeesActCurrency());
                }
            }
            if(feesItem.getFeesActCurrency() == null) {
                if(feesItem.getFeesAdvanceCurrency() != null) {
                    feesItem.setFeesActCurrency(feesItem.getFeesAdvanceCurrency());
                } else if(feesItem.getFeesInvoiceCurrency() != null) {
                    feesItem.setFeesActCurrency(feesItem.getFeesInvoiceCurrency());
                } else if(feesItem.getFeesPaymentCurrency() != null) {
                    feesItem.setFeesActCurrency(feesItem.getFeesPaymentCurrency());
                }
            }
            
            if(outOfPocketItem.getOutOfPocketInvoiceCurrency() == null) {
                if(outOfPocketItem.getOutOfPocketPaymentCurrency() != null) {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(outOfPocketItem.getOutOfPocketPaymentCurrency());
                } else if(outOfPocketItem.getOutOfPocketActCurrency() != null) {
                    outOfPocketItem.setOutOfPocketInvoiceCurrency(outOfPocketItem.getOutOfPocketActCurrency());
                }
            }
            if(outOfPocketItem.getOutOfPocketPaymentCurrency() == null) {
                if(outOfPocketItem.getOutOfPocketInvoiceCurrency() != null) {
                    outOfPocketItem.setOutOfPocketPaymentCurrency(outOfPocketItem.getOutOfPocketInvoiceCurrency());
                } else if(outOfPocketItem.getOutOfPocketActCurrency() != null) {
                    outOfPocketItem.setOutOfPocketPaymentCurrency(outOfPocketItem.getOutOfPocketActCurrency());
                }
            }
            if(outOfPocketItem.getOutOfPocketActCurrency() == null) {
                if(outOfPocketItem.getOutOfPocketInvoiceCurrency() != null) {
                    outOfPocketItem.setOutOfPocketActCurrency(outOfPocketItem.getOutOfPocketInvoiceCurrency());
                } else if(outOfPocketItem.getOutOfPocketPaymentCurrency() != null) {
                    outOfPocketItem.setOutOfPocketActCurrency(outOfPocketItem.getOutOfPocketPaymentCurrency());
                }
            }
        }    
        rowNumber++;
        return errors;
    }
    public void save(String stamp) {
        Session hs = HibernateUtil.getSessionFactory().getCurrentSession();
        for(Long projectCodeId : feesItems.keySet()) {
            FeesItem feesItem = feesItems.get(projectCodeId);
            if(! hs.contains(feesItem) && feesItem.getId() != null) {
                hs.refresh(feesItem);
            }
            hs.save(feesItem);
        }
        for(Long projectCodeId : outOfPocketItems.keySet()) {
            OutOfPocketItem outOfPocketItem = outOfPocketItems.get(projectCodeId);
            if(! hs.contains(outOfPocketItem) && outOfPocketItem.getId() != null) {
                hs.refresh(outOfPocketItem);
            }            
            hs.save(outOfPocketItem);
        }
        for(FeesAdvance feesAdvance : feesAdvances) {
            feesAdvance.setStamp(stamp);
            if(! hs.contains(feesAdvance) && feesAdvance.getId() != null) {
                hs.refresh(feesAdvance);
            }            
            hs.save(feesAdvance);
        }
        for(FeesInvoice feesInvoice : feesInvoices) {
            feesInvoice.setStamp(stamp);
            if(! hs.contains(feesInvoice) && feesInvoice.getId() != null) {
                hs.refresh(feesInvoice);
            }            
            hs.save(feesInvoice);
        }
        for(FeesPayment feesPayment : feesPayments) {
            feesPayment.setStamp(stamp);
            if(! hs.contains(feesPayment) && feesPayment.getId() != null) {
                hs.refresh(feesPayment);
            }            
            hs.save(feesPayment);
        }
        for(FeesAct feesAct : feesActs) {
            feesAct.setStamp(stamp);
            if(! hs.contains(feesAct) && feesAct.getId() != null) {
                hs.refresh(feesAct);
            }            
            hs.save(feesAct);
        }
        for(OutOfPocketInvoice outOfPocketInvoice : outOfPocketInvoices) {
            outOfPocketInvoice.setStamp(stamp);
            if(! hs.contains(outOfPocketInvoice) && outOfPocketInvoice.getId() != null) {
                hs.refresh(outOfPocketInvoice);
            }            
            hs.save(outOfPocketInvoice);
        }
        for(OutOfPocketPayment outOfPocketPayment : outOfPocketPayments) {
            outOfPocketPayment.setStamp(stamp);
            if(! hs.contains(outOfPocketPayment) && outOfPocketPayment.getId() != null) {
                hs.refresh(outOfPocketPayment);
            }            
            hs.save(outOfPocketPayment);
        }
        for(OutOfPocketAct outOfPocketAct : outOfPocketActs) {
            outOfPocketAct.setStamp(stamp);
            if(! hs.contains(outOfPocketAct) && outOfPocketAct.getId() != null) {
                hs.refresh(outOfPocketAct);
            }            
            hs.save(outOfPocketAct);
        }
    }
}
