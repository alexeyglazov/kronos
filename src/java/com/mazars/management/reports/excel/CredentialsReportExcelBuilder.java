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
public class CredentialsReportExcelBuilder {
        private CredentialsReport report;
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

        public CredentialsReportExcelBuilder(CredentialsReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public CredentialsReportExcelBuilder(CredentialsReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            sheet.addCell(new Label(columnNumber, rowNumber, "Group", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Activity sector group", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Activity sector", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Country", headingFormat));
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
            if(this.report.getFormGroup() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormGroup().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormClient() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormClient().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormActivitySectorGroup() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormActivitySectorGroup().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormActivitySector() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormActivitySector().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            if(this.report.getFormCountry() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.report.getFormCountry().getName()));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "All"));
            }
            columnNumber++;
            rowNumber++;
            columnNumber = 0;
        }
        private void makeContent(List<CredentialsReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {     
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group");
            columnNames.add("Client");
            columnNames.add("Activity Sector Group");
            columnNames.add("Activity Sector");
            columnNames.add("Office");
            columnNames.add("Department");
            columnNames.add("Subdepartment");
            columnNames.add("Activity");
            columnNames.add("Code");
            columnNames.add("Description");
            columnNames.add("Person in charge");
            
            for(String columnName : columnNames) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;
            for(CredentialsReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                if(row.getGroup() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroup().getName()));
                }
                columnNumber++;
                if(row.getClient() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClient().getName()));
                }
                columnNumber++;
                if(row.getActivitySectorGroup() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getActivitySectorGroup().getName()));
                }    
                columnNumber++;
                if(row.getActivitySector() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getActivitySector().getName()));
                }
                columnNumber++;
                if(row.getOffice() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getOffice().getName()));
                }
                columnNumber++;
                if(row.getDepartment() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getDepartment().getName()));
                }
                columnNumber++;
                if(row.getSubdepartment() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getSubdepartment().getName()));
                }
                columnNumber++;
                if(row.getActivity() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getActivity().getName()));
                }
                columnNumber++;
                if(row.getProjectCode() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
                }
                columnNumber++;
                if(row.getProjectCode() != null && row.getProjectCode().getDescription() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCode().getDescription()));
                }
                columnNumber++;
                if(row.getInChargePerson() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getInChargePerson().getFullName()));
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
        WritableSheet sheet = workbook.createSheet("Credentials report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }        
}
