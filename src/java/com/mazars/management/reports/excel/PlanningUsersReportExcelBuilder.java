/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.Locale;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.write.WritableCellFormat;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
/**
 *
 * @author Glazov
 */
public class PlanningUsersReportExcelBuilder {
    private PlanningUsersReport report;
    private OutputStream outputStream;
    
    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;

    public PlanningUsersReportExcelBuilder(PlanningUsersReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
        this.report = report;
        this.outputStream = outputStream;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {

    }
    public void makeContent(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Username", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "First name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Last name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Full name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Position", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Active", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Start date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "End date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Country", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Email", headingFormat));
        columnNumber++;
        
        rowNumber++;
        columnNumber = 0;

        for(PlanningUsersReport.Row row : this.report.getRows()) {
            columnNumber = 0;
            if(row.getEmployeeUserName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeeUserName()));
            }
            columnNumber++;
            if(row.getEmployeeFirstName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeeFirstName()));
            }    
            columnNumber++;
            if(row.getEmployeeLastName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeeLastName()));
            }    
            columnNumber++;
            if(row.getEmployeeFullName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeeFullName()));
            }    
            columnNumber++;
            if(row.getPositionName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getPositionName()));
            }    
            columnNumber++;
            if(row.getDepartmentName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getDepartmentName()));
            }  
            columnNumber++;            
            if(row.getOfficeName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getOfficeName()));
            }  
            columnNumber++; 
            if(row.getEmployeeIsActive() != null) {
                sheet.addCell(new jxl.write.Boolean (columnNumber, rowNumber, row.getEmployeeIsActive()));
            }
            columnNumber++;
            if(row.getCareerStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getCareerStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(row.getCareerEndDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getCareerEndDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(row.getCountryCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getCountryCode()));
            }
            columnNumber++;
            if(row.getEmployeeEmail() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getEmployeeEmail()));
            }
            columnNumber++;            
            rowNumber++;
        }
    }

    public void createReport() throws IOException, RowsExceededException, WriteException {
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
        WritableSheet sheet = workbook.createSheet("Planning users", 0);
        makeHeader(sheet);
        makeContent(sheet);
    }
}
