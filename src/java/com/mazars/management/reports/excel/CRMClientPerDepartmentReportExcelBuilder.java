/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import jxl.Workbook;
import jxl.WorkbookSettings;
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
public class CRMClientPerDepartmentReportExcelBuilder {
        private CRMClientPerDepartmentReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public CRMClientPerDepartmentReportExcelBuilder(CRMClientPerDepartmentReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public CRMClientPerDepartmentReportExcelBuilder(CRMClientPerDepartmentReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            ws.setLocale(new Locale("en", "US"));
            workbook = Workbook.createWorkbook(outputStream, ws);
	}
        public void writeWorkbook() throws IOException, WriteException {
                workbook.write();
                workbook.close();
        }


	public void fillWorkbook() throws RowsExceededException, WriteException {
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group Id");
            columnNames.add("Group Name");
            columnNames.add("Client Id");
            columnNames.add("Client Name");
            columnNames.add("Client Customer Type");
            columnNames.add("Client Is Referred");
            columnNames.add("Client Activity Sector");
                
            WritableSheet sheet = workbook.createSheet("Code Detail Per Department Report", 0);

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, "Created at", headingFormat));
            rowNumber++;
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            rowNumber++;
            columnNumber = 0;
            for(Subdepartment subdepartment : this.report.getSubdepartments()) {
                Office office = subdepartment.getDepartment().getOffice();
                sheet.addCell(new Label(columnNumber, rowNumber, office.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            columnNumber = 0;
            for(Subdepartment subdepartment : this.report.getSubdepartments()) {
                Department department = subdepartment.getDepartment();
                sheet.addCell(new Label(columnNumber, rowNumber, department.getName(), headingFormat));
                columnNumber++;
            }
            rowNumber++;
            columnNumber = 0;
            for(Subdepartment subdepartment : this.report.getSubdepartments()) {
                sheet.addCell(new Label(columnNumber, rowNumber, subdepartment.getName(), headingFormat));
                columnNumber++;
            }
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }
            rowNumber++;

            for(CRMClientPerDepartmentReport.Row row : this.report.getRows()) {
                columnNumber = 0;
                for(Subdepartment subdepartment : this.report.getSubdepartments()) {
                    if(row.getSubdepartments().contains(subdepartment)) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, Boolean.TRUE));
                    }
                    columnNumber++;
                }
                Group group = row.getGroup();
                Client client = row.getClient();
                if(group != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, group.getId()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, group.getName()));
                    columnNumber++;
                }
                columnNumber = this.report.getSubdepartments().size() + 2;
                if(client != null) {
                    sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, client.getId()));
                    columnNumber++;
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
                    columnNumber++;
                    if(client.getCustomerType() != null) {
                        sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + client.getCustomerType()));
                    }
                    columnNumber++;
                    if(client.getIsReferred() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsReferred()));
                    }
                    columnNumber++;
                    String activitySectorNames = "";
                    for(ActivitySector activitySector : row.getActivitySectors()) {
                        activitySectorNames += activitySector.getName() + "; ";
                    }
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, "" + activitySectorNames));
                    columnNumber++;
                }
                rowNumber++;
            }
	}
}
