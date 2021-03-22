/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.reports.excel;
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
/**
 *
 * @author Glazov
 */
public class ExcelUtils {
    public static String getColumnName(int index) {
        String[] letters = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"};
        String columnName = "";
        if(index < 26) {
            return letters[index];
        }
        return letters[index / 26 - 1] + letters[index % 26];
    }
    public static WritableCellFormat getHeadingFormat() throws RowsExceededException, WriteException {
        WritableCellFormat headingFormat = new WritableCellFormat();
        headingFormat.setWrap(true);
        headingFormat.setBackground(Colour.GRAY_25);
        return headingFormat;
    }
    public static WritableCellFormat getNumberHeadingFormat() throws RowsExceededException, WriteException {
        WritableCellFormat numberHeadingFormat = new WritableCellFormat(NumberFormats.FLOAT);
        numberHeadingFormat.setWrap(true);
        numberHeadingFormat.setBackground(Colour.GRAY_25);
        return numberHeadingFormat;
    }
    public static WritableCellFormat getStrongFormat() throws RowsExceededException, WriteException {
        WritableFont font = new WritableFont(WritableFont.ARIAL, 10, WritableFont.BOLD, false);       
        WritableCellFormat strongFormat = new WritableCellFormat (font);
        strongFormat.setWrap(true);
        return strongFormat;
    }
    public static WritableCellFormat getWrapFormat() throws RowsExceededException, WriteException {
        WritableFont font = new WritableFont(WritableFont.ARIAL, 10, WritableFont.NO_BOLD, false);       
        WritableCellFormat format = new WritableCellFormat (font);
        format.setWrap(true);
        return format;
    }
    public static WritableCellFormat getNumberFormat() throws RowsExceededException, WriteException {
        WritableCellFormat numberFormat = new WritableCellFormat(NumberFormats.FLOAT);
        return numberFormat;
    }
    public static WritableCellFormat getIntegerFormat() throws RowsExceededException, WriteException {
        WritableCellFormat integerFormat = new WritableCellFormat(NumberFormats.INTEGER);
        return integerFormat;
    }
    public static WritableCellFormat getPercentFormat() throws RowsExceededException, WriteException {
        WritableCellFormat percentFormat = new WritableCellFormat(NumberFormats.PERCENT_FLOAT);
        return percentFormat;
    }
    public static WritableCellFormat getTimespentFormat() throws RowsExceededException, WriteException {
        WritableCellFormat timespentFormat = new WritableCellFormat(NumberFormats.FLOAT);
        return timespentFormat;
    }
    public static WritableCellFormat getDateFormat() throws RowsExceededException, WriteException {
        WritableCellFormat dateFormat = new WritableCellFormat (new DateFormat ("dd.MM.yyyy"));
        return dateFormat;
    }
    public static WritableCellFormat getFullDateFormat() throws RowsExceededException, WriteException {
        WritableCellFormat fullDateFormat = new WritableCellFormat (new DateFormat ("dd.MM.yyyy HH:mm:ss"));
        return fullDateFormat;
    }
}
