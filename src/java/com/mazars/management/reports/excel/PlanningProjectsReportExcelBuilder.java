/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
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
public class PlanningProjectsReportExcelBuilder {
    private PlanningProjectsReport report;
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

    public PlanningProjectsReportExcelBuilder(PlanningProjectsReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
        this.report = report;
        this.outputStream = outputStream;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {

    }
    public void makeContent(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Client Name", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project Code", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project Code Comment", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Start Date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project Status", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Project Code ID", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Country", headingFormat));
        columnNumber++;
        
        rowNumber++;
        columnNumber = 0;

        for(PlanningProjectsReport.Row row : this.report.getRows()) {
            columnNumber = 0;
            if(row.getClientName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientName()));
            }
            columnNumber++;
            if(row.getProjectCodeCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCodeCode()));
            }    
            columnNumber++;
            if(row.getProjectCodeComment() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCodeComment()));
            }    
            columnNumber++;
            if(row.getProjectCodeStartDate() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getProjectCodeStartDate().getTime(), dateFormat));
            }
            columnNumber++;
            if(Boolean.TRUE.equals(row.getProjectCodeIsClosed())) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Closed"));
            } else {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Approved"));
            }   
            columnNumber++;
            if(row.getProjectCodeId() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + row.getProjectCodeId()));
            }  
            columnNumber++;            
            if(row.getCountryCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getCountryCode()));
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
        WritableSheet sheet = workbook.createSheet("Planning projects", 0);
        makeHeader(sheet);
        makeContent(sheet);
    }
}
