/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.mazars.management.service;

/**
 *
 * @author glazov
 */
public class StringUtils {
    public static Boolean getBoolean(String str) {
        if(str == null) {
            return null;
        }
        str = str.trim();
        if(str.equals("1") || str.equalsIgnoreCase("yes") || str.equals("+") || str.equalsIgnoreCase("TRUE")) {
            return true;
        }
        if(str.equals("0") || str.equalsIgnoreCase("no") || str.equals("-") || str.equalsIgnoreCase("FALSE")) {
            return false;
        }
        return null;
    }
    
    public static String stripNonValidXMLCharacters(String in) {
    StringBuilder out = new StringBuilder();
    char current;
 
    if (in == null || ("".equals(in))) return "";
        for (int i = 0; i < in.length(); i++) {
            current = in.charAt(i);
            if ((current == 0x9) ||
                (current == 0xA) ||
                (current == 0xD) ||
                ((current >= 0x20) && (current <= 0xD7FF)) ||
                ((current >= 0xE000) && (current <= 0xFFFD)) ||
                ((current >= 0x10000) && (current <= 0x10FFFF)))
                out.append(current);
            }
            return out.toString();
    }
}
