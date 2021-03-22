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

import java.util.Map;
import java.util.List;
import java.util.LinkedList;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.CalendarUtil;
import com.mazars.management.db.vo.YearMonthDate;
import jxl.write.NumberFormat;
import java.io.*;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.zip.*;
import java.text.SimpleDateFormat;
/**
 *
 * @author Glazov
 */
public class MonthlyTimeSheetReportExcelBuilder {
    private MonthlyTimeSheetReport monthlyTimeSheetReport;
    private ZipOutputStream zipOutputStream;
    private WritableWorkbook workbook;
    private SimpleDateFormat dateFormatterLong = new SimpleDateFormat("ddMMyyyyHHmmss");

    //private String[] months = {"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};
    private String[] months = {"01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"};
    Map<String, String> localizedLabels;
    String[] localizedMonths;
    Map<String, String> localizedTasks;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;


    public MonthlyTimeSheetReportExcelBuilder(MonthlyTimeSheetReport monthlyTimeSheetReport, ZipOutputStream zipOutputStream, Map<String, String> localizedLabels, String[] localizedMonths, Map<String, String> localizedTasks) throws RowsExceededException, WriteException {
        this.monthlyTimeSheetReport = monthlyTimeSheetReport;
        this.zipOutputStream = zipOutputStream;
        this.localizedLabels = localizedLabels;
        this.localizedMonths = localizedMonths;
        this.localizedTasks = localizedTasks;

        this.headingFormat = ExcelUtils.getHeadingFormat();
        this.numberFormat = ExcelUtils.getNumberFormat();
        this.integerFormat = ExcelUtils.getIntegerFormat();
        this.percentFormat = ExcelUtils.getPercentFormat();
        this.timespentFormat = ExcelUtils.getTimespentFormat();
        this.dateFormat = ExcelUtils.getDateFormat();
        this.fullDateFormat = ExcelUtils.getFullDateFormat();
    }

    public void createZipFile() throws IOException, RowsExceededException, WriteException {
        if(! this.monthlyTimeSheetReport.getEmployeeReports().isEmpty()) {
            for(MonthlyTimeSheetReport.EmployeeReport employeeReport : this.monthlyTimeSheetReport.getEmployeeReports()) {
                //String fileName = "MTS_" + employeeReport.getEmployee().getUserName() + "_(" +employeeReport.getEmployee().getFirstName() + "_" + employeeReport.getEmployee().getLastName() + ")_" + monthlyTimeSheetReport.getYear() + "_" + months[monthlyTimeSheetReport.getMonth()] + "_";
                String fileName = "" + employeeReport.getEmployee().getUserName() + "_" + monthlyTimeSheetReport.getYear() + "_" + months[monthlyTimeSheetReport.getMonth()];
                //fileName += dateFormatterLong.format(monthlyTimeSheetReport.getCreatedAt());
                fileName += ".xls";

                ZipEntry entry = new ZipEntry(fileName);
                zipOutputStream.putNextEntry(entry);
                createWorkbook(employeeReport);
            }
        } else {
                 String fileName = "readme_" + monthlyTimeSheetReport.getYear() + "_" + months[monthlyTimeSheetReport.getMonth()];
                //fileName += dateFormatterLong.format(monthlyTimeSheetReport.getCreatedAt());
                fileName += ".xls";

                ZipEntry entry = new ZipEntry(fileName);
                zipOutputStream.putNextEntry(entry);
                createReadmeWorkbook();       
        }
    }
    public void createWorkbook(MonthlyTimeSheetReport.EmployeeReport employeeReport) throws IOException, RowsExceededException, WriteException {
        WorkbookSettings ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.createWorkbook(zipOutputStream, ws);
        fillWorkbook(employeeReport);
        writeWorkbook();
    }
    public void createReadmeWorkbook() throws IOException, RowsExceededException, WriteException {
        WorkbookSettings ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.createWorkbook(zipOutputStream, ws);
        fillReadmeWorkbook();
        writeWorkbook();
    }
    public void fillWorkbook(MonthlyTimeSheetReport.EmployeeReport employeeReport) throws RowsExceededException, WriteException {
        WritableSheet sheet = workbook.createSheet( "Timesheet", 0);
        fillSheet(sheet, employeeReport);
    }
    public void fillReadmeWorkbook() throws RowsExceededException, WriteException {
        WritableSheet sheet = workbook.createSheet( "Readme", 0);
        fillReadmeSheet(sheet);
    }
    private void fillSheet(WritableSheet sheet, MonthlyTimeSheetReport.EmployeeReport report) throws RowsExceededException, WriteException {
        int daysNumber = getDaysNumber(this.monthlyTimeSheetReport.getYear(), this.monthlyTimeSheetReport.getMonth());
    
        String firstName = report.getEmployee().getFirstNameLocalLanguage() != null && !report.getEmployee().getFirstNameLocalLanguage().trim().equals("") ? report.getEmployee().getFirstNameLocalLanguage() : report.getEmployee().getFirstName();
        String lastName = report.getEmployee().getLastNameLocalLanguage() != null && !report.getEmployee().getLastNameLocalLanguage().trim().equals("") ? report.getEmployee().getLastNameLocalLanguage() : report.getEmployee().getLastName();
        int columnNumber = 0;
        int rowNumber = 0;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Caption")));
        rowNumber = 1;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Company Name")));
        rowNumber = 2;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Last Name")));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, lastName));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Month")));
        columnNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, localizedMonths[this.monthlyTimeSheetReport.getMonth()]));
        rowNumber = 3;
        columnNumber = 0;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("First Name")));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, firstName));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Year")));
        columnNumber++;
        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, this.monthlyTimeSheetReport.getYear()));
        rowNumber++;
        columnNumber = 0;

        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Project")));
        columnNumber = 2;
        sheet.addCell(new Label(columnNumber, rowNumber, localizedLabels.get("Total")));
        columnNumber = 3;
        for(int i = 0; i < daysNumber; i++) {
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, i + 1));
            columnNumber++;
        }
        rowNumber++;

        int firstRowToSum = rowNumber;

        for(MonthlyTimeSheetReport.ProjetCodeRow projetCodeRow : report.getProjetCodeRows()) {
            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projetCodeRow.getProjectCode().getCode()));
            columnNumber = 2;
            String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber + 1) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber + daysNumber) + (rowNumber + 1) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
            columnNumber++;
            for(int i = 0; i < daysNumber; i++) {
                YearMonthDate day = new YearMonthDate();
                day.setYear(this.monthlyTimeSheetReport.getYear());
                day.setMonth(this.monthlyTimeSheetReport.getMonth());
                day.setDayOfMonth(i + 1);
                Long timeSpent = null;
                if(projetCodeRow.getSpentTimes() != null) {
                    for(YearMonthDate dayTmp : projetCodeRow.getSpentTimes().keySet()) {
                        if(day.equals(dayTmp)) {
                            timeSpent = projetCodeRow.getSpentTimes().get(dayTmp);
                            break;
                        }
                    }
                }
                if(timeSpent != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, (timeSpent + 0.0) / 60, timespentFormat));
                } else {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, 0, timespentFormat));
                }
                columnNumber++;
            }
            rowNumber++;
        }

        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, localizedLabels.get("Other")));
        rowNumber++;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, localizedLabels.get("Internal Not Idle Tasks")));

        columnNumber = 2;
        String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber + 1) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber + daysNumber) + (rowNumber + 1) + ")";
        sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
        columnNumber++;
        for(int i = 0; i < daysNumber; i++) {
            YearMonthDate day = new YearMonthDate();
            day.setYear(this.monthlyTimeSheetReport.getYear());
            day.setMonth(this.monthlyTimeSheetReport.getMonth());
            day.setDayOfMonth(i + 1);
            Long timeSpent = null;
            if(report.getNotIdleInternalTasksRow() != null && report.getNotIdleInternalTasksRow().getSpentTimes() != null) {
                for(YearMonthDate dayTmp : report.getNotIdleInternalTasksRow().getSpentTimes().keySet()) {
                    if(day.equals(dayTmp)) {
                        timeSpent = report.getNotIdleInternalTasksRow().getSpentTimes().get(dayTmp);
                        break;
                    }
                }
            }
            if(timeSpent != null) {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, (timeSpent + 0.0) / 60, timespentFormat));
            } else {
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, 0, timespentFormat));
            }
            columnNumber++;
        }
        rowNumber++;
        for(String taskName : this.localizedTasks.keySet()) {
            MonthlyTimeSheetReport.TaskRow taskRow = null;
            for(MonthlyTimeSheetReport.TaskRow taskRowTmp : report.getIdleTaskRows()) {
                if(taskRowTmp.getTask().getName().equals(taskName)) {
                    taskRow = taskRowTmp;
                    break;
                }
            }
            if(taskRow != null) {
                columnNumber = 0;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.localizedTasks.get(taskName)));
                columnNumber = 2;
                String formula2 = "SUM(" + ExcelUtils.getColumnName(columnNumber + 1) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber + daysNumber) + (rowNumber + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula2, timespentFormat));
                columnNumber++;
                for(int i = 0; i < daysNumber; i++) {
                    YearMonthDate day = new YearMonthDate();
                    day.setYear(this.monthlyTimeSheetReport.getYear());
                    day.setMonth(this.monthlyTimeSheetReport.getMonth());
                    day.setDayOfMonth(i + 1);
                    Long timeSpent = null;
                    if(taskRow.getSpentTimes() != null) {
                        for(YearMonthDate dayTmp : taskRow.getSpentTimes().keySet()) {
                            if(day.equals(dayTmp)) {
                                timeSpent = taskRow.getSpentTimes().get(dayTmp);
                                break;
                            }
                        }
                    }
                    if(timeSpent != null) {
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, (timeSpent + 0.0) / 60, timespentFormat));
                    } else {
                        //sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, 0, timespentFormat));
                    }
                    columnNumber++;
                }
            } else {
                columnNumber = 0;
                sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, this.localizedTasks.get(taskName)));
                columnNumber = 2;
                String formula2 = "SUM(" + ExcelUtils.getColumnName(columnNumber + 1) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(columnNumber + daysNumber) + (rowNumber + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula2, timespentFormat));
                columnNumber++;
            }
            rowNumber++;
        }
        for(MonthlyTimeSheetReport.TaskRow taskRow : report.getIdleTaskRows()) {

        }

        columnNumber = 0;
        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, localizedLabels.get("TOTAL")));

        columnNumber = 2;
        String formula2 = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber) + ")";
        sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula2, timespentFormat));

        columnNumber = 3;
        for(int i = 0; i < daysNumber; i++) {
            String formula3 = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (rowNumber) + ")";
            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula3, timespentFormat));
            columnNumber++;
        }
    }
    private void fillReadmeSheet(WritableSheet sheet) throws RowsExceededException, WriteException {
        String message = "No time was reported for selected year and month";
        sheet.addCell(new Label(0, 0, message));
    }
    public void writeWorkbook() throws IOException, WriteException {
            workbook.write();
            workbook.close();
    }
    public int getDaysNumber(int year, int month) {
        Calendar dateTmp = CalendarUtil.getBeginDateForYearMonth(year, month);
        for(int i = 28; i < 32; i++) {
            dateTmp.set(Calendar.DAY_OF_MONTH, i);
            if(dateTmp.get(Calendar.MONTH) != month) {
                return i - 1;
            }
        }
        return 31;
    }
}
