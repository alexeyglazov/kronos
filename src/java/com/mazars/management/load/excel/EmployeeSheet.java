/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import com.mazars.management.db.util.CalendarUtil;
import java.util.*;
import java.io.*;
import java.text.DateFormat;
import java.text.ParseException;
import java.util.Locale;
import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import jxl.DateCell;
import java.text.SimpleDateFormat;

/**
 *
 * @author Glazov
 */
public class EmployeeSheet {
    public class Row {
        String ref1C;
        String nameCyrillic;
        String lastNameCyrillic;
        String name;
        String lastName;
        String department;
        String subdepartment;
        String position;
        String standardPosition;
        Calendar from;
        Calendar to;
        Boolean status;
        String mail;
        String username;

        public String getSubdepartment() {
            return subdepartment;
        }

        public void setSubdepartment(String subdepartment) {
            this.subdepartment = subdepartment;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public Calendar getFrom() {
            return from;
        }

        public void setFrom(Calendar from) {
            this.from = from;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getLastNameCyrillic() {
            return lastNameCyrillic;
        }

        public void setLastNameCyrillic(String lastNameCyrillic) {
            this.lastNameCyrillic = lastNameCyrillic;
        }

        public String getMail() {
            return mail;
        }

        public void setMail(String mail) {
            this.mail = mail;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getNameCyrillic() {
            return nameCyrillic;
        }

        public void setNameCyrillic(String nameCyrillic) {
            this.nameCyrillic = nameCyrillic;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public String getRef1C() {
            return ref1C;
        }

        public void setRef1C(String ref1C) {
            this.ref1C = ref1C;
        }

        public String getStandardPosition() {
            return standardPosition;
        }

        public void setStandardPosition(String standardPosition) {
            this.standardPosition = standardPosition;
        }

        public Boolean getStatus() {
            return status;
        }

        public void setStatus(Boolean status) {
            this.status = status;
        }

        public Calendar getTo() {
            return to;
        }

        public void setTo(Calendar to) {
            this.to = to;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }

    private List<Row> rows = new LinkedList<Row>();

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }
    public List<String> read(InputStream inputStream, String sheetName) throws IOException, BiffException {
        WorkbookSettings ws = null;
        Workbook workbook = null;
        Sheet sheet = null;
        Cell rowData[] = null;
        int rowCount = '0';

        ws = new WorkbookSettings();
        ws.setLocale(new Locale("ru", "RU"));
        workbook = Workbook.getWorkbook(inputStream, ws);
        sheet = workbook.getSheet(sheetName);
        rowCount = sheet.getRows();
        List<String> errors = new LinkedList<String>();
        for (int i = 0; i < rowCount; i++) {
            if(i == 0) {
                continue;
            }
            rowData = sheet.getRow(i);
            Row row = new Row();
            Cell ref1CCell = null;
            Cell nameCyrillicCell = null;
            Cell lastNameCyrillicCell = null;
            Cell nameCell = null;
            Cell lastNameCell = null;
            Cell departmentCell = null;
            Cell subdepartmentCell = null;
            Cell positionCell = null;
            Cell standardPositionCell = null;
            Cell fromCell = null;
            Cell toCell = null;
            Cell statusCell = null;
            Cell mailCell = null;
            Cell usernameCell = null;

            try {
                ref1CCell = rowData[0];
                nameCyrillicCell = rowData[1];
                lastNameCyrillicCell = rowData[2];
                nameCell = rowData[3];
                lastNameCell = rowData[4];
                departmentCell = rowData[5];
                subdepartmentCell = rowData[6];
                positionCell = rowData[7];
                standardPositionCell = rowData[8];
                fromCell = rowData[9];
                toCell = rowData[10];
                statusCell = rowData[11];
                mailCell = rowData[12];
                usernameCell = rowData[13];
            } catch (Exception e) {
                errors.add("Exception of " + e + " at row "+ (i + 1));
                continue;
            }

            row.setRef1C(ref1CCell.getContents());
            row.setNameCyrillic(nameCyrillicCell.getContents());
            row.setLastNameCyrillic(lastNameCyrillicCell.getContents());
            row.setName(nameCell.getContents());
            row.setLastName(lastNameCell.getContents());
            if("Tax".equals(departmentCell.getContents())) {
                row.setDepartment("Tax & Legal");
            } else {
                row.setDepartment(departmentCell.getContents().trim());
            }
            row.setSubdepartment(subdepartmentCell.getContents().trim());
            row.setPosition(positionCell.getContents().trim());
            row.setStandardPosition(standardPositionCell.getContents());
            SimpleDateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy");
            if(fromCell.getContents() == null || fromCell.getContents().trim().equals("")) {
                row.setFrom(null);
            } else {
                try {
                    Calendar from = new GregorianCalendar();
                    from.setTime(dateFormatter.parse(fromCell.getContents()));
                    CalendarUtil.truncateTime(from);
                    row.setFrom(from);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at FROM at row "+ (i + 1));
                    continue;
                }
            }
            if(toCell.getContents() == null || toCell.getContents().trim().equals("")) {
                row.setTo(null);
            } else {
                try {
                    Calendar to = new GregorianCalendar();
                    to.setTime(dateFormatter.parse(toCell.getContents()));
                    CalendarUtil.truncateTime(to);
                    row.setTo(to);
                } catch (ParseException e) {
                    errors.add("Exception of " + e + " at TO at row "+ (i + 1));
                    continue;
                }
            }
            if("out".equalsIgnoreCase(statusCell.getContents())) {
                row.setStatus(Boolean.FALSE);
            } else {
                row.setStatus(Boolean.TRUE);
            }
            row.setMail(mailCell.getContents());
            row.setUsername(usernameCell.getContents());

            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }
    public Set<String> getUsernames() {
        Set<String> usernames = new HashSet<String>();
        for(Row row : rows) {
            usernames.add(row.getUsername());
        }
        return usernames;
    }
    public List<Row> getRowsByUserName(String username) {
        List<Row> subrows = new LinkedList<Row>();
        for(Row row : rows) {
            if(row.getUsername().equals(username)) {
                subrows.add(row);
            }
        }
        return subrows;
    }
}
