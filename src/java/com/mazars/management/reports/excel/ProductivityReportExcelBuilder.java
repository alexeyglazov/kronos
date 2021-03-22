/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.reports.*;
import java.util.Locale;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.format.Alignment;
import jxl.format.Border;
import jxl.format.BorderLineStyle;
import jxl.format.Colour;
import jxl.format.Orientation;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
import jxl.write.NumberFormats;
import jxl.write.DateFormat;
import java.io.*;

import java.util.Date;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class ProductivityReportExcelBuilder {
    private ProductivityReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;


    public ProductivityReportExcelBuilder(ProductivityReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Office", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Department", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Subdepartment", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Start date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "End date", headingFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        rowNumber++;
        String formOfficeName = "All";
        String formDepartmentName = "All";
        String formSubdepartmentName = "All";
        if(this.report.getFormOffice() != null) {
            formOfficeName = this.report.getFormOffice().getName();
        }
        if(this.report.getFormDepartment() != null) {
            formDepartmentName = this.report.getFormDepartment().getName();
        }
        if(this.report.getFormSubdepartment() != null) {
            formSubdepartmentName = this.report.getFormSubdepartment().getName();
        }
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formOfficeName));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formDepartmentName));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, formSubdepartmentName));
        columnNumber++;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getStartDate().getTime(), dateFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getEndDate().getTime(), dateFormat));
        columnNumber++;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        columnNumber++;
        int count = 0;
        rowNumber++;
        columnNumber = 0;
    }
    public void makeContent(List<ProductivityReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Code created", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Code closed", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Fees (budget)", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Fees Currency", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Timespent", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Project Closed", headingFormat));
        columnNumber++;
        
        rowNumber++;
        columnNumber = 0;

        int firstRowToSumNumber = rowNumber;
        int timeSpentColumnNumber = 7;
        for(ProductivityReport.Row row : rows) {
            columnNumber = 0;
            if(row.getGroupName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroupName()));
            }
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClientName()));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCodeCode()));
            columnNumber++;
            if(row.getProjectCodeCreatedAt() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getProjectCodeCreatedAt(), dateFormat));
            }
            columnNumber++;
            if(row.getProjectCodeClosedAt() != null) {
                sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, row.getProjectCodeClosedAt(), dateFormat));
            }
            columnNumber++;
            if(row.getFeesValue() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, row.getFeesValue().doubleValue(), numberFormat));
            }
            columnNumber++;
            if(row.getFeesCurrencyCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getFeesCurrencyCode()));
            }
            columnNumber++;
            if(row.getTimeSpent() != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, (row.getTimeSpent().doubleValue() / 60.0), timespentFormat));
            }
            columnNumber++;
            sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, row.getProjectCodeIsClosed()));
            columnNumber++;
            rowNumber++;
        }
        String formula = "SUM(" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber - 1 + 1) + ")";
        sheet.addCell(new jxl.write.Formula(timeSpentColumnNumber, rowNumber, formula, timespentFormat));
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
        WritableSheet sheet = workbook.createSheet("Productivity Report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }
}
