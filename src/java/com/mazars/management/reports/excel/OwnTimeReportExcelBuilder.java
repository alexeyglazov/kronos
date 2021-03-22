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
import java.util.Map;
import jxl.write.NumberFormat;
/**
 *
 * @author Glazov
 */
public class OwnTimeReportExcelBuilder {
        private OwnTimeReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public OwnTimeReportExcelBuilder(OwnTimeReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
            this.report = report;
            this.outputStream = outputStream;

            this.headingFormat = ExcelUtils.getHeadingFormat();
            this.numberFormat = ExcelUtils.getNumberFormat();
            this.integerFormat = ExcelUtils.getIntegerFormat();
            this.percentFormat = ExcelUtils.getPercentFormat();
            this.timespentFormat = ExcelUtils.getTimespentFormat();
            this.dateFormat = ExcelUtils.getDateFormat();
            this.fullDateFormat = ExcelUtils.getFullDateFormat();
        }
        public OwnTimeReportExcelBuilder(OwnTimeReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
        }
        public void createWorkbook() throws IOException {
            WorkbookSettings ws = new WorkbookSettings();
            ws.setLocale(new Locale("ru", "RU"));
            workbook = Workbook.createWorkbook(outputStream, ws);
	}
        public void writeWorkbook() throws IOException, WriteException {
                workbook.write();
                workbook.close();
        }


	public void fillWorkbook() throws RowsExceededException, WriteException {
            int count = 0;
            OwnTimeReport.Subreport fullSubreport = null;
            for(OwnTimeReport.Subreport subreport : this.report.getSubreports()) {
                if(subreport.getIsInternal() == null && subreport.getTask() == null && subreport.getIsIdle() == null) {
                    fullSubreport = subreport;
                    break;
                }
            }
           
            for(OwnTimeReport.Subreport subreport : this.report.getSubreports()) {
                String taskTypeName;
                String taskName;
                if(subreport.getIsInternal() == null) {
                    taskTypeName = "All";
                } else if(subreport.getIsInternal() == false) {
                    taskTypeName = "Project";
                } else {
                    taskTypeName = "Internal";
                }
                if(subreport.getTask() == null) {
                    taskName = "All";
                } else {
                    taskName = subreport.getTask().getName();
                }
                WritableSheet sheet = workbook.createSheet(taskTypeName + " " + taskName, count);
                if(OwnTimeReport.View.TIME.equals(this.report.getView())) {
                    fillSheet(sheet, subreport);
                } else {
                    fillSheetWithPercent(sheet, subreport, fullSubreport);
                }
                count++;
            }
	}
        private void fillSheet(WritableSheet sheet, OwnTimeReport.Subreport subreport) throws RowsExceededException, WriteException {
            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Office", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Department", headingFormat));
            sheet.addCell(new Label(4, rowNumber, "Subdepartment", headingFormat));
            sheet.addCell(new Label(5, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getEndDate().getTime(), dateFormat));
            String officeName = "All";
            String departmentName = "All";
            String subdepartmentName = "All";
            if(report.getFormOffice() != null) {
                officeName = report.getFormOffice().getName();
            }
            if(report.getFormDepartment() != null) {
                departmentName = report.getFormDepartment().getName();
            }
            if(report.getFormSubdepartment() != null) {
                subdepartmentName = report.getFormSubdepartment().getName();
            }
            sheet.addCell(new jxl.write.Label(2, rowNumber, officeName));
            sheet.addCell(new jxl.write.Label(3, rowNumber, departmentName));
            sheet.addCell(new jxl.write.Label(4, rowNumber, subdepartmentName));
            sheet.addCell(new jxl.write.DateTime(5, rowNumber, report.getCreatedAt(), fullDateFormat));
            rowNumber++;

            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Sub department", headingFormat));
            columnNumber++;
            for(StandardPosition standardPosition : report.getStandardPositions()) {
                sheet.addCell(new Label(columnNumber, rowNumber, standardPosition.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            int firstRowToSum = rowNumber;
            for(Subdepartment subdepartment : report.getSubdepartments()) {
                columnNumber = 0;

                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                sheet.addCell(new Label(columnNumber, rowNumber, office.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName()));
                columnNumber++;
                if(subreport.getInfo().containsKey(subdepartment)) {
                    Map<StandardPosition, Long> subInfo = subreport.getInfo().get(subdepartment);
                    for(StandardPosition standardPosition : report.getStandardPositions()) {
                        Long timeTmp = subInfo.get(standardPosition);
                        Double time = 0.0;
                        if(timeTmp != null) {
                            time = timeTmp + 0.0;
                        }
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, time / 60.0, timespentFormat));
                        columnNumber++;
                    }
                    String formula = "SUM(" + ExcelUtils.getColumnName(3) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(3 + report.getStandardPositions().size() -1) + (rowNumber + 1) + ")";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                }
                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = 3;
                for(StandardPosition standardPosition : report.getStandardPositions()) {
                    String formula = "SUM(" + ExcelUtils.getColumnName(columnNumber) + (firstRowToSum + 1) + ":" + ExcelUtils.getColumnName(columnNumber) + (lastRowToSum + 1) + ")";
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
                    columnNumber++;
                }
                String formula = "SUM(" + ExcelUtils.getColumnName(3) + (rowNumber + 1) + ":" + ExcelUtils.getColumnName(3 + report.getStandardPositions().size() -1) + (rowNumber + 1) + ")";
                sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, timespentFormat));
            }
        }
        
        private void fillSheetWithPercent(WritableSheet sheet, OwnTimeReport.Subreport subreport, OwnTimeReport.Subreport fullSubreport) throws RowsExceededException, WriteException {
            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(0, rowNumber, "Start date", headingFormat));
            sheet.addCell(new Label(1, rowNumber, "End date", headingFormat));
            sheet.addCell(new Label(2, rowNumber, "Office", headingFormat));
            sheet.addCell(new Label(3, rowNumber, "Department", headingFormat));
            sheet.addCell(new Label(4, rowNumber, "Subdepartment", headingFormat));
            sheet.addCell(new Label(5, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(0, rowNumber, report.getStartDate().getTime(), dateFormat));
            sheet.addCell(new jxl.write.DateTime(1, rowNumber, report.getEndDate().getTime(), dateFormat));
            String officeName = "All";
            String departmentName = "All";
            String subdepartmentName = "All";
            if(report.getFormOffice() != null) {
                officeName = report.getFormOffice().getName();
            }
            if(report.getFormDepartment() != null) {
                departmentName = report.getFormDepartment().getName();
            }
            if(report.getFormSubdepartment() != null) {
                subdepartmentName = report.getFormSubdepartment().getName();
            }
            sheet.addCell(new jxl.write.Label(2, rowNumber, officeName));
            sheet.addCell(new jxl.write.Label(3, rowNumber, departmentName));
            sheet.addCell(new jxl.write.Label(4, rowNumber, subdepartmentName));
            sheet.addCell(new jxl.write.DateTime(5, rowNumber, report.getCreatedAt(), fullDateFormat));
            rowNumber++;

            sheet.addCell(new Label(columnNumber, rowNumber, "Office", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Department", headingFormat));
            columnNumber++;
            sheet.addCell(new Label(columnNumber, rowNumber, "Sub department", headingFormat));
            columnNumber++;
            for(StandardPosition standardPosition : report.getStandardPositions()) {
                sheet.addCell(new Label(columnNumber, rowNumber, standardPosition.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            
            int firstRowToSum = rowNumber;
            String formula = "";
            for(Subdepartment subdepartment : report.getSubdepartments()) {
                columnNumber = 0;

                Department department = subdepartment.getDepartment();
                Office office = department.getOffice();
                sheet.addCell(new Label(columnNumber, rowNumber, office.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName()));
                columnNumber++;
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName()));
                columnNumber++;
                if(subreport.getInfo().containsKey(subdepartment)) {
                    Map<StandardPosition, Long> row = subreport.getInfo().get(subdepartment);
                    Map<StandardPosition, Long> fullRow = fullSubreport.getInfo().get(subdepartment);
                    for(StandardPosition standardPosition : report.getStandardPositions()) {
                        Long timeTmp = row.get(standardPosition);
                        Long fullTimeTmp = fullRow.get(standardPosition);
                        Double time = 0.0;
                        Double fullTime = 0.0;
                        if(timeTmp != null) {
                            time = timeTmp/60.0;
                        }
                        if(fullTimeTmp != null) {
                            fullTime = fullTimeTmp/60.0;
                        }
                        if(fullTime != 0) {
                            formula = "" + time + "/" + fullTime;
                            sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
                        }
                        columnNumber++;
                    }
                }
                
                Long subdepartmentTimeTmp = subreport.getTotalTimeSpentBySubdepartment(subdepartment);
                Long fullSubdepartmentTimeTmp = fullSubreport.getTotalTimeSpentBySubdepartment(subdepartment);
                Double subdepartmentTime = 0.0;
                Double fullSubdepartmentTime = 0.0;
                if(subdepartmentTimeTmp != null) {
                    subdepartmentTime = subdepartmentTimeTmp/60.0;
                }
                if(fullSubdepartmentTimeTmp != null) {
                    fullSubdepartmentTime = fullSubdepartmentTimeTmp/60.0;
                }
                if(fullSubdepartmentTime != 0) {
                    formula = "" + subdepartmentTime + "/" + fullSubdepartmentTime;
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
                }
                rowNumber++;
            }
            int lastRowToSum = rowNumber - 1;
            if(lastRowToSum >= firstRowToSum) {
                columnNumber = 3;
                for(StandardPosition standardPosition : report.getStandardPositions()) {
                    Long standardPositionTimeTmp = subreport.getTotalTimeSpentByStandardPosition(standardPosition);
                    Long fullStandardPositionTimeTmp = fullSubreport.getTotalTimeSpentByStandardPosition(standardPosition);
                    Double standardPositionTime = 0.0;
                    Double fullStandardPositionTime = 0.0;
                    if(standardPositionTimeTmp != null) {
                        standardPositionTime = standardPositionTimeTmp/60.0;
                    }
                    if(fullStandardPositionTimeTmp != null) {
                        fullStandardPositionTime = fullStandardPositionTimeTmp/60.0;
                    }
                    if(fullStandardPositionTime != 0) {
                        formula = "" + standardPositionTime + "/" + fullStandardPositionTime;
                        sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
                    }
                    columnNumber++;
                }
                Long totalTimeTmp = subreport.getTotalTimeSpent();
                Long fullTotalTimeTmp = fullSubreport.getTotalTimeSpent();
                Double totalTime = 0.0;
                Double fullTotalTime = 0.0;
                if(totalTimeTmp != null) {
                    totalTime = totalTimeTmp/60.0;
                }
                if(fullTotalTimeTmp != null) {
                    fullTotalTime = fullTotalTimeTmp/60.0;
                }
                if(fullTotalTime != 0) {
                    formula = "" + totalTime + "/" + fullTotalTime;
                    sheet.addCell(new jxl.write.Formula(columnNumber, rowNumber, formula, percentFormat));
                }
            }
        }

}
