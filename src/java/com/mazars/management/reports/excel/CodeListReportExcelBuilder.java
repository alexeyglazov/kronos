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
public class CodeListReportExcelBuilder {
    private CodeListReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;


    public CodeListReportExcelBuilder(CodeListReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "Created at", headingFormat));
        columnNumber++;
        rowNumber++;
        columnNumber = 0;
        sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        columnNumber++;
        int count = 0;
        rowNumber++;
        columnNumber = 0;
    }
    public void makeContent(List<CodeListReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new Label(columnNumber, rowNumber, "Group", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Project Code", headingFormat));
        columnNumber++;
        
        rowNumber++;
        columnNumber = 0;

        int firstRowToSumNumber = rowNumber;
        for(CodeListReport.Row row : rows) {
            columnNumber = 0;
            if(row.getGroup() != null && row.getGroup().getName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getGroup().getName()));
            }
            columnNumber++;
            if(row.getClient().getName() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getClient().getName()));
            }
            columnNumber++;
            if(row.getProjectCode().getCode() != null) {
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getProjectCode().getCode()));
            }
            columnNumber++;
            rowNumber++;
        }
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
        WritableSheet sheet = workbook.createSheet("Business trip report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }
}
