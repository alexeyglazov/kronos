/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.mazars.management.db.comparators;
import java.util.Comparator;
import com.mazars.management.db.domain.*;
import java.util.List;
import java.util.ArrayList;
/**
 *
 * @author Glazov
 */
public class ClientComparator implements Comparator<Client> {
    public enum Mode {
        NAME,
        CODE_NAME
    }
    Mode mode = Mode.NAME;
    public ClientComparator() {
    }

    public ClientComparator(Mode mode) {
        this.mode = mode;
    }
    public Mode getMode() {
        return mode;
    }

    public void setMode(Mode mode) {
        this.mode = mode;
    }    
    public int compare(Client o1, Client o2) {
        if(Mode.CODE_NAME.equals(this.mode)) {
            return o1.getCodeName().compareToIgnoreCase(o2.getCodeName());
        } else {
            return o1.getName().compareToIgnoreCase(o2.getName());
        }        
    }
}
