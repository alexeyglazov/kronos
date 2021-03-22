/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.db.util.ClientListUtil;
import com.mazars.management.reports.*;
import com.mazars.management.web.vo.OfficeDepartmentSubdepartment;
import java.io.*;
import java.math.BigDecimal;
import java.util.Collections;
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
public class ClientActivityReportExcelBuilder {
        private ClientActivityReport report;
        private OutputStream outputStream;
        private WritableWorkbook workbook;

        private WritableCellFormat headingFormat;
        private WritableCellFormat numberFormat;
        private WritableCellFormat integerFormat;
        private WritableCellFormat percentFormat;
        private WritableCellFormat timespentFormat;
        private WritableCellFormat dateFormat;
        private WritableCellFormat fullDateFormat;

        public ClientActivityReportExcelBuilder(ClientActivityReport report, OutputStream outputStream) throws RowsExceededException, WriteException {
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
        public ClientActivityReportExcelBuilder(ClientActivityReport report, OutputStream outputStream, WritableWorkbook workbook) throws RowsExceededException, WriteException {
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
            List<OfficeDepartmentSubdepartment> subdepartments = new LinkedList<OfficeDepartmentSubdepartment>();
            for(Subdepartment subdepartment : this.report.getSubdepartments()) {
                subdepartments.add(new OfficeDepartmentSubdepartment(subdepartment));
            }
            Collections.sort(subdepartments, new OfficeDepartmentSubdepartment.OfficeDepartmentSubdepartmentComparator());
            List<String> columnNames = new LinkedList<String>();
            columnNames.add("Group");
            columnNames.add("Client");
            columnNames.add("Active");
            columnNames.add("Country");
            columnNames.add("Project count");
            for(Currency currency : this.report.getCurrencies()) {
                columnNames.add(currency.getCode());
            }    
            WritableSheet sheet = workbook.createSheet("Client Activity Report", 0);

            int columnNumber = 0;
            int rowNumber = 0;
            sheet.addCell(new Label(columnNumber, rowNumber, "Created at", headingFormat));
            rowNumber++;
            
            columnNumber = 0;
            sheet.addCell(new jxl.write.DateTime(columnNumber, rowNumber, this.report.getCreatedAt(), fullDateFormat));
            columnNumber++;
            
            rowNumber++;
            columnNumber = 0;
            for(String columnName : columnNames) {
                sheet.addCell(new Label(columnNumber, rowNumber, columnName, headingFormat));
                columnNumber++;
            }            
            rowNumber++;

            for(ClientListUtil.DescribedClientWithProjectAndFinancialActivityInfoItem row : this.report.getRows()) {
                columnNumber = 0;

                Group group = row.getGroup();
                Client client = row.getClient();
                Long totalSubdepartmentCounts = new Long(0);
                for(Subdepartment subdepartment : row.getSubdepartmentCounts().keySet()) {
                    totalSubdepartmentCounts += row.getSubdepartmentCounts().get(subdepartment);
                }
                if(group != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, group.getName()));
                }
                columnNumber++;

                if(client != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, client.getName()));
                    columnNumber++;
                    if(client.getIsActive() != null) {
                        sheet.addCell(new jxl.write.Boolean(columnNumber, rowNumber, client.getIsActive()));
                    }
                    columnNumber++;
                }
                if(row.getCountry() != null) {
                    sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, row.getCountry().getName()));
                }
                columnNumber++;
                sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, totalSubdepartmentCounts, integerFormat));
                columnNumber++;
                
                for(Currency currency : this.report.getCurrencies()) {
                    if(row.getCurrencyAmounts().get(currency) != null) {
                        BigDecimal amount = row.getCurrencyAmounts().get(currency);
                        sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, amount.doubleValue(), numberFormat));
                    }
                    columnNumber++;
                }
                rowNumber++;
            }
	}
}
