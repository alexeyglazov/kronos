/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.web.comparators;
import java.util.Comparator;
import com.mazars.management.web.vo.PositionWithStandardPositionVO;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class StringWithNumbersComparator implements Comparator<String> {
    public int compare(String o1, String o2) {
        List<String> pieces1 = split(o1);
        List<String> pieces2 = split(o2);
        int min = pieces1.size();
        if(min > pieces2.size()) {
            min = pieces2.size();
        }
        for(int i = 0; i < min; i++) {
            String piece1 = pieces1.get(i);
            String piece2 = pieces2.get(i);
            if(! piece1.equals(piece2)) {
                if(Character.isDigit(piece1.charAt(0)) && Character.isDigit(piece2.charAt(0))) {
                    Integer number1 = Integer.parseInt(piece1);
                    Integer number2 = Integer.parseInt(piece2);
                    return number1.compareTo(number2);
                } else if(Character.isDigit(piece1.charAt(0)) && ! Character.isDigit(piece2.charAt(0))) {
                    return -1;
                } else if(! Character.isDigit(piece1.charAt(0)) && Character.isDigit(piece2.charAt(0))) {
                    return 1;
                } else if(! Character.isDigit(piece1.charAt(0)) && ! Character.isDigit(piece2.charAt(0))) {
                   return piece1.compareToIgnoreCase(piece2);
                }
            }
        }
        if(pieces1.size() < pieces2.size()) {
            return -1;
        } else if(pieces1.size() > pieces2.size()) {
            return 1;
        }
        return 0;
    }
    public List<String> split(String line) {
        List<String> pieces = new ArrayList<String>();
        Boolean isDigit = null;
        for(int i = 0; i < line.length(); i++) {
            Character c = line.charAt(i);
            if(pieces.isEmpty()) {
                pieces.add("" + c);
                isDigit = Character.isDigit(c);
                continue;
            }
            if(isDigit.equals(Character.isDigit(c))) {
                pieces.set(pieces.size() - 1, pieces.get(pieces.size() - 1) + c);
            } else {
                pieces.add("" + c);
                isDigit = Character.isDigit(c);
            }
        }
        return pieces;
    }
}
