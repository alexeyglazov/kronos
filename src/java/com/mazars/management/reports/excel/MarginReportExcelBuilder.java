/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
import com.mazars.management.db.domain.*;
import com.mazars.management.reports.*;
import java.io.*;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
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
public class MarginReportExcelBuilder {
    private ProfitabilityReport report;

    private WritableCellFormat headingFormat;
    private WritableCellFormat numberFormat;
    private WritableCellFormat integerFormat;
    private WritableCellFormat percentFormat;
    private WritableCellFormat timespentFormat;
    private WritableCellFormat dateFormat;
    private WritableCellFormat fullDateFormat;

    private int columnNumber = 0;
    private int rowNumber = 0;


    public MarginReportExcelBuilder(ProfitabilityReport report) throws RowsExceededException, WriteException {
        this.report = report;
    }
    public void makeHeader(WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new Label(0, rowNumber, "Group", headingFormat));
        sheet.addCell(new Label(1, rowNumber, "Client", headingFormat));
        sheet.addCell(new Label(2, rowNumber, "Office", headingFormat));
        sheet.addCell(new Label(3, rowNumber, "Department", headingFormat));
        sheet.addCell(new Label(4, rowNumber, "Subdepartment", headingFormat));
        sheet.addCell(new Label(5, rowNumber, "Start date", headingFormat));
        sheet.addCell(new Label(6, rowNumber, "End date", headingFormat));
        sheet.addCell(new Label(7, rowNumber, "Created at", headingFormat));
        rowNumber++;
        String formGroupName = "All";
        String formClientName = "All";
        String formOfficeName = "All";
        String formDepartmentName = "All";
        String formSubdepartmentName = "All";
        if(this.report.getFormGroup() != null) {
            formGroupName = this.report.getFormGroup().getName();
        }
        if(this.report.getFormClient() != null) {
            formClientName = this.report.getFormClient().getName();
        }
        if(this.report.getFormOffice() != null) {
            formOfficeName = this.report.getFormOffice().getName();
        }
        if(this.report.getFormDepartment() != null) {
            formDepartmentName = this.report.getFormDepartment().getName();
        }
        if(this.report.getFormSubdepartment() != null) {
            formSubdepartmentName = this.report.getFormSubdepartment().getName();
        }

        sheet.addCell(new jxl.write.Label(0, rowNumber, formGroupName));
        sheet.addCell(new jxl.write.Label(1, rowNumber, formClientName));
        sheet.addCell(new jxl.write.Label(2, rowNumber, formOfficeName));
        sheet.addCell(new jxl.write.Label(3, rowNumber, formDepartmentName));
        sheet.addCell(new jxl.write.Label(4, rowNumber, formSubdepartmentName));
        sheet.addCell(new jxl.write.DateTime(5, rowNumber, this.report.getStartDate().getTime(), dateFormat));
        sheet.addCell(new jxl.write.DateTime(6, rowNumber, this.report.getEndDate().getTime(), dateFormat));
        sheet.addCell(new jxl.write.DateTime(7, rowNumber, this.report.getCreatedAt(), fullDateFormat));
        int count = 0;
        rowNumber++;
        columnNumber = 0;
    }
    public void makeContent(List<ProfitabilityReport.Row> rows, WritableSheet sheet) throws RowsExceededException, WriteException {
        sheet.addCell(new Label(columnNumber, rowNumber, "Code", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Client", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "First Name", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Last Name", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Position", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Standard Position", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Task", headingFormat));
        columnNumber++;
        sheet.addCell(new Label(columnNumber, rowNumber, "Task Type", headingFormat));
        columnNumber++;
        int timeSpentColumnNumber = columnNumber;
        sheet.addCell(new Label(columnNumber, rowNumber, "Time Spent", headingFormat));
        columnNumber++;
        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Selling Rate", headingFormat));
            columnNumber ++;
        }
        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Standard Cost", headingFormat));
            columnNumber ++;
        }
        int firstColumnForTotalSellingNumber = columnNumber;
        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Total Selling Rate", headingFormat));
            columnNumber ++;
        }
        int firstColumnForTotalCostNumber = columnNumber;
        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            sheet.addCell(new Label(columnNumber, rowNumber, "Total Standard Cost", headingFormat));
            columnNumber ++;
        }

        rowNumber++;
        columnNumber = 0;

        for(int i = 0; i < 9; i++) {
            sheet.addCell(new Label(columnNumber, rowNumber, "", headingFormat));
            columnNumber ++;
        }
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
            columnNumber++;
        }
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
            columnNumber++;
        }
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
            columnNumber++;
        }
        for(Currency currency : this.report.getCurrencies()) {
            sheet.addCell(new Label(columnNumber, rowNumber, currency.getCode(), headingFormat));
            columnNumber++;
        }

        rowNumber++;
        columnNumber = 0;

        int firstRowToSumNumber = rowNumber;
        for(ProfitabilityReport.Row row : rows) {
            Employee employee = row.getEmployeePositionHistoryItem().getEmployee();
            ProjectCode projectCode = row.getProjectCode();
            Client client = projectCode.getClient();
            Position position = row.getEmployeePositionHistoryItem().getPosition();
            StandardPosition standardPosition = position.getStandardPosition();
            Task task = row.getTask();
            TaskType taskType = task.getTaskType();
            String projectCodeCode = projectCode.getCode();
            String clientName = client.getName();
            String employeeFirstName = employee.getFirstName();
            String employeeLastName = employee.getLastName();
            String positionName = position.getName();
            String standardPositionName = standardPosition.getName();
            String taskName = task.getName();
            String taskTypeName = taskType.getName();
            Long timeSpent = row.getTimeSpent();

            columnNumber = 0;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, projectCodeCode));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, clientName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employeeFirstName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, employeeLastName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, positionName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, standardPositionName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, taskName));
            columnNumber++;
            sheet.addCell(new jxl.write.Label(columnNumber, rowNumber, taskTypeName));
            columnNumber++;
            sheet.addCell(new jxl.write.Number(columnNumber, rowNumber, timeSpent / 60.0, timespentFormat));
            columnNumber++;
            Integer standardSellingRateColumnNumber = null;
            Integer standardCostColumnNumber = null;
            Integer totalSellingRateColumnNumber = null;
            Integer totalCostColumnNumber = null;
            for(Currency currency : this.report.getCurrencies()) {
                if(row.getStandardSellingRate() != null && currency.getId().equals(row.getStandardSellingRate().getStandardSellingRateGroup().getCurrency().getId())) {
                    standardSellingRateColumnNumber = columnNumber;
                    totalSellingRateColumnNumber = standardSellingRateColumnNumber + 2 * this.report.getCurrencies().size();
                }
                columnNumber++;
            }
            for(Currency currency : this.report.getCurrencies()) {
                if(row.getStandardCost() != null && currency.getId().equals(row.getStandardCost().getStandardCostGroup().getCurrency().getId())) {
                    standardCostColumnNumber = columnNumber;
                    totalCostColumnNumber = standardCostColumnNumber + 2 * this.report.getCurrencies().size();
                }
                columnNumber++;
            }

            if(standardSellingRateColumnNumber != null) {
                sheet.addCell(new jxl.write.Number(standardSellingRateColumnNumber, rowNumber, row.getStandardSellingRate().getAmount().doubleValue(), numberFormat));
            }
            if(standardCostColumnNumber != null) {
                sheet.addCell(new jxl.write.Number(standardCostColumnNumber, rowNumber, row.getStandardCost().getAmount().doubleValue(), numberFormat));
            }
            if(totalSellingRateColumnNumber != null) {
                String formula = "" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(standardSellingRateColumnNumber) + (rowNumber + 1) + "";
                sheet.addCell(new jxl.write.Formula(totalSellingRateColumnNumber, rowNumber, formula, numberFormat));
            }
            if(totalCostColumnNumber != null) {
                String formula = "" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber + 1) + "*" + ExcelUtils.getColumnName(standardCostColumnNumber) + (rowNumber + 1) + "";
                sheet.addCell(new jxl.write.Formula(totalCostColumnNumber, rowNumber, formula, numberFormat));
            }

            rowNumber++;
        }
        String formula = "SUM(" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(timeSpentColumnNumber) + (rowNumber - 1 + 1) + ")";
        sheet.addCell(new jxl.write.Formula(timeSpentColumnNumber, rowNumber, formula, timespentFormat));

        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            String formula2 = "SUM(" + ExcelUtils.getColumnName(firstColumnForTotalSellingNumber + i) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(firstColumnForTotalSellingNumber + i) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(firstColumnForTotalSellingNumber + i, rowNumber, formula2, numberFormat));
        } 
        for(int i = 0; i < this.report.getCurrencies().size(); i++) {
            String formula2 = "SUM(" + ExcelUtils.getColumnName(firstColumnForTotalCostNumber + i) + (firstRowToSumNumber + 1) + ":" + ExcelUtils.getColumnName(firstColumnForTotalCostNumber + i) + (rowNumber - 1 + 1) + ")";
            sheet.addCell(new jxl.write.Formula(firstColumnForTotalCostNumber + i, rowNumber, formula2, numberFormat));
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
        WritableSheet sheet = workbook.createSheet("Profitability Report", 0);
        makeHeader(sheet);
        makeContent(this.report.getRows(), sheet);
    }

    public void createDividedReport(ZipOutputStream zipOutputStream) throws IOException, RowsExceededException, WriteException {
        if(this.report.getRows().isEmpty()) {
            ZipEntry entry = new ZipEntry("readme.txt");
            zipOutputStream.putNextEntry(entry);
            BufferedWriter bw = null;
            try {
                bw = new BufferedWriter(new OutputStreamWriter(zipOutputStream));
                bw.write("Report returned no rows");
            } catch (IOException e) {
                throw e;
            } finally {
                if(bw != null) {
                    bw.close();
                }
            }
            return;
        }
        Set<Department> departments = new HashSet<Department>();
        for(ProfitabilityReport.Row row : this.report.getRows()) {
            departments.add(row.getProjectCode().getSubdepartment().getDepartment());
        }
        for(Department department : departments) {
            List<ProfitabilityReport.Row> rows = new LinkedList<ProfitabilityReport.Row>();
            for(ProfitabilityReport.Row row : this.report.getRows()) {
                if(row.getProjectCode().getSubdepartment().getDepartment().getId().equals(department.getId())) {
                    rows.add(row);
                }
            }
            String fileName = "" + department.getOffice().getCodeName() + "_" + department.getCodeName();
            fileName += ".xls";
            ZipEntry entry = new ZipEntry(fileName);
            zipOutputStream.putNextEntry(entry);
            createDividedWorkbook(rows, zipOutputStream);
        }
    }
    public void createDividedWorkbook(List<ProfitabilityReport.Row> rows, OutputStream outputStream) throws IOException, RowsExceededException, WriteException {
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
        fillDividedWorkbook(rows, workbook);
        workbook.write();
        workbook.close();
    }
    public void fillDividedWorkbook(List<ProfitabilityReport.Row> rows, WritableWorkbook workbook) throws RowsExceededException, WriteException {
        Set<Client> clients = new HashSet<Client>();
        for(ProfitabilityReport.Row row : rows) {
            clients.add(row.getProjectCode().getClient());
        }
        int count = 0;
        for(Client client : clients) {
            WritableSheet sheet = workbook.createSheet(client.getCodeName(), count);
            columnNumber = 0;
            rowNumber = 0;

            List<ProfitabilityReport.Row> clientRows = new LinkedList<ProfitabilityReport.Row>();
            for(ProfitabilityReport.Row row : rows) {
                if(row.getProjectCode().getClient().getId().equals(client.getId())) {
                    clientRows.add(row);
                }
            }
            makeHeader(sheet);
            makeContent(clientRows, sheet);
            count++;
        }
    }
}
