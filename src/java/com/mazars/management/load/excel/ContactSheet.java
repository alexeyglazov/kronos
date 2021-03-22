/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.load.excel;
import com.mazars.management.db.domain.Contact.Gender;
import com.mazars.management.db.domain.Contact.NormalPosition;
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
import com.mazars.management.db.domain.Contact;

/**
 *
 * @author Glazov
 */
public class ContactSheet {
    public class Row {
        Long id;
        Contact.Gender gender;
        String firstName;
        String lastName;
        String firstNameLocalLanguage;
        String lastNameLocalLanguage;
        Contact.NormalPosition normalPosition;
        String position;
        String directPhone;
        String mobilePhone;
        String email;
        Long nationalityId;
        Long language1Id;
        Long language2Id;
        Long language3Id;
        Long language4Id;
        Long residencialCountryId;
        Boolean isAudit;
        Boolean isOutsourcing;
        Boolean isTaxAndLegal;
        Boolean isNewsletters;
        Boolean isActive;
        Long clientId;

        public Long getClientId() {
            return clientId;
        }

        public void setClientId(Long clientId) {
            this.clientId = clientId;
        }

        public String getDirectPhone() {
            return directPhone;
        }

        public void setDirectPhone(String directPhone) {
            this.directPhone = directPhone;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFirstName() {
            return firstName;
        }

        public void setFirstName(String firstName) {
            this.firstName = firstName;
        }

        public String getFirstNameLocalLanguage() {
            return firstNameLocalLanguage;
        }

        public void setFirstNameLocalLanguage(String firstNameLocalLanguage) {
            this.firstNameLocalLanguage = firstNameLocalLanguage;
        }

        public Gender getGender() {
            return gender;
        }

        public void setGender(Gender gender) {
            this.gender = gender;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }

        public Boolean getIsAudit() {
            return isAudit;
        }

        public void setIsAudit(Boolean isAudit) {
            this.isAudit = isAudit;
        }

        public Boolean getIsNewsletters() {
            return isNewsletters;
        }

        public void setIsNewsletters(Boolean isNewsletters) {
            this.isNewsletters = isNewsletters;
        }

        public Boolean getIsOutsourcing() {
            return isOutsourcing;
        }

        public void setIsOutsourcing(Boolean isOutsourcing) {
            this.isOutsourcing = isOutsourcing;
        }

        public Boolean getIsTaxAndLegal() {
            return isTaxAndLegal;
        }

        public void setIsTaxAndLegal(Boolean isTaxAndLegal) {
            this.isTaxAndLegal = isTaxAndLegal;
        }

        public Long getLanguage1Id() {
            return language1Id;
        }

        public void setLanguage1Id(Long language1Id) {
            this.language1Id = language1Id;
        }

        public Long getLanguage2Id() {
            return language2Id;
        }

        public void setLanguage2Id(Long language2Id) {
            this.language2Id = language2Id;
        }

        public Long getLanguage3Id() {
            return language3Id;
        }

        public void setLanguage3Id(Long language3Id) {
            this.language3Id = language3Id;
        }

        public Long getLanguage4Id() {
            return language4Id;
        }

        public void setLanguage4Id(Long language4Id) {
            this.language4Id = language4Id;
        }

        public String getLastName() {
            return lastName;
        }

        public void setLastName(String lastName) {
            this.lastName = lastName;
        }

        public String getLastNameLocalLanguage() {
            return lastNameLocalLanguage;
        }

        public void setLastNameLocalLanguage(String lastNameLocalLanguage) {
            this.lastNameLocalLanguage = lastNameLocalLanguage;
        }

        public String getMobilePhone() {
            return mobilePhone;
        }

        public void setMobilePhone(String mobilePhone) {
            this.mobilePhone = mobilePhone;
        }

        public Long getNationalityId() {
            return nationalityId;
        }

        public void setNationalityId(Long nationalityId) {
            this.nationalityId = nationalityId;
        }

        public NormalPosition getNormalPosition() {
            return normalPosition;
        }

        public void setNormalPosition(NormalPosition normalPosition) {
            this.normalPosition = normalPosition;
        }

        public String getPosition() {
            return position;
        }

        public void setPosition(String position) {
            this.position = position;
        }

        public Long getResidencialCountryId() {
            return residencialCountryId;
        }

        public void setResidencialCountryId(Long residencialCountryId) {
            this.residencialCountryId = residencialCountryId;
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
            Cell genderCell = null;
            Cell firstNameCell = null;
            Cell lastNameCell = null;
            Cell firstNameLocalLanguageCell = null;
            Cell lastNameLocalLanguageCell = null;
            Cell normalPositionCell = null;
            Cell positionCell = null;
            Cell directPhoneCell = null;
            Cell mobilePhoneCell = null;
            Cell emailCell = null;
            Cell nationalityIdCell = null;
            Cell language1IdCell = null;
            Cell language2IdCell = null;
            Cell language3IdCell = null;
            Cell language4IdCell = null;
            Cell residencialCountryIdCell = null;
            Cell isAuditCell = null;
            Cell isOutsourcingCell = null;
            Cell isTaxAndLegalCell = null;
            Cell isNewslettersCell = null;
            Cell isActiveCell = null;
            Cell clientIdCell = null;

            try {
                idCell = rowData[0];
                genderCell = rowData[1];
                firstNameCell = rowData[2];
                lastNameCell = rowData[3];
                firstNameLocalLanguageCell = rowData[4];
                lastNameLocalLanguageCell = rowData[5];
                normalPositionCell = rowData[6];
                positionCell = rowData[7];
                directPhoneCell = rowData[8];
                mobilePhoneCell = rowData[9];
                emailCell = rowData[10];
                nationalityIdCell = rowData[11];
                language1IdCell = rowData[12];
                language2IdCell = rowData[13];
                language3IdCell = rowData[14];
                language4IdCell = rowData[15];
                residencialCountryIdCell = rowData[16];
                isAuditCell = rowData[17];
                isOutsourcingCell = rowData[18];
                isTaxAndLegalCell = rowData[19];
                isNewslettersCell = rowData[20];
                isActiveCell = rowData[21];
                clientIdCell = rowData[22];
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

            if(genderCell.getContents() == null || genderCell.getContents().trim().equals("")) {

            } else {
                if("female".equalsIgnoreCase(genderCell.getContents())) {
                    row.setGender(Contact.Gender.MRS);
                } else {
                    row.setGender(Contact.Gender.MR);
                }
            }

            row.setFirstName(firstNameCell.getContents());
            row.setLastName(lastNameCell.getContents());
            row.setFirstNameLocalLanguage(firstNameLocalLanguageCell.getContents());
            row.setLastNameLocalLanguage(lastNameLocalLanguageCell.getContents());
            if(normalPositionCell.getContents() == null || normalPositionCell.getContents().trim().equals("")) {

            } else {
                try {
                     row.setNormalPosition(Contact.NormalPosition.valueOf(normalPositionCell.getContents()));
                } catch(IllegalArgumentException e) {
                    errors.add("Wrong value of NormalPosition cell at row " + (i + 1));
                    continue;
                }
            }
            row.setPosition(positionCell.getContents());
            row.setDirectPhone(directPhoneCell.getContents());
            row.setMobilePhone(mobilePhoneCell.getContents());
            row.setEmail(emailCell.getContents());

            if(nationalityIdCell.getContents() == null || nationalityIdCell.getContents().trim().equals("")) {

            } else if(nationalityIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of nationalityId cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setNationalityId(Long.parseLong(nationalityIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of nationalityId cell at row " + (i + 1));
                    continue;
                }
            }
           if(language1IdCell.getContents() == null || language1IdCell.getContents().trim().equals("")) {

           } else if(language1IdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of language1Id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setLanguage1Id(Long.parseLong(language1IdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of language1Id cell at row " + (i + 1));
                    continue;
                }
            }
           if(language2IdCell.getContents() == null || language2IdCell.getContents().trim().equals("")) {

           } else if(language2IdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of language2Id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setLanguage2Id(Long.parseLong(language2IdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of language2Id cell at row " + (i + 1));
                    continue;
                }
            }
           if(language3IdCell.getContents() == null || language3IdCell.getContents().trim().equals("")) {

           } else if(language3IdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of language3Id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setLanguage3Id(Long.parseLong(language3IdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of language3Id cell at row " + (i + 1));
                    continue;
                }
            }
           if(language4IdCell.getContents() == null || language4IdCell.getContents().trim().equals("")) {

           } else if(language4IdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of language4Id cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setLanguage4Id(Long.parseLong(language4IdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of language4Id cell at row " + (i + 1));
                    continue;
                }
            }
           if(residencialCountryIdCell.getContents() == null || residencialCountryIdCell.getContents().trim().equals("")) {

           } else if(residencialCountryIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of residencialCountryId cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setResidencialCountryId(Long.parseLong(residencialCountryIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of residencialCountryId cell at row " + (i + 1));
                    continue;
                }
            }
            if("1".equals(isAuditCell.getContents())) {
                row.setIsAudit(Boolean.TRUE);
            }
            if("1".equals(isOutsourcingCell.getContents())) {
                row.setIsOutsourcing(Boolean.TRUE);
            }
            if("1".equals(isTaxAndLegalCell.getContents())) {
                row.setIsTaxAndLegal(Boolean.TRUE);
            }
            if("1".equals(isNewslettersCell.getContents())) {
                row.setIsNewsletters(Boolean.TRUE);
            }
            if("1".equals(isActiveCell.getContents())) {
                row.setIsActive(Boolean.TRUE);
            }
            if(clientIdCell.getContents() == null || clientIdCell.getContents().trim().equals("")) {
                errors.add("Empty value at clientId cell at row " + (i + 1));
                 continue;
            } else if(clientIdCell.getType() != CellType.NUMBER) {
                errors.add("Wrong type of clientId cell at row " + (i + 1));
                continue;
            } else {
                try {
                    row.setClientId(Long.parseLong(clientIdCell.getContents()));
                } catch (NumberFormatException e) {
                    errors.add("Wrong format of clientId cell at row " + (i + 1));
                    continue;
                }
            }
            this.rows.add(row);
        }
        workbook.close();
        return errors;
    }
}
