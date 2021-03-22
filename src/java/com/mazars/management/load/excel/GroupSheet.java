/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import java.util.*;
import java.io.*;
import java.text.ParseException;
import java.util.Locale;
import jxl.Cell;
import jxl.CellType;
import jxl.Sheet;
import jxl.Workbook;
import jxl.WorkbookSettings;
import jxl.read.biff.BiffException;
import jxl.DateCell;

/**
 *
 * @author Glazov
 */
public class GroupSheet {
    public class Row {
        Long id;
        String name;
        Long countryId;
        Boolean isListed;
        Long listingCountryId;
        Long workCountryId;

        public Long getCountryId() {
            return countryId;
        }

        public void setCountryId(Long countryId) {
            this.countryId = countryId;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Boolean getIsListed() {
            return isListed;
        }

        public void setIsListed(Boolean isListed) {
            this.isListed = isListed;
        }
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Long getListingCountryId() {
            return listingCountryId;
        }

        public void setListingCountryId(Long listingCountryId) {
            this.listingCountryId = listingCountryId;
        }

        public Long getWorkCountryId() {
            return workCountryId;
        }

        public void setWorkCountryId(Long workCountryId) {
            this.workCountryId = workCountryId;
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
            Cell idCell = null;
            Cell nameCell = null;
            Cell countryIdCell = null;
            Cell isListedCell = null;
            Cell listingCountryIdCell = null;
            Cell workCountryIdCell = null;

            try {
                idCell = rowData[0];
                nameCell = rowData[1];
                countryIdCell = rowData[2];
                isListedCell = rowData[3];
                listingCountryIdCell = rowData[4];
                workCountryIdCell = rowData[5];
            } catch (Exception e) {
                errors.add("Exception of " + e + " at row "+ (i + 1));
                continue;
            }

            if(idCell.getContents() == null || idCell.getContents().trim().equals("")) {
                errors.add("Empty id cell at row " + (i + 1));
                continue;
            } else if(idCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setId(Long.parseLong(idCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of id cell at row " + (i + 1));
                    continue;
                }
            }

            if(nameCell.getContents() == null || nameCell.getContents().trim().equals("")) {
                errors.add("Empty name cell at row " + (i + 1));
                continue;
            } else if(nameCell.getType() != CellType.LABEL) {
                errors.add("Wrong type of name cell at row " + (i + 1));
                continue;
            }
            row.setName(nameCell.getContents());

            if(countryIdCell.getContents() == null || countryIdCell.getContents().trim().equals("")) {
                
            } else if(countryIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of country_id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setCountryId(Long.parseLong(countryIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of country_id cell at row " + (i + 1));
                    continue;
                }
            }

            if("1".equals(isListedCell.getContents())) {
                row.setIsListed(Boolean.TRUE);
            }

            if(listingCountryIdCell.getContents() == null || listingCountryIdCell.getContents().trim().equals("")) {
                
            } else if(listingCountryIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of listingCountryId cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setListingCountryId(Long.parseLong(listingCountryIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of listing_country_id cell at row " + (i + 1));
                    continue;
                }
            }

            if(workCountryIdCell.getContents() == null || workCountryIdCell.getContents().trim().equals("")) {
                errors.add("Empty work_country_id cell at row " + (i + 1));
                continue;
            } else if(workCountryIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of work_country_id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setWorkCountryId(Long.parseLong(workCountryIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of work_country_id cell at row " + (i + 1));
                    continue;
                }
            }
            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }
}
